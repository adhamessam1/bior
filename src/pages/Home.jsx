import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import Footer from "../components/Footer/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showNew={showNew}
        setShowNew={setShowNew}
      />

      <Hero />

      <Features />

      <Categories
        setSearchTerm={setSearchTerm}
        setShowNew={setShowNew}
      />

      <Products
        searchTerm={searchTerm}
        showNew={showNew}
      />

      <Footer />
    </>
  );
}

export default Home;