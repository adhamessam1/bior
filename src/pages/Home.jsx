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
          FOOTER
      ====================================== */}

      <Footer />
    </>
  );
}

export default Home;