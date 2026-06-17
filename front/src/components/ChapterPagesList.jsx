import { useEffect, useState } from "react";
import { GetPagesByChapter, DeletePage } from "../api/page.js";

export default function ChapterPagesList({ chapterId }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPages() {
        try {
            const data = await GetPagesByChapter(chapterId);
            setPages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPages();
    }, [chapterId]);

    async function handleDelete(id) {
        try {
            await DeletePage(id);
            fetchPages(); // 🔥 refresh après delete
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <div>Loading pages...</div>;

    if (!pages || pages.length === 0)
        return <p className="text-gray-500">Aucune page</p>;

    return (
        <div className="grid grid-cols-3 gap-4">
            {pages.map((page) => (
                <div key={page.id} className="relative">
                    <img
                        src={page.image_url}
                        alt=""
                        className="rounded-lg"
                    />

                    <button
                        onClick={() => handleDelete(page.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}
