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
    <footer className="bg-black text-white mt-20">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-4xl font-bold">BIOR</h2>

          <p className="text-gray-400 mt-4 leading-7">
            أزياء حريمي أنيقة بتشكيلات مميزة تناسب كل إطلالة.
          </p>

          {/* Social Media */}
          <div className="flex gap-4 mt-6 text-xl">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/bior_fashoin.11/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-400 transition"
            >
              <FaInstagram />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/194MwxL1AV/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gray-400 transition"
            >
              <FaFacebookF />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@bior_fashoin.11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-gray-400 transition"
            >
              <FaTiktok />
            </a>

          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-xl mb-4">
            الأقسام
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>هودي</li>
            <li>تيشيرت</li>
            <li>بنطلون</li>
            <li>جيبة</li>
            <li>سوت</li>
            <li>توب</li>
            <li>بلوزة</li>
            <li>جاكت</li>
          </ul>
        </div>

        {/* Store & Contact */}
        <div>
          <h3 className="font-bold text-xl mb-4">
            زورينا في الفرع
          </h3>

          <div className="text-gray-400">

            {/* Address */}
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0" />

              <p className="leading-7">
                المنصورة - دكرنس
                <br />
                شارع المستشفى
                <br />
                بجوار سور المستشفى
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col gap-3 mt-6">

              {/* Call */}
              <a
                href="tel:01065587997"
                className="flex items-center justify-center gap-3 bg-white text-black py-3 px-5 rounded-lg hover:bg-gray-200 transition"
              >
                <FaPhoneAlt />
                اتصلي بنا
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201065587997"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-5 rounded-lg hover:bg-green-700 transition"
              >
                <FaWhatsapp />
                تواصلي معنا على واتساب
              </a>

            </div>

            <p className="mt-5 leading-7">
              تصفحي تشكيلتنا أونلاين
              <br />
              وزورينا في الفرع لاختيار ما يناسبك.
            </p>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 py-5 text-center text-gray-500">
        © 2026 BIOR. جميع الحقوق محفوظة.
      </div>

    </footer>
  );
}

export default Footer;