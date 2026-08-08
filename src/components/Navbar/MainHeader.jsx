import logo from "../../assets/logo/logo.png";
import SearchBox from "./SearchBox";

function MainHeader({ searchTerm, setSearchTerm }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Logo */}
        <img
          src={logo}
          alt="BIOR"
          className="h-14 sm:h-16 w-auto object-contain"
        />

        {/* Search */}
        <div className="w-full sm:max-w-md">
          <SearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

      </div>
    </div>
  );
}

export default MainHeader;