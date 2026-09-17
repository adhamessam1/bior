import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

function NavLinks({
  searchTerm,
  setSearchTerm,
  showNew,
  setShowNew,
  categoryId,
  setCategoryId,
  onCategoryChange,
  onShowNew,
  onHome,
}) {
  const [categories, setCategories] = useState([]);

  const [navbarSettings, setNavbarSettings] = useState({
    navbar_show_home: true,
    navbar_show_new: true,
  });

  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, sort_order, is_visible")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("Nav categories fetch error:", error);
        setCategories([]);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  // =========================
  // FETCH NAVBAR SETTINGS
  // =========================

  useEffect(() => {
    const fetchNavbarSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("navbar_show_home, navbar_show_new")
        .eq("section", "home")
        .maybeSingle();

      if (error) {
        console.error("Navbar visibility fetch error:", error);
        return;
      }

      if (data) {
        setNavbarSettings({
          navbar_show_home: data.navbar_show_home ?? true,
          navbar_show_new: data.navbar_show_new ?? true,
        });
      }
    };

    fetchNavbarSettings();
  }, []);

  // =========================
  // SCROLL TO PRODUCTS
  // =========================

  const scrollToProducts = () => {
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // =========================
  // HOME
  // =========================

  const handleHome = () => {
    setSearchTerm("");
    setShowNew(false);
    setCategoryId?.(null);

    if (onHome) {
      onHome();
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // NEW
  // =========================

  const handleNew = () => {
    setSearchTerm("");
    setShowNew(true);
    setCategoryId?.(null);

    if (onShowNew) {
      onShowNew();
      return;
    }

    scrollToProducts();
  };

  // =========================
  // CATEGORY
  // =========================

  const handleCategoryClick = (category) => {
    setSearchTerm("");
    setShowNew(false);
    setCategoryId?.(category.id);

    if (onCategoryChange) {
      onCategoryChange(category);
      return;
    }

    scrollToProducts();
  };

  // =========================
  // ACTIVE CATEGORY
  // =========================

  const isCategoryActive = (id) => {
    return !showNew && Number(categoryId) === Number(id);
  };

  const isHomeActive = !showNew && !categoryId && !searchTerm;

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="w-full overflow-x-auto overscroll-x-contain scrollbar-hide">
          <ul className="flex w-max min-w-full items-center justify-start gap-6 px-5 py-4 sm:justify-center sm:gap-9 sm:px-8 lg:gap-10 lg:px-10">

            {/* الرئيسية */}

            {navbarSettings.navbar_show_home && (
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={handleHome}
                  className={`group relative whitespace-nowrap pb-1 text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${
                    isHomeActive
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  الرئيسية

                  <span
                    className={`absolute bottom-0 right-0 h-px bg-black transition-all duration-300 ${
                      isHomeActive
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            )}

            {/* الجديد */}

            {navbarSettings.navbar_show_new && (
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={handleNew}
                  className={`group relative whitespace-nowrap pb-1 text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${
                    showNew
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  الجديد

                  <span
                    className={`absolute bottom-0 right-0 h-px bg-black transition-all duration-300 ${
                      showNew
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            )}

            {/* الأقسام من Supabase */}

            {categories.map((category) => {
              const active = isCategoryActive(category.id);

              return (
                <li
                  key={category.id}
                  className="shrink-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryClick(category)
                    }
                    className={`group relative whitespace-nowrap pb-1 text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${
                      active
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {category.name}

                    <span
                      className={`absolute bottom-0 right-0 h-px bg-black transition-all duration-300 ${
                        active
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavLinks;