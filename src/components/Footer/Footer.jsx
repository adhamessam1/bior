import { useEffect, useState } from "react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

import { supabase } from "../../lib/supabase";

const fallbackSettings = {
  footer_description:
    "مساحة لعرض تشكيلات BIOR من الأزياء الحريمي، بتصميمات مختارة وتفاصيل تناسب ستايلك.",

  footer_instagram:
    "https://www.instagram.com/bior_fashoin.11/",

  footer_facebook:
    "https://www.facebook.com/share/194MwxL1AV/",

  footer_tiktok:
    "https://www.tiktok.com/@bior_fashoin.11",

  footer_address_line_1: "المنصورة - دكرنس",
  footer_address_line_2: "شارع المستشفى",
  footer_address_line_3: "بجوار سور المستشفى",

  footer_location_link: "",

  footer_phone: "01065587997",
  footer_whatsapp: "201065587997",

  footer_visit_title: "زورينا في الفرع",

  footer_contact_text:
    "الموقع مخصص لاستعراض تشكيلات BIOR. لزيارة الفرع والتعرف على المنتجات، تواصلي معنا.",

  footer_bottom_text:
    "© 2026 BIOR. جميع الحقوق محفوظة.",

  footer_bottom_tagline:
    "FASHION • STYLE • BIOR",
};

function Footer() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFooterSettings();
    fetchCategories();
  }, []);

  async function fetchFooterSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        `
        footer_description,
        footer_instagram,
        footer_facebook,
        footer_tiktok,
        footer_address_line_1,
        footer_address_line_2,
        footer_address_line_3,
        footer_location_link,
        footer_phone,
        footer_whatsapp,
        footer_visit_title,
        footer_contact_text,
        footer_bottom_text,
        footer_bottom_tagline
        `
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error("Footer settings fetch error:", error);
      return;
    }

    if (data) {
      setSettings({
        footer_description:
          data.footer_description ||
          fallbackSettings.footer_description,

        footer_instagram:
          data.footer_instagram ||
          fallbackSettings.footer_instagram,

        footer_facebook:
          data.footer_facebook ||
          fallbackSettings.footer_facebook,

        footer_tiktok:
          data.footer_tiktok ||
          fallbackSettings.footer_tiktok,

        footer_address_line_1:
          data.footer_address_line_1 ||
          fallbackSettings.footer_address_line_1,

        footer_address_line_2:
          data.footer_address_line_2 ||
          fallbackSettings.footer_address_line_2,

        footer_address_line_3:
          data.footer_address_line_3 ||
          fallbackSettings.footer_address_line_3,

        footer_location_link:
          data.footer_location_link || "",

        footer_phone:
          data.footer_phone ||
          fallbackSettings.footer_phone,

        footer_whatsapp:
          data.footer_whatsapp ||
          fallbackSettings.footer_whatsapp,

        footer_visit_title:
          data.footer_visit_title ||
          fallbackSettings.footer_visit_title,

        footer_contact_text:
          data.footer_contact_text ||
          fallbackSettings.footer_contact_text,

        footer_bottom_text:
          data.footer_bottom_text ||
          fallbackSettings.footer_bottom_text,

        footer_bottom_tagline:
          data.footer_bottom_tagline ||
          fallbackSettings.footer_bottom_tagline,
      });
    }
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, sort_order, is_visible")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("Footer categories fetch error:", error);
      return;
    }

    setCategories(data || []);
  }

  const phoneLink = settings.footer_phone
    ? `tel:${settings.footer_phone.replace(/\s+/g, "")}`
    : "#";

  const whatsappNumber = settings.footer_whatsapp
    ? settings.footer_whatsapp.replace(/[^\d]/g, "")
    : "";

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  const locationLink =
    settings.footer_location_link?.trim() || "";

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Footer */}

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          {/* Brand */}

          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.3em] text-gray-500">
              BIOR FASHION STORE
            </p>

            <h2 className="mt-5 text-6xl font-light tracking-tight sm:text-7xl">
              BIOR
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-gray-400 sm:text-base">
              {settings.footer_description}
            </p>

            {/* Social */}

            <div className="mt-9 flex gap-3">
              {settings.footer_instagram && (
                <a
                  href={settings.footer_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
                >
                  <FaInstagram />
                </a>
              )}

              {settings.footer_facebook && (
                <a
                  href={settings.footer_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
                >
                  <FaFacebookF />
                </a>
              )}

              {settings.footer_tiktok && (
                <a
                  href={settings.footer_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
                >
                  <FaTiktok />
                </a>
              )}
            </div>
          </div>

          {/* Collections */}

          <div className="lg:col-span-3">
            <p className="text-xs tracking-[0.3em] text-gray-500">
              COLLECTIONS
            </p>

            <h3 className="mt-5 text-xl font-medium">
              الأقسام
            </h3>

            <div className="mt-7 grid grid-cols-2 gap-y-4 text-sm text-gray-400">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="transition-colors hover:text-white"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>

          {/* Store */}

          <div className="lg:col-span-4">
            <p className="text-xs tracking-[0.3em] text-gray-500">
              VISIT BIOR
            </p>

            <h3 className="mt-5 text-xl font-medium">
              {settings.footer_visit_title}
            </h3>

            {/* Address */}

            <div className="mt-7 flex items-start gap-4 text-sm text-gray-400">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-white" />

              <p className="leading-7">
                {settings.footer_address_line_1}
                <br />
                {settings.footer_address_line_2}
                <br />
                {settings.footer_address_line_3}
              </p>
            </div>

            {/* Google Maps */}

            {locationLink && (
              <a
                href={locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-3 border border-gray-700 px-5 py-3 text-sm font-medium transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaMapMarkerAlt />
                موقع الفرع على الخريطة
              </a>
            )}

            {/* Contact */}

            <div className="mt-5 flex flex-col gap-3">
              {settings.footer_phone && (
                <a
                  href={phoneLink}
                  className="flex items-center justify-center gap-3 border border-gray-700 px-5 py-3 text-sm font-medium transition hover:border-white hover:bg-white hover:text-black"
                >
                  <FaPhoneAlt />
                  اتصلي بنا
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  <FaWhatsapp />
                  تواصلي معنا على واتساب
                </a>
              )}
            </div>

            {/* Contact Text */}

            <p className="mt-6 text-xs leading-7 text-gray-500">
              {settings.footer_contact_text}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-center text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-right lg:px-10">
          <span>
            {settings.footer_bottom_text}
          </span>

          <span>
            {settings.footer_bottom_tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;