import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import SearchBox from "./SearchBox";
import defaultLogo from "../../assets/logo/bior-logo.png";

function MainHeader({ searchTerm, setSearchTerm }) {
  const [navbarSettings, setNavbarSettings] = useState({
    navbar_logo: "",
    navbar_logo_alt: "BIOR",
    navbar_show_search: true,
    site_name: "BIOR",
  });

  useEffect(() => {
    const fetchNavbarSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "navbar_logo, navbar_logo_alt, navbar_show_search, site_name"
        )
        .eq("section", "home")
        .maybeSingle();

      if (error) {
        console.error("Navbar settings fetch error:", error);
        return;
      }

      if (data) {
        setNavbarSettings({
          navbar_logo: data.navbar_logo || "",
          navbar_logo_alt: data.navbar_logo_alt || "BIOR",
          navbar_show_search: data.navbar_show_search ?? true,
          site_name: data.site_name || "BIOR",
        });
      }
    };

    fetchNavbarSettings();
  }, []);

  const logo = navbarSettings.navbar_logo?.trim() || defaultLogo;
  const siteName = navbarSettings.site_name?.trim() || "BIOR";

  return (
    <header className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="flex min-h-[86px] w-full items-center justify-between gap-3 py-4 sm:min-h-[100px] sm:gap-12">
          <div className="shrink-0">
            <img
              src={logo}
              alt={navbarSettings.navbar_logo_alt || siteName}
              title={siteName}
              className="h-10 w-auto max-w-[110px] object-contain sm:h-14 sm:max-w-[140px] lg:h-16 lg:max-w-none"
            />
          </div>

          {navbarSettings.navbar_show_search && (
            <div className="min-w-0 flex-1">
              <SearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainHeader;