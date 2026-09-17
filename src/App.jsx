import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import Products from "./components/Products/Products";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loadingSite, setLoadingSite] = useState(true);

  // ==========================================
  // FETCH SITE SETTINGS
  // ==========================================

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  // ==========================================
  // SEO
  // ==========================================

  useEffect(() => {
    if (!siteSettings) return;

    const defaultTitle =
      "BIOR | بيور – ملابس حريمي في المنصورة";

    const defaultDescription =
      "BIOR (بيور) هو متجر ملابس حريمي في المنصورة. اكتشفي أحدث تشكيلات الملابس النسائية.";

    const siteTitle =
      siteSettings.seo_title?.trim() ||
      defaultTitle;

    const siteDescription =
      siteSettings.seo_description?.trim() ||
      siteSettings.site_description?.trim() ||
      defaultDescription;

    // ==========================================
    // PAGE TITLE
    // ==========================================

    document.title = siteTitle;

    // ==========================================
    // META DESCRIPTION
    // ==========================================

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");

      descriptionTag.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      siteDescription
    );

    // ==========================================
    // META KEYWORDS
    // ==========================================

    if (siteSettings.seo_keywords?.trim()) {
      let keywordsTag = document.querySelector(
        'meta[name="keywords"]'
      );

      if (!keywordsTag) {
        keywordsTag = document.createElement("meta");

        keywordsTag.setAttribute(
          "name",
          "keywords"
        );

        document.head.appendChild(keywordsTag);
      }

      keywordsTag.setAttribute(
        "content",
        siteSettings.seo_keywords.trim()
      );
    }
  }, [siteSettings]);

  // ==========================================
  // FETCH SITE SETTINGS
  // ==========================================

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        `
          site_name,
          site_description,
          site_status,
          site_closed_message,
          seo_title,
          seo_description,
          seo_keywords,
          seo_og_image,
          footer_location_link,
          footer_phone,
          footer_whatsapp,
          footer_address_line_1,
          footer_address_line_2,
          footer_address_line_3
        `
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error(
        "Site settings fetch error:",
        error
      );
    }

    setSiteSettings(data || {});
    setLoadingSite(false);
  };

  // ==========================================
  // LOCAL BUSINESS SCHEMA
  // ==========================================

  useEffect(() => {
    if (!siteSettings) return;

    const normalizePhone = (value) =>
      String(value || "").replace(/\D/g, "");

    const location =
      siteSettings.footer_location_link?.trim() || "";

    const phone = normalizePhone(siteSettings.footer_phone);

    const address = [
      siteSettings.footer_address_line_1,
      siteSettings.footer_address_line_2,
      siteSettings.footer_address_line_3,
    ]
      .filter(Boolean)
      .join("، ");

    let script = document.head.querySelector(
      'script[data-bior-local-business="true"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(
        "data-bior-local-business",
        "true"
      );
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "@id": "https://bior-fashion.vercel.app/#store",
      name: siteSettings.site_name?.trim() || "BIOR | بيور",
      url: window.location.origin,
      logo: `${window.location.origin}/bior-logo-mark.webp`,
      description:
        siteSettings.site_description?.trim() ||
        "BIOR متجر ملابس حريمي في المنصورة.",
      ...(phone ? { telephone: `+${phone}` } : {}),
      ...(address
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: address,
              addressLocality: "Mansoura / Dikirnis",
              addressRegion: "Dakahlia",
              addressCountry: "EG",
            },
          }
        : {}),
      ...(location ? { hasMap: location } : {}),
    });
  }, [siteSettings]);

  // ==========================================
  // CURRENT PATH
  // ==========================================

  const currentPath = window.location.pathname;

  // ==========================================
  // ADMIN ROUTE
  // ==========================================

  const isAdminRoute =
    currentPath === "/admin" ||
    currentPath === "/admin/";

  if (isAdminRoute) {
    return <Admin />;
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingSite) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white"
      >
        <p className="text-sm text-gray-500">
          جاري تحميل الموقع...
        </p>
      </div>
    );
  }

  // ==========================================
  // SITE CLOSED
  // ==========================================

  if (siteSettings?.site_status === false) {
    return (
      <SiteClosed
        message={siteSettings.site_closed_message}
      />
    );
  }

  // ==========================================
  // HOME
  // ==========================================

  if (
    currentPath === "/" ||
    currentPath === ""
  ) {
    return <Home />;
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  if (
    currentPath === "/products" ||
    currentPath === "/products/"
  ) {
    return <Products />;
  }

  // ==========================================
  // PRODUCT DETAILS
  // ==========================================

  if (currentPath.startsWith("/product/")) {
    const productId = currentPath
      .replace("/product/", "")
      .replace(/\/+$/, "");

    return (
      <ProductDetails
        productId={productId}
      />
    );
  }

  // ==========================================
  // FALLBACK
  // ==========================================

  return <Home />;
}

// =====================================================
// SITE CLOSED COMPONENT
// =====================================================

function SiteClosed({ message }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-6"
    >
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">
            🔧
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          الموقع متوقف مؤقتًا
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          {message?.trim() ||
            "الموقع متوقف مؤقتًا، يرجى المحاولة مرة أخرى لاحقًا."}
        </p>

        <div className="mt-6 text-xs text-gray-400">
          BIOR
        </div>
      </div>
    </div>
  );
}

export default App;