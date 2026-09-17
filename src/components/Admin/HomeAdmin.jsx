import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  hero_title: "",
  hero_subtitle: "",
  hero_button_text: "",
  hero_button_link: "",
  hero_image_1: "",
  hero_image_2: "",
  hero_image_3: "",
  hero_image_4: "",
};

function HomeAdmin() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchHomeSettings();
  }, []);

  async function fetchHomeSettings() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "hero_title, hero_subtitle, hero_button_text, hero_button_link, hero_image_1, hero_image_2, hero_image_3, hero_image_4"
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء تحميل إعدادات الصفحة الرئيسية.");
      setLoading(false);
      return;
    }

    if (data) {
      setForm({
        hero_title: data.hero_title || "",
        hero_subtitle: data.hero_subtitle || "",
        hero_button_text: data.hero_button_text || "",
        hero_button_link: data.hero_button_link || "",
        hero_image_1: data.hero_image_1 || "",
        hero_image_2: data.hero_image_2 || "",
        hero_image_3: data.hero_image_3 || "",
        hero_image_4: data.hero_image_4 || "",
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

  async function handleImageUpload(index, file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("من فضلك اختر صورة فقط.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("حجم الصورة يجب ألا يتجاوز 5MB.");
      return;
    }

    setUploadingImage(index);
    setMessage("");

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `hero-${index}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `home/hero/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      setMessage("حدث خطأ أثناء رفع الصورة.");
      setUploadingImage(null);
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    const publicUrl = data?.publicUrl || "";

    setForm((prev) => ({
      ...prev,
      [`hero_image_${index}`]: publicUrl,
    }));

    setMessage(`تم رفع الصورة ${index} بنجاح.`);
    setUploadingImage(null);
  }

  function removeImage(index) {
    setForm((prev) => ({
      ...prev,
      [`hero_image_${index}`]: "",
    }));

    setMessage(`تم إزالة الصورة ${index} من الإعدادات.`);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          section: "home",

          hero_title: form.hero_title,
          hero_subtitle: form.hero_subtitle,
          hero_button_text: form.hero_button_text,
          hero_button_link: form.hero_button_link,

          hero_image_1: form.hero_image_1,
          hero_image_2: form.hero_image_2,
          hero_image_3: form.hero_image_3,
          hero_image_4: form.hero_image_4,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      );

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء حفظ الإعدادات.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات الصفحة الرئيسية بنجاح ✅");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">جاري تحميل إعدادات الصفحة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          الصفحة الرئيسية
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          التحكم في محتوى الـ Hero والصور الظاهرة في الصفحة الرئيسية.
        </p>
      </div>

      {/* Hero Text */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          محتوى الـ Hero
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              العنوان الرئيسي
            </label>

            <input
              type="text"
              name="hero_title"
              value={form.hero_title}
              onChange={handleChange}
              placeholder="مثال: BIOR"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              العنوان الفرعي
            </label>

            <input
              type="text"
              name="hero_subtitle"
              value={form.hero_subtitle}
              onChange={handleChange}
              placeholder="مثال: ستايلك.. بطريقتك"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              نص الزر
            </label>

            <input
              type="text"
              name="hero_button_text"
              value={form.hero_button_text}
              onChange={handleChange}
              placeholder="مثال: اكتشفي الأقسام"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              رابط الزر
            </label>

            <input
              type="text"
              name="hero_button_link"
              value={form.hero_button_link}
              onChange={handleChange}
              placeholder="/bior/products"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Hero Images */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            صور الـ Hero
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            يمكنك رفع 4 صور للسلايدر من جهازك. الحد الأقصى للصورة 5MB.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((index) => {
            const image = form[`hero_image_${index}`];

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <h4 className="mb-3 font-semibold text-gray-800">
                  الصورة {index}
                </h4>

                {image ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={image}
                      alt={`Hero ${index}`}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    لا توجد صورة
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
                    {uploadingImage === index
                      ? "جاري الرفع..."
                      : image
                        ? "تغيير الصورة"
                        : "رفع صورة"}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage === index}
                      onChange={(e) =>
                        handleImageUpload(index, e.target.files?.[0])
                      }
                    />
                  </label>

                  {image && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      إزالة
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
          disabled={saving || uploadingImage !== null}
          className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

export default HomeAdmin;