import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

const initialSettings = {
  site_name: "",
  site_description: "",
  site_status: true,
  site_closed_message: "",
};

function SettingsAdmin() {
  const [settings, setSettings] = useState(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "site_name, site_description, site_status, site_closed_message"
      )
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error("Settings fetch error:", error);
      setMessage("حدث خطأ أثناء تحميل الإعدادات.");
      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        site_name: data.site_name || "",
        site_description: data.site_description || "",
        site_status: data.site_status ?? true,
        site_closed_message: data.site_closed_message || "",
      });
    }

    setLoading(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    setSettings((current) => ({
      ...current,
      site_status: event.target.checked,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          section: "home",
          site_name: settings.site_name.trim(),
          site_description:
            settings.site_description.trim(),
          site_status: settings.site_status,
          site_closed_message:
            settings.site_closed_message.trim(),
        },
        {
          onConflict: "section",
        }
      );

    if (error) {
      console.error("Settings save error:", error);
      setMessage("حدث خطأ أثناء حفظ الإعدادات.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات الموقع بنجاح.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          جاري تحميل الإعدادات...
        </p>
      </div>
    );
  }

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <span className="text-xs font-medium tracking-[0.25em] text-gray-400">
          BIOR SETTINGS
        </span>

        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          إعدادات الموقع
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          التحكم في الإعدادات العامة لموقع BIOR.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SITE NAME */}

        <div>
          <label
            htmlFor="site_name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            اسم الموقع
          </label>

          <input
            id="site_name"
            name="site_name"
            type="text"
            value={settings.site_name}
            onChange={handleChange}
            placeholder="BIOR"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* SITE DESCRIPTION */}

        <div>
          <label
            htmlFor="site_description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            وصف الموقع
          </label>

          <textarea
            id="site_description"
            name="site_description"
            value={settings.site_description}
            onChange={handleChange}
            rows={4}
            placeholder="وصف مختصر عن متجر BIOR..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* SITE STATUS */}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                حالة الموقع
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                تقدر من هنا تحدد هل الموقع يعمل بشكل طبيعي أم
                متوقف مؤقتًا.
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.site_status}
                onChange={handleStatusChange}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-black after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />

              <span className="mr-3 text-sm font-medium text-gray-700">
                {settings.site_status
                  ? "الموقع يعمل"
                  : "الموقع متوقف"}
              </span>
            </label>
          </div>
        </div>

        {/* CLOSED MESSAGE */}

        {!settings.site_status && (
          <div>
            <label
              htmlFor="site_closed_message"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              رسالة إيقاف الموقع
            </label>

            <textarea
              id="site_closed_message"
              name="site_closed_message"
              value={settings.site_closed_message}
              onChange={handleChange}
              rows={3}
              placeholder="الموقع متوقف مؤقتًا، يرجى المحاولة مرة أخرى لاحقًا."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>
        )}

        {/* MESSAGE */}

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

        {/* SAVE */}

        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "جاري الحفظ..."
              : "حفظ الإعدادات"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SettingsAdmin;