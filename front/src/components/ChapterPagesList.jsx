import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetPagesByChapter, DeletePage } from "../api/page.js";

export default function ChapterPagesList({ chapterId }) {
    const queryClient = useQueryClient();

    const { data: pages, isLoading } = useQuery({
        queryKey: ["chapterPages", chapterId],
        queryFn: () => GetPagesByChapter(chapterId),
    });

    const deleteMutation = useMutation({
        mutationFn: DeletePage,
        onSuccess: () => {
            queryClient.invalidateQueries(["chapterPages", chapterId]);
        },
    });

    if (isLoading) return <div>Loading pages...</div>;

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
                        onClick={() => deleteMutation.mutate(page.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}
