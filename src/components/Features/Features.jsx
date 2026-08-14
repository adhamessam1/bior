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
      number: "01",
      title: "زورينا في الفرع",
      desc: "شاهدي المنتجات واختاري ما يناسبك من التشكيلة المتوفرة في الفرع.",
    },
    {
      icon: <FaTshirt />,
      number: "02",
      title: "تشكيلات متنوعة",
      desc: "شميز، هودي، تيشيرت، بنطلون، جيبة، سوت وأكثر.",
    },
    {
      icon: <FaMapMarkerAlt />,
      number: "03",
      title: "موقعنا في دكرنس",
      desc: "المنصورة - دكرنس، شارع المستشفى، بجوار سور المستشفى.",
    },
    {
      icon: <FaInstagram />,
      number: "04",
      title: "تابعينا على إنستجرام",
      desc: "تابعي أحدث المنتجات والتشكيلات الجديدة أولًا بأول.",
    },
  ];

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
                  {item.icon}
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