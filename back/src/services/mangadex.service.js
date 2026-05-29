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
        contentFilters = ["safe", "suggestive"],
        includedTags = [],
        excludedTags = []

    ) => {
        try {

            const contentQuery = contentFilters
                .map((filter) => `contentRating[]=${filter}`)
                .join("&");

            console.log(contentQuery);


            const includedQuery = includedTags.length
                ? includedTags.map(tag => `includedTags[]=${tag}`).join("&")
                : "";

            const excludedQuery = excludedTags.length
                ? excludedTags.map(tag => `excludedTags[]=${tag}`).join("&")
                : "";

            console.log(includedQuery);
            console.log(excludedQuery);

            const res = await fetch(
                `${BASE_URL}/manga?limit=${limit}&offset=${offset}&${contentQuery}&${includedQuery}&${excludedQuery}&includes[]=cover_art&availableTranslatedLanguage[]=fr&availableTranslatedLanguage[]=en&order[latestUploadedChapter]=desc`
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
        language = "fr"
    ) => {

        const res = await fetch(
            `${BASE_URL}/chapter?limit=50&offset=${offset}&translatedLanguage[]=${language}&order[readableAt]=desc&includes[]=manga`
        );

        const data = await res.json();

        const seen = new Set();

        const filtered = data.data
            .filter((chapter) => {
                const mangaId = chapter.relationships.find(r => r.type === "manga")?.id;
                if (!mangaId || seen.has(mangaId)) return false;
                seen.add(mangaId);
                return true;
            })
            .slice(0, limit);

        return await Promise.all(
            filtered.map(async (chapter) => {

                const mangaRel = chapter.relationships.find(r => r.type === "manga");

                const title =
                    mangaRel?.attributes?.title
                        ? Object.values(mangaRel.attributes.title)[0]
                        : "Titre inconnu";

                const cover = await mangadexService.getMangaCover(mangaRel.id);

                return {
                    id: mangaRel?.id,
                    mangaTitle: title,
                    lastChapter: chapter.attributes.chapter || "??",
                    publishAt: chapter.attributes.readableAt,
                    cover
                };
            })
        );
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