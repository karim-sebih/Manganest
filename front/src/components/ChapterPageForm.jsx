import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePages } from "../api/page.js";

export default function ChapterPageForm({ chapterId }) {
    const [files, setFiles] = useState([]);
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: ({ chapterId, data }) => CreatePages(chapterId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["chapterPages", chapterId]);
            setFiles([]);
        },
    });


    function handleChange(e) {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("pages", file);
        });

        uploadMutation.mutate({
            chapterId,
            data: formData,
        });
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
                >
                    Upload
                </button>
            </form>

            {/* preview */}
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
