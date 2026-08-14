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
      className="bg-[#f6f3ef] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Header */}
        <div className="flex flex-col items-end text-right sm:flex-row sm:items-end sm:justify-between sm:gap-10">

          <div className="max-w-xl sm:text-right">
            <span className="text-xs font-medium tracking-[0.3em] text-gray-500">
              BIOR COLLECTIONS
            </span>

            <h2 className="mt-4 text-4xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
              اكتشفي الأقسام
            </h2>
          </div>

          <p className="mt-5 max-w-md text-sm leading-7 text-gray-500 sm:mb-1 sm:mt-0 sm:text-base">
            تصفحي تشكيلات BIOR واختاري القسم اللي حابة تشوفي منتجاته.
          </p>
        </div>

        {/* Categories */}
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-gray-300 bg-gray-300 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className="group relative flex min-h-[150px] items-end overflow-hidden bg-[#f6f3ef] p-5 text-right transition-colors duration-500 hover:bg-black sm:min-h-[180px] lg:min-h-[200px]"
            >
              {/* Number */}
              <span className="absolute right-5 top-5 text-xs tracking-[0.2em] text-gray-400 transition-colors duration-500 group-hover:text-gray-500">
                0{index + 1}
              </span>

              {/* Arrow */}
              <span className="absolute left-5 top-5 text-lg font-light text-gray-400 transition-all duration-500 group-hover:-translate-x-1 group-hover:text-white">
                ←
              </span>

              {/* Category Name */}
              <span className="relative z-10 text-xl font-medium text-gray-900 transition-colors duration-500 group-hover:text-white sm:text-2xl">
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Browse All */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleShowAll}
            className="border-b border-black pb-2 text-sm font-medium text-black transition-opacity hover:opacity-50"
          >
            عرض كل المنتجات
          </button>
        </div>

      </div>
    </section>
  );
}

export default Categories;