import Manga from "../models/Manga.js"
import User from "../models/User.js"
import Chapter from "../models/Chapter.js";

async function CreateManga(req, res) {
    try {
        const { title, description } = req.body;
        const user_id = req.user.id;

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

async function GetUsersSelfManga(req, res) {
    try {
        const user_id = req.user.id;

        const manga = await Manga.findAll({
            where: { user_id },
            order: [["created_at", "DESC"]]
        });

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: "Erreur l'hors du fetch des self manga" })
    }
}

async function UpdateSelfManga(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        await Manga.update(
            { title, description },
            { where: { id, user_id: req.user.id } }
        );

        res.json({ message: "Update SelfManga réussi" })
    } catch (error) {
        res.status(500).json({ message: "erreur l'hors de l'updating du selfmanga" })
    }
}


async function DeleteSelfManga(req, res) {
    try {
        const { id } = req.params;

        await Manga.destroy({ where: { id, user_id: req.user.id } });

        res.json({ message: "Manga supprimé" })
    } catch (error) {
        res.status(500).json({ message: "erreur l'hors de la suppression du selfmanga" })
    }
}

async function GetSelfMangaById(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        const chapters = await Chapter.findAll({
            where: { manga_id: id },
            order: [["chapter_number", "ASC"]]
        });

        res.json({ manga, chapters });
    } catch (err) {
        res.status(500).json({ message: "Erreur fetch manga" });
    }
}

export { CreateManga, GetUsersSelfManga, UpdateSelfManga, DeleteSelfManga, GetSelfMangaById };