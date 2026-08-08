import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="bg-[#f8f8f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl text-center lg:text-right"
        >
          <span className="text-green-600 font-semibold tracking-widest text-sm">
            التشكيلة الجديدة
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight text-gray-900">
            اكتشفي
            <br />
            ستايلك الخاص
          </h1>

          <p className="text-gray-600 mt-6 text-base sm:text-lg leading-8 max-w-lg mx-auto lg:mr-0">
            اكتشفي أحدث تشكيلات الملابس الحريمي بتصميمات أنيقة،
            جودة مميزة، وأسعار تناسبك.
          </p>

          <div className="flex gap-4 mt-10">
  <button
    type="button"
    className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition"
  >
    تصفحي المنتجات
  </button>

  <button
    type="button"
    className="border border-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition"
  >
    اكتشفي الأقسام
  </button>
</div>
        </motion.div>

        {/* Hero Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[380px] sm:max-w-[420px]"
        >
          <div className="w-full aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-300 rounded-[32px] sm:rounded-[40px] shadow-2xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-4">✦</div>

              <h2 className="text-2xl font-semibold">
                BIOR
              </h2>

              <p className="mt-2 text-sm">
                الصورة هنضيفها لاحقًا
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;