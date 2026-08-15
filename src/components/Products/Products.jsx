import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ProductCard from "../ProductCard/ProductCard";

function Products({ searchTerm = "", showNew = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = String(searchTerm).trim();

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Products fetch error:", error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  let filteredProducts = products;

  // =========================
  // الجديد
  // =========================
  if (showNew || search === "الجديد") {
    filteredProducts = products.filter(
      (product) => product.isNew === true
    );
  }

  // =========================
  // البحث والأقسام
  // =========================
  else if (search !== "") {
    filteredProducts = products.filter(
      (product) =>
        String(product.name || "").includes(search) ||
        String(product.category || "").includes(search)
    );
  }

  return (
    <section
      id="products"
      className="w-full bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Header */}
        <div className="flex flex-col gap-8 border-b border-gray-200 pb-10 sm:flex-row sm:items-end sm:justify-between">

          {/* Title */}
          <div className="text-right">
            <span className="text-xs font-medium tracking-[0.3em] text-gray-400">
              BIOR PRODUCTS
            </span>

            <h2 className="mt-4 text-4xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
              {showNew || search === "الجديد"
                ? "أحدث المنتجات"
                : "تشكيلة BIOR"}
            </h2>
          </div>

          {/* Description */}
          <div className="max-w-md text-right">
            <p className="text-sm leading-8 text-gray-500 sm:text-base">
              {search
                ? `النتائج الخاصة بـ "${search}"`
                : showNew
                  ? "أحدث القطع المضافة إلى تشكيلة BIOR."
                  : "اكتشفي تشكيلات BIOR واختاري القطع اللي تناسب ستايلك."}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-400">
              <span className="h-px w-8 bg-gray-300" />
              <span>عرض واستعراض فقط</span>
            </div>
          </div>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-24 text-center">
            <p className="text-sm text-gray-500">
              جاري تحميل المنتجات...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (

          /* Products Grid */
          <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        ) : (

          /* Empty State */
          <div className="py-24 text-center">
            <p className="text-xl font-light text-gray-900">
              مفيش منتجات مطابقة.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              جربي البحث عن قسم أو منتج تاني.
            </p>
          </div>

        )}

      </div>
    </section>
  );
}

export default Products;