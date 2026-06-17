import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { GetChapterById } from "../api/chapter";
import ChapterPageForm from "../components/ChapterPageForm.jsx";
import ChapterPagesList from "../components/ChapterPagesList.jsx";

export default function ManageChapter() {
    const { id } = useParams();

    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChapter() {
            try {
                const data = await GetChapterById(id);
                setChapter(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchChapter();
    }, [id]);

    if (loading) return <div>Loading...</div>;
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
