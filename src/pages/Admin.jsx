import { useState } from "react";
import productsData from "../data/products";

function Admin() {
  const [products, setProducts] = useState(productsData);

  const [form, setForm] = useState({
    name: "",
    category: "شميز",
    price: "",
    image: "",
    isNew: false,
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "شميز",
      price: "",
      image: "",
      isNew: false,
    });

    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      alert("من فضلك اكتب اسم المنتج والسعر");
      return;
    }

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name.trim(),
                category: form.category,
                price: Number(form.price),
                image: form.image.trim(),
                isNew: form.isNew,
              }
            : product
        )
      );

      alert("تم تعديل المنتج بنجاح");
      resetForm();
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      isNew: form.isNew,
    };

    setProducts((prev) => [newProduct, ...prev]);

    alert("تم إضافة المنتج بنجاح");
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image || "",
      isNew: product.isNew,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنتج؟"
    );

    if (!confirmed) return;

    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
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
            إدارة منتجات المتجر بسهولة بدون الحاجة لتعديل الكود.
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
                السعر
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

            {/* Image */}
            <div>
              <label className="mb-2 block font-medium">
                رابط الصورة
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="سنضيف رفع الصور لاحقًا"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
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
                className="rounded-xl bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                {editingId !== null
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
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
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                {/* Image */}
                <div className="flex aspect-[4/5] items-center justify-center bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="text-4xl">✦</div>

                      <p className="mt-2 text-sm">
                        لا توجد صورة
                      </p>
                    </div>
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

                  <p className="mt-2 font-bold text-green-600">
                    {product.price} جنيه
                  </p>

                  {product.isNew && (
                    <span className="mt-3 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      جديد
                    </span>
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
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;