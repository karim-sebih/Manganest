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
                order: { latestUploadedChapter: "desc" }
            });
        } catch (error) {
            console.error("getAllManga Error:", error.message);
            throw error;
        }
    },

    // Derniers chapitres (via mangas récemment mis à jour)
    getLatestChapters: async (limit = 12) => {
        try {
            // 1. Récupérer des mangas/manhwa récemment mis à jour
            const mangas = await Manga.search({
                limit: limit * 2,
                hasAvailableChapters: true,
                availableTranslatedLanguage: ['fr', 'en'],
                order: { latestUploadedChapter: "desc" }
            });

            // 2. Pour chaque manga, on récupère son dernier chapitre
            const promises = mangas.slice(0, limit).map(async (manga) => {
                try {
                    const feed = await manga.getFeed({
                        limit: 1,
                        availableTranslatedLanguage: ['fr', 'en'],
                        order: { chapter: "desc" }
                    });

                    const latestChapter = feed[0];

                    return {
                        id: manga.id,
                        mangaTitle: manga.localTitle || manga.title?.en || "Titre inconnu",
                        cover: manga.mainCover?.url ||
                            (manga.mainCover?.fileName
                                ? `https://uploads.mangadex.org/covers/${manga.id}/${manga.mainCover.fileName}`
                                : null),
                        lastChapter: latestChapter?.chapter || manga.lastChapter || "?",
                        chapterTitle: latestChapter?.title,
                        publishAt: latestChapter?.publishAt || manga.updatedAt,
                        translatedLanguage: latestChapter?.translatedLanguage,
                    };
                } catch (e) {
                    return {
                        id: manga.id,
                        mangaTitle: manga.localTitle || manga.title?.en || "Titre inconnu",
                        cover: manga.mainCover?.url || null,
                        lastChapter: manga.lastChapter || "?",
                        publishAt: manga.updatedAt,
                    };
                }
            });

            return await Promise.all(promises);
        } catch (error) {
            console.error("getLatestChapters Error:", error.message);
            throw error;
        }
    },
};

export default mangadexService;