import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getSelfMangaById } from "../api/selfmanga.js";
import { GetChaptersByManga } from "../api/chapter.js";

export default function ManageManga() {
    const { id } = useParams();

    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const mangaData = await getSelfMangaById(id);
                setManga(mangaData.manga); // ⚠️ important

                const chaptersData = await GetChaptersByManga(id);
                setChapters(chaptersData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!manga) return <div>Manga introuvable</div>;

    return (
        <div>
            <h1>{manga.title}</h1>

            {chapters.map((chapter) => (
                <div key={chapter.id}>
                    Chapitre {chapter.chapter_number}
                </div>
            ))}
        </div>
    );
}
