import { useState } from "react";

function Admin() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "شميز",
    price: "",
    image: "",
    isNew: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("من فضلك اكتب اسم المنتج والسعر");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
    };

    setProducts([...products, newProduct]);

    setForm({
      name: "",
      category: "شميز",
      price: "",
      image: "",
      isNew: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 sm:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold">
            لوحة تحكم BIOR
          </h1>

          <p className="text-gray-500 mt-2">
            إضافة وتعديل منتجات المتجر بسهولة.
          </p>
        </div>

        {/* Add Product */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">

          <h2 className="text-2xl font-bold mb-6">
            إضافة منتج جديد
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* Product Name */}
            <div>
              <label className="block mb-2 font-medium">
                اسم المنتج
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="مثال: هودي حريمي"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium">
                القسم
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-black"
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
              <label className="block mb-2 font-medium">
                السعر
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="مثال: 850"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 font-medium">
                رابط الصورة
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="ضع رابط صورة المنتج"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* New */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={form.isNew}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <span className="font-medium">
                  المنتج جديد
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                إضافة المنتج
              </button>
            </div>

          </form>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">

          <h2 className="text-2xl font-bold mb-6">
            المنتجات المضافة
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500">
              لم يتم إضافة منتجات جديدة بعد.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-bold">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {product.category}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    {product.price} جنيه
                  </p>

                  {product.isNew && (
                    <span className="inline-block mt-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                      جديد
                    </span>
                  )}
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Admin;