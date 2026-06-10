import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TagFilterDropdown = ({ onTagsChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [includedTags, setIncludedTags] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);

    // Tags populaires à afficher par défaut
    const popularTags = [
        "action", "adventure", "comedy", "drama", "fantasy", "horror",
        "mystery", "romance", "sci-fi", "slice of life", "sports", "supernatural"
    ];

    // Charger les tags depuis le localStorage
    useEffect(() => {
        const savedTags = JSON.parse(localStorage.getItem("tags")) || {};
        setIncludedTags(savedTags.included || []);
        setExcludedTags(savedTags.excluded || []);
    }, []);

    const handleTagClick = (tagId) => {
        if (includedTags.includes(tagId)) {
            setIncludedTags(includedTags.filter(t => t !== tagId));
        } else if (excludedTags.includes(tagId)) {
            setExcludedTags(excludedTags.filter(t => t !== tagId));
        } else {
            setIncludedTags([...includedTags, tagId]);
        }
    };

    const handleSave = () => {
        const tagsToSave = {
            included: includedTags,
            excluded: excludedTags
        };
        localStorage.setItem("tags", JSON.stringify(tagsToSave));
        onTagsChange(tagsToSave);
        setIsOpen(false);
    };

    const handleReset = () => {
        setIncludedTags([]);
        setExcludedTags([]);
        localStorage.removeItem("tags");
        onTagsChange({ included: [], excluded: [] });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Tags
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1E293B] rounded-lg shadow-lg z-50 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Filtrer par tags</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-green-400 mb-2">Inclure ces tags</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {includedTags.map((tagId) => (
                                <span
                                    key={`in-${tagId}`}
                                    className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                    {tagId}
                                    <button
                                        onClick={() => setIncludedTags(includedTags.filter(t => t !== tagId))}
                                        className="hover:text-green-100"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>

                        <h4 className="text-sm font-medium text-red-400 mb-2">Exclure ces tags</h4>
                        <div className="flex flex-wrap gap-1">
                            {excludedTags.map((tagId) => (
                                <span
                                    key={`ex-${tagId}`}
                                    className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                    {tagId}
                                    <button
                                        onClick={() => setExcludedTags(excludedTags.filter(t => t !== tagId))}
                                        className="hover:text-red-100"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {popularTags.map((tag) => {
                            const isIncluded = includedTags.includes(tag);
                            const isExcluded = excludedTags.includes(tag);

                            if (isIncluded || isExcluded) return null;

                            return (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs transition-colors truncate"
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-600">
                        <button
                            onClick={handleReset}
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            Réinitialiser
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagFilterDropdown;
