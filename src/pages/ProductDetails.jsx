import { useEffect, useMemo, useState } from "react";

import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard/ProductCard";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/+$/, "");

const FALLBACK_MAP_URL =
  "https://maps.app.goo.gl/xpgYkjQ33UMYZynf7?g_st=ac";
const FALLBACK_WHATSAPP = "201065587997";

const COLOR_MAP = {
  black: "#000000",
  اسود: "#000000",

  white: "#ffffff",
  ابيض: "#ffffff",

  ivory: "#fffff0",
  عاجي: "#fffff0",

  "off white": "#f7f4ea",
  "اوف وايت": "#f7f4ea",

  cream: "#f5f0dc",
  كريمي: "#f5f0dc",

  beige: "#d6c2a1",
  بيج: "#d6c2a1",

  camel: "#b78b5a",
  جملي: "#b78b5a",

  tan: "#c19a6b",

  brown: "#8b4513",
  بني: "#8b4513",

  chocolate: "#5b3716",
  شوكولاته: "#5b3716",

  كافيه: "#6f4e37",
  cafe: "#6f4e37",

  burgundy: "#800020",
  برجندي: "#800020",
  برغندي: "#800020",
  نبيتي: "#800020",
  عنابي: "#800020",
  خمري: "#800020",

  red: "#dc2626",
  احمر: "#dc2626",

  pink: "#ec4899",
  وردي: "#ec4899",
  بينك: "#ec4899",
  بمبي: "#ec4899",

  fuchsia: "#d10075",
  فوشيا: "#d10075",

  coral: "#ff7f50",
  كورال: "#ff7f50",

  peach: "#ffcba4",
  خوخي: "#ffcba4",

  purple: "#9333ea",
  بنفسجي: "#9333ea",
  موف: "#9333ea",

  mauve: "#a4778f",
  "موف ترابي": "#a4778f",

  lavender: "#a78bfa",
  لافندر: "#a78bfa",

  blue: "#2563eb",
  ازرق: "#2563eb",

  navy: "#0f172a",
  كحلي: "#0f172a",

  sky: "#38bdf8",
  سماوي: "#38bdf8",

  turquoise: "#14b8a6",
  فيروزي: "#14b8a6",

  teal: "#0f766e",
  بترولي: "#0f766e",

  denim: "#3b5998",
  جينز: "#3b5998",

  green: "#16a34a",
  اخضر: "#16a34a",

  olive: "#6b7a24",
  زيتي: "#6b7a24",

  sage: "#9caf88",
  سيج: "#9caf88",

  mint: "#86efac",
  مينت: "#86efac",

  yellow: "#eab308",
  اصفر: "#eab308",

  mustard: "#d4a017",
  مستردة: "#d4a017",

  orange: "#f97316",
  برتقالي: "#f97316",

  terracotta: "#c65d3b",
  طوبي: "#c65d3b",

  gray: "#808080",
  grey: "#808080",
  رمادي: "#808080",
  رصاصي: "#808080",

  charcoal: "#36454f",
  فحمي: "#36454f",

  silver: "#9ca3af",
  فضي: "#9ca3af",

  gold: "#d4af37",
  ذهبي: "#d4af37",
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function getColorHex(name) {
  const n = normalizeText(name);

  if (COLOR_MAP[n]) {
    return COLOR_MAP[n];
  }

  const hit = Object.keys(COLOR_MAP).find((key) =>
    n.includes(normalizeText(key))
  );

  return hit ? COLOR_MAP[hit] : "#d1d5db";
}

function parseArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {}

    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeColors(value) {
  return parseArray(value)
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `c-${index}`,
          name: item.trim(),
          hex: getColorHex(item),
          available: true,
        };
      }

      const name = String(item?.name || "").trim();

      return name
        ? {
            id: `c-${index}`,
            name,
            hex: item.hex || getColorHex(name),
            available: item.available !== false,
          }
        : null;
    })
    .filter(Boolean);
}

function normalizeSizes(value) {
  return parseArray(value)
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `s-${index}`,
          name: item.trim(),
          available: true,
        };
      }

      const name = String(item?.name || "").trim();

      return name
        ? {
            id: `s-${index}`,
            name,
            available: item.available !== false,
          }
        : null;
    })
    .filter(Boolean);
}

function pickDetail(product, keys) {
  const sources = [
    product?.details,
    product?.extra_details,
  ];

  for (const source of sources) {
    let obj = source;

    if (typeof source === "string") {
      try {
        obj = JSON.parse(source);
      } catch {
        obj = null;
      }
    }

    if (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj)
    ) {
      for (const key of keys) {
        if (
          obj[key] != null &&
          String(obj[key]).trim()
        ) {
          return String(obj[key]).trim();
        }
      }
    }
  }

  return "";
}

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [storeSettings, setStoreSettings] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  const [error, setError] = useState("");

  const [drawer, setDrawer] = useState(null);
  const [openSection, setOpenSection] = useState("details");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const { data, error: e } = await supabase
        .from("products")
        .select("*, categories(id,name)")
        .eq("id", productId)
        .eq("is_available", true)
        .single();

      if (e) {
        console.error("Product error:", e);

        setError(
          "المنتج غير موجود أو لم يعد متاحًا."
        );

        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    if (productId) {
      load();
    }
  }, [productId]);

  useEffect(() => {
    const loadStoreSettings = async () => {
      const { data, error: e } = await supabase
        .from("site_settings")
        .select("footer_location_link, footer_whatsapp, footer_phone, footer_address_line_1, footer_address_line_2, footer_address_line_3")
        .eq("section", "home")
        .maybeSingle();

      if (e) {
        console.error("Store settings error:", e);
        return;
      }

      setStoreSettings(data || {});
    };

    loadStoreSettings();
  }, []);

  const colors = useMemo(
    () => normalizeColors(product?.colors),
    [product]
  );

  const sizes = useMemo(
    () => normalizeSizes(product?.sizes),
    [product]
  );

  useEffect(() => {
    setSelectedColor(
      colors.find((c) => c.available) ||
        colors[0] ||
        null
    );

    setSelectedSize(null);
  }, [productId, colors]);

  useEffect(() => {
    const load = async () => {
      if (!productId) return;

      setLoadingImages(true);

      const { data, error: e } = await supabase
        .from("product_images")
        .select(
          "id,image_url,sort_order,color,color_hex"
        )
        .eq("product_id", productId)
        .order("sort_order", {
          ascending: true,
        });

      if (e) {
        console.error(
          "Product images error:",
          e
        );
      }

      setProductImages(data || []);
      setLoadingImages(false);
    };

    load();
  }, [productId]);

  const selectedColorImages = useMemo(() => {
    if (!selectedColor) return [];

    const name = normalizeText(
      selectedColor.name
    );

    const hex = (
      selectedColor.hex ||
      getColorHex(selectedColor.name)
    ).toLowerCase();

    return productImages.filter(
      (img) =>
        normalizeText(img.color) === name ||
        String(img.color_hex || "").toLowerCase() ===
          hex
    );
  }, [productImages, selectedColor]);

  const displayImages = useMemo(() => {
    const source = selectedColor
      ? selectedColorImages
      : [];

    const result = source.length
      ? [...source]
      : [];

    if (!result.length && product?.image) {
      result.push({
        id: "main",
        image_url: product.image,
      });
    }

    if (!selectedColor) {
      productImages
        .filter(
          (img) =>
            !img.color &&
            img.image_url
        )
        .forEach((img) => result.push(img));
    }

    return result.filter(
      (img, i, arr) =>
        img.image_url &&
        arr.findIndex(
          (x) =>
            x.image_url === img.image_url
        ) === i
    );
  }, [
    selectedColor,
    selectedColorImages,
    product,
    productImages,
  ]);

  useEffect(() => {
    setSelectedImage(
      displayImages[0]?.image_url ||
        product?.image ||
        ""
    );
  }, [displayImages, product]);

  useEffect(() => {
    if (!product) return;

    const title =
      product.seo_title?.trim() ||
      `${product.name || "منتج"} | BIOR – بيور`;

    const description = (
      product.seo_description ||
      product.short_description ||
      product.description ||
      product.caption ||
      `${product.name || "منتج"} من BIOR (بيور).`
    ).slice(0, 160);

    document.title = title;

    const setMeta = (
      selector,
      attr,
      value
    ) => {
      let el = document.querySelector(
        selector
      );

      if (!el) {
        el = document.createElement("meta");

        el.setAttribute(
          attr.split(":")[0],
          attr.includes(":")
            ? attr.split(":")[1]
            : attr
        );

        document.head.appendChild(el);
      }

      el.setAttribute("content", value);
    };

    setMeta(
      'meta[name="description"]',
      "name",
      description
    );

    setMeta(
      'meta[property="og:title"]',
      "property",
      title
    );

    setMeta(
      'meta[property="og:description"]',
      "property",
      description
    );

    if (product.image) {
      setMeta(
        'meta[property="og:image"]',
        "property",
        product.image
      );
    }

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical =
        document.createElement("link");

      canonical.rel = "canonical";

      document.head.appendChild(canonical);
    }

    canonical.href =
      `${window.location.origin}/product/${product.id}`;
  }, [product]);

  useEffect(() => {
    const load = async () => {
      if (!product) return;

      const { data } = await supabase
        .from("products")
        .select("*, categories(id,name)")
        .eq("is_available", true)
        .neq("id", product.id)
        .eq(
          "category_id",
          product.category_id
        )
        .order("sort_order", {
          ascending: true,
        })
        .limit(4);

      setRelatedProducts(data || []);
    };

    load();
  }, [product]);

  const price =
    Number(product?.price) || 0;

  const oldPrice =
    Number(
      product?.original_price ??
        product?.old_price
    ) || price;

  const discount =
    Number(product?.discount_percent) || 0;

  const finalPrice =
    discount > 0
      ? Math.round(
          oldPrice -
            (oldPrice * discount) / 100
        )
      : price;

  const categoryName =
    product?.categories?.name ||
    product?.category ||
    "ملابس حريمي";

  const description =
    product?.description ||
    product?.short_description ||
    product?.caption ||
    "";

  const fabric =
    product?.fabric ||
    pickDetail(product, [
      "fabric",
      "الخامة",
      "material",
      "القماش",
    ]);

  const care =
    product?.care_instructions ||
    pickDetail(product, [
      "care",
      "الغسيل",
      "wash",
      "washing",
    ]) ||
    pickDetail(product, [
      "washing_instructions",
      "تعليمات الغسيل",
    ]);

  const modelHeight =
    product?.model_height_cm
      ? `${product.model_height_cm} سم`
      : pickDetail(product, [
          "model_height",
          "طول الموديل",
          "modelHeight",
        ]);

  const modelSize =
    product?.model_size ||
    pickDetail(product, [
      "model_size",
      "مقاس الموديل",
      "modelSize",
    ]);

  const modelMeasurements =
    product?.model_measurements ||
    pickDetail(product, [
      "model_measurements",
      "قياسات الموديل",
      "measurements",
    ]);

  const features = parseArray(
    product?.features ||
      product?.details?.features ||
      product?.extra_details?.features
  )
    .map(String)
    .filter(Boolean);

  const productUrl =
    `${window.location.origin}/product/${product?.id || ""}`;

  /*
   * WhatsApp
   * Number:
   * +20 10 65587997
   *
   * WhatsApp format:
   * 201065587997
   */

  const whatsappMessage = [
    "مرحبًا BIOR 👋",
    "",
    `أريد الاستفسار عن المنتج: ${
      product?.name || ""
    }`,
    selectedColor
      ? `اللون: ${selectedColor.name}`
      : "",
    selectedSize
      ? `المقاس: ${selectedSize.name}`
      : "",
    "",
    `رابط المنتج: ${productUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  /*
   * مهم:
   * لا نضع +20 أو 010...
   * wa.me يحتاج الرقم بهذا الشكل:
   * 201065587997
   */

  const whatsappNumber = String(
    storeSettings?.footer_whatsapp || FALLBACK_WHATSAPP
  ).replace(/\D/g, "");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "#";

  const locationUrl =
    storeSettings?.footer_location_link?.trim() ||
    FALLBACK_MAP_URL;

  const storePhone =
    storeSettings?.footer_phone?.trim() || "01065587997";

  const addressLines = [
    storeSettings?.footer_address_line_1,
    storeSettings?.footer_address_line_2,
    storeSettings?.footer_address_line_3,
  ].filter(Boolean);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] flex items-center justify-center text-gray-400"
      >
        جاري تحميل المنتج...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] flex items-center justify-center text-gray-500"
      >
        {error || "المنتج غير موجود."}
      </div>
    );
  }

  const openProduct = (id) => {
    window.location.href =
      `${BASE_PATH}/product/${id}`;
  };

  const toggle = (key) => {
    setOpenSection((v) =>
      v === key ? "" : key
    );
  };

  return (
    <main
      dir="rtl"
      className="bg-white text-black pb-24 md:pb-0"
    >
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <button
            onClick={() =>
              (window.location.href =
                `${BASE_PATH}/`)
            }
            className="hover:text-black"
          >
            BIOR
          </button>

          <span>/</span>

          <span>{categoryName}</span>

          <span>/</span>

          <span className="text-gray-700">
            {product.name}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

          {/* Images */}
          <div>
            <div className="grid gap-3 sm:grid-cols-[88px_1fr]">

              <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
                {loadingImages ? (
                  <div className="p-4 text-xs text-gray-400">
                    جاري تحميل الصور...
                  </div>
                ) : (
                  displayImages.map(
                    (img, i) => (
                      <button
                        key={`${img.id}-${i}`}
                        onClick={() =>
                          setSelectedImage(
                            img.image_url
                          )
                        }
                        className={`h-20 w-16 shrink-0 overflow-hidden border ${
                          selectedImage ===
                          img.image_url
                            ? "border-black"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img.image_url}
                          alt={`${product.name} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                  )
                )}
              </div>

              <div className="order-1 overflow-hidden bg-[#f7f7f5] sm:order-2">
                <div className="relative aspect-[4/5]">

                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      لا توجد صورة
                    </div>
                  )}

                  {(product.isNew ||
                    discount > 0) && (
                    <div className="absolute right-4 top-4 flex flex-col gap-2">

                      {product.isNew && (
                        <span className="bg-black px-3 py-1 text-[10px] text-white">
                          NEW
                        </span>
                      )}

                      {discount > 0 && (
                        <span className="bg-white px-3 py-1 text-[10px]">
                          -{discount}%
                        </span>
                      )}

                    </div>
                  )}

                  {(modelHeight ||
                    modelSize) && (
                    <div className="absolute bottom-4 right-4 rounded-sm bg-white/90 px-4 py-3 text-xs leading-6 backdrop-blur">

                      <strong className="block mb-1">
                        معلومات الموديل
                      </strong>

                      {modelHeight && (
                        <span className="block">
                          الطول: {modelHeight}
                        </span>
                      )}

                      {modelSize && (
                        <span className="block">
                          المقاس: {modelSize}
                        </span>
                      )}

                      {modelMeasurements && (
                        <span className="block">
                          القياسات:{" "}
                          {modelMeasurements}
                        </span>
                      )}

                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pt-2">

            <p className="text-xs tracking-[0.25em] text-gray-400">
              BIOR FASHION
            </p>

            <h1 className="mt-3 text-2xl font-normal sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {categoryName}
            </p>

            <div className="mt-5 flex items-center gap-3">

              <span className="text-xl font-medium">
                {finalPrice.toLocaleString(
                  "ar-EG"
                )}{" "}
                جنيه
              </span>

              {discount > 0 && (
                <del className="text-sm text-gray-400">
                  {oldPrice.toLocaleString(
                    "ar-EG"
                  )}{" "}
                  جنيه
                </del>
              )}

            </div>

            {description && (
              <p className="mt-6 whitespace-pre-line text-sm leading-8 text-gray-600">
                {description}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-sm font-medium">
                    اللون
                  </h2>

                  <span className="text-xs text-gray-500">
                    {selectedColor?.name || ""}
                  </span>

                </div>

                <div className="mt-4 flex flex-wrap gap-4">

                  {colors.map((color) => {
                    const active =
                      normalizeText(
                        selectedColor?.name
                      ) ===
                      normalizeText(
                        color.name
                      );

                    const white =
                      color.hex?.toLowerCase() ===
                      "#ffffff";

                    return (
                      <button
                        key={color.id}
                        disabled={
                          !color.available
                        }
                        onClick={() =>
                          color.available &&
                          setSelectedColor(color)
                        }
                        title={
                          color.available
                            ? color.name
                            : `${color.name} - خلصان`
                        }
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={`relative h-10 w-10 rounded-full border-2 ${
                            active
                              ? "border-black ring-2 ring-black ring-offset-2"
                              : "border-gray-300"
                          } ${
                            !color.available
                              ? "opacity-35"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              color.hex ||
                              getColorHex(
                                color.name
                              ),
                            borderColor: white
                              ? "#d1d5db"
                              : undefined,
                          }}
                        >
                          {!color.available && (
                            <span className="absolute left-1/2 top-1/2 h-[2px] w-12 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                          )}

                          {active &&
                            color.available && (
                              <span
                                className={
                                  white
                                    ? "text-black"
                                    : "text-white"
                                }
                              >
                                ✓
                              </span>
                            )}

                        </span>

                        <span
                          className={`text-xs ${
                            color.available
                              ? "text-gray-600"
                              : "text-gray-400 line-through"
                          }`}
                        >
                          {color.name}
                        </span>
                      </button>
                    );
                  })}

                </div>

                {selectedColor &&
                  selectedColorImages.length ===
                    0 && (
                    <p className="mt-3 text-xs text-amber-600">
                      لا توجد صور إضافية لهذا اللون
                      حاليًا، لذلك يتم عرض الصورة
                      الرئيسية.
                    </p>
                  )}

              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-sm font-medium">
                    المقاس
                  </h2>

                  <button
                    onClick={() =>
                      setDrawer("sizes")
                    }
                    className="text-xs underline underline-offset-4"
                  >
                    دليل المقاسات
                  </button>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {sizes.map((size) => {
                    const active =
                      normalizeText(
                        selectedSize?.name
                      ) ===
                      normalizeText(size.name);

                    return (
                      <button
                        key={size.id}
                        disabled={
                          !size.available
                        }
                        onClick={() =>
                          size.available &&
                          setSelectedSize(size)
                        }
                        className={`relative min-w-14 border px-5 py-3 text-sm ${
                          active
                            ? "border-black bg-black text-white"
                            : size.available
                            ? "border-gray-300 hover:border-black"
                            : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                        }`}
                      >
                        {size.name}

                        {!size.available && (
                          <span className="absolute left-0 right-0 top-1/2 h-px bg-gray-500" />
                        )}
                      </button>
                    );
                  })}

                </div>

              </div>
            )}

            {/* WhatsApp + Maps */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center bg-black px-5 text-sm text-white hover:bg-gray-800"
              >
                تواصل عبر واتساب للاستفسار
              </a>

              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center border border-black px-5 text-sm hover:bg-black hover:text-white"
              >
                📍 عنوان المحل / اللوكيشن
              </a>

            </div>

            <p className="mt-3 text-center text-xs leading-6 text-gray-400">
              BIOR حاليًا موقع عرض فقط. للتأكد من توفر
              اللون والمقاس، تواصل معنا قبل زيارة الفرع.
            </p>

            {/* Accordion */}
            <div className="mt-8 border-t border-gray-200">

              {[
                {
                  key: "details",
                  title: "تفاصيل وخامة القطعة",
                  content: (
                    <div className="space-y-4 text-sm leading-7 text-gray-600">

                      {description && (
                        <p className="whitespace-pre-line">
                          {description}
                        </p>
                      )}

                      {fabric && (
                        <p>
                          <strong>
                            الخامة:
                          </strong>{" "}
                          {fabric}
                        </p>
                      )}

                      {care && (
                        <p>
                          <strong>
                            العناية والغسيل:
                          </strong>{" "}
                          {care}
                        </p>
                      )}

                      {!description &&
                        !fabric &&
                        !care && (
                          <p>
                            لا توجد تفاصيل إضافية
                            حاليًا.
                          </p>
                        )}

                    </div>
                  ),
                },

                {
                  key: "features",
                  title: "مميزات المنتج",
                  content: features.length ? (
                    <div className="flex flex-wrap gap-2">

                      {features.map((f, i) => (
                        <span
                          key={i}
                          className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs"
                        >
                          {f}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      يمكن إضافة مميزات المنتج من لوحة
                      التحكم.
                    </p>
                  ),
                },

                {
                  key: "branch",
                  title: "مواعيد وعنوان الفرع",
                  content: (
                    <div className="space-y-3 text-sm leading-7 text-gray-600">

                      <p>
                        {addressLines.length ? (
                          addressLines.map((line, index) => (
                            <span key={`${line}-${index}`}>
                              {index > 0 && <br />}
                              {line}
                            </span>
                          ))
                        ) : (
                          <>
                            المنصورة دكرنس، شارع المستشفى،
                            <br />
                            بجوار سور المستشفى.
                          </>
                        )}
                      </p>

                      <p>
                        <strong>
                          رقم الهاتف:
                        </strong>{" "}

                        <a
                          href={`tel:${storePhone.replace(/\s+/g, "")}`}
                          className="underline"
                        >
                          {storePhone}
                        </a>
                      </p>

                      <a
                        className="underline"
                        href={locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        فتح الموقع على Google Maps
                      </a>

                    </div>
                  ),
                },

              ].map((section) => (
                <div
                  key={section.key}
                  className="border-b border-gray-200"
                >
                  <button
                    onClick={() =>
                      toggle(section.key)
                    }
                    className="flex w-full items-center justify-between py-5 text-right text-sm font-medium"
                  >
                    <span>
                      {section.title}
                    </span>

                    <span className="text-lg font-light">
                      {openSection ===
                      section.key
                        ? "−"
                        : "+"}
                    </span>
                  </button>

                  {openSection ===
                    section.key && (
                    <div className="pb-5">
                      {section.content}
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="border-t border-gray-200 pt-10">

            <p className="text-xs tracking-[0.25em] text-gray-400">
              BIOR FOR YOU
            </p>

            <h2 className="mt-3 text-2xl font-light">
              قد يعجبك أيضًا
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {relatedProducts.map(
                (item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      openProduct(item.id)
                    }
                    className="cursor-pointer"
                  >
                    <ProductCard
                      product={{
                        ...item,
                        category:
                          item.categories
                            ?.name ||
                          item.category ||
                          "",
                        image:
                          item.image || "",
                      }}
                    />
                  </div>
                )
              )}

            </div>
          </div>
        </section>
      )}

      {/* Size Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">

          <button
            aria-label="close"
            onClick={() =>
              setDrawer(null)
            }
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl sm:p-8">

            <div className="flex items-center justify-between border-b border-gray-200 pb-5">

              <h2 className="text-lg">
                دليل المقاسات
              </h2>

              <button
                onClick={() =>
                  setDrawer(null)
                }
                className="text-2xl"
              >
                ×
              </button>

            </div>

            <div className="mt-6">

              <p className="text-sm leading-7 text-gray-500">
                المقاسات المتاحة لهذا المنتج:
              </p>

              <div className="mt-5 space-y-3">

                {sizes.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between border-b border-gray-100 py-3 text-sm"
                  >
                    <span>
                      {s.name}
                    </span>

                    <span
                      className={
                        s.available
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {s.available
                        ? "متاح"
                        : "خلصان"}
                    </span>
                  </div>
                ))}

              </div>

              <p className="mt-8 text-xs leading-6 text-gray-400">
                لأن المقاسات بالسنتيمتر تختلف حسب
                تصميم كل قطعة، يتم إضافة جدول القياسات
                التفصيلي من بيانات المنتج عند توفره.
              </p>

            </div>

          </aside>
        </div>
      )}

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">

        <div className="flex items-center gap-3">

          <div className="min-w-0 flex-1">

            <p className="truncate text-xs text-gray-500">
              {product.name}
            </p>

            <p className="text-sm font-medium">
              {finalPrice.toLocaleString(
                "ar-EG"
              )}{" "}
              جنيه
            </p>

          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-black px-4 py-3 text-xs text-white"
          >
            واتساب
          </a>

          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-black px-4 py-3 text-xs"
          >
            Maps
          </a>

        </div>
      </div>

    </main>
  );
}

export default ProductDetails;