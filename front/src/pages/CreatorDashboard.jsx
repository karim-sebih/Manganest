import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSelfMangaById, GetUsersSelfManga } from "../api/selfmanga.js";
import { GetChaptersByManga } from "../api/chapter.js";


export default function CreatorDashboard() {
    const navigate = useNavigate();

    const [mangas, setMangas] = useState([]);
    const [selectedManga, setSelectedManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    //  FETCH MANGAS
    useEffect(() => {
        async function fetchMangas() {
            try {
                setLoading(true);

                const data = await GetUsersSelfManga();
                setMangas(data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMangas();
    }, []);


    // ✅ CLICK MANGA
    const handleSelectManga = async (manga) => {
        try {
            setSelectedManga(manga);

            const data = await GetChaptersByManga(manga.id);
            setChapters(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-10">

            <h1 className="text-3xl font-bold mb-10 text-center">
                Dashboard Creator
            </h1>

            <div className="flex gap-10">

                {/* 🧱 COLONNE GAUCHE → MANGAS */}
                <div className="w-1/2 bg-[#1E293B] p-6 rounded-2xl">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            Liste des mangas
                        </h2>

                        <button
                            onClick={() => navigate("/creator/create")}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg"
                        >
                            ➕
                        </button>
                    </div>

                    {mangas.length === 0 ? (
                        <p className="text-gray-400">
                            Aucun manga créé
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {mangas.map((manga) => (
                                <div
                                    key={manga.id}
                                    onClick={() => handleSelectManga(manga)}
                                    className={`p-4 rounded-xl cursor-pointer transition ${selectedManga?.id === manga.id
                                        ? "bg-blue-600"
                                        : "bg-[#0F172A] hover:bg-[#334155]"
                                        }`}
                                >
                                    {manga.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🧱 COLONNE DROITE → CHAPITRES */}
                <div className="w-1/2 bg-[#1E293B] p-6 rounded-2xl">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            Liste des chapitres
                        </h2>

                        {selectedManga && selectedManga.status === "approved" && (
                            <button
                                onClick={() =>
                                    navigate(`/creator/${selectedManga.id}/create-chapter`)
                                }
                                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg"
                            >
                                ➕
                            </button>
                        )}
                        {selectedManga && selectedManga.status !== "approved" && (
                            <p className="text-sm text-yellow-400">
                                Ton manga doit être approuvé pour ajouter des chapitres
                            </p>
                        )}


                    </div>

                    {!selectedManga ? (
                        <p className="text-gray-400">
                            Sélectionne un manga
                        </p>
                    ) : chapters.length === 0 ? (
                        <p className="text-gray-400">
                            Aucun chapitre
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {chapters.map((chapter) => (
                                <div
                                    key={chapter.id}
                                    className="p-4 bg-[#0F172A] rounded-xl"
                                >
                                    <p className="font-semibold">
                                        Chapitre {chapter.chapter}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {chapter.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
