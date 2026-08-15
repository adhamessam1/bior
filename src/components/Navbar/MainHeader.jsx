import logo from "../../assets/logo/bior-logo.png";
import SearchBox from "./SearchBox";

function MainHeader({ searchTerm, setSearchTerm }) {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="flex min-h-[86px] w-full items-center justify-between gap-3 py-4 sm:min-h-[100px] sm:gap-12">

          {/* BIOR Logo */}
          <div className="shrink-0">
            <img
              src={logo}
              alt="BIOR"
              className="h-10 w-auto max-w-[110px] object-contain sm:h-14 sm:max-w-[140px] lg:h-16 lg:max-w-none"
            />
          </div>

          {/* Search */}
          <div className="min-w-0 flex-1">
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