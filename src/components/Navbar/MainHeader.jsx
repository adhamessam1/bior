import logo from "../../assets/logo/bior-logo-mark.webp";
import SearchBox from "./SearchBox";

function MainHeader({ searchTerm, setSearchTerm }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Brand */}
<div className="flex items-center gap-3 shrink-0">
  <div className="w-11 h-11 overflow-hidden relative">
    <img
      src={logo}
      alt="BIOR"
      className="absolute w-[180px] max-w-none left-1/2 -translate-x-1/2 -top-[50px]"
    />
  </div>

  <span className="text-2xl font-semibold tracking-[0.18em] text-gray-900">
    BIOR
  </span>
</div>

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