import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

const emptyForm = {
  name: "",
  image: "",
  description: "",
  sort_order: 0,
  is_visible: true,
};

function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("Categories fetch error:", error);
      alert("حصل خطأ أثناء تحميل الأقسام.");
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingCategory(null);

    setForm({
      ...emptyForm,
    });

    setSelectedImage(null);
    setImagePreview("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // EDIT FORM
  // =========================

  const openEditForm = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      image: category.image || "",
      description: category.description || "",
      sort_order: category.sort_order ?? 0,
      is_visible:
        category.is_visible !== false,
    });

    setSelectedImage(null);
    setImagePreview(category.image || "");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);

    setForm({
      ...emptyForm,
    });

    setSelectedImage(null);
    setImagePreview("");
  };

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("من فضلك اختار صورة فقط.");

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب ألا يتجاوز 5MB.");

      event.target.value = "";

      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      "jpg";

    const fileName = `category-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

    const filePath = `categories/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error(
        "Category image upload error:",
        error
      );

      throw new Error(
        `فشل رفع صورة القسم: ${error.message}`
      );
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error(
        "لم يتم الحصول على رابط صورة القسم."
      );
    }

    return data.publicUrl;
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("اكتب اسم القسم أولًا.");
      return;
    }

    if (
      form.sort_order !== "" &&
      Number(form.sort_order) < 0
    ) {
      alert(
        "ترتيب القسم لا يمكن أن يكون بالسالب."
      );

      return;
    }

    setSaving(true);

    try {
      // =========================
      // IMAGE
      // =========================

      let imageUrl =
        form.image.trim() || null;

      if (selectedImage) {
        imageUrl = await uploadImage(
          selectedImage
        );
      }

      // =========================
      // CATEGORY DATA
      // =========================

      const categoryData = {
        name: form.name.trim(),

        image: imageUrl,

        description:
          form.description.trim() || null,

        sort_order:
          form.sort_order === ""
            ? 0
            : Number(form.sort_order),

        is_visible:
          Boolean(form.is_visible),
      };

      // =========================
      // UPDATE
      // =========================

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) {
          console.error(
            "Update category error:",
            error
          );

          throw new Error(error.message);
        }

        alert(
          "تم تعديل القسم بنجاح ✅"
        );
      }

      // =========================
      // INSERT
      // =========================

      else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);

        if (error) {
          console.error(
            "Insert category error:",
            error
          );

          throw new Error(error.message);
        }

        alert(
          "تم إضافة القسم بنجاح ✅"
        );
      }

      await fetchCategories();

      setShowForm(false);
      setEditingCategory(null);

      setForm({
        ...emptyForm,
      });

      setSelectedImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      alert(
        `حصل خطأ أثناء حفظ القسم:\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "هل أنت متأكد إنك عايز تحذف القسم ده؟\n\nلو فيه منتجات مرتبطة بالقسم، قاعدة البيانات ممكن تمنع الحذف."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(categoryId);

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error(
          "Delete category error:",
          error
        );

        alert(
          `حصل خطأ أثناء حذف القسم:\n${error.message}`
        );

        return;
      }

      setCategories((current) =>
        current.filter(
          (category) =>
            category.id !== categoryId
        )
      );

      alert(
        "تم حذف القسم بنجاح ✅"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // TOGGLE VISIBILITY
  // =========================

  const toggleVisibility = async (
    category
  ) => {
    setTogglingId(category.id);

    const newVisibility =
      !category.is_visible;

    const { error } = await supabase
      .from("categories")
      .update({
        is_visible: newVisibility,
      })
      .eq("id", category.id);

    if (error) {
      console.error(
        "Toggle category visibility error:",
        error
      );

      alert(
        `حصل خطأ أثناء تغيير حالة القسم:\n${error.message}`
      );

      setTogglingId(null);

      return;
    }

    setCategories((current) =>
      current.map((item) =>
        item.id === category.id
          ? {
              ...item,
              is_visible:
                newVisibility,
            }
          : item
      )
    );

    setTogglingId(null);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <section
      dir="rtl"
      className="w-full"
    >
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-medium tracking-[0.3em] text-gray-400">
            BIOR CATEGORIES
          </span>

          <h2 className="mt-3 text-3xl font-light tracking-tight text-black">
            إدارة الأقسام
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            من هنا تقدر تضيف وتعدل وتحذف
            وتتحكم في ظهور وترتيب الأقسام.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="w-fit border border-black bg-black px-6 py-3 text-sm text-white transition hover:bg-white hover:text-black"
        >
          + إضافة قسم
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <section className="mb-10 border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <span className="text-xs text-gray-400">
                BIOR CATEGORY
              </span>

              <h3 className="mt-2 text-2xl font-light text-black">
                {editingCategory
                  ? "تعديل القسم"
                  : "إضافة قسم جديد"}
              </h3>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="text-sm text-gray-500 transition hover:text-black disabled:opacity-50"
            >
              إغلاق
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >
            {/* NAME */}

            <div>
              <label className="mb-2 block text-xs text-gray-500">
                اسم القسم *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="مثال: تيشيرت"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-xs text-gray-500">
                صورة القسم
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="block w-full cursor-pointer border border-gray-200 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-400">
                الحد الأقصى 5MB.
              </p>

              {imagePreview && (
                <div className="mt-5">
                  <p className="mb-2 text-xs text-gray-500">
                    معاينة الصورة
                  </p>

                  <div className="h-56 w-44 overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* FALLBACK URL */}

              <div className="mt-5">
                <label className="mb-2 block text-xs text-gray-400">
                  أو استخدم رابط صورة مباشر
                </label>

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={Boolean(
                    selectedImage
                  )}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-xs text-gray-500">
                وصف القسم
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="اكتب وصفًا مختصرًا للقسم..."
                className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* SORT */}

            <div>
              <label className="mb-2 block text-xs text-gray-500">
                ترتيب القسم
              </label>

              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-400">
                الرقم الأصغر يظهر أولًا.
              </p>
            </div>

            {/* VISIBILITY */}

            <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
              <input
                type="checkbox"
                name="is_visible"
                checked={form.is_visible}
                onChange={handleChange}
              />

              <div>
                <p className="text-sm text-black">
                  القسم ظاهر على الموقع
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  لو ألغيت الاختيار، القسم
                  لن يظهر للزوار.
                </p>
              </div>
            </label>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="border border-black bg-black px-8 py-3 text-sm text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "جاري الحفظ..."
                  : editingCategory
                  ? "حفظ التعديلات"
                  : "إضافة القسم"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="border border-gray-200 px-8 py-3 text-sm text-gray-600 transition hover:border-black hover:text-black disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </section>
      )}

      {/* CATEGORIES */}

      {loading ? (
        <div className="border border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">
            جاري تحميل الأقسام...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-gray-200 bg-white px-6 py-20 text-center">
          <h3 className="text-xl font-light text-black">
            مفيش أقسام حاليًا
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            ابدأ بإضافة أول قسم للمتجر.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    القسم
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الوصف
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الترتيب
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الظهور
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map(
                  (category) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {/* CATEGORY */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={
                                  category.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                بدون صورة
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-black">
                              {category.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID:{" "}
                              {category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="max-w-xs px-6 py-5">
                        <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                          {category.description ||
                            "بدون وصف"}
                        </p>
                      </td>

                      {/* ORDER */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-600">
                          {category.sort_order ??
                            0}
                        </span>
                      </td>

                      {/* VISIBILITY */}

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            toggleVisibility(
                              category
                            )
                          }
                          disabled={
                            togglingId ===
                            category.id
                          }
                          className={`inline-flex px-3 py-1 text-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            category.is_visible
                              ? "border border-black text-black hover:bg-black hover:text-white"
                              : "border border-gray-200 text-gray-400 hover:border-black hover:text-black"
                          }`}
                        >
                          {togglingId ===
                          category.id
                            ? "..."
                            : category.is_visible
                            ? "ظاهر"
                            : "مخفي"}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-5">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                category
                              )
                            }
                            className="text-xs text-gray-600 transition hover:text-black"
                          >
                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category.id
                              )
                            }
                            disabled={
                              deletingId ===
                              category.id
                            }
                            className="text-xs text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            category.id
                              ? "جاري الحذف..."
                              : "حذف"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default CategoriesAdmin;