import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getMangaById } from "../../api/manga.js";
import { useTranslation } from "react-i18next";

export default function MangaDetails() {
    const { id } = useParams();
    const { t } = useTranslation();


    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chapters, setChapters] = useState([]);


    useEffect(() => {
        async function fetchManga() {
            try {
                setLoading(true);

                const chapterLanguage =
                    localStorage.getItem("chapterLanguage") || "fr";


                const data = await getMangaById(
                    id,
                    [chapterLanguage]
                );
                setManga(data.manga);
                setChapters(data.chapters);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger le manga");
            } finally {
                setLoading(false);
            }
        }

        fetchManga();
    }, [id]);

    const handleChapterClick = (chapterId, index) => {
        navigate(`/chapter/${chapterId}`, {
            state: {
                mangaId: id,
                chapters: chapters,
                currentIndex: index
            }
        });
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
                {t('mangaDetails.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {t('mangaDetails.error')}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex flex-col md:flex-row gap-10">

                    {/* Cover */}
                    <img
                        src={manga.cover}
                        alt={manga.title}
                        className="w-64 h-[380px] object-cover rounded-2xl shadow-lg"
                    />

                    {/* Infos */}
                    <div className="flex-1">

                        <h1 className="text-4xl font-bold mb-4">
                            {manga.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {manga.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 leading-7">
                            {manga.description}
                        </p>

                        <div className="mt-8 space-y-2 text-gray-400">
                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.author')}
                                </span>{" "}
                                {manga.authors?.join(", ")}
                            </p>

                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.artist')}
                                </span>{" "}
                                {manga.artists?.join(", ")}
                            </p>
                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.status')}
                                </span>{" "}
                                {manga.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chapitres */}
                <div className="mt-14">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('mangaDetails.chaptersSection')}
                    </h2>

                    <div className="space-y-3">

                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                onClick={() => handleChapterClick(chapter.id, index)}
                                className="bg-[#1E293B] p-5 rounded-xl cursor-pointer hover:bg-[#334155]"
                            >
                                <p className="text-lg font-semibold">
                                    {t('mangaDetails.chapterPrefix')} {chapter.chapter}
                                </p>

                                <p className="text-gray-400">
                                    {chapter.title}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
}