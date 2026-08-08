function NavLinks({ setSearchTerm }) {
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

   if (link === "الجديد") {
  setSearchTerm("الجديد");
  return;
}

    setSearchTerm(link);
  };

  return (
    <div className="border-t border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8">
        <ul className="flex items-center justify-start lg:justify-center gap-7 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {links.map((link) => (
            <li key={link} className="shrink-0">
              <button
                type="button"
                onClick={() => handleClick(link)}
                className="relative text-sm font-medium text-gray-700 hover:text-black transition group"
              >
                {link}

                <span className="absolute -bottom-2 right-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavLinks;