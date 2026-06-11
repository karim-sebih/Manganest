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

export { getProgress, saveProgress };