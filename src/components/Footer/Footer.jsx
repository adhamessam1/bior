import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-4xl font-bold tracking-wider">
            BIOR
          </h2>

          <p className="mt-5 max-w-sm leading-8 text-gray-400">
            أزياء حريمي أنيقة بتشكيلات مميزة تناسب كل إطلالة.
          </p>

          {/* Social Media */}
          <div className="mt-7 flex gap-3">

            <a
              href="https://www.instagram.com/bior_fashoin.11/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 text-lg transition hover:border-white hover:bg-white hover:text-black"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com/share/194MwxL1AV/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 text-lg transition hover:border-white hover:bg-white hover:text-black"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.tiktok.com/@bior_fashoin.11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 text-lg transition hover:border-white hover:bg-white hover:text-black"
            >
              <FaTiktok />
            </a>

          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">
            الأقسام
          </h3>

          <ul className="grid grid-cols-2 gap-y-4 text-sm text-gray-400">
            <li>شميز</li>
            <li>هودي</li>
            <li>تيشيرت</li>
            <li>بنطلون</li>
            <li>جيبة</li>
            <li>سوت</li>
            <li>توب</li>
            <li>بلوز</li>
            <li>جاكت</li>
          </ul>
        </div>

        {/* Store & Contact */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">
            زورينا في الفرع
          </h3>

          {/* Address */}
          <div className="flex items-start gap-3 text-gray-400">
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
          <div className="mt-6 flex flex-col gap-3">

            <a
              href="tel:01065587997"
              className="flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-gray-200"
            >
              <FaPhoneAlt />
              اتصلي بنا
            </a>

            <a
              href="https://wa.me/201065587997"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
            >
              <FaWhatsapp />
              تواصلي معنا على واتساب
            </a>

          </div>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            تصفحي تشكيلتنا أونلاين
            <br />
            وزورينا في الفرع لاختيار ما يناسبك.
          </p>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © 2026 BIOR. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

export default Footer;