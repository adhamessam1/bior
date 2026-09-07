import { useEffect, useState } from "react";

import {
  FaStore,
  FaTshirt,
  FaMapMarkerAlt,
  FaInstagram,
  FaShoppingBag,
  FaStar,
  FaHeart,
  FaTruck,
  FaPhone,
  FaWhatsapp,
  FaTag,
} from "react-icons/fa";

import { supabase } from "../../lib/supabase";

const initialFeatures = [
  {
    number: "01",
    title: "زورينا في الفرع",
    desc: "شاهدي المنتجات واختاري ما يناسبك من التشكيلة المتوفرة في الفرع.",
    icon: "store",
  },
  {
    number: "02",
    title: "تشكيلات متنوعة",
    desc: "شميز، هودي، تيشيرت، بنطلون، جيبة، سوت وأكثر.",
    icon: "tshirt",
  },
  {
    number: "03",
    title: "موقعنا في دكرنس",
    desc: "المنصورة - دكرنس، شارع المستشفى، بجوار سور المستشفى.",
    icon: "location",
  },
  {
    number: "04",
    title: "تابعينا على إنستجرام",
    desc: "تابعي أحدث المنتجات والتشكيلات الجديدة أولًا بأول.",
    icon: "instagram",
  },
];

const iconOptions = [
  { value: "store", label: "متجر", icon: <FaStore /> },
  { value: "tshirt", label: "ملابس", icon: <FaTshirt /> },
  { value: "location", label: "موقع", icon: <FaMapMarkerAlt /> },
  { value: "instagram", label: "إنستجرام", icon: <FaInstagram /> },
  { value: "shopping", label: "تسوق", icon: <FaShoppingBag /> },
  { value: "star", label: "نجمة", icon: <FaStar /> },
  { value: "heart", label: "قلب", icon: <FaHeart /> },
  { value: "truck", label: "شحن", icon: <FaTruck /> },
  { value: "phone", label: "هاتف", icon: <FaPhone /> },
  { value: "whatsapp", label: "واتساب", icon: <FaWhatsapp /> },
  { value: "tag", label: "خصم / سعر", icon: <FaTag /> },
];

function FeaturesAdmin() {
  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    setLoading(true);
    setMessage("");

    const columns = [
      "feature_1_title",
      "feature_1_desc",
      "feature_1_icon",
      "feature_2_title",
      "feature_2_desc",
      "feature_2_icon",
      "feature_3_title",
      "feature_3_desc",
      "feature_3_icon",
      "feature_4_title",
      "feature_4_desc",
      "feature_4_icon",
    ].join(", ");

    const { data, error } = await supabase
      .from("site_settings")
      .select(columns)
      .eq("section", "home")
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء تحميل إعدادات المميزات.");
      setLoading(false);
      return;
    }

    if (data) {
      setFeatures(
        initialFeatures.map((feature, index) => ({
          ...feature,
          title:
            data[`feature_${index + 1}_title`] ||
            feature.title,
          desc:
            data[`feature_${index + 1}_desc`] ||
            feature.desc,
          icon:
            data[`feature_${index + 1}_icon`] ||
            feature.icon,
        }))
      );
    }

    setLoading(false);
  }

  function handleChange(index, field, value) {
    setFeatures((prev) =>
      prev.map((feature, featureIndex) =>
        featureIndex === index
          ? {
              ...feature,
              [field]: value,
            }
          : feature
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const payload = {
      section: "home",

      feature_1_title: features[0].title,
      feature_1_desc: features[0].desc,
      feature_1_icon: features[0].icon,

      feature_2_title: features[1].title,
      feature_2_desc: features[1].desc,
      feature_2_icon: features[1].icon,

      feature_3_title: features[2].title,
      feature_3_desc: features[2].desc,
      feature_3_icon: features[2].icon,

      feature_4_title: features[3].title,
      feature_4_desc: features[3].desc,
      feature_4_icon: features[3].icon,

      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(payload, {
        onConflict: "section",
      });

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء حفظ إعدادات المميزات.");
      setSaving(false);
      return;
    }

    setMessage("تم حفظ إعدادات المميزات بنجاح ✅");
    setSaving(false);
  }

  function getIcon(iconName) {
    const selected = iconOptions.find(
      (item) => item.value === iconName
    );

    return selected?.icon || <FaStore />;
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          جاري تحميل إعدادات المميزات...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          المميزات
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          التحكم في العناوين والأوصاف والأيقونات الخاصة بالمميزات
          الظاهرة في الصفحة الرئيسية.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-5">
        {features.map((feature, index) => (
          <div
            key={feature.number}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs tracking-[0.2em] text-gray-400">
                  {feature.number}
                </span>

                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  الميزة {index + 1}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700">
                {getIcon(feature.icon)}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  عنوان الميزة
                </label>

                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  الأيقونة
                </label>

                <select
                  value={feature.icon}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "icon",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                >
                  {iconOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  وصف الميزة
                </label>

                <textarea
                  value={feature.desc}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "desc",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none transition focus:border-black"
                />
              </div>
            </div>
          </div>
        ))}
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
          {saving
            ? "جاري الحفظ..."
            : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

export default FeaturesAdmin;