import Manga from "../models/Manga.js"
import User from "../models/User.js"

async function CreateManga(req, res) {
    try {
        const { title, description } = req.body;
        const user_id = req.user_id;

        const manga = await Manga.create({
            title,
            description,
            user_id,
        });
        res.json(manga)
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la création du Self-Manga" })
    }
}

export { CreateManga };