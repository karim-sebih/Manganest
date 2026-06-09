import { Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function ChapterLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [openSidebar, setOpenSidebar] = useState(false);

    const { mangaId, chapters, currentIndex } = location.state || {};

    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "auto";
    }, [openSidebar]);

    if (!chapters) {
        return <div className="text-white">Erreur: données manquantes</div>;
    }

    const currentChapter = chapters[currentIndex];
    const prevChapter = chapters[currentIndex + 1];
    const nextChapter = chapters[currentIndex - 1];

    return (
        <div className="bg-black min-h-screen text-white">

            {/* NAVBAR */}
            <div className="fixed top-0 left-0 right-0 bg-[#0F172A] p-4 flex justify-between items-center z-30">

                <button onClick={() => navigate(`/manga/${mangaId}`)}>
                    ← Retour
                </button>

                <span>
                    Chapitre {currentChapter.chapter} / {chapters[0]?.chapter}
                </span>

                <button onClick={() => setOpenSidebar(!openSidebar)}>
                    ☰
                </button>
            </div>

            {/* OVERLAY */}
            {openSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#020617] text-white z-50 transform transition-transform duration-300 ease-in-out
                ${openSidebar ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 pt-20">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg">Chapitres</h2>
                        <button onClick={() => setOpenSidebar(false)}>✕</button>
                    </div>

                    {/* NAVIGATION */}
                    <div className="flex justify-between mb-4">
                        <button
                            disabled={!prevChapter}
                            onClick={() => {
                                if (!prevChapter) return;

                                navigate(`/chapter/${prevChapter.id}`, {
                                    state: { mangaId, chapters, currentIndex: currentIndex + 1 }
                                });

                                setOpenSidebar(false);
                            }}
                        >
                            ⬅
                        </button>

                        <button
                            disabled={!nextChapter}
                            onClick={() => {
                                if (!nextChapter) return;

                                navigate(`/chapter/${nextChapter.id}`, {
                                    state: { mangaId, chapters, currentIndex: currentIndex - 1 }
                                });

                                setOpenSidebar(false);
                            }}
                        >
                            ➡
                        </button>
                    </div>

                    {/* LISTE */}
                    <div className="overflow-y-auto max-h-[70vh] space-y-2">
                        {chapters.map((chap, index) => (
                            <div
                                key={chap.id}
                                onClick={() => {
                                    navigate(`/chapter/${chap.id}`, {
                                        state: { mangaId, chapters, currentIndex: index }
                                    });
                                    setOpenSidebar(false);
                                }}
                                className={`p-2 rounded cursor-pointer ${index === currentIndex
                                    ? "bg-blue-500"
                                    : "hover:bg-gray-700"
                                    }`}
                            >
                                Chapitre {chap.chapter}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="pt-16">
                <Outlet />
            </div>

        </div>
    );
}
