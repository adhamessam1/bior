import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import Footer from "../components/Footer/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [showNew, setShowNew] = useState(false);

  // ==========================================
  // اختيار قسم
  // ==========================================
  const handleCategoryChange = (category) => {
    setCategoryId(Number(category.id));
    setSearchTerm("");
    setShowNew(false);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ==========================================
  // الجديد
  // ==========================================
  const handleShowNew = () => {
    setCategoryId(null);
    setSearchTerm("");
    setShowNew(true);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ==========================================
  // الرئيسية
  // ==========================================
  const handleHome = () => {
    setCategoryId(null);
    setSearchTerm("");
    setShowNew(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ======================================
          NAVBAR
      ====================================== */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showNew={showNew}
        setShowNew={setShowNew}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        onCategoryChange={handleCategoryChange}
        onShowNew={handleShowNew}
        onHome={handleHome}
      />

      {/* ======================================
          HERO
      ====================================== */}
      <Hero />

      {/* ======================================
          FEATURES
      ====================================== */}
      <Features />

      {/* ======================================
          CATEGORIES
      ====================================== */}
      <Categories
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        showNew={showNew}
        setShowNew={setShowNew}
        onCategoryChange={handleCategoryChange}
        onShowNew={handleShowNew}
      />

      {/* ======================================
          PRODUCTS
      ====================================== */}
      <Products
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        showNew={showNew}
        setShowNew={setShowNew}
      />

      {/* ======================================
          SEO INTRO
      ====================================== */}
      <section
        dir="rtl"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl bg-gray-50 px-6 py-8 text-center sm:px-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            BIOR – بيور | ملابس حريمي في المنصورة
          </h2>

          <p className="mx-auto max-w-4xl text-base leading-8 text-gray-600">
            BIOR (بيور) هو براند ملابس حريمي في المنصورة، يقدم مجموعة متنوعة
                       . من الملابس النسائية العصرية. 
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-base leading-8 text-gray-600">
            يمكنك تصفح المنتجات والتعرف على أحدث التشكيلات المتوفرة من BIOR،
            ثم زيارة الفرع في دكرنس المنصورة لمشاهدة المنتجات المتاحة.
          </p>
        </div>
      </section>

      {/* ======================================
          FOOTER
      ====================================== */}
      <Footer />
    </>
  );
}

export default Home;