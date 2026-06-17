import { useState } from "react";
import { CreatePages } from "../api/page.js";

export default function ChapterPageForm({ chapterId }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("pages", file);
        });

        try {
            setLoading(true);
            await CreatePages(chapterId, formData);
            setFiles([]);

            // 🔥 refresh simple
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Upload..." : "Upload"}
                </button>
            </form>

            <div className="grid grid-cols-3 gap-3 mt-4">
                {files.map((file, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="rounded-lg"
                    />
                ))}
            </div>
        </div>
    );
}
