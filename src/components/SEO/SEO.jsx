import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

function SEO() {
  useEffect(() => {
    const loadSEO = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "seo_title, seo_description, seo_keywords, seo_og_image"
        )
        .eq("section", "home")
        .maybeSingle();

      if (error) {
        console.error("SEO fetch error:", error);
        return;
      }

      if (!data) return;

      const title =
        data.seo_title?.trim() || "BIOR | ملابس حريمي";

      const description =
        data.seo_description?.trim() ||
        "اكتشف أحدث موديلات الملابس الحريمي من BIOR.";

      const keywords = data.seo_keywords?.trim() || "";
      const ogImage = data.seo_og_image?.trim() || "";

      document.title = title;

      setMeta("description", description);

      if (keywords) {
        setMeta("keywords", keywords);
      }

      setMetaProperty("og:title", title);
      setMetaProperty("og:description", description);

      if (ogImage) {
        setMetaProperty("og:image", ogImage);
      }

      setMetaProperty("og:type", "website");
      setMetaProperty("og:site_name", "BIOR");
    };

    loadSEO();
  }, []);

  return null;
}

function setMeta(name, content) {
  let tag = document.head.querySelector(
    `meta[name="${name}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  let tag = document.head.querySelector(
    `meta[property="${property}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

export default SEO;