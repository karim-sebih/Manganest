import Chapter from "../models/Chapter.js";
import Manga from "../models/Manga.js";


async function CreateChapter(req, res) {
    try {
        const { manga_id, title, chapter_number } = req.body;

        const manga = await Manga.findByPk(manga_id);

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const chapter = await Chapter.create({
            title,
            chapter_number,
            manga_id
        });

        res.json(chapter);
    } catch (error) {
        res.status(500).json({ message: "Erreur création chapitre" });
    }
}


async function GetChaptersByManga(req, res) {
    try {
        const { manga_id } = req.params;

        const chapters = await Chapter.findAll({
            where: { manga_id },
            order: [["chapter_number", "ASC"]]
        });

        res.json(chapters);
    } catch {
        res.status(500).json({ message: "Erreur fetch chapitres" });
    }
}


async function UpdateChapter(req, res) {
    try {
        const { id } = req.params;
        const { title, chapter_number } = req.body;

        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Chapter.update(
            { title, chapter_number },
            { where: { id } }
        );

        res.json({ message: "Chapitre mis à jour" });
    } catch {
        res.status(500).json({ message: "Erreur update chapitre" });
    }
}


async function DeleteChapter(req, res) {
    try {
        const { id } = req.params;

        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Chapter.destroy({ where: { id } });

        res.json({ message: "Chapitre supprimé" });
    } catch {
        res.status(500).json({ message: "Erreur suppression chapitre" });
    }
}


export {
    CreateChapter,
    GetChaptersByManga,
    UpdateChapter,
    DeleteChapter
};
