import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";

function Navbar({
  searchTerm,
  setSearchTerm,
  showNew,
  setShowNew,
}) {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <MainHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <NavLinks
        setSearchTerm={setSearchTerm}
        showNew={showNew}
        setShowNew={setShowNew}
      />
    </header>
  );
}

export default Navbar;