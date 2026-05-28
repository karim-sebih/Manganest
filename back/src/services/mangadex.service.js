import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.mangadex.org";

const mangadexService = {

    // Recherche manga
    searchManga: async (title = "", limit = 20, offset = 0) => {
        try {

            const res = await fetch(
                `${BASE_URL}/manga?title=${encodeURIComponent(title)}&limit=${limit}&offset=${offset}&includes[]=cover_art&availableTranslatedLanguage[]=fr&availableTranslatedLanguage[]=en`
            );

            const data = await res.json();

            return data.data || [];

        } catch (error) {
            console.error("searchManga Error:", error.message);
            throw error;
        }
    },

    // Manga par ID
    getMangaById: async (id) => {
        try {

            const res = await fetch(
                `${BASE_URL}/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`
            );

            const data = await res.json();

            return data.data;

        } catch (error) {
            console.error("getMangaById Error:", error.message);
            throw error;
        }
    },

    /* Récupérer les chapitres d’un manga (sois en fr sois en eng pour l'instant*/
    getMangaChapters: async (
        id,
        languages = ["fr"]
    ) => {

        try {

            const languageQuery = languages
                .map(
                    (lang) =>
                        `translatedLanguage[]=${lang}`
                )
                .join("&");

            const res = await fetch(
                `${BASE_URL}/chapter?manga=${id}&${languageQuery}&order[chapter]=desc&limit=100`
            );

            const data = await res.json();

            return data.data;

        } catch (error) {

            console.error(
                "getMangaChapters Error:",
                error.message
            );

            throw error;
        }
    },

    getChapterPages: async (id) => {
        try {

            const res = await fetch(
                `${BASE_URL}/at-home/server/${id}`
            );

            const data = await res.json();

            return data;

        } catch (error) {

            console.error(
                "getChapterPages Error:",
                error.message
            );

            throw error;
        }
    },

    // Tous les mangas récents
    getAllManga: async (
        limit = 20,
        offset = 0,
        contentFilters = ["safe", "suggestive"]

    ) => {
        try {

            const contentQuery = contentFilters
                .map((filter) => `contentRating[]=${filter}`)
                .join("&");

            console.log(contentQuery);

            const res = await fetch(
                `${BASE_URL}/manga?limit=${limit}&offset=${offset}&${contentQuery}&includes[]=cover_art&availableTranslatedLanguage[]=fr&availableTranslatedLanguage[]=en&order[latestUploadedChapter]=desc`
            );

            if (!res.ok) {
                throw new Error(`MangaDex API Error: ${res.status}`);
            }

            const data = await res.json();

            return data.data || [];

        } catch (error) {
            console.error("FULL ERROR:", error);
            throw error;
        }
    },

    // Derniers chapitres
    getLatestChapters: async (
        limit = 12,
        offset = 0,
        language = "fr",
        contentFilters = ["safe", "suggestive"]
    ) => {
        try {

            const contentQuery = contentFilters
                .map(
                    (filter) =>
                        `contentRating[]=${filter}`
                )
                .join("&");

            const res = await fetch(
                `${BASE_URL}/manga?limit=${limit}&offset=${offset}&${contentQuery}&includes[]=cover_art&order[latestUploadedChapter]=desc`
            );

            const data = await res.json();

            const results = await Promise.all(
                data.data.map(async (manga) => {

                    const feedRes = await fetch(
                        `${BASE_URL}/manga/${manga.id}/feed?limit=10&translatedLanguage[]=${language}&order[publishAt]=desc`
                    );

                    const feedData = await feedRes.json();

                    const latestChapter =
                        feedData.data?.find(
                            (chapter) =>
                                chapter.attributes?.chapter &&
                                chapter.attributes?.translatedLanguage === language
                        );

                    const coverRel =
                        manga.relationships.find(
                            (rel) => rel.type === "cover_art"
                        );

                    const cover =
                        coverRel?.attributes?.fileName
                            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                            : null;

                    return {
                        id: manga.id,

                        mangaTitle:
                            manga.attributes?.title?.en ||
                            Object.values(
                                manga.attributes?.title || {}
                            )[0] ||
                            "Titre inconnu",

                        lastChapter:
                            latestChapter?.attributes?.chapter || null,

                        publishAt:
                            latestChapter?.attributes?.publishAt || null,

                        cover
                    };
                })
            );

            return results.filter(
                (manga) => manga.lastChapter !== null
            );

        } catch (error) {

            console.error(
                "getLatestChapters Error:",
                error.message
            );

            throw error;
        }
    },

    // Cover d’un manga
    getMangaCover: async (id) => {
        try {

            const res = await fetch(
                `${BASE_URL}/manga/${id}?includes[]=cover_art`
            );

            const data = await res.json();

            const coverRel = data.data.relationships.find(
                (rel) => rel.type === "cover_art"
            );

            if (!coverRel?.attributes?.fileName) {
                return null;
            }

            return `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`;

        } catch (error) {
            console.error("getMangaCover Error:", error.message);
            return null;
        }
    }
};

export default mangadexService;