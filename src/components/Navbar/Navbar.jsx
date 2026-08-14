import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";

function Navbar({
  searchTerm,
  setSearchTerm,
  showNew,
  setShowNew,
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md">

      {/* Main Header */}
      <MainHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Navigation */}
      <div className="border-t border-gray-100">
        <NavLinks
          setSearchTerm={setSearchTerm}
          showNew={showNew}
          setShowNew={setShowNew}
        />
      </div>

    </header>
  );
}

export default Navbar;