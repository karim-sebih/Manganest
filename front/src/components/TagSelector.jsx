import { useEffect, useState } from "react";

export default function TagsModal({ isOpen, onClose }) {
    const [tags, setTags] = useState({
        included: [],
        excluded: []
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        setTags(
            JSON.parse(localStorage.getItem("tags")) || {
                included: [],
                excluded: []
            }
        );

        async function fetchTags() {
            const res = await fetch("https://api.mangadex.org/manga/tag");
            const data = await res.json();
            setAvailableTags(data.data || []);
        }

        fetchTags();
    }, [isOpen]);

    const toggleTag = (type, tagId) => {
        setTags((prev) => {
            const opposite = type === "included" ? "excluded" : "included";

            return {
                ...prev,

                [type]: prev[type].includes(tagId)
                    ? prev[type].filter(t => t !== tagId)
                    : [...prev[type], tagId],

                [opposite]: prev[opposite].filter(t => t !== tagId)
            };
        });
    };
    const save = () => {
        localStorage.setItem("tags", JSON.stringify(tags));
        onClose();

        window.dispatchEvent(new Event("tagsUpdated"));
        window.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1E293B] w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Manage Tags
                </h2>

                <div className="grid grid-cols-2 gap-6">

                    {/* INCLUDED */}
                    <div>
                        <h3 className="text-green-400 mb-3 font-semibold">
                            Included
                        </h3>

                        <div className="space-y-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag("included", tag.id)}
                                    className={`w-full p-2 rounded-lg text-sm transition ${tags.included.includes(tag.id)
                                        ? "bg-green-600"
                                        : "bg-[#0F172A]"
                                        }`}
                                >
                                    {tag.attributes?.name?.en}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* EXCLUDED */}
                    <div>
                        <h3 className="text-red-400 mb-3 font-semibold">
                            Excluded
                        </h3>

                        <div className="space-y-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag("excluded", tag.id)}
                                    className={`w-full p-2 rounded-lg text-sm transition ${tags.excluded.includes(tag.id)
                                        ? "bg-red-600"
                                        : "bg-[#0F172A]"
                                        }`}
                                >
                                    {tag.attributes?.name?.en}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 px-4 py-2 rounded-xl"
                    >
                        Close
                    </button>

                    <button
                        onClick={save}
                        className="bg-blue-600 px-4 py-2 rounded-xl"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
}