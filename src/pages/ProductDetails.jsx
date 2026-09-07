import { useEffect, useMemo, useState } from "react";

import { supabase } from "../lib/supabase";

import ProductCard from "../components/ProductCard/ProductCard";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/+$/, "");

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq("id", productId)
        .eq("is_available", true)
        .single();

      if (error) {
        console.error("Product details error:", error);

        setProduct(null);
        setError("المنتج غير موجود أو لم يعد متاحًا.");
        setLoading(false);

        return;
      }

      setProduct(data);
      setLoading(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // ==========================================
  // FETCH PRODUCT IMAGES
  // ==========================================

  useEffect(() => {
    const fetchProductImages = async () => {
      if (!productId) return;

      setLoadingImages(true);

      const { data, error } = await supabase
        .from("product_images")
        .select("id, image_url, sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("Product images error:", error);
        setProductImages([]);
      } else {
        setProductImages(data || []);
      }

      setLoadingImages(false);
    };

    fetchProductImages();
  }, [productId]);

  // ==========================================
  // SET MAIN IMAGE
  // ==========================================

  useEffect(() => {
    if (!product) return;

    if (productImages.length > 0) {
      setSelectedImage(productImages[0].image_url);
      return;
    }

    setSelectedImage(
      product.image || product.image_url || ""
    );
  }, [product, productImages]);

  // ==========================================
  // FETCH RELATED PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setLoadingRelated(true);

      let suggestions = [];

      // ----------------------------------------
      // نفس القسم
      // ----------------------------------------

      if (product.category_id) {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq("category_id", product.category_id)
          .eq("is_available", true)
          .neq("id", product.id)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error(
            "Related products error:",
            error
          );
        } else {
          suggestions = data || [];
        }
      }

      // ----------------------------------------
      // لو أقل من 4
      // ----------------------------------------

      if (suggestions.length < 4) {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq("is_available", true)
          .neq("id", product.id)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) {
          console.error(
            "More related products error:",
            error
          );
        } else {
          const existingIds = new Set(
            suggestions.map((item) => item.id)
          );

          const extraProducts = (data || []).filter(
            (item) => !existingIds.has(item.id)
          );

          suggestions = [
            ...suggestions,
            ...extraProducts,
          ].slice(0, 4);
        }
      }

      setRelatedProducts(suggestions);
      setLoadingRelated(false);
    };

    fetchRelatedProducts();
  }, [product]);

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const categoryName = useMemo(() => {
    if (!product) return "";

    return (
      product.categories?.name ||
      product.category ||
      "بدون قسم"
    );
  }, [product]);

  // ==========================================
  // PRICES
  // ==========================================

  const priceData = useMemo(() => {
    if (!product) {
      return {
        originalPrice: 0,
        finalPrice: 0,
        discount: 0,
      };
    }

    const discount =
      Number(product.discount_percent) || 0;

    const originalPrice =
      Number(
        product.original_price ??
          product.old_price ??
          product.price
      ) || 0;

    const finalPrice =
      discount > 0
        ? Math.round(
            originalPrice -
              originalPrice * (discount / 100)
          )
        : Number(product.price) || originalPrice;

    return {
      originalPrice,
      finalPrice,
      discount,
    };
  }, [product]);

  // ==========================================
  // FORMAT JSON DETAILS
  // ==========================================

  const formatDetails = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (
          typeof parsed === "object" &&
          parsed !== null
        ) {
          return formatDetails(parsed);
        }

        return String(parsed);
      } catch {
        return value;
      }
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (
            typeof item === "object" &&
            item !== null
          ) {
            return Object.entries(item)
              .map(
                ([key, val]) =>
                  `${key}: ${String(val)}`
              )
              .join("\n");
          }

          return String(item);
        })
        .join("\n");
    }

    if (typeof value === "object") {
      if (value.text) {
        return String(value.text);
      }

      return Object.entries(value)
        .map(([key, val]) => {
          if (
            typeof val === "object" &&
            val !== null
          ) {
            return `${key}: ${JSON.stringify(val)}`;
          }

          return `${key}: ${String(val)}`;
        })
        .join("\n");
    }

    return String(value);
  };

  // ==========================================
  // OPEN PRODUCT
  // ==========================================

  const openProduct = (id) => {
    window.location.href = `${BASE_PATH}/product/${id}`;
  };

  // ==========================================
  // BACK HOME
  // ==========================================

  const goHome = () => {
    window.location.href = `${BASE_PATH}/`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f6f3ef]"
      >
        <p className="text-sm text-gray-500">
          جاري تحميل تفاصيل المنتج...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f3ef] px-5 py-10 sm:px-8 lg:px-10"
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-gray-400">
            BIOR PRODUCT
          </p>

          <h1 className="mt-5 text-3xl font-light text-black">
            {error || "المنتج غير موجود"}
          </h1>

          <button
            type="button"
            onClick={goHome}
            className="mt-8 border border-black px-7 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            العودة للمتجر
          </button>
        </div>
      </main>
    );
  }

  const detailsText = formatDetails(
    product.details
  );

  const extraDetailsText = formatDetails(
    product.extra_details
  );

  const description =
    product.description ||
    product.short_description ||
    product.caption ||
    "";

  // ==========================================
  // IMAGES
  // ==========================================

  const allImages = [];

  if (product.image || product.image_url) {
    allImages.push({
      id: "main",
      image_url:
        product.image ||
        product.image_url,
    });
  }

  productImages.forEach((item) => {
    if (
      item.image_url &&
      !allImages.some(
        (image) =>
          image.image_url === item.image_url
      )
    ) {
      allImages.push(item);
    }
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6f3ef]"
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
          >
            <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            <span>
              العودة للمتجر
            </span>
          </button>

          <button
            type="button"
            onClick={goHome}
            className="text-sm font-semibold tracking-[0.3em] text-black"
          >
            BIOR
          </button>
        </div>
      </header>

      {/* =========================================
          PRODUCT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* =====================================
              IMAGES
          ===================================== */}

          <div>
            <div className="relative overflow-hidden bg-[#f3f1ed]">
              {/* NEW */}

              {product.isNew && (
                <span className="absolute right-5 top-5 z-20 bg-white px-4 py-2 text-[10px] font-medium tracking-[0.2em] text-black shadow-sm">
                  NEW
                </span>
              )}

              {/* DISCOUNT */}

              {priceData.discount > 0 && (
                <span className="absolute left-5 top-5 z-20 bg-black px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-white">
                  خصم {priceData.discount}%
                </span>
              )}

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={
                    product.name ||
                    "BIOR Product"
                  }
                  className="h-auto max-h-[850px] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-sm text-gray-400">
                  لا توجد صورة للمنتج
                </div>
              )}
            </div>

            {/* ===================================
                IMAGE THUMBNAILS
            =================================== */}

            {!loadingImages &&
              allImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {allImages.map((image) => {
                    const isSelected =
                      selectedImage ===
                      image.image_url;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            image.image_url
                          )
                        }
                        className={`relative aspect-[4/5] overflow-hidden bg-[#f3f1ed] ${
                          isSelected
                            ? "ring-2 ring-black ring-offset-2"
                            : "opacity-70 transition hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={
                            product.name ||
                            "BIOR Product"
                          }
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
          </div>

          {/* =====================================
              INFO
          ===================================== */}

          <div className="flex flex-col justify-center text-right">
            <p className="text-xs font-medium tracking-[0.3em] text-gray-400">
              BIOR COLLECTION
            </p>

            <p className="mt-5 text-sm text-gray-400">
              {categoryName}
            </p>

            <h1 className="mt-3 text-4xl font-light tracking-tight text-black sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            {/* PRICE */}

            <div className="mt-8 border-y border-gray-200 py-6">
              {priceData.discount > 0 ? (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-2xl font-semibold text-black">
                    {priceData.finalPrice} جنيه
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                    {priceData.originalPrice} جنيه
                  </span>

                  <span className="bg-black px-3 py-1 text-xs font-medium text-white">
                    خصم {priceData.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-semibold text-black">
                  {priceData.finalPrice} جنيه
                </span>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-black">
                تفاصيل المنتج
              </h2>

              <div className="mt-4 max-w-xl text-sm leading-8 text-gray-500">
                {description && (
                  <p className="whitespace-pre-line">
                    {description}
                  </p>
                )}

                {detailsText && (
                  <div className="mt-5 whitespace-pre-line">
                    {detailsText}
                  </div>
                )}

                {extraDetailsText && (
                  <div className="mt-5 border-t border-gray-100 pt-5 whitespace-pre-line">
                    {extraDetailsText}
                  </div>
                )}

                {!description &&
                  !detailsText &&
                  !extraDetailsText && (
                    <p>
                      لا يوجد وصف للمنتج حاليًا.
                    </p>
                  )}
              </div>
            </div>

            {/* PRODUCT INFO */}

            <div className="mt-10 border-t border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 py-4">
                <span className="text-sm text-gray-400">
                  القسم
                </span>

                <span className="text-sm font-medium text-black">
                  {categoryName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-4">
                <span className="text-sm text-gray-400">
                  الحالة
                </span>

                <span className="text-sm font-medium text-black">
                  {product.isNew
                    ? "منتج جديد"
                    : "متوفر للعرض"}
                </span>
              </div>

              {product.sku && (
                <div className="flex items-center justify-between border-b border-gray-200 py-4">
                  <span className="text-sm text-gray-400">
                    كود المنتج
                  </span>

                  <span className="text-sm font-medium text-black">
                    {product.sku}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-gray-400">
                  الماركة
                </span>

                <span className="text-sm font-medium tracking-[0.2em] text-black">
                  BIOR
                </span>
              </div>
            </div>

            {/* CTA */}

            <button
              type="button"
              onClick={goHome}
              className="group mt-8 flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <span>
                متابعة تصفح المنتجات
              </span>

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          RELATED PRODUCTS
      ========================================= */}

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-right">
              <span className="text-xs font-medium tracking-[0.3em] text-gray-400">
                BIOR FOR YOU
              </span>

              <h2 className="mt-3 text-3xl font-light text-black sm:text-4xl">
                قد يعجبك أيضًا
              </h2>
            </div>

            <p className="max-w-md text-right text-sm leading-7 text-gray-500">
              قطع اخترناها لك من تشكيلات BIOR،
              اكملي اكتشاف القطع اللي ممكن تناسب
              ستايلك.
            </p>
          </div>

          {loadingRelated ? (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-400">
                جاري تحميل الاقتراحات...
              </p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    openProduct(item.id)
                  }
                >
                  <ProductCard
                    product={{
                      ...item,
                      category:
                        item.categories?.name ||
                        item.category ||
                        "",
                      image:
                        item.image ||
                        item.image_url ||
                        "",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-400">
                لا توجد اقتراحات حاليًا.
              </p>
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={goHome}
              className="group flex items-center gap-3 border-b border-black pb-2 text-sm font-medium text-black"
            >
              <span>
                عرض كل المنتجات
              </span>

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="border-t border-gray-200 bg-[#f6f3ef] px-5 py-10 text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-gray-400">
          BIOR FASHION STORE
        </p>

        <p className="mt-3 text-xs text-gray-400">
          © BIOR — جميع الحقوق محفوظة
        </p>
      </footer>
    </main>
  );
}

export default ProductDetails;