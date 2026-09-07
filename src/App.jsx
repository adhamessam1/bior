import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import Products from "./components/Products/Products";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/+$/, "");

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loadingSite, setLoadingSite] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (!siteSettings) return;

    const siteName =
      siteSettings.seo_title?.trim() ||
      siteSettings.site_name?.trim() ||
      "BIOR";

    const siteDescription =
      siteSettings.seo_description?.trim() ||
      siteSettings.site_description?.trim() ||
      "BIOR - متجر أزياء حريمي";

    // عنوان الصفحة
    document.title = siteName;

    // Meta Description
    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      siteDescription
    );

    // Meta Keywords
    let keywordsTag = document.querySelector(
      'meta[name="keywords"]'
    );

    if (!keywordsTag) {
      keywordsTag = document.createElement("meta");
      keywordsTag.setAttribute("name", "keywords");
      document.head.appendChild(keywordsTag);
    }

    keywordsTag.setAttribute(
      "content",
      siteSettings.seo_keywords?.trim() || ""
    );

    // Open Graph Title
    let ogTitleTag = document.querySelector(
      'meta[property="og:title"]'
    );

    if (!ogTitleTag) {
      ogTitleTag = document.createElement("meta");
      ogTitleTag.setAttribute("property", "og:title");
      document.head.appendChild(ogTitleTag);
    }

    ogTitleTag.setAttribute("content", siteName);

    // Open Graph Description
    let ogDescriptionTag = document.querySelector(
      'meta[property="og:description"]'
    );

    if (!ogDescriptionTag) {
      ogDescriptionTag = document.createElement("meta");
      ogDescriptionTag.setAttribute(
        "property",
        "og:description"
      );
      document.head.appendChild(ogDescriptionTag);
    }

    ogDescriptionTag.setAttribute(
      "content",
      siteDescription
    );

    // Open Graph Image
    if (siteSettings.seo_og_image?.trim()) {
      let ogImageTag = document.querySelector(
        'meta[property="og:image"]'
      );

      if (!ogImageTag) {
        ogImageTag = document.createElement("meta");
        ogImageTag.setAttribute("property", "og:image");
        document.head.appendChild(ogImageTag);
      }

      ogImageTag.setAttribute(
        "content",
        siteSettings.seo_og_image.trim()
      );
    }
  }, [siteSettings]);

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
        seo_og_image
        `
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error("Site settings fetch error:", error);
    }

    setSiteSettings(data || {});
    setLoadingSite(false);
  };

  const currentPath = window.location.pathname;

  const isAdminRoute =
    currentPath === `${BASE_URL}/admin` ||
    currentPath === `${BASE_URL}/admin/`;

  // الـ Admin يفضل شغال حتى لو الموقع متوقف
  if (isAdminRoute) {
    return <Admin />;
  }

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

  // لو الموقع متوقف
  if (siteSettings?.site_status === false) {
    return (
      <SiteClosed
        message={siteSettings.site_closed_message}
      />
    );
  }

  // الصفحة الرئيسية
  if (
    currentPath === BASE_URL ||
    currentPath === `${BASE_URL}/`
  ) {
    return <Home />;
  }

  // صفحة المنتجات
  if (
    currentPath === `${BASE_URL}/products` ||
    currentPath === `${BASE_URL}/products/`
  ) {
    return <Products />;
  }

  // تفاصيل المنتج
  if (currentPath.startsWith(`${BASE_URL}/product/`)) {
    const productId = currentPath
      .replace(`${BASE_URL}/product/`, "")
      .replace(/\/+$/, "");

    return <ProductDetails productId={productId} />;
  }

  // أي رابط غير معروف
  return <Home />;
}

function SiteClosed({ message }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-6"
    >
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">🔧</span>
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