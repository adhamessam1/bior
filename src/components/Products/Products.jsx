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
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {search === "الجديد" ? "أحدث المنتجات" : "منتجات BIOR"}
          </h2>

          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            اكتشفي أحدث تشكيلات الملابس الحريمي
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 mt-10 sm:mt-14">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            مفيش منتجات مطابقة.
          </div>
        )}

      </div>
    </section>
  );
}

export default Products;