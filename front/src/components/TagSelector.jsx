import { useEffect, useState } from "react";
import { getMangaTags } from "../api/manga";

export default function TagSelector({ tags, setTags }) {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getMangaTags();
            setAvailableTags(data);
        }

        load();
    }, []);

    const toggleTag = (type, tagId) => {
        setTags(prev => {
            const list = prev[type] || [];

            return {
                ...prev,
                [type]: list.includes(tagId)
                    ? list.filter(t => t !== tagId)
                    : [...list, tagId]
            };
        });
    };

    return (
        <div className="space-y-6">
            {/* INCLUDED */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Tags inclus</h3>

                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                        const id = tag.id;
                        const name = tag.attributes?.name?.en;

                        const active = tags.included.includes(id);

                        return (
                            <button
                                key={id}
                                onClick={() => toggleTag("included", id)}
                                className={`px-3 py-1 rounded-full border transition ${active
                                        ? "bg-green-500 text-black"
                                        : "border-gray-500"
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* EXCLUDED */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Tags exclus</h3>

                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                        const id = tag.id;
                        const name = tag.attributes?.name?.en;

                        const active = tags.excluded.includes(id);

                        return (
                            <button
                                key={id}
                                onClick={() => toggleTag("excluded", id)}
                                className={`px-3 py-1 rounded-full border transition ${active
                                        ? "bg-red-500 text-black"
                                        : "border-gray-500"
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}