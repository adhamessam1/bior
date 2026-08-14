import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/bior/hero/hero-1.jpg",
    "/bior/hero/hero-2.jpg",
    "/bior/hero/hero-3.jpg",
    "/bior/hero/hero-4.jpg",
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // الانتقال للصورة التالية
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // الانتقال للصورة السابقة
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  // تشغيل الـ Slider تلقائيًا
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="bg-[#f6f3ef]">
      <div className="relative overflow-hidden">

        {/* Hero Slider */}
        <div className="relative min-h-[560px] sm:min-h-[650px] lg:min-h-[720px]">

          {/* Current Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide]}
              alt={`BIOR Fashion ${currentSlide + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Soft Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f3ef]/95 via-[#f6f3ef]/65 to-transparent" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 sm:min-h-[650px] sm:px-10 lg:min-h-[720px] lg:px-12"
          >
            <div className="max-w-xl text-right">

              <p className="mb-5 text-sm font-medium tracking-[0.25em] text-gray-600">
                BIOR FASHION STORE
              </p>

              <h1 className="text-6xl font-light leading-none tracking-tight text-black sm:text-7xl lg:text-8xl">
                Bior
              </h1>

              <h2 className="mt-5 text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">
                ستايلك.. بطريقتك
              </h2>

              <p className="mt-5 max-w-md text-base leading-8 text-gray-600 sm:text-lg">
                اكتشفي أحدث تشكيلات الملابس الحريمي بتصميمات أنيقة
                وتفاصيل صنعت علشان تكمّل ستايلك.
              </p>

              {/* Showcase Buttons */}
              <div className="mt-8 flex flex-wrap justify-end gap-3">

                <button
                  type="button"
                  onClick={() => scrollToSection("categories")}
                  className="rounded-none bg-black px-9 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  اكتشفي الأقسام
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("products")}
                  className="rounded-none border border-black bg-white/70 px-9 py-4 text-sm font-medium text-black backdrop-blur-sm transition hover:bg-black hover:text-white"
                >
                  تصفحي المنتجات
                </button>

              </div>
            </div>
          </motion.div>

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="الصورة السابقة"
            className="absolute left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-md transition hover:bg-black hover:text-white sm:left-8"
          >
            ←
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="الصورة التالية"
            className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-md transition hover:bg-black hover:text-white sm:right-8"
          >
            →
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`عرض الصورة ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-7 bg-black"
                    : "w-2.5 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;