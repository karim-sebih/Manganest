import React, { useEffect, useState } from "react";
import { getAllManga, getLatestChapters } from "../api/manga";
import { useNavigate } from "react-router";
import Pagination from "../components/Pagination";

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [latestChapters, setLatestChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 20;

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [mangaData, chapterData] = await Promise.all([
          getAllManga(LIMIT, (page - 1) * LIMIT),
          getLatestChapters(
            LIMIT,
            (page - 1) * LIMIT
          )]);

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
  }, [page]);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-xl text-gray-400">Chargement des derniers chapitres...</p>
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

        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          Derniers Chapitres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestChapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => handleMangaClick(chapter.id)}
              className="bg-[#1E293B] rounded-2xl p-6 hover:bg-[#25334b] transition-all cursor-pointer flex gap-5 group"
            >
              <div className="flex-shrink-0">
                <img
                  src={
                    chapter.cover ||
                    "Rien à afficher"
                  }

                  alt={chapter.mangaTitle}
                  className="w-24 h-36 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/300/420?random=1"; // fallback fiable

                  }}

                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
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
      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={mangas.length >= LIMIT}
      />
    </div>
  );

}