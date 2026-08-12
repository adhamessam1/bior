import logo from "../../assets/logo/bior-logo.png";
import SearchBox from "./SearchBox";

function MainHeader({ searchTerm, setSearchTerm }) {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-8 py-4 sm:gap-12">
          
          {/* BIOR Logo */}
          <div className="shrink-0">
            <img
              src={logo}
              alt="BIOR"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>

          {/* Search */}
          <div className="w-full max-w-lg">
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

        </div>
      </div>
    </header>
  );
}

export default MainHeader;