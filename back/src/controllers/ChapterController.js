import Chapter from "../models/Chapter.js"
import Manga from "../models/Manga.js"

async function CreateChapter(req, res) {
    try {
        const { manga_id, title, chapter_number } = req.body;

        const chapter = await Chapter.create({
            title,
            chapter_number,
            manga_id
        });
        res.json(chapter)
    } catch (error) {
        res.status(500).json({ message: "Erreur l'hors de la création du chapitres" })
    }

}

export { CreateChapter }