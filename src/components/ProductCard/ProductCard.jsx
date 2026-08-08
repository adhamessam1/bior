function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

      {/* Product Image */}
      <div className="relative h-80 bg-gray-100 flex items-center justify-center overflow-hidden">

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
            جديد
          </span>
        )}

        {/* Product Image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center text-gray-400">
            <span className="text-sm">
              صورة المنتج
            </span>
          </div>
        )}

      </div>

      {/* Product Info */}
      <div className="p-5 text-right">

        <p className="text-sm text-gray-400 mb-1">
          {product.category}
        </p>

        <h3 className="text-lg font-semibold">
          {product.name}
        </h3>

        <p className="text-green-600 font-bold mt-2">
          {product.price} جنيه
        </p>

        <div className="mt-5 w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center text-sm font-medium">
          متوفر في الفرع
        </div>

      </div>

    </div>
  );
}

export default ProductCard;