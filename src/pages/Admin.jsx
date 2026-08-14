import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  name: "",
  category: "شميز",
  price: "",
  discount_percent: 0,
  image: "",
  isNew: false,
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      alert(`حصل خطأ أثناء تحميل المنتجات: ${error.message}`);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // Form Change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Upload Image
  // =========================
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // السماح بالصور فقط
    if (!file.type.startsWith("image/")) {
      alert("من فضلك اختر صورة فقط");
      e.target.value = "";
      return;
    }

    // حجم الصورة: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split(".").pop();

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExt}`;

      const filePath = `products/${fileName}`;

      // رفع الصورة إلى bucket products
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert(`حصل خطأ أثناء رفع الصورة: ${uploadError.message}`);
        return;
      }

      // الحصول على الرابط العام
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        alert("تم رفع الصورة ولكن لم نتمكن من الحصول على رابطها");
        return;
      }

      // حفظ الرابط داخل الفورم
      setForm((prev) => ({
        ...prev,
        image: data.publicUrl,
      }));

      alert("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Image upload error:", error);
      alert("حصل خطأ غير متوقع أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  // =========================
  // Discount Calculation
  // =========================
  const getDiscountedPrice = (price, discount) => {
    const originalPrice = Number(price) || 0;
    const discountPercent = Number(discount) || 0;

    return Math.round(
      originalPrice - originalPrice * (discountPercent / 100)
    );
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("من فضلك اكتب اسم المنتج");
      return;
    }

    if (form.price === "") {
      alert("من فضلك اكتب السعر");
      return;
    }

    const price = Number(form.price);

    if (price < 0) {
      alert("السعر لا يمكن أن يكون أقل من صفر");
      return;
    }

    const discount = Math.min(
      100,
      Math.max(0, Number(form.discount_percent) || 0)
    );

    // مهم:
    // اسم العمود في Supabase هو isNew
    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: price,
      discount_percent: discount,
      image: form.image.trim(),
      isNew: Boolean(form.isNew),
    };

    setSaving(true);

    // =========================
    // Update
    // =========================
    if (editingId !== null) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (error) {
        console.error("Update error:", error);
        alert(`حصل خطأ أثناء تعديل المنتج: ${error.message}`);
      } else {
        alert("تم تعديل المنتج بنجاح");
        resetForm();
        await fetchProducts();
      }

      setSaving(false);
      return;
    }

    // =========================
    // Insert
    // =========================
    const { error } = await supabase
      .from("products")
      .insert([productData]);

    if (error) {
      console.error("Insert error:", error);
      alert(`حصل خطأ أثناء إضافة المنتج: ${error.message}`);
    } else {
      alert("تم إضافة المنتج بنجاح");
      resetForm();
      await fetchProducts();
    }

    setSaving(false);
  };

  // =========================
  // Edit
  // =========================
  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "شميز",
      price: product.price ?? "",
      discount_percent: product.discount_percent ?? 0,
      image: product.image || "",
      isNew: Boolean(product.isNew),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنتج؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert(`حصل خطأ أثناء حذف المنتج: ${error.message}`);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    alert("تم حذف المنتج");

    await fetchProducts();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 px-5 py-8 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">
            BIOR ADMIN
          </span>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            لوحة تحكم BIOR
          </h1>

          <p className="mt-2 text-gray-500">
            إدارة منتجات BIOR وإضافة الصور والأسعار والخصومات بسهولة.
          </p>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            {editingId !== null
              ? "تعديل المنتج"
              : "إضافة منتج جديد"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {editingId !== null
              ? "عدّل البيانات المطلوبة ثم اضغط حفظ التعديلات."
              : "املأ البيانات التالية لإضافة منتج جديد."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block font-medium">
                اسم المنتج
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="مثال: هودي حريمي"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-medium">
                القسم
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="شميز">شميز</option>
                <option value="هودي">هودي</option>
                <option value="تيشيرت">تيشيرت</option>
                <option value="بنطلون">بنطلون</option>
                <option value="جيبة">جيبة</option>
                <option value="سوت">سوت</option>
                <option value="توب">توب</option>
                <option value="بلوز">بلوز</option>
                <option value="جاكت">جاكت</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block font-medium">
                السعر الأصلي
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="مثال: 850"
                min="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="mb-2 block font-medium">
                الخصم (%)
              </label>

              <input
                type="number"
                name="discount_percent"
                value={form.discount_percent}
                onChange={handleChange}
                placeholder="مثال: 20"
                min="0"
                max="100"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />

              {Number(form.discount_percent) > 0 &&
                Number(form.price) > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    السعر بعد الخصم:{" "}
                    <strong>
                      {getDiscountedPrice(
                        form.price,
                        form.discount_percent
                      )}{" "}
                      جنيه
                    </strong>
                  </p>
                )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                صورة المنتج
              </label>

              <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || saving}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-5 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                />

                {uploadingImage && (
                  <p className="mt-3 text-sm text-gray-500">
                    جاري رفع الصورة...
                  </p>
                )}

                {form.image && !uploadingImage && (
                  <div className="mt-5">

                    <p className="mb-3 text-sm text-green-600">
                      تم اختيار الصورة بنجاح
                    </p>

                    <div className="relative aspect-[4/5] max-w-xs overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={form.image}
                        alt={form.name || "صورة المنتج"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                  </div>
                )}

                {!form.image && !uploadingImage && (
                  <p className="mt-3 text-xs text-gray-400">
                    اختار صورة المنتج من جهازك، وسيتم رفعها تلقائيًا.
                  </p>
                )}

              </div>
            </div>

            {/* New */}
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={form.isNew}
                  onChange={handleChange}
                  className="h-5 w-5"
                />

                <span className="font-medium">
                  المنتج جديد
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-xl bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "جاري الحفظ..."
                  : uploadingImage
                    ? "جاري رفع الصورة..."
                    : editingId !== null
                      ? "حفظ التعديلات"
                      : "إضافة المنتج"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving || uploadingImage}
                  className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition hover:border-black hover:text-black"
                >
                  إلغاء التعديل
                </button>
              )}

            </div>
          </form>
        </div>

        {/* Products */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                منتجات BIOR
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                عدد المنتجات: {products.length}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium transition hover:border-black disabled:opacity-50"
            >
              {loading
                ? "جاري التحميل..."
                : "تحديث المنتجات"}
            </button>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              جاري تحميل المنتجات...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              لا توجد منتجات حاليًا.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {products.map((product) => {
                const originalPrice =
                  Number(product.price) || 0;

                const discount =
                  Number(product.discount_percent) || 0;

                const finalPrice =
                  getDiscountedPrice(
                    originalPrice,
                    discount
                  );

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >

                    {/* Image */}
                    <div className="relative flex aspect-[4/5] items-center justify-center bg-gray-100">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <div className="text-4xl">
                            ✦
                          </div>

                          <p className="mt-2 text-sm">
                            لا توجد صورة
                          </p>
                        </div>
                      )}

                      {/* New Badge */}
                      {product.isNew && (
                        <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                          جديد
                        </span>
                      )}

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                          خصم {discount}%
                        </span>
                      )}

                    </div>

                    {/* Info */}
                    <div className="p-4">

                      <p className="text-xs text-gray-400">
                        {product.category}
                      </p>

                      <h3 className="mt-2 font-bold text-gray-900">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-3">

                        {discount > 0 ? (
                          <div className="flex items-center gap-2">

                            <span className="text-lg font-bold text-red-600">
                              {finalPrice} جنيه
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              {originalPrice} جنيه
                            </span>

                          </div>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">
                            {originalPrice} جنيه
                          </p>
                        )}

                      </div>

                      {/* Saving */}
                      {discount > 0 && (
                        <p className="mt-2 text-xs text-green-600">
                          توفير{" "}
                          {originalPrice - finalPrice} جنيه
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
                        >
                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="flex-1 rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          حذف
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;