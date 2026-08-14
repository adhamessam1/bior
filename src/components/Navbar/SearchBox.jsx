import { FaSearch } from "react-icons/fa";

function SearchBox({ searchTerm, setSearchTerm }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="group flex w-full items-center gap-3 border-b border-gray-300 bg-white px-1 py-2 transition-colors duration-300 focus-within:border-black">
      <FaSearch className="shrink-0 text-sm text-gray-400 transition-colors group-focus-within:text-black" />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ابحثي عن منتج أو قسم..."
        className="min-w-0 flex-1 bg-transparent py-1 text-right text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
    </div>
  );
}

export default SearchBox;