import logo from "../../assets/logo/bior-logo.png";
import SearchBox from "./SearchBox";

function MainHeader({ searchTerm, setSearchTerm }) {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex min-h-[86px] items-center justify-between gap-8 py-4 sm:min-h-[100px] sm:gap-12">

          {/* BIOR Logo */}
          <div className="shrink-0">
            <img
              src={logo}
              alt="BIOR"
              className="h-12 w-auto object-contain sm:h-14 lg:h-16"
            />
          </div>

          {/* Search */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
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