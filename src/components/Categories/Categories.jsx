import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

function Categories({
  setSearchTerm,
  setShowNew,
  categoryId,
  setCategoryId,
  onCategoryChange,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select(
          "id, name, image, description, sort_order, is_visible"
        )
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("Categories fetch error:", error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  // =========================
  // CATEGORY CLICK
  // =========================

  const handleCategoryClick = (category) => {
    setSearchTerm("");
    setShowNew(false);

    // تحديث القسم الرئيسي
    setCategoryId?.(Number(category.id));

    // استخدام نفس الـ handler الموجود في Home
    if (onCategoryChange) {
      onCategoryChange(category);
      return;
    }

    // Fallback
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // =========================
  // SHOW ALL
  // =========================

  const handleShowAll = () => {
    setCategoryId?.(null);
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

        {/* =========================
            SECTION HEADER
        ========================= */}

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

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div className="mt-14 border border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">
              جاري تحميل الأقسام...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-14 border border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">
              لا توجد أقسام حاليًا.
            </p>
          </div>
        ) : (

          /* =========================
             CATEGORIES GRID
          ========================= */

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-gray-300 bg-gray-300 sm:grid-cols-3 lg:grid-cols-5">

            {categories.map((category, index) => {
              const isActive =
                Number(categoryId) === Number(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(category)
                  }
                  className={`group relative flex min-h-[150px] items-end overflow-hidden text-right transition-colors duration-500 sm:min-h-[180px] lg:min-h-[200px] ${
                    isActive
                      ? "bg-black"
                      : "bg-[#f6f3ef] hover:bg-black"
                  }`}
                >

                  {/* CATEGORY IMAGE */}

                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                        isActive
                          ? "scale-105 opacity-35"
                          : "opacity-0 group-hover:scale-105 group-hover:opacity-35"
                      }`}
                    />
                  )}

                  {/* OVERLAY */}

                  <div
                    className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                      isActive
                        ? "opacity-40"
                        : "opacity-0 group-hover:opacity-40"
                    }`}
                  />

                  {/* NUMBER */}

                  <span
                    className={`absolute right-5 top-5 z-10 text-xs tracking-[0.2em] transition-colors duration-500 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* ARROW */}

                  <span
                    className={`absolute left-5 top-5 z-10 text-lg font-light transition-all duration-500 ${
                      isActive
                        ? "-translate-x-1 text-white"
                        : "text-gray-400 group-hover:-translate-x-1 group-hover:text-white"
                    }`}
                  >
                    ←
                  </span>

                  {/* ACTIVE LABEL */}

                  {isActive && (
                    <span className="absolute bottom-5 left-5 z-10 text-[10px] font-medium tracking-[0.2em] text-white">
                      SELECTED
                    </span>
                  )}

                  {/* NAME */}

                  <span
                    className={`relative z-10 p-5 text-xl font-medium transition-colors duration-500 sm:text-2xl ${
                      isActive
                        ? "text-white"
                        : "text-gray-900 group-hover:text-white"
                    }`}
                  >
                    {category.name}
                  </span>

                </button>
              );
            })}

          </div>
        )}

        {/* =========================
            SHOW ALL PRODUCTS
        ========================= */}

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