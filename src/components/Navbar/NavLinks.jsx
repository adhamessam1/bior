function NavLinks({
  setSearchTerm,
  showNew,
  setShowNew,
}) {
  const links = [
    "الرئيسية",
    "الجديد",
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

  const scrollToProducts = () => {
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleClick = (link) => {
    if (link === "الرئيسية") {
      setSearchTerm("");
      setShowNew(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (link === "الجديد") {
      setSearchTerm("");
      setShowNew(true);
      scrollToProducts();
      return;
    }

    setShowNew(false);
    setSearchTerm(link);
    scrollToProducts();
  };

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="w-full overflow-x-auto overscroll-x-contain scrollbar-hide">
          <ul className="flex w-max min-w-full items-center justify-start gap-6 px-5 py-4 sm:justify-center sm:gap-9 sm:px-8 lg:gap-10 lg:px-10">

            {links.map((link) => {
              const isActive =
                (link === "الجديد" && showNew) ||
                (link !== "الجديد" &&
                  link !== "الرئيسية" &&
                  false);

              return (
                <li
                  key={link}
                  className="shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => handleClick(link)}
                    className={`group relative whitespace-nowrap pb-1 text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${
                      isActive
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {link}

                    <span
                      className={`absolute bottom-0 right-0 h-px bg-black transition-all duration-300 ${
                        isActive
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