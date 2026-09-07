import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/+$/, "");

const fallbackSettings = {
  hero_title: "ستايلك.. بطريقتك",
  hero_subtitle:
    "اكتشفي أحدث تشكيلات الملابس الحريمي بتصميمات أنيقة وتفاصيل صنعت علشان تكمّل ستايلك.",
  hero_button_text: "اكتشفي الأقسام",
  hero_button_link: "#categories",

  hero_image_1: "",
  hero_image_2: "",
  hero_image_3: "",
  hero_image_4: "",
};

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState(fallbackSettings);

  const fallbackSlides = [
    `${BASE_URL}/hero/hero-1.jpg`,
    `${BASE_URL}/hero/hero-2.jpg`,
    `${BASE_URL}/hero/hero-3.jpg`,
    `${BASE_URL}/hero/hero-4.jpg`,
  ];

  const slides = [
    settings.hero_image_1?.trim() || fallbackSlides[0],
    settings.hero_image_2?.trim() || fallbackSlides[1],
    settings.hero_image_3?.trim() || fallbackSlides[2],
    settings.hero_image_4?.trim() || fallbackSlides[3],
  ];

  useEffect(() => {
    const fetchHeroSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "hero_title, hero_subtitle, hero_button_text, hero_button_link, hero_image_1, hero_image_2, hero_image_3, hero_image_4"
        )
        .eq("section", "home")
        .maybeSingle();

      if (error) {
        console.error("Hero settings fetch error:", error);
        return;
      }

      if (data) {
        setSettings({
          hero_title:
            data.hero_title || fallbackSettings.hero_title,

          hero_subtitle:
            data.hero_subtitle ||
            fallbackSettings.hero_subtitle,

          hero_button_text:
            data.hero_button_text ||
            fallbackSettings.hero_button_text,

          hero_button_link:
            data.hero_button_link ||
            fallbackSettings.hero_button_link,

          hero_image_1: data.hero_image_1 || "",
          hero_image_2: data.hero_image_2 || "",
          hero_image_3: data.hero_image_3 || "",
          hero_image_4: data.hero_image_4 || "",
        });
      }
    };

    fetchHeroSettings();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleHeroButton = () => {
    const link = settings.hero_button_link?.trim();

    if (!link) {
      scrollToSection("categories");
      return;
    }

    if (link.startsWith("#")) {
      scrollToSection(link.substring(1));
      return;
    }

    if (
      link.startsWith("http://") ||
      link.startsWith("https://")
    ) {
      window.location.href = link;
      return;
    }

    if (link.startsWith("/")) {
      window.location.href = link;
      return;
    }

    window.location.href = `${BASE_URL}/${link.replace(/^\/+/, "")}`;
  };

  const openProducts = () => {
    window.location.href = `${BASE_URL}/products`;
  };

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="bg-[#f6f3ef]">
      <div className="relative overflow-hidden">
        <div className="relative min-h-[560px] sm:min-h-[650px] lg:min-h-[720px]">
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

          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f3ef]/95 via-[#f6f3ef]/65 to-transparent" />

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
                {settings.hero_title}
              </h2>

              <p className="mt-5 max-w-md text-base leading-8 text-gray-600 sm:text-lg">
                {settings.hero_subtitle}
              </p>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleHeroButton}
                  className="rounded-none bg-black px-9 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  {settings.hero_button_text}
                </button>

                <button
                  type="button"
                  onClick={openProducts}
                  className="rounded-none border border-black bg-white/70 px-9 py-4 text-sm font-medium text-black backdrop-blur-sm transition hover:bg-black hover:text-white"
                >
                  تصفحي المنتجات
                </button>
              </div>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={prevSlide}
            aria-label="الصورة السابقة"
            className="absolute left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-md transition hover:bg-black hover:text-white sm:left-8"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="الصورة التالية"
            className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-md transition hover:bg-black hover:text-white sm:right-8"
          >
            →
          </button>

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