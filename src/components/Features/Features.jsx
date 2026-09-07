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

const fallbackFeatures = [
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

function getIcon(iconName) {
  const icons = {
    store: <FaStore />,
    tshirt: <FaTshirt />,
    location: <FaMapMarkerAlt />,
    instagram: <FaInstagram />,
    shopping: <FaShoppingBag />,
    star: <FaStar />,
    heart: <FaHeart />,
    truck: <FaTruck />,
    phone: <FaPhone />,
    whatsapp: <FaWhatsapp />,
    tag: <FaTag />,
  };

  return icons[iconName] || <FaStore />;
}

function Features() {
  const [features, setFeatures] = useState(fallbackFeatures);

  useEffect(() => {
    const fetchFeatures = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          `
          feature_1_title,
          feature_1_desc,
          feature_1_icon,
          feature_2_title,
          feature_2_desc,
          feature_2_icon,
          feature_3_title,
          feature_3_desc,
          feature_3_icon,
          feature_4_title,
          feature_4_desc,
          feature_4_icon
          `
        )
        .eq("section", "home")
        .maybeSingle();

      if (error) {
        console.error("Features settings fetch error:", error);
        return;
      }

      if (!data) {
        return;
      }

      const updatedFeatures = fallbackFeatures.map(
        (feature, index) => {
          const number = index + 1;

          return {
            ...feature,
            title:
              data[`feature_${number}_title`] ||
              feature.title,
            desc:
              data[`feature_${number}_desc`] ||
              feature.desc,
            icon:
              data[`feature_${number}_icon`] ||
              feature.icon,
          };
        }
      );

      setFeatures(updatedFeatures);
    };

    fetchFeatures();
  }, []);

  return (
    <section className="bg-[#f6f3ef]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Features Grid */}

        <div className="grid grid-cols-1 border-x border-gray-300 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((item, index) => (
            <div
              key={item.number}
              className={`group relative min-h-[230px] border-b border-gray-300 p-7 text-right transition-colors duration-500 hover:bg-black sm:p-8 lg:min-h-[260px] ${
                index !== features.length - 1
                  ? "lg:border-l"
                  : ""
              } ${
                index === 0
                  ? "sm:border-l lg:border-l"
                  : ""
              }`}
            >

              {/* Number */}

              <div className="flex items-start justify-between">
                <span className="text-xs tracking-[0.2em] text-gray-400 transition-colors duration-500 group-hover:text-gray-500">
                  {item.number}
                </span>

                {/* Icon */}

                <span className="text-lg text-gray-500 transition-colors duration-500 group-hover:text-white">
                  {getIcon(item.icon)}
                </span>
              </div>

              {/* Content */}

              <div className="mt-16">
                <h3 className="text-xl font-medium text-gray-900 transition-colors duration-500 group-hover:text-white sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-500 transition-colors duration-500 group-hover:text-gray-400">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Arrow */}

              <span className="absolute bottom-7 left-7 text-lg font-light text-gray-300 transition-all duration-500 group-hover:-translate-x-1 group-hover:text-white">
                ←
              </span>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;