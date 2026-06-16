import Page from "../models/Page.js"
import Chapter from "../models/Chapter.js"
import upload from "../middlewares/upload.js";
import Manga from "../models/Manga.js";



async function CreatePage(req, res) {
    try {
        const { id: chapter_id } = req.params;

        const chapter = await Chapter.findByPk(chapter_id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const pages = req.files.map((file, index) => ({
            chapter_id,
            image_url: `/uploads/${file.filename}`,
            page_number: index + 1
        }));

        await Page.bulkCreate(pages);

        res.json({ message: "Pages uploadées" });
    } catch (error) {
        res.status(500).json({ message: "Erreur création page" });
    }
}


async function GetPageByChapter(req, res) {
    try {
        const { chapter_id } = req.params;

        const pages = await Page.findAll({
            where: { chapter_id },
            order: [["page_number", "ASC"]],
        });

        res.json(pages);
    } catch {
        res.status(500).json({ message: "Erreur fetch pages" });
    }
}


async function UpdatePage(req, res) {
    try {
        const { id } = req.params;
        const { page_number } = req.body;

        const page = await Page.findByPk(id);
        const chapter = await Chapter.findByPk(page.chapter_id);
        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }


        await Page.update(
            { page_number },
            { where: { id } }
        );

        res.json({ message: "Page mise à jour" });
    } catch {
        res.status(500).json({ message: "Erreur update page" });
    }
}


async function DeletePage(req, res) {
    try {
        const { id } = req.params;

        const page = await Page.findByPk(id);
        if (!page) return res.status(404).json({ message: "Page not found" });

        const chapter = await Chapter.findByPk(page.chapter_id);
        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        await Page.destroy({ where: { id } });

        res.json({ message: "Suppression réussie" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression page" });
    }
}


export { CreatePage, GetPageByChapter, UpdatePage, DeletePage }