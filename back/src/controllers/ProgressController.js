import Progress from "../models/Progress.js";
import mangadexService from "../services/mangadex.service.js";
import User from "../models/User.js";

async function saveProgress(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id } = req.body;
        const { mangadex_chapter_id, page } = req.body;

        await Progress.upsert({
            user_id,
            mangadex_id,
            mangadex_chapter_id,
            page
        });
        res.status(200).json({ message: "Progress saved successfully" });

    } catch (error) {
        console.error("Error saving progress:", error);
        res.status(500).json({ message: "Error saving progress" });
    }
}

async function getProgress(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id } = req.params;
        const progress = await Progress.findOne({
            where: { user_id, mangadex_id }
        });
        if (!progress) {
            return res.json(null);
        }
        res.json(progress);
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ message: "Error fetching progress" });
    }
}

async function getAllProgress(req, res) {
    try {
        const user_id = req.user.id;

        const progressList = await Progress.findAll({
            where: { user_id },
            order: [["updated_at", "DESC"]]
        });

        if (!progressList.length) {
            return res.json([]);
        }

        const ids = progressList.map(p => p.mangadex_id);

        const mangas = await mangadexService.getMangasByIds(ids);

        const mangaMap = new Map(mangas.map(m => [m.id, m]));

        const result = progressList.map(item => {
            const manga = mangaMap.get(item.mangadex_id);

            const title = manga?.attributes?.title
                ? Object.values(manga.attributes.title)[0]
                : "Titre inconnu";

            const coverRel = manga?.relationships?.find(r => r.type === "cover_art");

            const cover = coverRel?.attributes?.fileName
                ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                : null;

            return {
                mangadex_id: item.mangadex_id || null,
                mangadex_chapter_id: item.mangadex_chapter_id || null,
                hasChapter: !!item.mangadex_chapter_id,
                page: item.page ?? 0,
                updatedAt: item.updated_at || null,

                title: title || "Titre inconnu",

                cover: cover || "https://picsum.photos/300/420"
            };

        });

        res.json(result);

    } catch (error) {
        console.error("Error fetching all progress:", error);
        res.status(500).json({ message: "Error fetching progress" });
    }
}


export { getProgress, saveProgress, getAllProgress };