import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

const initialSettings = {
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  seo_og_image: "",
};

function SEOAdmin() {
  const [settings, setSettings] = useState(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "seo_title, seo_description, seo_keywords, seo_og_image"
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error("SEO settings fetch error:", error);
      setMessage("حدث خطأ أثناء تحميل إعدادات SEO.");
      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: data.seo_keywords || "",
        seo_og_image: data.seo_og_image || "",
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOGImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage("حجم الصورة يجب ألا يتجاوز 5MB.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("من فضلك اختر ملف صورة فقط.");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `seo-og-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExtension}`;

      const filePath = `seo/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "SEO OG image upload error:",
          uploadError
        );

        setMessage("حدث خطأ أثناء رفع صورة المشاركة.");
        setUploadingImage(false);
        e.target.value = "";
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        setMessage("تعذر الحصول على رابط الصورة.");
        setUploadingImage(false);
        e.target.value = "";
        return;
      }

      setSettings((prev) => ({
        ...prev,
        seo_og_image: data.publicUrl,
      }));

      setMessage("تم رفع صورة المشاركة بنجاح.");
    } catch (error) {
      console.error("SEO OG image error:", error);
      setMessage("حدث خطأ أثناء رفع صورة المشاركة.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveOGImage = () => {
    setSettings((prev) => ({
      ...prev,
      seo_og_image: "",
    }));

    setMessage("تم إزالة صورة المشاركة. اضغط حفظ لتأكيد التغيير.");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          section: "home",
          seo_title: settings.seo_title.trim(),
          seo_description: settings.seo_description.trim(),
          seo_keywords: settings.seo_keywords.trim(),
          seo_og_image: settings.seo_og_image.trim(),
        },
        {
          onConflict: "section",
        }
      );

    if (error) {
      console.error("SEO settings save error:", error);
      setMessage("حدث خطأ أثناء حفظ إعدادات SEO.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات SEO بنجاح.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          جاري تحميل إعدادات SEO...
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <span className="text-xs font-medium tracking-[0.25em] text-gray-400">
          BIOR SEO
        </span>

        <h2 className="mt-3 text-xl font-bold text-gray-900">
          SEO
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          تحسين ظهور موقع BIOR في محركات البحث والمشاركة على
          مواقع التواصل.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO Title */}
        <div>
          <label
            htmlFor="seo_title"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            عنوان الموقع في محركات البحث
          </label>

          <input
            id="seo_title"
            name="seo_title"
            type="text"
            value={settings.seo_title}
            onChange={handleChange}
            placeholder="BIOR | ملابس حريمي"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            العنوان الذي يمكن أن يظهر في نتائج Google.
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <label
            htmlFor="seo_description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            وصف الموقع
          </label>

          <textarea
            id="seo_description"
            name="seo_description"
            value={settings.seo_description}
            onChange={handleChange}
            rows={4}
            placeholder="اكتشف أحدث موديلات الملابس الحريمي من BIOR..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            وصف مختصر يساعد محركات البحث على فهم محتوى الموقع.
          </p>
        </div>

        {/* SEO Keywords */}
        <div>
          <label
            htmlFor="seo_keywords"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            الكلمات المفتاحية
          </label>

          <input
            id="seo_keywords"
            name="seo_keywords"
            type="text"
            value={settings.seo_keywords}
            onChange={handleChange}
            placeholder="ملابس حريمي, BIOR, ملابس نسائية, المنصورة"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            افصل بين الكلمات باستخدام الفاصلة.
          </p>
        </div>

        {/* OG Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            صورة المشاركة
          </label>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            {settings.seo_og_image ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img
                    src={settings.seo_og_image}
                    alt="SEO OG Preview"
                    className="h-56 w-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <label className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                    {uploadingImage
                      ? "جاري الرفع..."
                      : "تغيير الصورة"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOGImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleRemoveOGImage}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    إزالة الصورة
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center transition hover:border-gray-500">
                <span className="text-sm font-semibold text-gray-700">
                  {uploadingImage
                    ? "جاري رفع الصورة..."
                    : "اختيار صورة من الجهاز"}
                </span>

                <span className="mt-2 text-xs text-gray-400">
                  PNG / JPG / WEBP — الحد الأقصى 5MB
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOGImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            الصورة التي تظهر عند مشاركة رابط موقع BIOR على
            Facebook وWhatsApp وغيرها.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.includes("بنجاح")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "جاري الحفظ..."
              : "حفظ إعدادات SEO"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SEOAdmin;