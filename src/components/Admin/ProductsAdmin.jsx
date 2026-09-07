import { useEffect, useMemo, useState } from "react";

import { supabase } from "../../lib/supabase";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  original_price: "",
  discount_percent: "",
  image: "",
  isNew: false,
  is_available: true,
  is_best_seller: false,
  is_featured: false,
  category_id: "",
  short_description: "",
  description: "",
  caption: "",
  details: "",
  extra_details: "",
  sku: "",
  sort_order: 0,
  seo_title: "",
  seo_description: "",
  og_image: "",
};

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin products fetch error:", error);
      alert("حصل خطأ أثناء تحميل المنتجات.");
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("Admin categories fetch error:", error);
      alert("حصل خطأ أثناء تحميل الأقسام.");
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // FILTERED PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const selectedCategory = categories.find(
      (category) =>
        String(category.id) === String(filterCategory)
    );

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.sku,
        product.category,
        product.description,
        product.short_description,
        product.caption,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      let matchesCategory = true;

      if (filterCategory) {
        const productCategoryId = String(
          product.category_id ?? ""
        );

        const productCategoryName = String(
          product.category ?? ""
        )
          .trim()
          .toLowerCase();

        const selectedCategoryName = String(
          selectedCategory?.name ?? ""
        )
          .trim()
          .toLowerCase();

        matchesCategory =
          productCategoryId === String(filterCategory) ||
          (selectedCategoryName &&
            productCategoryName === selectedCategoryName);
      }

      let matchesStatus = true;

      switch (filterStatus) {
        case "available":
          matchesStatus = product.is_available === true;
          break;

        case "unavailable":
          matchesStatus = product.is_available === false;
          break;

        case "new":
          matchesStatus = product.isNew === true;
          break;

        case "best":
          matchesStatus = product.is_best_seller === true;
          break;

        case "featured":
          matchesStatus = product.is_featured === true;
          break;

        default:
          matchesStatus = true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    categories,
    searchTerm,
    filterCategory,
    filterStatus,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    const selectedCategory = categories.find(
      (category) =>
        String(category.id) === String(categoryId)
    );

    setForm((current) => ({
      ...current,
      category_id: categoryId,
      category: selectedCategory?.name || "",
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("من فضلك اختر صورة فقط.");
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
  // DETAILS HELPER
  // =========================

  const getDetailsText = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (parsed && typeof parsed === "object") {
          if (typeof parsed.text === "string") {
            return parsed.text;
          }

          return JSON.stringify(parsed, null, 2);
        }

        return String(parsed);
      } catch {
        return value;
      }
    }

    if (typeof value === "object") {
      if (typeof value.text === "string") {
        return value.text;
      }

      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setSelectedImage(null);
    setImagePreview("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      original_price: product.original_price ?? "",
      discount_percent: product.discount_percent ?? "",
      image: product.image || "",

      isNew: Boolean(product.isNew),

      is_available:
        product.is_available !== false,

      is_best_seller:
        Boolean(product.is_best_seller),

      is_featured:
        Boolean(product.is_featured),

      category_id:
        product.category_id ?? "",

      short_description:
        product.short_description || "",

      description:
        product.description || "",

      caption:
        product.caption || "",

      details:
        getDetailsText(product.details),

      extra_details:
        getDetailsText(product.extra_details),

      sku:
        product.sku || "",

      sort_order:
        product.sort_order ?? 0,

      seo_title:
        product.seo_title || "",

      seo_description:
        product.seo_description || "",

      og_image:
        product.og_image || "",
    });

    setSelectedImage(null);
    setImagePreview(product.image || "");
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
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setSelectedImage(null);
    setImagePreview("");
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }

    const fileExtension =
      file.name.split(".").pop();

    const safeExtension = fileExtension
      ? fileExtension.toLowerCase()
      : "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${safeExtension}`;

    const filePath = fileName;

    const { error: uploadError } =
      await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

    if (uploadError) {
      console.error(
        "Image upload error:",
        uploadError
      );

      throw new Error(
        `فشل رفع الصورة: ${uploadError.message}`
      );
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error(
        "لم يتم الحصول على رابط الصورة."
      );
    }

    return data.publicUrl;
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("اكتب اسم المنتج أولًا.");
      return;
    }

    if (!form.category_id) {
      alert("اختار قسم المنتج.");
      return;
    }

    if (form.price === "") {
      alert("اكتب سعر المنتج.");
      return;
    }

    if (Number(form.price) < 0) {
      alert("السعر لا يمكن أن يكون بالسالب.");
      return;
    }

    if (
      form.original_price !== "" &&
      Number(form.original_price) < 0
    ) {
      alert(
        "السعر الأصلي لا يمكن أن يكون بالسالب."
      );
      return;
    }

    if (
      form.discount_percent !== "" &&
      (Number(form.discount_percent) < 0 ||
        Number(form.discount_percent) > 100)
    ) {
      alert(
        "نسبة الخصم يجب أن تكون بين 0 و100."
      );
      return;
    }

    setSaving(true);

    try {
      // IMAGE

      let imageUrl =
        form.image.trim() || null;

      if (selectedImage) {
        imageUrl =
          await uploadImage(selectedImage);
      }

      // CATEGORY

      const selectedCategoryId =
        Number(form.category_id);

      const selectedCategory =
        categories.find(
          (category) =>
            Number(category.id) ===
            selectedCategoryId
        );

      // DETAILS

      let detailsValue = {};

      if (form.details.trim()) {
        try {
          const parsedDetails =
            JSON.parse(form.details);

          if (
            parsedDetails &&
            typeof parsedDetails === "object"
          ) {
            detailsValue = parsedDetails;
          } else {
            detailsValue = {
              text: form.details.trim(),
            };
          }
        } catch {
          detailsValue = {
            text: form.details.trim(),
          };
        }
      }

      // EXTRA DETAILS

      let extraDetailsValue = {};

      if (form.extra_details.trim()) {
        try {
          const parsedExtraDetails =
            JSON.parse(form.extra_details);

          if (
            parsedExtraDetails &&
            typeof parsedExtraDetails === "object"
          ) {
            extraDetailsValue =
              parsedExtraDetails;
          } else {
            extraDetailsValue = {
              text: form.extra_details.trim(),
            };
          }
        } catch {
          extraDetailsValue = {
            text: form.extra_details.trim(),
          };
        }
      }

      // PRODUCT DATA

      const productData = {
        name: form.name.trim(),

        category:
          selectedCategory?.name ||
          form.category.trim(),

        price: Number(form.price),

        original_price:
          form.original_price === ""
            ? null
            : Number(form.original_price),

        discount_percent:
          form.discount_percent === ""
            ? 0
            : Number(form.discount_percent),

        image: imageUrl,

        isNew: Boolean(form.isNew),

        is_available:
          Boolean(form.is_available),

        is_best_seller:
          Boolean(form.is_best_seller),

        is_featured:
          Boolean(form.is_featured),

        category_id:
          selectedCategoryId,

        short_description:
          form.short_description.trim() || null,

        description:
          form.description.trim() || null,

        caption:
          form.caption.trim() || null,

        details: detailsValue,

        extra_details:
          extraDetailsValue,

        sku:
          form.sku.trim() || null,

        sort_order:
          form.sort_order === ""
            ? 0
            : Number(form.sort_order),

        seo_title:
          form.seo_title.trim() || null,

        seo_description:
          form.seo_description.trim() || null,

        og_image:
          form.og_image.trim() || null,
      };

      // EDIT

      if (editingProduct) {
        const { error } =
          await supabase
            .from("products")
            .update(productData)
            .eq(
              "id",
              editingProduct.id
            );

        if (error) {
          console.error(
            "Update product error:",
            error
          );

          throw new Error(error.message);
        }
      }

      // ADD

      else {
        const { error } =
          await supabase
            .from("products")
            .insert([productData]);

        if (error) {
          console.error(
            "Insert product error:",
            error
          );

          throw new Error(error.message);
        }
      }

      alert(
        editingProduct
          ? "تم تعديل المنتج بنجاح ✅"
          : "تم إضافة المنتج بنجاح ✅"
      );

      await fetchProducts();

      setShowForm(false);
      setEditingProduct(null);
      setForm({ ...emptyForm });
      setSelectedImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      alert(
        `حصل خطأ أثناء حفظ المنتج:\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "هل أنت متأكد إنك عايز تحذف المنتج ده؟"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(productId);

    const { error } =
      await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        `حصل خطأ أثناء حذف المنتج:\n${error.message}`
      );

      setDeletingId(null);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) =>
          product.id !== productId
      )
    );

    setDeletingId(null);
  };

  // =========================
  // PRICE
  // =========================

  const getPriceData = (product) => {
    const price =
      Number(product.price) || 0;

    const originalPrice =
      Number(product.original_price) ||
      price;

    const discount =
      Number(product.discount_percent) || 0;

    const finalPrice =
      discount > 0
        ? Math.round(
            originalPrice -
              originalPrice *
                (discount / 100)
          )
        : price;

    return {
      price,
      originalPrice,
      discount,
      finalPrice,
    };
  };

  // =========================
  // RENDER
  // =========================

  return (
    <section dir="rtl">
      {/* HEADER */}

      <div className="mb-10 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-gray-400">
              BIOR PRODUCTS
            </span>

            <h2 className="mt-4 text-3xl font-light tracking-tight text-black sm:text-4xl">
              إدارة المنتجات
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              من هنا تقدر تضيف وتعدل وتحذف منتجات BIOR.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="w-fit border border-black bg-black px-6 py-3 text-sm text-white transition hover:bg-white hover:text-black"
          >
            + إضافة منتج
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <section className="mb-8 border border-gray-200 bg-white p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-3">
          {/* SEARCH */}

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              البحث
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="ابحث باسم المنتج أو SKU أو القسم..."
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              القسم
            </label>

            <select
              value={filterCategory}
              onChange={(event) =>
                setFilterCategory(
                  event.target.value
                )
              }
              disabled={loadingCategories}
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option value="">
                {loadingCategories
                  ? "جاري تحميل الأقسام..."
                  : "كل الأقسام"}
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              الحالة
            </label>

            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(
                  event.target.value
                )
              }
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">
                كل المنتجات
              </option>

              <option value="available">
                المنتجات المتاحة
              </option>

              <option value="unavailable">
                غير متاحة
              </option>

              <option value="new">
                المنتجات الجديدة
              </option>

              <option value="best">
                الأكثر مبيعًا
              </option>

              <option value="featured">
                المميزة
              </option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
          <span className="text-xs text-gray-400">
            عرض {filteredProducts.length} من{" "}
            {products.length} منتج
          </span>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-gray-500 transition hover:text-black"
          >
            مسح الفلاتر
          </button>
        </div>
      </section>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <section className="mb-10 border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <span className="text-xs text-gray-400">
                BIOR PRODUCT
              </span>

              <h3 className="mt-2 text-2xl font-light text-black">
                {editingProduct
                  ? "تعديل المنتج"
                  : "إضافة منتج جديد"}
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
            className="space-y-8"
          >
            {/* BASIC INFO */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                البيانات الأساسية
              </h4>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    اسم المنتج *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="مثال: جاكت شتوي"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="مثال: BIOR-001"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    القسم *
                  </label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleCategoryChange}
                    disabled={loadingCategories}
                    className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="">
                      {loadingCategories
                        ? "جاري تحميل الأقسام..."
                        : "اختار القسم"}
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    ترتيب المنتج
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* PRICES */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                الأسعار
              </h4>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    السعر الحالي *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="850"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    السعر الأصلي
                  </label>

                  <input
                    type="number"
                    name="original_price"
                    value={form.original_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="1000"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    نسبة الخصم %
                  </label>

                  <input
                    type="number"
                    name="discount_percent"
                    value={form.discount_percent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    placeholder="20"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* IMAGE */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                صورة المنتج
              </h4>

              <label className="mb-3 block text-xs text-gray-500">
                اختر صورة من الجهاز
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="block w-full cursor-pointer border border-gray-200 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-400">
                الحد الأقصى 5MB — JPG, PNG, WEBP وغيرها.
              </p>

              {imagePreview && (
                <div className="mt-5">
                  <p className="mb-2 text-xs text-gray-500">
                    معاينة الصورة
                  </p>

                  <div className="h-64 w-48 overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTIONS */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                وصف المنتج
              </h4>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    وصف مختصر
                  </label>

                  <textarea
                    name="short_description"
                    value={form.short_description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="اكتب وصفًا مختصرًا للمنتج..."
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    الوصف الكامل
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="اكتب وصف المنتج بالتفصيل..."
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    Caption
                  </label>

                  <textarea
                    name="caption"
                    value={form.caption}
                    onChange={handleChange}
                    rows="3"
                    placeholder="نص قصير إضافي للمنتج..."
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* DETAILS */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                تفاصيل المنتج
              </h4>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    Details
                  </label>

                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    rows="6"
                    placeholder="اكتب تفاصيل المنتج..."
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    تقدر تكتب التفاصيل بشكل عادي.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    Extra Details
                  </label>

                  <textarea
                    name="extra_details"
                    value={form.extra_details}
                    onChange={handleChange}
                    rows="5"
                    placeholder="اكتب تفاصيل إضافية..."
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                حالة المنتج
              </h4>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={form.is_available}
                    onChange={handleChange}
                  />

                  <span className="text-sm">
                    المنتج متاح
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={form.isNew}
                    onChange={handleChange}
                  />

                  <span className="text-sm">
                    منتج جديد
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_best_seller"
                    checked={form.is_best_seller}
                    onChange={handleChange}
                  />

                  <span className="text-sm">
                    الأكثر مبيعًا
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                  />

                  <span className="text-sm">
                    Featured
                  </span>
                </label>
              </div>
            </div>

            {/* SEO */}

            <div>
              <h4 className="mb-5 text-sm font-medium text-black">
                SEO
              </h4>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    SEO Title
                  </label>

                  <input
                    name="seo_title"
                    value={form.seo_title}
                    onChange={handleChange}
                    placeholder="عنوان المنتج لمحركات البحث"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    SEO Description
                  </label>

                  <textarea
                    name="seo_description"
                    value={form.seo_description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="وصف المنتج لمحركات البحث"
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    OG Image
                  </label>

                  <input
                    name="og_image"
                    value={form.og_image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    اختياري — رابط صورة المشاركة على السوشيال ميديا.
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={
                  saving || loadingCategories
                }
                className="border border-black bg-black px-8 py-3 text-sm text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "جاري الحفظ..."
                  : editingProduct
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
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

      {/* PRODUCTS */}

      {loading ? (
        <div className="border border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">
            جاري تحميل المنتجات...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-gray-200 bg-white px-6 py-20 text-center">
          <h3 className="text-xl font-light text-black">
            مفيش نتائج
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            جرّب تغيير البحث أو الفلاتر.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 border-b border-black pb-1 text-xs text-black"
          >
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-right">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    المنتج
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    القسم
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    السعر
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الخصم
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الحالة
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const {
                    price,
                    originalPrice,
                    discount,
                    finalPrice,
                  } = getPriceData(product);

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {/* PRODUCT */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={
                                  product.name ||
                                  "BIOR product"
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
                              {product.name ||
                                "بدون اسم"}
                            </p>

                            {product.sku && (
                              <p className="mt-1 text-xs text-gray-400">
                                SKU:{" "}
                                {product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-600">
                          {product.category ||
                            "بدون قسم"}
                        </span>
                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-5">
                        {discount > 0 ? (
                          <div>
                            <p className="text-sm font-semibold text-black">
                              {finalPrice} جنيه
                            </p>

                            <p className="text-xs text-gray-400 line-through">
                              {originalPrice} جنيه
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-black">
                            {price} جنيه
                          </span>
                        )}
                      </td>

                      {/* DISCOUNT */}

                      <td className="px-6 py-5">
                        {discount > 0 ? (
                          <span className="inline-flex bg-black px-3 py-1 text-xs text-white">
                            خصم {discount}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            بدون خصم
                          </span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {product.is_available ? (
                            <span className="inline-flex border border-black px-3 py-1 text-xs text-black">
                              متاح
                            </span>
                          ) : (
                            <span className="inline-flex border border-gray-200 px-3 py-1 text-xs text-gray-400">
                              غير متاح
                            </span>
                          )}

                          {product.isNew && (
                            <span className="inline-flex bg-black px-3 py-1 text-xs text-white">
                              جديد
                            </span>
                          )}

                          {product.is_best_seller && (
                            <span className="inline-flex border border-gray-300 px-3 py-1 text-xs text-gray-600">
                              الأكثر مبيعًا
                            </span>
                          )}

                          {product.is_featured && (
                            <span className="inline-flex border border-gray-300 px-3 py-1 text-xs text-gray-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-5">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                product
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
                                product.id
                              )
                            }
                            disabled={
                              deletingId ===
                              product.id
                            }
                            className="text-xs text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            product.id
                              ? "جاري الحذف..."
                              : "حذف"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductsAdmin;