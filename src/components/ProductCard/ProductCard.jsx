function ProductCard({ product }) {
  const originalPrice = Number(product.price) || 0;
  const discount = Number(product.discount_percent) || 0;

  const finalPrice =
    discount > 0
      ? Math.round(originalPrice - originalPrice * (discount / 100))
      : originalPrice;

  return (
    <article className="group">

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f1ed]">

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute right-4 top-4 z-10 border-b border-black pb-1 text-[10px] font-medium tracking-[0.2em] text-black">
            NEW
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-4 top-4 z-10 bg-black px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] text-white">
            خصم {discount}%
          </span>
        )}

        {/* Image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="text-sm">
              صورة المنتج
            </span>
          </div>
        )}

        {/* Hover Info */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 px-5 py-4 text-center transition-transform duration-500 group-hover:translate-y-0">
          <span className="text-xs font-medium tracking-wide text-white">
            متوفر للعرض في الفرع
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-5 text-right">

        {/* Category + Brand */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-medium tracking-[0.2em] text-gray-400">
            BIOR
          </span>

          <p className="text-xs tracking-[0.12em] text-gray-400">
            {product.category}
          </p>
        </div>

        {/* Product Name */}
        <h3 className="mt-2 text-base font-medium text-gray-900 sm:text-lg">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-4 border-t border-gray-100 pt-3">

          {discount > 0 ? (
            <div className="flex items-end justify-between gap-3">

              <span className="text-[11px] text-gray-400">
                للعرض فقط
              </span>

              <div className="flex items-center gap-2">

                <span className="text-base font-semibold text-black">
                  {finalPrice} جنيه
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {originalPrice} جنيه
                </span>

              </div>

            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">

              <span className="text-[11px] text-gray-400">
                للعرض فقط
              </span>

              <p className="text-base font-semibold text-gray-900">
                {originalPrice} جنيه
              </p>

            </div>
          )}

        </div>

      </div>

    </article>
  );
}

export default ProductCard;