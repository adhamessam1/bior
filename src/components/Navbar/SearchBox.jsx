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
    <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-black focus-within:bg-white">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ابحثي عن منتج..."
        className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none"
      />

      <FaSearch className="shrink-0 text-gray-500" />
    </div>
  );
}

export default SearchBox;