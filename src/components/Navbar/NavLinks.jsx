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

      setTimeout(() => {
        document.getElementById("products")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return;
    }

    setShowNew(false);
    setSearchTerm(link);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-5 sm:px-8 lg:px-10">
        <ul className="flex min-w-max items-center justify-center gap-7 py-4 sm:gap-9 lg:gap-10">

          {links.map((link) => {
            const isActive =
              link === "الجديد" && showNew;

            return (
              <li key={link}>
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
    </nav>
  );
}

export default NavLinks;