import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const COLOR_MAP = {
  black: "#000000", white: "#ffffff", gray: "#808080", grey: "#808080",
  brown: "#8b4513", burgundy: "#800020", maroon: "#800000", red: "#dc2626",
  pink: "#ec4899", rose: "#f43f5e", fuchsia: "#d946ef", purple: "#9333ea",
  violet: "#7c3aed", lavender: "#a78bfa", mauve: "#a4778f", blue: "#2563eb",
  navy: "#0f172a", sky: "#38bdf8", cyan: "#06b6d4", turquoise: "#14b8a6",
  teal: "#0f766e", green: "#16a34a", olive: "#6b7a24", mint: "#86efac",
  sage: "#9caf88", yellow: "#eab308", mustard: "#ca8a04", orange: "#f97316",
  peach: "#fdba74", coral: "#fb7185", beige: "#d6c2a1", cream: "#f5f0dc",
  ivory: "#fffff0", camel: "#b78b5a", tan: "#c19a6b", khaki: "#c3b091",
  gold: "#d4af37", silver: "#9ca3af", denim: "#3b5998", charcoal: "#36454f",
  taupe: "#8b7e74", chocolate: "#5c4033", coffee: "#6f4e37", terracotta: "#e2725b",
  rust: "#b7410e", plum: "#673147", wine: "#722f37", tealblue: "#0f766e",
  "اوف وايت": "#f8f5ee", "أوف وايت": "#f8f5ee", "اوف وايت": "#f8f5ee",
  "اسود": "#000000", "أبيض": "#ffffff", "ابيض": "#ffffff", "رمادي": "#808080", "رصاصي": "#808080",
  "بني": "#8b4513", "برجندي": "#800020", "برغندي": "#800020", "نبيتي": "#722f37", "عنابي": "#800020", "خمري": "#722f37",
  "احمر": "#dc2626", "أحمر": "#dc2626", "وردي": "#ec4899", "بينك": "#ec4899", "بمبي": "#ec4899",
  "فوشيا": "#d946ef", "موف": "#9333ea", "بنفسجي": "#9333ea", "لافندر": "#a78bfa", "موف ترابي": "#a4778f",
  "ازرق": "#2563eb", "أزرق": "#2563eb", "سماوي": "#38bdf8", "لبني": "#7dd3fc", "كحلي": "#0f172a",
  "فيروزي": "#14b8a6", "تركواز": "#14b8a6", "بترولي": "#0f766e", "اخضر": "#16a34a", "أخضر": "#16a34a",
  "زيتي": "#6b7a24", "سيج": "#9caf88", "مينت": "#86efac", "اصفر": "#eab308", "أصفر": "#eab308",
  "مستردة": "#ca8a04", "برتقالي": "#f97316", "خوخي": "#fdba74", "مرجاني": "#fb7185",
  "بيج": "#d6c2a1", "كريمي": "#f5f0dc", "عاجي": "#fffff0", "جملي": "#b78b5a", "تان": "#c19a6b", "كاكي": "#c3b091",
  "ذهبي": "#d4af37", "فضي": "#9ca3af", "جينز": "#3b5998", "فحمي": "#36454f", "تاوب": "#8b7e74",
  "شوكولاتة": "#5c4033", "كافيه": "#6f4e37", "طوبي": "#e2725b", "صدئي": "#b7410e", "برقوقي": "#673147"
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

const NORMALIZED_COLOR_MAP = Object.fromEntries(
  Object.entries(COLOR_MAP).map(([key, value]) => [normalizeText(key), value])
);

const COLOR_KEYWORDS = [
  ["اوف وايت", "#f8f5ee"], ["off white", "#f8f5ee"], ["cream", "#f5f0dc"], ["كريمي", "#f5f0dc"],
  ["burgundy", "#800020"], ["wine", "#722f37"], ["نبيتي", "#722f37"], ["خمري", "#722f37"], ["عنابي", "#800020"],
  ["maroon", "#800000"], ["pink", "#ec4899"], ["وردي", "#ec4899"], ["fuchsia", "#d946ef"], ["فوشيا", "#d946ef"],
  ["purple", "#9333ea"], ["موف", "#9333ea"], ["violet", "#7c3aed"], ["lavender", "#a78bfa"],
  ["navy", "#0f172a"], ["كحلي", "#0f172a"], ["blue", "#2563eb"], ["ازرق", "#2563eb"], ["سماوي", "#38bdf8"], ["لبني", "#7dd3fc"],
  ["turquoise", "#14b8a6"], ["فيروزي", "#14b8a6"], ["teal", "#0f766e"], ["بترولي", "#0f766e"],
  ["olive", "#6b7a24"], ["زيتي", "#6b7a24"], ["sage", "#9caf88"], ["سيج", "#9caf88"], ["mint", "#86efac"], ["مينت", "#86efac"],
  ["mustard", "#ca8a04"], ["مستردة", "#ca8a04"], ["orange", "#f97316"], ["برتقالي", "#f97316"], ["peach", "#fdba74"], ["خوخي", "#fdba74"],
  ["coral", "#fb7185"], ["مرجاني", "#fb7185"], ["beige", "#d6c2a1"], ["بيج", "#d6c2a1"], ["camel", "#b78b5a"], ["جملي", "#b78b5a"],
  ["khaki", "#c3b091"], ["كاكي", "#c3b091"], ["gold", "#d4af37"], ["ذهبي", "#d4af37"], ["silver", "#9ca3af"], ["فضي", "#9ca3af"],
  ["denim", "#3b5998"], ["جينز", "#3b5998"], ["charcoal", "#36454f"], ["فحمي", "#36454f"], ["chocolate", "#5c4033"], ["شوكولاتة", "#5c4033"],
  ["coffee", "#6f4e37"], ["كافيه", "#6f4e37"], ["terracotta", "#e2725b"], ["طوبي", "#e2725b"], ["rust", "#b7410e"], ["صدئي", "#b7410e"]
];

function normalizeColorName(value) {
  return String(value || "").trim();
}

function getColorHex(name) {
  const normalized = normalizeText(name);
  if (!normalized) return "#d1d5db";
  if (NORMALIZED_COLOR_MAP[normalized]) return NORMALIZED_COLOR_MAP[normalized];
  for (const [keyword, hex] of COLOR_KEYWORDS) {
    if (normalized.includes(normalizeText(keyword))) return hex;
  }
  return "#d1d5db";
}




const emptyForm = {
  name: "",
  category: "",
  price: "",
  original_price: "",
  discount_percent: "",
  image: "",

  isNew: false,
  is_available: true,
  is_best_seller: false,
  is_featured: false,

  category_id: "",

  short_description: "",
  description: "",
  caption: "",

  details: "",
  extra_details: "",

  sku: "",
  sort_order: 0,

  seo_title: "",
  seo_description: "",
  og_image: "",

  model_height_cm: "",
  model_size: "",
  model_measurements: "",
  fabric: "",
  care_instructions: "",
  features: "",
  size_guide: "",

  gallery: {
    existingImages: [],
    newFiles: [],
  },

  colors: [],
  sizes: [],
};

function normalizeColors(value) {
  if (!value) {
    return [];
  }

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({
          id: `${Date.now()}-${Math.random()}`,
          name,
          hex: getColorHex(name),
          available: true,
          existingImages: [],
          newFiles: [],
        }));
    }
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (typeof item === "string") {
        return {
          id: `${Date.now()}-${Math.random()}`,
          name: item,
          hex: getColorHex(item),
          available: true,
          existingImages: [],
          newFiles: [],
        };
      }

      if (item && typeof item === "object") {
        const name = normalizeColorName(item.name);

        return {
          id: `${Date.now()}-${Math.random()}`,
          name,
          hex: item.hex || getColorHex(name),
          available: item.available !== false,
          existingImages: [],
          newFiles: [],
        };
      }

      return null;
    })
    .filter(Boolean);
}

function normalizeSizes(value) {
  if (!value) {
    return [];
  }

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({
          id: `${Date.now()}-${Math.random()}`,
          name,
          available: true,
        }));
    }
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (typeof item === "string") {
        return {
          id: `${Date.now()}-${Math.random()}`,
          name: item,
          available: true,
        };
      }

      if (item && typeof item === "object") {
        return {
          id: `${Date.now()}-${Math.random()}`,
          name: String(item.name || "").trim(),
          available: item.available !== false,
        };
      }

      return null;
    })
    .filter((item) => item && item.name);
}

function createColor() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: "",
    hex: "#CCCCCC",
    available: true,
    existingImages: [],
    newFiles: [],
  };
}

function createSize() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: "",
    available: true,
  };
}

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] =
    useState(null);
  const [imagePreview, setImagePreview] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] =
    useState("");
  const [filterStatus, setFilterStatus] =
    useState("");

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Admin products fetch error:",
        error
      );

      alert(
        "حصل خطأ أثناء تحميل المنتجات."
      );

      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error(
        "Admin categories fetch error:",
        error
      );

      alert(
        "حصل خطأ أثناء تحميل الأقسام."
      );

      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const selectedCategory =
      categories.find(
        (category) =>
          String(category.id) ===
          String(filterCategory)
      );

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.sku,
        product.category,
        product.description,
        product.short_description,
        product.caption,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search ||
        searchableText.includes(search);

      let matchesCategory = true;

      if (filterCategory) {
        const productCategoryId = String(
          product.category_id ?? ""
        );

        const productCategoryName =
          String(product.category ?? "")
            .trim()
            .toLowerCase();

        const selectedCategoryName =
          String(
            selectedCategory?.name ?? ""
          )
            .trim()
            .toLowerCase();

        matchesCategory =
          productCategoryId ===
            String(filterCategory) ||
          (selectedCategoryName &&
            productCategoryName ===
              selectedCategoryName);
      }

      let matchesStatus = true;

      switch (filterStatus) {
        case "available":
          matchesStatus =
            product.is_available === true;
          break;

        case "unavailable":
          matchesStatus =
            product.is_available === false;
          break;

        case "new":
          matchesStatus =
            product.isNew === true;
          break;

        case "best":
          matchesStatus =
            product.is_best_seller === true;
          break;

        case "featured":
          matchesStatus =
            product.is_featured === true;
          break;

        default:
          matchesStatus = true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    categories,
    searchTerm,
    filterCategory,
    filterStatus,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleCategoryChange = (event) => {
    const categoryId =
      event.target.value;

    const selectedCategory =
      categories.find(
        (category) =>
          String(category.id) ===
          String(categoryId)
      );

    setForm((current) => ({
      ...current,
      category_id: categoryId,
      category:
        selectedCategory?.name || "",
    }));
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(
        "من فضلك اختر صورة فقط."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "حجم الصورة يجب ألا يتجاوز 5MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleColorNameChange = (
    colorId,
    value
  ) => {
    const name =
      normalizeColorName(value);

    setForm((current) => ({
      ...current,
      colors: current.colors.map(
        (color) =>
          color.id === colorId
            ? {
                ...color,
                name,
                hex:
                  getColorHex(name),
              }
            : color
      ),
    }));
  };

  const addColor = () => {
    setForm((current) => ({
      ...current,
      colors: [
        ...current.colors,
        createColor(),
      ],
    }));
  };

  const removeColor = (colorId) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.filter(
        (color) =>
          color.id !== colorId
      ),
    }));
  };

  const toggleColorAvailability = (
    colorId
  ) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.map(
        (color) =>
          color.id === colorId
            ? {
                ...color,
                available:
                  !color.available,
              }
            : color
      ),
    }));
  };

  const handleColorImages = (
    colorId,
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const validFiles = files.filter(
      (file) => {
        if (
          !file.type.startsWith("image/")
        ) {
          return false;
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {
          return false;
        }

        return true;
      }
    );

    if (
      validFiles.length !==
      files.length
    ) {
      alert(
        "تم تجاهل أي ملف ليس صورة أو حجمه أكبر من 5MB."
      );
    }

    const previews =
      validFiles.map((file) => ({
        file,
        preview:
          URL.createObjectURL(file),
      }));

    setForm((current) => ({
      ...current,
      colors: current.colors.map(
        (color) =>
          color.id === colorId
            ? {
                ...color,
                newFiles: [
                  ...(color.newFiles || []),
                  ...previews,
                ],
              }
            : color
      ),
    }));

    event.target.value = "";
  };

  const removeNewColorImage = (
    colorId,
    index
  ) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.map(
        (color) =>
          color.id === colorId
            ? {
                ...color,
                newFiles:
                  color.newFiles.filter(
                    (_, imageIndex) =>
                      imageIndex !== index
                  ),
              }
            : color
      ),
    }));
  };

  const removeExistingColorImage = (
    colorId,
    imageId
  ) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.map(
        (color) =>
          color.id === colorId
            ? {
                ...color,
                existingImages:
                  color.existingImages.filter(
                    (image) =>
                      image.id !== imageId
                  ),
              }
            : color
      ),
    }));
  };

  const handleGalleryImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      alert("تم تجاهل أي ملف ليس صورة أو حجمه أكبر من 5MB.");
    }

    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((current) => ({
      ...current,
      gallery: {
        ...(current.gallery || { existingImages: [], newFiles: [] }),
        newFiles: [
          ...(current.gallery?.newFiles || []),
          ...previews,
        ],
      },
    }));

    event.target.value = "";
  };

  const removeExistingGalleryImage = (imageId) => {
    setForm((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        existingImages: (current.gallery?.existingImages || []).filter(
          (image) => image.id !== imageId
        ),
      },
    }));
  };

  const removeNewGalleryImage = (index) => {
    setForm((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        newFiles: (current.gallery?.newFiles || []).filter(
          (_, imageIndex) => imageIndex !== index
        ),
      },
    }));
  };

  const addSize = () => {
    setForm((current) => ({
      ...current,
      sizes: [
        ...current.sizes,
        createSize(),
      ],
    }));
  };

  const removeSize = (sizeId) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.filter(
        (size) =>
          size.id !== sizeId
      ),
    }));
  };

  const handleSizeNameChange = (
    sizeId,
    value
  ) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map(
        (size) =>
          size.id === sizeId
            ? {
                ...size,
                name: value,
              }
            : size
      ),
    }));
  };

  const toggleSizeAvailability = (
    sizeId
  ) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map(
        (size) =>
          size.id === sizeId
            ? {
                ...size,
                available:
                  !size.available,
              }
            : size
      ),
    }));
  };

  const getDetailsText = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      try {
        const parsed =
          JSON.parse(value);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          if (
            typeof parsed.text ===
            "string"
          ) {
            return parsed.text;
          }

          return JSON.stringify(
            parsed,
            null,
            2
          );
        }

        return String(parsed);
      } catch {
        return value;
      }
    }

    if (typeof value === "object") {
      if (
        typeof value.text ===
        "string"
      ) {
        return value.text;
      }

      return JSON.stringify(
        value,
        null,
        2
      );
    }

    return String(value);
  };

  const fetchProductImages = async (
    productId
  ) => {
    const { data, error } =
      await supabase
        .from("product_images")
        .select("*")
        .eq(
          "product_id",
          productId
        )
        .order("sort_order", {
          ascending: true,
        })
        .order("id", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Product images fetch error:",
        error
      );

      return [];
    }

    return data || [];
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      colors: [],
      sizes: [],
      gallery: { existingImages: [], newFiles: [] },
    });

    setSelectedImage(null);
    setImagePreview("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openEditForm = async (
    product
  ) => {
    setEditingProduct(product);

    const productImages =
      await fetchProductImages(
        product.id
      );

    const colors =
      normalizeColors(
        product.colors
      );

    const imagesByColor = {};

    productImages.forEach(
      (image) => {
        const imageColor =
          normalizeColorName(
            image.color
          );

        if (!imageColor) {
          return;
        }

        const key =
          imageColor.toLowerCase();

        if (!imagesByColor[key]) {
          imagesByColor[key] = [];
        }

        imagesByColor[key].push(
          image
        );
      }
    );

    const preparedColors =
      colors.map((color) => ({
        ...color,
        existingImages:
          imagesByColor[
            color.name.toLowerCase()
          ] || [],
        newFiles: [],
      }));

    const galleryImages = productImages.filter(
      (image) => !image.color && image.image_url
    );

    setForm({
      name: product.name || "",
      category:
        product.category || "",
      price:
        product.price ?? "",
      original_price:
        product.original_price ?? "",
      discount_percent:
        product.discount_percent ?? "",
      image:
        product.image || "",

      isNew: Boolean(
        product.isNew
      ),

      is_available:
        product.is_available !==
        false,

      is_best_seller:
        Boolean(
          product.is_best_seller
        ),

      is_featured:
        Boolean(
          product.is_featured
        ),

      category_id:
        product.category_id ??
        "",

      short_description:
        product.short_description ||
        "",

      description:
        product.description ||
        "",

      caption:
        product.caption ||
        "",

      details:
        getDetailsText(
          product.details
        ),

      extra_details:
        getDetailsText(
          product.extra_details
        ),

      sku:
        product.sku || "",

      sort_order:
        product.sort_order ?? 0,

      seo_title:
        product.seo_title ||
        "",

      seo_description:
        product.seo_description ||
        "",

      og_image:
        product.og_image ||
        "",

      model_height_cm:
        product.model_height_cm ?? "",
      model_size:
        product.model_size || "",
      model_measurements:
        product.model_measurements || "",
      fabric:
        product.fabric || "",
      care_instructions:
        product.care_instructions || "",
      features:
        product.features || "",
      size_guide:
        product.size_guide || "",

      gallery: {
        existingImages: galleryImages,
        newFiles: [],
      },

      colors:
        preparedColors,

      sizes:
        normalizeSizes(
          product.sizes
        ),
    });

    setSelectedImage(null);
    setImagePreview(
      product.image || ""
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      colors: [],
      sizes: [],
    });

    setSelectedImage(null);
    setImagePreview("");
  };

  const uploadImage = async (
    file,
    folder = "products"
  ) => {
    if (!file) {
      return null;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

    const filePath =
      `${folder}/${fileName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("products")
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",
          upsert: false,
          contentType:
            file.type,
        }
      );

    if (uploadError) {
      console.error(
        "Image upload error:",
        uploadError
      );

      throw new Error(
        `فشل رفع الصورة: ${uploadError.message}`
      );
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(
          filePath
        );

    if (!data?.publicUrl) {
      throw new Error(
        "لم يتم الحصول على رابط الصورة."
      );
    }

    return data.publicUrl;
  };

  const parseDetails = (value) => {
    if (!value.trim()) {
      return {};
    }

    try {
      const parsed =
        JSON.parse(value);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        return parsed;
      }

      return {
        text: value.trim(),
      };
    } catch {
      return {
        text: value.trim(),
      };
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "اكتب اسم المنتج أولًا."
      );
      return;
    }

    if (!form.category_id) {
      alert(
        "اختار قسم المنتج."
      );
      return;
    }

    if (form.price === "") {
      alert(
        "اكتب سعر المنتج."
      );
      return;
    }

    if (
      Number(form.price) < 0
    ) {
      alert(
        "السعر لا يمكن أن يكون بالسالب."
      );
      return;
    }

    if (
      form.original_price !==
        "" &&
      Number(
        form.original_price
      ) < 0
    ) {
      alert(
        "السعر الأصلي لا يمكن أن يكون بالسالب."
      );
      return;
    }

    if (
      form.discount_percent !==
        "" &&
      (Number(
        form.discount_percent
      ) < 0 ||
        Number(
          form.discount_percent
        ) > 100)
    ) {
      alert(
        "نسبة الخصم يجب أن تكون بين 0 و100."
      );
      return;
    }

    const cleanColors =
      form.colors
        .map((color) => ({
          name: normalizeColorName(
            color.name
          ),
          hex: getColorHex(
            color.name
          ),
          available:
            color.available !==
            false,
        }))
        .filter(
          (color) =>
            color.name
        );

    const duplicateColors =
      cleanColors.filter(
        (color, index, array) =>
          array.findIndex(
            (item) =>
              item.name.toLowerCase() ===
              color.name.toLowerCase()
          ) !== index
      );

    if (
      duplicateColors.length
    ) {
      alert(
        "مينفعش تضيف نفس اللون مرتين."
      );
      return;
    }

    const cleanSizes =
      form.sizes
        .map((size) => ({
          name: String(
            size.name || ""
          ).trim(),
          available:
            size.available !==
            false,
        }))
        .filter(
          (size) =>
            size.name
        );

    const colorsMissingImages = form.colors.filter((color) => {
      const imageCount =
        (color.existingImages?.length || 0) +
        (color.newFiles?.length || 0);
      return color.name.trim() && imageCount < 2;
    });

    if (colorsMissingImages.length > 0) {
      alert(
        `كل لون لازم يكون له صورتين على الأقل. راجع: ${colorsMissingImages
          .map((color) => color.name.trim())
          .join("، ")}`
      );
      return;
    }

    setSaving(true);

    try {
      let imageUrl =
        form.image.trim() ||
        null;

      if (selectedImage) {
        imageUrl =
          await uploadImage(
            selectedImage,
            "main"
          );
      }

      const selectedCategoryId =
        Number(
          form.category_id
        );

      const selectedCategory =
        categories.find(
          (category) =>
            Number(
              category.id
            ) ===
            selectedCategoryId
        );

      const productData = {
        name:
          form.name.trim(),

        category:
          selectedCategory?.name ||
          form.category.trim(),

        price:
          Number(form.price),

        original_price:
          form.original_price ===
          ""
            ? null
            : Number(
                form.original_price
              ),

        discount_percent:
          form.discount_percent ===
          ""
            ? 0
            : Number(
                form.discount_percent
              ),

        image:
          imageUrl,

        isNew:
          Boolean(form.isNew),

        is_available:
          Boolean(
            form.is_available
          ),

        is_best_seller:
          Boolean(
            form.is_best_seller
          ),

        is_featured:
          Boolean(
            form.is_featured
          ),

        category_id:
          selectedCategoryId,

        short_description:
          form.short_description.trim() ||
          null,

        description:
          form.description.trim() ||
          null,

        caption:
          form.caption.trim() ||
          null,

        details:
          parseDetails(
            form.details
          ),

        extra_details:
          parseDetails(
            form.extra_details
          ),

        sku:
          form.sku.trim() ||
          null,

        sort_order:
          form.sort_order ===
          ""
            ? 0
            : Number(
                form.sort_order
              ),

        seo_title:
          form.seo_title.trim() ||
          null,

        seo_description:
          form.seo_description.trim() ||
          null,

        og_image:
          form.og_image.trim() ||
          null,

        model_height_cm:
          form.model_height_cm === "" ? null : Number(form.model_height_cm),
        model_size:
          form.model_size.trim() || null,
        model_measurements:
          form.model_measurements.trim() || null,
        fabric:
          form.fabric.trim() || null,
        care_instructions:
          form.care_instructions.trim() || null,
        features:
          form.features.trim() || null,
        size_guide:
          form.size_guide.trim() || null,

        colors:
          cleanColors,

        sizes:
          cleanSizes,
      };

      let productId;

      if (editingProduct) {
        const { error } =
          await supabase
            .from("products")
            .update(
              productData
            )
            .eq(
              "id",
              editingProduct.id
            );

        if (error) {
          throw new Error(
            error.message
          );
        }

        productId =
          editingProduct.id;
      } else {
        const { data, error } =
          await supabase
            .from("products")
            .insert([
              productData,
            ])
            .select()
            .single();

        if (error) {
          throw new Error(
            error.message
          );
        }

        productId =
          data.id;
      }

      /*
       * =====================================
       * PRODUCT COLOR IMAGES
       * =====================================
       */

      const finalImages = [];

      for (const image of form.gallery?.existingImages || []) {
        finalImages.push({
          product_id: productId,
          image_url: image.image_url,
          color: null,
          color_hex: null,
          sort_order: finalImages.length,
        });
      }

      for (const item of form.gallery?.newFiles || []) {
        const uploadedUrl = await uploadImage(
          item.file,
          `gallery/${productId}`
        );

        finalImages.push({
          product_id: productId,
          image_url: uploadedUrl,
          color: null,
          color_hex: null,
          sort_order: finalImages.length,
        });
      }

      for (
        const color of form.colors
      ) {
        const colorName =
          normalizeColorName(
            color.name
          );

        if (!colorName) {
          continue;
        }

        const colorHex =
          getColorHex(
            colorName
          );

        /*
         * Existing images
         */
        for (
          const image of
            color.existingImages ||
            []
        ) {
          finalImages.push({
            product_id:
              productId,

            image_url:
              image.image_url,

            color:
              colorName,

            color_hex:
              colorHex,

            sort_order:
              finalImages.length,
          });
        }

        /*
         * New images
         */
        for (
          const item of
            color.newFiles ||
            []
        ) {
          const uploadedUrl =
            await uploadImage(
              item.file,
              `colors/${productId}`
            );

          finalImages.push({
            product_id:
              productId,

            image_url:
              uploadedUrl,

            color:
              colorName,

            color_hex:
              colorHex,

            sort_order:
              finalImages.length,
          });
        }
      }

      /*
       * =====================================
       * REPLACE PRODUCT IMAGES
       * =====================================
       */

      const { error: deleteImagesError } =
        await supabase
          .from("product_images")
          .delete()
          .eq(
            "product_id",
            productId
          );

      if (deleteImagesError) {
        throw new Error(
          deleteImagesError.message
        );
      }

      if (finalImages.length) {
        const {
          error:
            insertImagesError,
        } = await supabase
          .from("product_images")
          .insert(
            finalImages
          );

        if (insertImagesError) {
          throw new Error(
            insertImagesError.message
          );
        }

        /*
         * لو مفيش صورة رئيسية
         * نخلي أول صورة لون هي الرئيسية
         */
        if (!imageUrl) {
          await supabase
            .from("products")
            .update({
              image:
                finalImages[0]
                  .image_url,
            })
            .eq(
              "id",
              productId
            );
        }
      }

      alert(
        editingProduct
          ? "تم تعديل المنتج بنجاح ✅"
          : "تم إضافة المنتج بنجاح ✅"
      );

      await fetchProducts();

      closeForm();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      alert(
        `حصل خطأ أثناء حفظ المنتج:\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "هل أنت متأكد إنك عايز تحذف المنتج ده؟"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      productId
    );

    /*
     * حذف صور المنتج من قاعدة البيانات
     */
    await supabase
      .from("product_images")
      .delete()
      .eq(
        "product_id",
        productId
      );

    const { error } =
      await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          productId
        );

    if (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        `حصل خطأ أثناء حذف المنتج:\n${error.message}`
      );

      setDeletingId(null);
      return;
    }

    setProducts(
      (currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !==
            productId
        )
    );

    setDeletingId(null);
  };

  const getPriceData = (
    product
  ) => {
    const price =
      Number(
        product.price
      ) || 0;

    const originalPrice =
      Number(
        product.original_price
      ) || price;

    const discount =
      Number(
        product.discount_percent
      ) || 0;

    const finalPrice =
      discount > 0
        ? Math.round(
            originalPrice -
              originalPrice *
                (discount /
                  100)
          )
        : price;

    return {
      price,
      originalPrice,
      discount,
      finalPrice,
    };
  };

  return (
    <section dir="rtl">

      {/* HEADER */}
      <div className="mb-10 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-gray-400">
              BIOR PRODUCTS
            </span>

            <h2 className="mt-4 text-3xl font-light tracking-tight text-black sm:text-4xl">
              إدارة المنتجات
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              أضف المنتجات والألوان والمقاسات والصور بسهولة.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="w-fit border border-black bg-black px-6 py-3 text-sm text-white transition hover:bg-white hover:text-black"
          >
            + إضافة منتج
          </button>

        </div>
      </div>

      {/* FILTERS */}
      <section className="mb-8 border border-gray-200 bg-white p-6 sm:p-8">

        <div className="grid gap-5 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              البحث
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="ابحث باسم المنتج أو SKU أو القسم..."
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              القسم
            </label>

            <select
              value={
                filterCategory
              }
              onChange={(event) =>
                setFilterCategory(
                  event.target.value
                )
              }
              disabled={
                loadingCategories
              }
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">
                {loadingCategories
                  ? "جاري تحميل الأقسام..."
                  : "كل الأقسام"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              الحالة
            </label>

            <select
              value={
                filterStatus
              }
              onChange={(event) =>
                setFilterStatus(
                  event.target.value
                )
              }
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">
                كل المنتجات
              </option>

              <option value="available">
                المنتجات المتاحة
              </option>

              <option value="unavailable">
                غير متاحة
              </option>

              <option value="new">
                المنتجات الجديدة
              </option>

              <option value="best">
                الأكثر مبيعًا
              </option>

              <option value="featured">
                المميزة
              </option>
            </select>
          </div>

        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">

          <span className="text-xs text-gray-400">
            عرض{" "}
            {
              filteredProducts.length
            }{" "}
            من{" "}
            {
              products.length
            }{" "}
            منتج
          </span>

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="text-xs text-gray-500 hover:text-black"
          >
            مسح الفلاتر
          </button>

        </div>
      </section>

      {/* FORM */}
      {showForm && (
        <section className="mb-10 border border-gray-200 bg-white p-6 sm:p-8">

          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">

            <div>
              <span className="text-xs text-gray-400">
                BIOR PRODUCT
              </span>

              <h3 className="mt-2 text-2xl font-light text-black">
                {editingProduct
                  ? "تعديل المنتج"
                  : "إضافة منتج جديد"}
              </h3>
            </div>

            <button
              type="button"
              onClick={
                closeForm
              }
              disabled={
                saving
              }
              className="text-sm text-gray-500 hover:text-black"
            >
              إغلاق
            </button>

          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-10"
          >

            {/* BASIC */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                البيانات الأساسية
              </h4>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    اسم المنتج *
                  </label>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="مثال: جاكت شتوي"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={
                      form.sku
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="BIOR-001"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    القسم *
                  </label>

                  <select
                    value={
                      form.category_id
                    }
                    onChange={
                      handleCategoryChange
                    }
                    disabled={
                      loadingCategories
                    }
                    className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  >
                    <option value="">
                      اختار القسم
                    </option>

                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    ترتيب المنتج
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={
                      form.sort_order
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

              </div>
            </div>

            {/* PRICES */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                الأسعار
              </h4>

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    السعر الحالي *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    السعر الأصلي
                  </label>

                  <input
                    type="number"
                    name="original_price"
                    value={
                      form.original_price
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    نسبة الخصم %
                  </label>

                  <input
                    type="number"
                    name="discount_percent"
                    value={
                      form.discount_percent
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    max="100"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

              </div>
            </div>

            {/* MAIN IMAGE */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                الصورة الرئيسية
              </h4>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                disabled={
                  saving
                }
                className="block w-full border border-gray-200 px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-400">
                الصورة الرئيسية للمنتج.
              </p>

              {imagePreview && (
                <div className="mt-5 h-64 w-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

            </div>

            {/* GENERAL GALLERY */}
            <div>
              <h4 className="mb-5 text-sm font-medium">
                معرض الصور الرئيسي
              </h4>

              <p className="mb-4 text-xs leading-6 text-gray-400">
                ارفع أي عدد من الصور العامة للمنتج. الصور هنا لا ترتبط بلون معين.
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImages}
                disabled={saving}
                className="block w-full border border-gray-200 px-4 py-3 text-sm"
              />

              {(form.gallery?.existingImages?.length > 0 || form.gallery?.newFiles?.length > 0) && (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                  {form.gallery?.existingImages?.map((image) => (
                    <div key={image.id} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <img src={image.image_url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(image.id)}
                        className="absolute left-1 top-1 bg-white px-2 py-1 text-xs text-red-500 shadow"
                      >×</button>
                    </div>
                  ))}

                  {form.gallery?.newFiles?.map((item, index) => (
                    <div key={`gallery-new-${index}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <img src={item.preview} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryImage(index)}
                        className="absolute left-1 top-1 bg-white px-2 py-1 text-xs text-red-500 shadow"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLORS */}
            <div>

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h4 className="text-sm font-medium">
                    ألوان المنتج
                  </h4>

                  <p className="mt-2 text-xs text-gray-400">
                    اكتب اسم اللون فقط، والنظام يتعرف عليه تلقائيًا.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addColor
                  }
                  className="border border-black px-4 py-2 text-xs hover:bg-black hover:text-white"
                >
                  + إضافة لون
                </button>

              </div>

              <div className="space-y-5">

                {form.colors.length ===
                  0 && (
                    <div className="border border-dashed border-gray-200 px-6 py-10 text-center">
                      <p className="text-sm text-gray-400">
                        لم تضف ألوان بعد.
                      </p>
                    </div>
                  )}

                {form.colors.map(
                  (
                    color,
                    index
                  ) => (
                    <div
                      key={
                        color.id
                      }
                      className="border border-gray-200 p-5"
                    >

                      <div className="grid gap-5 md:grid-cols-[1fr_100px_auto]">

                        <div>
                          <label className="mb-2 block text-xs text-gray-500">
                            اسم اللون
                          </label>

                          <input
                            value={
                              color.name
                            }
                            onChange={(
                              event
                            ) =>
                              handleColorNameChange(
                                color.id,
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="مثال: برجندي"
                            className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-500">
                            اللون
                          </label>

                          <div
                            className="h-12 w-full border border-gray-200"
                            style={{
                              backgroundColor:
                                color.hex,
                            }}
                            title={
                              color.hex
                            }
                          />
                        </div>

                        <div className="flex items-end">

                          <button
                            type="button"
                            onClick={() =>
                              removeColor(
                                color.id
                              )
                            }
                            className="border border-red-200 px-4 py-3 text-xs text-red-500 hover:bg-red-50"
                          >
                            حذف اللون
                          </button>

                        </div>

                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            toggleColorAvailability(
                              color.id
                            )
                          }
                          className={`border px-4 py-2 text-xs ${
                            color.available
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-400"
                          }`}
                        >
                          {color.available
                            ? "اللون متاح"
                            : "اللون خلصان"}
                        </button>

                        <span
                          className="text-xs text-gray-400"
                        >
                          اللون رقم{" "}
                          {index +
                            1}
                        </span>

                      </div>

                      <div className="mt-6 border-t border-gray-100 pt-5">

                        <label className="mb-2 block text-xs text-gray-500">
                          صور هذا اللون
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(
                            event
                          ) =>
                            handleColorImages(
                              color.id,
                              event
                            )
                          }
                          disabled={
                            saving
                          }
                          className="block w-full border border-gray-200 px-4 py-3 text-sm"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                          تقدر تختار أكتر من صورة لنفس اللون.
                        </p>

                        {(color.existingImages
                          ?.length >
                          0 ||
                          color.newFiles
                            ?.length >
                            0) && (
                          <div className="mt-5 flex flex-wrap gap-4">

                            {color.existingImages?.map(
                              (
                                image
                              ) => (
                                <div
                                  key={
                                    image.id
                                  }
                                  className="relative h-28 w-24 overflow-hidden bg-gray-100"
                                >
                                  <img
                                    src={
                                      image.image_url
                                    }
                                    alt={
                                      color.name
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeExistingColorImage(
                                        color.id,
                                        image.id
                                      )
                                    }
                                    className="absolute left-1 top-1 bg-white px-2 py-1 text-xs text-red-500 shadow"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            )}

                            {color.newFiles?.map(
                              (
                                item,
                                imageIndex
                              ) => (
                                <div
                                  key={
                                    `${color.id}-${imageIndex}`
                                  }
                                  className="relative h-28 w-24 overflow-hidden bg-gray-100"
                                >
                                  <img
                                    src={
                                      item.preview
                                    }
                                    alt={
                                      color.name
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeNewColorImage(
                                        color.id,
                                        imageIndex
                                      )
                                    }
                                    className="absolute left-1 top-1 bg-white px-2 py-1 text-xs text-red-500 shadow"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            )}

                          </div>
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* SIZES */}
            <div>

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h4 className="text-sm font-medium">
                    المقاسات
                  </h4>

                  <p className="mt-2 text-xs text-gray-400">
                    أضف المقاسات وحدد المتاح والخلصان.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addSize
                  }
                  className="border border-black px-4 py-2 text-xs hover:bg-black hover:text-white"
                >
                  + إضافة مقاس
                </button>

              </div>

              <div className="space-y-3">

                {form.sizes.length ===
                  0 && (
                    <div className="border border-dashed border-gray-200 px-6 py-8 text-center">
                      <p className="text-sm text-gray-400">
                        لم تضف مقاسات بعد.
                      </p>
                    </div>
                  )}

                {form.sizes.map(
                  (size) => (
                    <div
                      key={
                        size.id
                      }
                      className="flex flex-col gap-3 border border-gray-200 p-4 sm:flex-row sm:items-center"
                    >

                      <input
                        value={
                          size.name
                        }
                        onChange={(
                          event
                        ) =>
                          handleSizeNameChange(
                            size.id,
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="S / M / L / XL / 36 / 38"
                        className="flex-1 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          toggleSizeAvailability(
                            size.id
                          )
                        }
                        className={`border px-5 py-3 text-xs ${
                          size.available
                            ? "border-black bg-black text-white"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        {size.available
                          ? "متاح"
                          : "خلصان"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeSize(
                            size.id
                          )
                        }
                        className="border border-red-200 px-5 py-3 text-xs text-red-500"
                      >
                        حذف
                      </button>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* DESCRIPTION */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                وصف المنتج
              </h4>

              <div className="space-y-5">

                <textarea
                  name="short_description"
                  value={
                    form.short_description
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  placeholder="وصف مختصر..."
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="5"
                  placeholder="الوصف الكامل..."
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <textarea
                  name="caption"
                  value={
                    form.caption
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  placeholder="Caption..."
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

              </div>
            </div>

            {/* DETAILS */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                تفاصيل المنتج
              </h4>

              <div className="space-y-5">

                <textarea
                  name="details"
                  value={
                    form.details
                  }
                  onChange={
                    handleChange
                  }
                  rows="6"
                  placeholder="تفاصيل المنتج..."
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <textarea
                  name="extra_details"
                  value={
                    form.extra_details
                  }
                  onChange={
                    handleChange
                  }
                  rows="5"
                  placeholder="تفاصيل إضافية..."
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

              </div>
            </div>

            {/* MODEL + FABRIC */}
            <div>
              <h4 className="mb-5 text-sm font-medium">
                بيانات العرض والخامة
              </h4>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">طول العارضة (سم)</label>
                  <input
                    type="number"
                    name="model_height_cm"
                    value={form.model_height_cm}
                    onChange={handleChange}
                    min="0"
                    placeholder="مثال: 178"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">المقاس الذي ترتديه العارضة</label>
                  <input
                    name="model_size"
                    value={form.model_size}
                    onChange={handleChange}
                    placeholder="مثال: M"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">قياسات العارضة</label>
                  <input
                    name="model_measurements"
                    value={form.model_measurements}
                    onChange={handleChange}
                    placeholder="مثال: 89 / 63 / 92"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">نوع / خامة القماش</label>
                  <input
                    name="fabric"
                    value={form.fabric}
                    onChange={handleChange}
                    placeholder="مثال: Twill - بوليستر"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">تعليمات الغسيل والعناية</label>
                  <input
                    name="care_instructions"
                    value={form.care_instructions}
                    onChange={handleChange}
                    placeholder="مثال: غسيل بارد - لا تستخدم المبيض"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">مميزات القطعة</label>
                  <textarea
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    rows="4"
                    placeholder="اكتب المميزات مفصولة بفاصلة أو كل ميزة في سطر\nمثال: خامة ناعمة، بطانة داخلية، مقاومة للانكماش"
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">دليل المقاسات</label>
                  <textarea
                    name="size_guide"
                    value={form.size_guide}
                    onChange={handleChange}
                    rows="4"
                    placeholder="كل سطر: المقاس | الصدر | الخصر | الطول\nمثال:\nالمقاس | الصدر | الخصر | الطول\nS | 88 | 68 | 70\nM | 92 | 72 | 71"
                    className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                  <p className="mt-2 text-xs text-gray-400">استخدم علامة | بين الأعمدة.</p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                حالة المنتج
              </h4>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={
                      form.is_available
                    }
                    onChange={
                      handleChange
                    }
                  />
                  <span className="text-sm">
                    المنتج متاح
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={
                      form.isNew
                    }
                    onChange={
                      handleChange
                    }
                  />
                  <span className="text-sm">
                    منتج جديد
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_best_seller"
                    checked={
                      form.is_best_seller
                    }
                    onChange={
                      handleChange
                    }
                  />
                  <span className="text-sm">
                    الأكثر مبيعًا
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={
                      form.is_featured
                    }
                    onChange={
                      handleChange
                    }
                  />
                  <span className="text-sm">
                    Featured
                  </span>
                </label>

              </div>
            </div>

            {/* SEO */}
            <div>

              <h4 className="mb-5 text-sm font-medium">
                SEO
              </h4>

              <div className="space-y-5">

                <input
                  name="seo_title"
                  value={
                    form.seo_title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="SEO Title"
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <textarea
                  name="seo_description"
                  value={
                    form.seo_description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  placeholder="SEO Description"
                  className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <input
                  name="og_image"
                  value={
                    form.og_image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="OG Image URL"
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">

              <button
                type="submit"
                disabled={
                  saving ||
                  loadingCategories
                }
                className="border border-black bg-black px-8 py-3 text-sm text-white hover:bg-white hover:text-black disabled:opacity-50"
              >
                {saving
                  ? "جاري الحفظ..."
                  : editingProduct
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
              </button>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={
                  saving
                }
                className="border border-gray-200 px-8 py-3 text-sm text-gray-600 hover:border-black hover:text-black"
              >
                إلغاء
              </button>

            </div>

          </form>
        </section>
      )}

      {/* PRODUCTS TABLE */}
      {loading ? (
        <div className="border border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">
            جاري تحميل المنتجات...
          </p>
        </div>
      ) : filteredProducts.length ===
        0 ? (
        <div className="border border-gray-200 bg-white px-6 py-20 text-center">

          <h3 className="text-xl font-light">
            مفيش نتائج
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            جرّب تغيير البحث أو الفلاتر.
          </p>

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="mt-5 border-b border-black pb-1 text-xs"
          >
            مسح الفلاتر
          </button>

        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 bg-white">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-right">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    المنتج
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    القسم
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    السعر
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الخصم
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الحالة
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    الإجراءات
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const {
                      price,
                      originalPrice,
                      discount,
                      finalPrice,
                    } =
                      getPriceData(
                        product
                      );

                    return (
                      <tr
                        key={
                          product.id
                        }
                        className="border-b border-gray-100"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="h-16 w-16 shrink-0 overflow-hidden bg-gray-100">

                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name ||
                                    "BIOR product"
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  بدون صورة
                                </div>
                              )}

                            </div>

                            <div>

                              <p className="text-sm font-medium text-black">
                                {product.name ||
                                  "بدون اسم"}
                              </p>

                              {product.sku && (
                                <p className="mt-1 text-xs text-gray-400">
                                  SKU:{" "}
                                  {
                                    product.sku
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600">
                            {product.category ||
                              "بدون قسم"}
                          </span>
                        </td>

                        <td className="px-6 py-5">

                          {discount >
                          0 ? (
                            <div>
                              <p className="text-sm font-semibold">
                                {
                                  finalPrice
                                }{" "}
                                جنيه
                              </p>

                              <p className="text-xs text-gray-400 line-through">
                                {
                                  originalPrice
                                }{" "}
                                جنيه
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm">
                              {
                                price
                              }{" "}
                              جنيه
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5">

                          {discount >
                          0 ? (
                            <span className="inline-flex bg-black px-3 py-1 text-xs text-white">
                              خصم{" "}
                              {
                                discount
                              }
                              %
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              بدون خصم
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex flex-wrap gap-2">

                            {product.is_available ? (
                              <span className="border border-black px-3 py-1 text-xs">
                                متاح
                              </span>
                            ) : (
                              <span className="border border-gray-200 px-3 py-1 text-xs text-gray-400">
                                غير متاح
                              </span>
                            )}

                            {product.isNew && (
                              <span className="bg-black px-3 py-1 text-xs text-white">
                                جديد
                              </span>
                            )}

                            {product.is_best_seller && (
                              <span className="border border-gray-300 px-3 py-1 text-xs">
                                الأكثر مبيعًا
                              </span>
                            )}

                            {product.is_featured && (
                              <span className="border border-gray-300 px-3 py-1 text-xs">
                                Featured
                              </span>
                            )}

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-5">

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  product
                                )
                              }
                              className="text-xs text-gray-600 hover:text-black"
                            >
                              تعديل
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                              disabled={
                                deletingId ===
                                product.id
                              }
                              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              {deletingId ===
                              product.id
                                ? "جاري الحذف..."
                                : "حذف"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </section>
  );
}

export default ProductsAdmin;