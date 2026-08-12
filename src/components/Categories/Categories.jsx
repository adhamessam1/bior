function Categories({ setSearchTerm, setShowNew }) {
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
    setShowNew(false);
    setSearchTerm(category);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleShowAll = () => {
    setShowNew(false);
    setSearchTerm("");

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <section
  id="categories"
  className="bg-gray-50 py-16 sm:py-20"
>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section Header */}
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">
            BIOR COLLECTIONS
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            تصفحي حسب القسم
          </h2>

          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            اكتشفي أحدث تشكيلات الملابس الحريمي
          </p>
        </div>

        {/* Categories */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg sm:h-32"
            >
              <span className="relative z-10 text-base font-semibold text-gray-800 transition-colors duration-300 group-hover:text-white sm:text-lg">
                {category}
              </span>

              <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-300 group-hover:translate-y-0" />
            </button>
          ))}
        </div>

        {/* All Products */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleShowAll}
            className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            عرض كل المنتجات
          </button>
        </div>

      </div>
    </section>
  );
}

export default Categories;