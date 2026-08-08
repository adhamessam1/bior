import { FaSearch } from "react-icons/fa";

function SearchBox({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex items-center w-full border border-gray-300 rounded-full px-4 py-3 bg-white">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحثي عن منتج..."
        className="flex-1 min-w-0 outline-none text-sm text-right bg-transparent"
      />

      <FaSearch className="text-gray-500 shrink-0" />
    </div>
  );
}

export default SearchBox;