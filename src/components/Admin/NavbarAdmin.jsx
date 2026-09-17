import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  navbar_logo: "",
  navbar_logo_alt: "BIOR",
  navbar_show_search: true,
  navbar_show_home: true,
  navbar_show_new: true,
};

function NavbarAdmin() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNavbarSettings();
  }, []);

  async function fetchNavbarSettings() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "navbar_logo, navbar_logo_alt, navbar_show_search, navbar_show_home, navbar_show_new"
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء تحميل إعدادات الـNavbar.");
      setLoading(false);
      return;
    }

    if (data) {
      setForm({
        navbar_logo: data.navbar_logo || "",
        navbar_logo_alt: data.navbar_logo_alt || "BIOR",
        navbar_show_search: data.navbar_show_search ?? true,
        navbar_show_home: data.navbar_show_home ?? true,
        navbar_show_new: data.navbar_show_new ?? true,
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleLogoUpload(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("من فضلك اختر صورة فقط.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("حجم اللوجو يجب ألا يتجاوز 5MB.");
      return;
    }

    setUploading(true);
    setMessage("");

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "png";

    const fileName = `bior-logo-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `navbar/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      setMessage("حدث خطأ أثناء رفع اللوجو.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    const publicUrl = data?.publicUrl || "";

    setForm((prev) => ({
      ...prev,
      navbar_logo: publicUrl,
    }));

    setMessage("تم رفع اللوجو بنجاح ✅");
    setUploading(false);
  }

  function removeLogo() {
    setForm((prev) => ({
      ...prev,
      navbar_logo: "",
    }));

    setMessage(
      "تم إزالة اللوجو المخصص. سيتم استخدام اللوجو الافتراضي."
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          section: "home",

          navbar_logo: form.navbar_logo,
          navbar_logo_alt: form.navbar_logo_alt,
          navbar_show_search: form.navbar_show_search,
          navbar_show_home: form.navbar_show_home,
          navbar_show_new: form.navbar_show_new,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      );

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء حفظ إعدادات الـNavbar.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات الـNavbar بنجاح ✅");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          جاري تحميل إعدادات الـNavbar...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          القائمة العلوية
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          التحكم في لوجو BIOR وروابط القائمة ومربع البحث.
        </p>
      </div>

      {/* Logo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          لوجو BIOR
        </h3>

        <div className="mb-5 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          {form.navbar_logo ? (
            <img
              src={form.navbar_logo}
              alt={form.navbar_logo_alt || "BIOR"}
              className="max-h-32 max-w-[220px] object-contain"
            />
          ) : (
            <img
              src="/logo/bior-logo.png"
              alt="BIOR"
              className="max-h-32 max-w-[220px] object-contain"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
            {uploading
              ? "جاري رفع اللوجو..."
              : form.navbar_logo
                ? "تغيير اللوجو"
                : "رفع لوجو جديد"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) =>
                handleLogoUpload(e.target.files?.[0])
              }
            />
          </label>

          {form.navbar_logo && (
            <button
              type="button"
              onClick={removeLogo}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              استخدام اللوجو الافتراضي
            </button>
          )}
        </div>
      </div>

      {/* Logo Alt */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          إعدادات اللوجو
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            النص البديل للصورة
          </label>

          <input
            type="text"
            name="navbar_logo_alt"
            value={form.navbar_logo_alt}
            onChange={handleChange}
            placeholder="BIOR"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            يستخدم لتحسين الوصول ومحركات البحث.
          </p>
        </div>
      </div>

      {/* Navbar Links */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          روابط القائمة
        </h3>

        <div className="space-y-3">
          {/* Home */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
            <div>
              <p className="font-medium text-gray-900">
                الرئيسية
              </p>

              <p className="mt-1 text-sm text-gray-500">
                إظهار أو إخفاء رابط الصفحة الرئيسية.
              </p>
            </div>

            <input
              type="checkbox"
              name="navbar_show_home"
              checked={form.navbar_show_home}
              onChange={handleChange}
              className="h-5 w-5 accent-black"
            />
          </label>

          {/* New */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
            <div>
              <p className="font-medium text-gray-900">
                الجديد
              </p>

              <p className="mt-1 text-sm text-gray-500">
                إظهار أو إخفاء رابط المنتجات الجديدة.
              </p>
            </div>

            <input
              type="checkbox"
              name="navbar_show_new"
              checked={form.navbar_show_new}
              onChange={handleChange}
              className="h-5 w-5 accent-black"
            />
          </label>

          {/* Categories */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium text-gray-900">
              الأقسام
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              الأقسام تظهر تلقائيًا من صفحة إدارة الأقسام.
              عند إخفاء قسم من CategoriesAdmin سيختفي تلقائيًا من الـNavbar.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">
          مربع البحث
        </h3>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
          <div>
            <p className="font-medium text-gray-900">
              إظهار مربع البحث
            </p>

            <p className="mt-1 text-sm text-gray-500">
              التحكم في ظهور البحث داخل الـNavbar.
            </p>
          </div>

          <input
            type="checkbox"
            name="navbar_show_search"
            checked={form.navbar_show_search}
            onChange={handleChange}
            className="h-5 w-5 accent-black"
          />
        </label>
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
          disabled={saving || uploading}
          className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

export default NavbarAdmin;