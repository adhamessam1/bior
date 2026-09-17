import { FaSearch } from "react-icons/fa";

function SearchBox({ searchTerm, setSearchTerm }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      e.target.blur();
    }
  };

  return (
    <div className="group flex min-w-0 w-full items-center gap-2 border-b border-gray-300 bg-white px-1 py-2 transition-colors duration-300 focus-within:border-black sm:gap-3">
      
      <FaSearch className="shrink-0 text-xs text-gray-400 transition-colors group-focus-within:text-black sm:text-sm" />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ابحثي عن منتج أو قسم..."
        className="min-w-0 flex-1 bg-transparent py-1 text-right text-xs text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
      />

    </div>
  );
}

export default SearchBox;