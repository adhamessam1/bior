import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import Footer from "../components/Footer/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Hero />

      <Features />

     <Categories setSearchTerm={setSearchTerm} />

      <Products
        searchTerm={searchTerm}
      />

      <Footer />
    </>
  );
}

export default Home;