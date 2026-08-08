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
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-7 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="text-4xl text-green-600 flex justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-2 leading-7 text-sm sm:text-base">
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