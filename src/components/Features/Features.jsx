import {
  FaStore,
  FaTshirt,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaStore />,
      title: "زورينا في الفرع",
      desc: "شاهدي المنتجات واختاري ما يناسبك من الفرع.",
    },
    {
      icon: <FaTshirt />,
      title: "تشكيلات متنوعة",
      desc: "شميز، هودي، تيشيرت، بنطلون، جيبة وأكثر.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "موقعنا في دكرنس",
      desc: "المنصورة - دكرنس، شارع المستشفى، بجوار سور المستشفى.",
    },
    {
      icon: <FaInstagram />,
      title: "تابعينا على إنستجرام",
      desc: "تابعي أحدث المنتجات والتشكيلات الجديدة.",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-xl text-gray-900 transition duration-300 group-hover:bg-black group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;