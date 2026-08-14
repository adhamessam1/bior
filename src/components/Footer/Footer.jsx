import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  const categories = [
    "شميز",
    "هودي",
    "تيشيرت",
    "بنطلون",
    "جيبة",
    "سوت",
    "توب",
    "بلوز",
    "جاكت",
  ];

  return (
    <footer className="bg-[#111111] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          {/* Brand */}
          <div className="lg:col-span-5">

            <p className="text-xs tracking-[0.3em] text-gray-500">
              BIOR FASHION STORE
            </p>

            <h2 className="mt-5 text-6xl font-light tracking-tight sm:text-7xl">
              BIOR
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-gray-400 sm:text-base">
              مساحة لعرض تشكيلات BIOR من الأزياء الحريمي،
              بتصميمات مختارة وتفاصيل تناسب ستايلك.
            </p>

            {/* Social */}
            <div className="mt-9 flex gap-3">

              <a
                href="https://www.instagram.com/bior_fashoin.11/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/share/194MwxL1AV/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.tiktok.com/@bior_fashoin.11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center border border-gray-700 text-sm transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaTiktok />
              </a>

            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-3">

            <p className="text-xs tracking-[0.3em] text-gray-500">
              COLLECTIONS
            </p>

            <h3 className="mt-5 text-xl font-medium">
              الأقسام
            </h3>

            <div className="mt-7 grid grid-cols-2 gap-y-4 text-sm text-gray-400">
              {categories.map((category) => (
                <span
                  key={category}
                  className="transition-colors hover:text-white"
                >
                  {category}
                </span>
              ))}
            </div>

          </div>

          {/* Store */}
          <div className="lg:col-span-4">

            <p className="text-xs tracking-[0.3em] text-gray-500">
              VISIT BIOR
            </p>

            <h3 className="mt-5 text-xl font-medium">
              زورينا في الفرع
            </h3>

            <div className="mt-7 flex items-start gap-4 text-sm text-gray-400">

              <FaMapMarkerAlt className="mt-1 shrink-0 text-white" />

              <p className="leading-7">
                المنصورة - دكرنس
                <br />
                شارع المستشفى
                <br />
                بجوار سور المستشفى
              </p>

            </div>

            {/* Contact */}
            <div className="mt-8 flex flex-col gap-3">

              <a
                href="tel:01065587997"
                className="flex items-center justify-center gap-3 border border-gray-700 px-5 py-3 text-sm font-medium transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaPhoneAlt />
                اتصلي بنا
              </a>

              <a
                href="https://wa.me/201065587997"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
              >
                <FaWhatsapp />
                تواصلي معنا على واتساب
              </a>

            </div>

            <p className="mt-6 text-xs leading-7 text-gray-500">
              الموقع مخصص لاستعراض تشكيلات BIOR.
              <br />
              لزيارة الفرع والتعرف على المنتجات، تواصلي معنا.
            </p>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-center text-xs text-gray-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between sm:text-right lg:px-10">

          <span>
            © 2026 BIOR. جميع الحقوق محفوظة.
          </span>

          <span>
            FASHION • STYLE • BIOR
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;