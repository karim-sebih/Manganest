import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { GetChapterById } from "../api/chapter";
import ChapterPageForm from "../components/ChapterPageForm.jsx";
import ChapterPagesList from "../components/ChapterPagesList.jsx";

export default function ManageChapter() {
    const { id } = useParams();

    const { data: chapter, isLoading } = useQuery({
        queryKey: ["chapter", id],
        queryFn: () => GetChapterById(id),
    });

    if (isLoading) return <div>Loading...</div>;
    if (!chapter) return <div>Chapitre introuvable</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                Chapitre {chapter.chapter_number} — {chapter.title}
            </h1>

            <ChapterPageForm chapterId={id} />
            <ChapterPagesList chapterId={id} />
        </div>
    );
}
