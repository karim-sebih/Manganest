import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router"; 
import { Search, Menu, Sun, Bell, User } from "lucide-react";
import { searchManga } from "../api/manga";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    } /*sa fait en sorte que quand y a plus de 2 char sa affiche le dropdown avec les résultats */

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchManga(query, 8);
        setResults(data.mangas || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  /* ferme le dropdown quand tu clique en dehors */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (manga) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/manga/${manga.id}`);
  };

  return (
    <nav className="bg-[#1E293B] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="../assets/Manganest-removebg-preview.png"
              alt="Manganest"
              className="h-10"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={dropdownRef}>
            <div className="relative">
              <div className="flex items-center h-10 bg-[#334155] rounded-lg px-4 text-white border border-transparent focus-within:border-blue-500 transition-all">
                <Search size={20} className="text-gray-400" />
                 <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un manga, manhwa..."
                  className="flex-1 bg-transparent outline-none px-3 text-sm placeholder-gray-400"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-gray-400 hover:text-white text-xl leading-none"
                  >
                    ✕
                  </button>
                )}
               <Link to = 'Filter'><div className="bg-[#1E293B] ml-1 px-3 py-1 text-xs rounded-sm">Filter</div></Link> 
              </div>
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute mt-2 w-full bg-[#1E293B] rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50 max-h-[420px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-gray-400">
                    Chargement...
                  </div>
                ) : results.length > 0 ? (
                  results.map((manga) => (
                    <div
                      key={manga.id}
                      onClick={() => handleSelect(manga)}
                      className="flex gap-4 p-3 hover:bg-[#334155] cursor-pointer border-b border-gray-700 last:border-none"
                    >
                      {/* Cover */}
                      <img
                        src={manga.cover || "/placeholder-cover.jpg"}
                        alt={manga.title}
                        className="w-12 h-16 object-cover rounded-md flex-shrink-0 bg-gray-700"
                        onError={(e) => {
                          e.target.src = "/placeholder-cover.jpg";
                        }}
                      />

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {manga.title}
                        </p>
                        {manga.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {manga.description}
                          </p>
                        )}
                        {manga.tags?.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {manga.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-gray-700 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    Aucun résultat pour "
                    <span className="text-white">{query}</span>"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Les Icons a gauche */}
          <div className="flex gap-4 text-gray-300">
            <Menu className="cursor-pointer hover:text-white" size={22} />
            <Sun className="cursor-pointer hover:text-white" size={22} />
            <Bell className="cursor-pointer hover:text-white" size={22} />
            <User className="cursor-pointer hover:text-white" size={22} />
          </div>
        </div>
      </div>
    </nav>
  );
}
