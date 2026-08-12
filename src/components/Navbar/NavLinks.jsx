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

    // الأقسام العادية
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
    <div className="border-t border-gray-100">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 py-5 sm:gap-x-8">
          {links.map((link) => (
            <li key={link}>
              <button
                type="button"
                onClick={() => handleClick(link)}
                className="group relative text-sm font-medium text-gray-700 transition hover:text-black"
              >
                {link}

                <span className="absolute -bottom-2 right-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavLinks;