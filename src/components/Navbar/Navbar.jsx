import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";

function Navbar({
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
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md">
      <MainHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <NavLinks
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showNew={showNew}
        setShowNew={setShowNew}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        onCategoryChange={onCategoryChange}
        onShowNew={onShowNew}
        onHome={onHome}
      />
    </header>
  );
}

export default Navbar;