import { useState, useEffect } from "react";

export default function AutocompleteInput({ label, options = [], value, onChange, placeholder }) {
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState(value || "");

  // 🔁 Sincroniza com valor externo sempre que ele muda
  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setSearch(val);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="p-2 border rounded w-full"
        value={search}
        placeholder={placeholder}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 150)}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
        }}
      />
      {showOptions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-48 overflow-y-auto">
          {filtered.map((option, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
