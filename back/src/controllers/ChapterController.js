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

async function GetChaptersByManga(req, res) {
    try {
        const { manga_id } = req.params;

        const chapters = await Chapter.findAll({
            where: { manga_id },
            order: [["chapter_number", "ASC"]]
        });
        res.json(chapters)
    } catch {
        res.status(500).json({ message: "Erreur de fetch des chapitres" })
    }
}


async function UpdateChapter(req, res) {
    try {
        const { id } = req.params,
        const { title, chapter_number } = req.body;

        await Chapter.update(
            { title, chapter_number },
            { where: { id } }
        )
        res.json({ message: "Chapitre mis a jour" })
    } catch {
        res.status(500).json({ message: "Erreur l'hors de la mise a jour du chapitre" })
    }
}

async function DeleteChapter(req, res) {
    try {
        const { id } = req.params;

        await Chapter.destroy({
            where: { id }
        });

        res.json({ message: "Chapitre supprimé" })
    } catch {
        res.status(500).json({ message: "erreur l'hors de la suppression du chapter" })
    }
}

export { CreateChapter, GetChaptersByManga, UpdateChapter, DeleteChapter }