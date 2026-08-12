function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
            جديد
          </span>
        )}

        {/* Image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="text-sm">
              صورة المنتج
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-4 py-3 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
          متوفر في الفرع
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 text-right">
        <p className="text-xs font-medium text-gray-400">
          {product.category}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-green-600">
            {product.price} جنيه
          </p>

          <span className="text-xs text-gray-400">
            داخل الفرع
          </span>
        </div>
      </div>

    </article>
  );
}

export default ProductCard;