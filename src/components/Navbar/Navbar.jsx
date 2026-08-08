import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";

function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <header className="bg-white">
      <MainHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <NavLinks setSearchTerm={setSearchTerm} />
    </header>
  );
}

export default Navbar;