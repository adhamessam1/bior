import products from "../../data/products";
import ProductCard from "../ProductCard/ProductCard";

function Products({ searchTerm = "" }) {
  const search = String(searchTerm).trim();

  let filteredProducts = products;

  if (search === "الجديد") {
    filteredProducts = products.filter((product) => product.isNew);
  } else if (search !== "") {
    filteredProducts = products.filter(
      (product) =>
        product.name.includes(search) ||
        product.category.includes(search)
    );
  }

  return (
    <section
      id="products"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section Header */}
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">
            BIOR PRODUCTS
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {search === "الجديد" ? "أحدث المنتجات" : "منتجات BIOR"}
          </h2>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            {search
              ? `النتائج الخاصة بـ "${search}"`
              : "اكتشفي أحدث تشكيلات الملابس الحريمي"}
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg font-medium">
              مفيش منتجات مطابقة.
            </p>

            <p className="mt-2 text-sm">
              جربي البحث عن قسم أو منتج تاني.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default Products;