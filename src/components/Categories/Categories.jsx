function Categories({ setSearchTerm }) {
  const categories = [
    "شميز",
    "هودي",
    "تيشيرت",
    "بنطلون",
    "جيبة",
    "سوت",
    "توب",
    "بلوز",
    "جاكت",
  ];

  const handleCategoryClick = (category) => {
    setSearchTerm(category);
  };

  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            تصفحي حسب القسم
          </h2>

          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            اكتشفي أحدث تشكيلات الملابس الحريمي
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mt-10 sm:mt-12">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className="h-32 sm:h-40 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold">
                {category}
              </h3>
            </button>
          ))}
        </div>

        {/* عرض كل المنتجات */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            عرض كل المنتجات
          </button>
        </div>

      </div>
    </section>
  );
}

export default Categories;