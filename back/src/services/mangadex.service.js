import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.mangadex.org";

const mangadexService = {

    // Recherche manga
    searchManga: async (title = "", limit = 150, offset = 0, includedTags = [], excludedTags = []) => {
        try {
            const params = new URLSearchParams();
            params.append("title", title); // Supprimez encodeURIComponent ici
            params.append("limit", limit);
            params.append("offset", offset);
            params.append("includes[]", "cover_art");
            params.append("availableTranslatedLanguage[]", "fr");
            params.append("availableTranslatedLanguage[]", "en");

            includedTags.forEach(tag => params.append("includedTags[]", tag));
            excludedTags.forEach(tag => params.append("excludedTags[]", tag));

            const res = await fetch(`${BASE_URL}/manga?${params}`);
            const data = await res.json();
            return data.data || [];
        } catch (error) {
            console.error("searchManga Error:", error.message);
            throw error;
        }
    },
    // Un Manga par ID
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

    // plusieurs mangas par ID
    getMangasByIds: async (ids) => {
        try {
            const params = new URLSearchParams();

            ids.forEach(id => params.append("ids[]", id));
            params.append("includes[]", "cover_art");

            const res = await fetch(`${BASE_URL}/manga?${params}`);
            const data = await res.json();

            return data.data || [];
        } catch (error) {
            console.error("getMangasByIds Error:", error.message);
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
        language,
        contentFilters = ["safe", "suggestive"],
        includedTags = [],
        excludedTags = []
    ) => {
        const timeoutMs = 50000;

        const fetchWithTimeout = async (url) => {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), timeoutMs);

            try {
                const res = await fetch(url, { signal: ctrl.signal });
                return res;
            } finally {
                clearTimeout(t);
            }
        };

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        // ✅ FIX PAGINATION
        const FETCH_MULTIPLIER = 4;
        const FETCH_SIZE = limit * FETCH_MULTIPLIER;

        // 🔥 correction ici
        const adjustedOffset = offset * FETCH_MULTIPLIER;

        const params = new URLSearchParams();
        params.append("limit", FETCH_SIZE);
        params.append("offset", adjustedOffset);
        params.append("includes[]", "cover_art");
        params.append("order[latestUploadedChapter]", "desc");

        contentFilters.forEach((f) => params.append("contentRating[]", f));
        includedTags.forEach((tag) => params.append("includedTags[]", tag));
        excludedTags.forEach((tag) => params.append("excludedTags[]", tag));

        params.append("availableTranslatedLanguage[]", "fr");
        params.append("availableTranslatedLanguage[]", "en");

        const mangaRes = await fetch(`${BASE_URL}/manga?${params}`);
        if (!mangaRes.ok) throw new Error(`MangaDex manga error: ${mangaRes.status}`);

        const mangaData = await mangaRes.json();
        const mangas = mangaData.data || [];

        if (!mangas.length) return [];

        const mangaIds = mangas.map((m) => m.id);

        const perMangaLimit = 3;
        const concurrency = 6;
        const allResults = [];

        for (let i = 0; i < mangaIds.length; i += concurrency) {
            const slice = mangaIds.slice(i, i + concurrency);

            const batch = await Promise.all(
                slice.map(async (id) => {
                    const url =
                        `${BASE_URL}/chapter?manga=${id}` +
                        `&translatedLanguage[]=${language}` +
                        `&order[readableAt]=desc` +
                        `&limit=${perMangaLimit}`;

                    for (let attempt = 0; attempt < 2; attempt++) {
                        try {
                            const res = await fetchWithTimeout(url);

                            if (!res.ok) {
                                if (res.status === 429 || res.status >= 500) {
                                    await sleep(400 * (attempt + 1));
                                    continue;
                                }
                                return [];
                            }

                            const json = await res.json();
                            return json.data || [];

                        } catch (e) {
                            if (attempt === 1) return [];
                            await sleep(400 * (attempt + 1));
                        }
                    }

                    return [];
                })
            );

            allResults.push(...batch);
        }

        let chapters = allResults.flatMap((r) => r || []);

        // ✅ TRI GLOBAL
        chapters.sort(
            (a, b) =>
                new Date(b.attributes.readableAt) - new Date(a.attributes.readableAt)
        );

        // ✅ UNIQUE MANGA
        const uniqueManga = new Map();

        for (const chapter of chapters) {
            const mangaRel = chapter.relationships.find(r => r.type === "manga");
            const mangaId = mangaRel?.id;

            if (!mangaId) continue;

            if (!uniqueManga.has(mangaId)) {
                uniqueManga.set(mangaId, chapter);
            }
        }

        chapters = Array.from(uniqueManga.values());

        // ✅ FILTRE DATE
        const MAX_DAYS = 30;
        const now = new Date();

        let filtered = chapters.filter(ch => {
            const date = new Date(ch.attributes.readableAt);
            const diff = (now - date) / (1000 * 60 * 60 * 24);
            return diff <= MAX_DAYS;
        });

        if (filtered.length < limit) {
            filtered = chapters;
        }

        filtered = filtered.slice(0, limit);

        return filtered.map((chapter) => {
            const mangaRel = chapter.relationships.find((r) => r.type === "manga");
            const manga = mangas.find((m) => m.id === mangaRel?.id);

            const title = manga?.attributes?.title
                ? Object.values(manga.attributes.title)[0]
                : "Titre inconnu";

            const coverRel = manga?.relationships?.find((r) => r.type === "cover_art");

            const cover = coverRel?.attributes?.fileName
                ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                : null;

            return {
                id: manga?.id,
                chapterId: chapter.id,
                mangaTitle: title,
                lastChapter: chapter.attributes.chapter || "??",
                publishAt: chapter.attributes.readableAt,
                cover,
            };
        });
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