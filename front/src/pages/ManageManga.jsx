import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChapter, GetChaptersByManga } from "../api/chapter.js";
import { getSelfMangaById } from "../api/selfmanga.js";
import { useNavigate } from "react-router";



export default function ManageManga() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: manga, isLoading: mangaLoading } = useQuery({
        queryKey: ["manga", id],
        queryFn: () => getSelfMangaById(id),
    });

    const { data: chapters, isLoading: chaptersLoading } = useQuery({
        queryKey: ["chapters", id],
        queryFn: () => GetChaptersByManga(id),
    });

    const createMutation = useMutation({
        mutationFn: CreateChapter,
        onSuccess: () => {
            queryClient.invalidateQueries(["chapters", id]);
        },
    });

    function handleCreateChapter() {
        const title = prompt("Titre ?");
        const chapter_number = prompt("Numéro ?");

        if (!title || !chapter_number) return;

        createMutation.mutate({
            manga_id: id,
            title,
            chapter_number: Number(chapter_number),
        });
    }

    if (mangaLoading || chaptersLoading) return <div>Loading...</div>;

    if (!manga) return <div>Manga introuvable</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow">
                <h1 className="text-2xl font-bold">{manga?.title}</h1>
                <p className="text-gray-600 mt-2">{manga?.description}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Chapitres</h2>

                    <button
                        onClick={handleCreateChapter}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Ajouter
                    </button>
                </div>

                <div className="space-y-3">
                    {chapters?.map((chapter) => (
                        <div
                            key={chapter.id}
                            className="flex justify-between items-center border p-3 rounded-lg"
                        >
                            <span>
                                Chapitre {chapter.chapter_number} — {chapter.title}
                            </span>

                            <button
                                onClick={() => navigate(`/chapter/${chapter.id}`)}
                                className="text-blue-600"
                            >
                                Gérer
                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
