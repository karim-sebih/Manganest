import React, { useEffect, useState } from "react";
import { getAllManga, getLatestChapters } from "../api/manga";
import { useNavigate } from "react-router";

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [latestChapters, setLatestChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [mangaData, chapterData] = await Promise.all([
          getAllManga(20),
          getLatestChapters(12),
        ]);

        setMangas(mangaData.mangas || []);
        setLatestChapters(chapterData.chapters || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-xl text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">

        {/* 🔥 CHAPITRES RÉCENTS */}
        <h2 className="text-3xl font-bold mt-16 mb-8 flex items-center gap-3">
          📖 Derniers Chapitres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestChapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => handleMangaClick(chapter.id)}
              className="bg-[#1E293B] rounded-2xl p-6 hover:bg-[#25334b] transition-all cursor-pointer flex gap-5 group"
            >
              <img
                src={chapter.cover}
                alt={chapter.mangaTitle}
                className="w-24 h-32 object-cover rounded-xl flex-shrink-0"
                onError={(e) => (e.target.src = "https://via.placeholder.com/300x420?text=No+Cover")}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400">
                  {chapter.mangaTitle}
                </h3>

                <p className="text-blue-400 text-xl font-medium mt-3">
                  Chapitre {chapter.lastChapter}
                </p>

                {chapter.publishAt && (
                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(chapter.publishAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
