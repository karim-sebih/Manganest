import { Manga, loginPersonal } from 'mangadex-full-api';
import dotenv from "dotenv";

dotenv.config();

const mangadexService = {
    // Recherche générale
    searchManga: async (title = "", limit = 20, offset = 0) => {
        try {
            return await Manga.search({
                title,
                limit,
                offset,
                hasAvailableChapters: true,
                availableTranslatedLanguage: ['fr', 'en']
            });
        } catch (error) {
            console.error("searchManga Error:", error.message);
            throw error;
        }
    },

    // Récupérer un manga par ID
    getMangaById: async (id) => {
        try {
            const manga = await Manga.get(id, {
                includes: ['author', 'artist', 'cover_art']
            });
            return manga;
        } catch (error) {
            console.error("getMangaById Error:", error.message);
            throw error;
        }
    },

    // Pour la page d'accueil - Tous les mangas (récents)
    getAllManga: async (limit = 20, offset = 0) => {
        try {
            return await Manga.search({
                limit,
                offset,
                hasAvailableChapters: true,
                availableTranslatedLanguage: ['fr', 'en'],
                order: { latestUploadedChapter: "desc" },
                includes: ['cover_art']
            });
        } catch (error) {
            console.error("getAllManga Error:", error.message);
            throw error;
        }
    },

    // Derniers chapitres (via mangas récemment mis à jour)
    getLatestChapters: async (limit = 12) => {
        try {

            const res = await fetch(
                `https://api.mangadex.org/manga?limit=${limit}&includes[]=cover_art&order[latestUploadedChapter]=desc`
            );

            const data = await res.json();

            const results = await Promise.all(
                data.data.map(async (manga) => {

                    // récupérer le dernier chapitre
                    const feedRes = await fetch(
                        `https://api.mangadex.org/manga/${manga.id}/feed?limit=1&order[chapter]=desc`
                    );

                    const feedData = await feedRes.json();

                    const latestChapter = feedData.data?.[0];

                    // récupérer la cover
                    const coverRel = manga.relationships.find(
                        (rel) => rel.type === "cover_art"
                    );

                    const cover = coverRel?.attributes?.fileName
                        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                        : null;

                    return {
                        id: manga.id,

                        mangaTitle:
                            manga.attributes?.title?.en ||
                            Object.values(manga.attributes?.title || {})[0] ||
                            "Titre inconnu",

                        lastChapter:
                            latestChapter?.attributes?.chapter || "N/A",

                        publishAt:
                            latestChapter?.attributes?.publishAt || null,

                        cover
                    };
                })
            );

            return results;

        } catch (error) {
            console.error("getLatestChapters Error:", error.message);
            throw error;
        }
    },


    getMangaCover: async (id) => {
        try {

            const res = await fetch(
                `https://api.mangadex.org/manga/${id}?includes[]=cover_art`
            );

            const data = await res.json();

            const coverRel = data.data.relationships.find(
                rel => rel.type === "cover_art"
            );

            if (!coverRel?.attributes?.fileName) {
                return null;
            }

            return `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`;

        } catch (error) {
            console.error(error);
            return null;
        }
    }
};

export default mangadexService;