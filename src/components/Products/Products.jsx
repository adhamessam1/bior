import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import ProductCard from "../ProductCard/ProductCard";

function Products({
  searchTerm = "",
  setSearchTerm,
  categoryId = null,
  setCategoryId,
  showNew = false,
  setShowNew,
  onCategoryChange,
  onShowNew,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ==========================================
  // جلب المنتجات
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Products fetch error:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // ==========================================
  // جلب الأقسام
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);

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

      setCategoriesLoading(false);
    };

    fetchCategories();
  }, []);

  // ==========================================
  // القسم الحالي
  // ==========================================

  const activeCategoryId =
    categoryId !== null &&
    categoryId !== undefined &&
    categoryId !== ""
      ? Number(categoryId)
      : null;

  // ==========================================
  // فلترة المنتجات
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // ----------------------------------------
    // القسم
    // ----------------------------------------

    if (activeCategoryId !== null) {
      const selectedCategory = categories.find(
        (category) =>
          Number(category.id) === activeCategoryId
      );

      const selectedCategoryName = String(
        selectedCategory?.name || ""
      )
        .trim()
        .toLowerCase();

      result = result.filter((product) => {
        const productCategoryId = Number(
          product.category_id
        );

        const productCategoryName = String(
          product.category || ""
        )
          .trim()
          .toLowerCase();

        // الطريقة الأساسية
        if (
          product.category_id !== null &&
          product.category_id !== undefined &&
          productCategoryId === activeCategoryId
        ) {
          return true;
        }

        // الطريقة الاحتياطية
        if (
          selectedCategoryName &&
          productCategoryName === selectedCategoryName
        ) {
          return true;
        }

        return false;
      });
    }

    // ----------------------------------------
    // الجديد
    // ----------------------------------------

    if (showNew) {
      result = result.filter(
        (product) => product.isNew === true
      );
    }

    // ----------------------------------------
    // البحث
    // ----------------------------------------

    if (searchTerm.trim()) {
      const search = searchTerm
        .trim()
        .toLowerCase();

      result = result.filter((product) => {
        const name = String(
          product.name || ""
        ).toLowerCase();

        const category = String(
          product.category || ""
        ).toLowerCase();

        const description = String(
          product.description || ""
        ).toLowerCase();

        const shortDescription = String(
          product.short_description || ""
        ).toLowerCase();

        const caption = String(
          product.caption || ""
        ).toLowerCase();

        return (
          name.includes(search) ||
          category.includes(search) ||
          description.includes(search) ||
          shortDescription.includes(search) ||
          caption.includes(search)
        );
      });
    }

    return result;
  }, [
    products,
    categories,
    activeCategoryId,
    searchTerm,
    showNew,
  ]);

  // ==========================================
  // اختيار قسم من أزرار المنتجات
  // ==========================================

  const handleCategoryClick = (category) => {
    // نمسح البحث
    setSearchTerm?.("");

    // نلغي الجديد
    setShowNew?.(false);

    // نحدث القسم في Home
    setCategoryId?.(Number(category.id));

    // لو Home مجهز callback نستخدمه
    if (onCategoryChange) {
      onCategoryChange(category);
      return;
    }

    // Scroll
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ==========================================
  // الكل
  // ==========================================

  const handleShowAll = () => {
    setCategoryId?.(null);
    setShowNew?.(false);
    setSearchTerm?.("");

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <main
      id="products"
      dir="rtl"
      className="min-h-screen bg-white"
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="px-5 pb-8 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-gray-200 pb-8">

            <p className="text-[10px] font-medium tracking-[0.35em] text-gray-400">
              BIOR COLLECTION
            </p>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-4xl font-light tracking-tight text-gray-950 sm:text-5xl">
                  المنتجات
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  اكتشفي أحدث تشكيلة BIOR من الملابس الحريمي.
                </p>
              </div>

              {!loading && (
                <p className="text-xs text-gray-400">
                  {filteredProducts.length} منتج
                </p>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CATEGORIES
      ========================================= */}

      <section className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-2">

              {/* الكل */}

              <button
                type="button"
                onClick={handleShowAll}
                className={`border px-5 py-2.5 text-xs transition-all duration-300 ${
                  !activeCategoryId &&
                  !showNew &&
                  !searchTerm
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black"
                }`}
              >
                الكل
              </button>

              {/* الأقسام */}

              {!categoriesLoading &&
                categories.map((category) => {
                  const isActive =
                    activeCategoryId ===
                      Number(category.id) &&
                    !showNew &&
                    !searchTerm;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        handleCategoryClick(category)
                      }
                      className={`border px-5 py-2.5 text-xs transition-all duration-300 ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}

              {/* Loading */}

              {categoriesLoading &&
                Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-9 w-20 animate-pulse bg-gray-100"
                    />
                  )
                )}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PRODUCTS
      ========================================= */}

      <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Loading */}

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">

              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse"
                  >
                    <div className="aspect-[4/5] bg-gray-100" />

                    <div className="pt-5">
                      <div className="h-2.5 w-16 bg-gray-100" />

                      <div className="mt-3 h-4 w-3/4 bg-gray-100" />

                      <div className="mt-5 border-t border-gray-100 pt-3">
                        <div className="h-3 w-20 bg-gray-100" />
                      </div>
                    </div>
                  </div>
                )
              )}

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="border-y border-gray-100 py-24 text-center">

              <p className="text-sm text-gray-500">
                لا توجد منتجات مطابقة حاليًا.
              </p>

              {(searchTerm ||
                showNew ||
                activeCategoryId) && (
                <button
                  type="button"
                  onClick={handleShowAll}
                  className="mt-5 border-b border-black pb-1 text-xs text-black"
                >
                  عرض جميع المنتجات
                </button>
              )}

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image:
                      product.image ||
                      product.image_url ||
                      "",
                  }}
                />
              ))}

            </div>

          )}

        </div>
      </section>
    </main>
  );
}

export default Products;