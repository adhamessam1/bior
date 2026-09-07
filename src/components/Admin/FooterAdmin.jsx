import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

const initialForm = {
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

function FooterAdmin() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  async function fetchFooterSettings() {
    setLoading(true);
    setMessage("");

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
      console.error(error);
      setMessage("حدث خطأ أثناء تحميل إعدادات الفوتر.");
      setLoading(false);
      return;
    }

    if (data) {
      setForm({
        footer_description:
          data.footer_description ||
          initialForm.footer_description,

        footer_instagram:
          data.footer_instagram ||
          initialForm.footer_instagram,

        footer_facebook:
          data.footer_facebook ||
          initialForm.footer_facebook,

        footer_tiktok:
          data.footer_tiktok ||
          initialForm.footer_tiktok,

        footer_address_line_1:
          data.footer_address_line_1 ||
          initialForm.footer_address_line_1,

        footer_address_line_2:
          data.footer_address_line_2 ||
          initialForm.footer_address_line_2,

        footer_address_line_3:
          data.footer_address_line_3 ||
          initialForm.footer_address_line_3,

        footer_location_link:
          data.footer_location_link || "",

        footer_phone:
          data.footer_phone ||
          initialForm.footer_phone,

        footer_whatsapp:
          data.footer_whatsapp ||
          initialForm.footer_whatsapp,

        footer_visit_title:
          data.footer_visit_title ||
          initialForm.footer_visit_title,

        footer_contact_text:
          data.footer_contact_text ||
          initialForm.footer_contact_text,

        footer_bottom_text:
          data.footer_bottom_text ||
          initialForm.footer_bottom_text,

        footer_bottom_tagline:
          data.footer_bottom_tagline ||
          initialForm.footer_bottom_tagline,
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          section: "home",

          footer_description: form.footer_description,

          footer_instagram: form.footer_instagram,
          footer_facebook: form.footer_facebook,
          footer_tiktok: form.footer_tiktok,

          footer_address_line_1:
            form.footer_address_line_1,

          footer_address_line_2:
            form.footer_address_line_2,

          footer_address_line_3:
            form.footer_address_line_3,

          footer_location_link:
            form.footer_location_link,

          footer_phone: form.footer_phone,
          footer_whatsapp: form.footer_whatsapp,

          footer_visit_title:
            form.footer_visit_title,

          footer_contact_text:
            form.footer_contact_text,

          footer_bottom_text:
            form.footer_bottom_text,

          footer_bottom_tagline:
            form.footer_bottom_tagline,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      );

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء حفظ إعدادات الفوتر.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات الفوتر بنجاح ✅");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          جاري تحميل إعدادات الفوتر...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          الفوتر
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          التحكم في محتوى الفوتر وبيانات التواصل وروابط
          السوشيال ميديا.
        </p>
      </div>

      {/* Brand */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          معلومات BIOR
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            وصف BIOR
          </label>

          <textarea
            name="footer_description"
            value={form.footer_description}
            onChange={handleChange}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none transition focus:border-black"
          />
        </div>
      </div>

      {/* Social Media */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          السوشيال ميديا
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Instagram
            </label>

            <input
              type="url"
              name="footer_instagram"
              value={form.footer_instagram}
              onChange={handleChange}
              placeholder="https://www.instagram.com/..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Facebook
            </label>

            <input
              type="url"
              name="footer_facebook"
              value={form.footer_facebook}
              onChange={handleChange}
              placeholder="https://www.facebook.com/..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              TikTok
            </label>

            <input
              type="url"
              name="footer_tiktok"
              value={form.footer_tiktok}
              onChange={handleChange}
              placeholder="https://www.tiktok.com/@..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Branch */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          بيانات الفرع
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              عنوان القسم
            </label>

            <input
              type="text"
              name="footer_visit_title"
              value={form.footer_visit_title}
              onChange={handleChange}
              placeholder="زورينا في الفرع"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              سطر العنوان الأول
            </label>

            <input
              type="text"
              name="footer_address_line_1"
              value={form.footer_address_line_1}
              onChange={handleChange}
              placeholder="المنصورة - دكرنس"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              سطر العنوان الثاني
            </label>

            <input
              type="text"
              name="footer_address_line_2"
              value={form.footer_address_line_2}
              onChange={handleChange}
              placeholder="شارع المستشفى"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              سطر العنوان الثالث
            </label>

            <input
              type="text"
              name="footer_address_line_3"
              value={form.footer_address_line_3}
              onChange={handleChange}
              placeholder="بجوار سور المستشفى"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              رابط موقع الفرع على Google Maps
            </label>

            <input
              type="url"
              name="footer_location_link"
              value={form.footer_location_link}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />

            <p className="mt-2 text-xs text-gray-500">
              ضع رابط Google Maps الخاص بالفرع هنا.
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          بيانات التواصل
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              رقم الهاتف
            </label>

            <input
              type="text"
              name="footer_phone"
              value={form.footer_phone}
              onChange={handleChange}
              placeholder="01065587997"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              رقم واتساب
            </label>

            <input
              type="text"
              name="footer_whatsapp"
              value={form.footer_whatsapp}
              onChange={handleChange}
              placeholder="201065587997"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />

            <p className="mt-2 text-xs text-gray-500">
              اكتب رقم واتساب بصيغة دولية بدون علامة +.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Text */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          نصوص الفوتر
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              النص أسفل بيانات التواصل
            </label>

            <textarea
              name="footer_contact_text"
              value={form.footer_contact_text}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              نص الحقوق
            </label>

            <input
              type="text"
              name="footer_bottom_text"
              value={form.footer_bottom_text}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              النص الجانبي
            </label>

            <input
              type="text"
              name="footer_bottom_tagline"
              value={form.footer_bottom_tagline}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Message */}

      {message && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* Save */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

export default FooterAdmin;