import { motion } from "framer-motion";

function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section id="hero" className="bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <span className="inline-block text-sm font-semibold tracking-[0.2em] text-green-600">
              التشكيلة الجديدة
            </span>

            <h1 className="mt-5 text-5xl font-bold leading-[1.15] text-gray-900 sm:text-6xl lg:text-7xl">
              اكتشفي
              <br />
              <span className="text-gray-800">ستايلك الخاص</span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-gray-500 sm:text-lg lg:mx-0">
              اكتشفي أحدث تشكيلات الملابس الحريمي بتصميمات أنيقة،
              جودة مميزة، وأسعار تناسبك.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => scrollToSection("products")}
                className="rounded-xl bg-black px-8 py-4 font-medium text-white transition hover:bg-gray-800"
              >
                تصفحي المنتجات
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("categories")}
                className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-medium text-gray-900 transition hover:border-black hover:bg-black hover:text-white"
              >
                اكتشفي الأقسام
              </button>
            </div>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mx-auto w-full max-w-[430px] lg:mr-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="mb-4 text-5xl">✦</div>

                  <h2 className="text-2xl font-semibold tracking-widest">
                    BIOR
                  </h2>

                  <p className="mt-2 text-sm">
                    الصورة هنضيفها لاحقًا
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;