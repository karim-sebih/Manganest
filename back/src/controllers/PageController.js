import Page from "../models/Page.js"
import Chapter from "../models/Chapter.js"
import upload from "../middlewares/upload.js";

async function CreatePage(res, req) {
    try {
        const { id: chapter_id } = req.params;

        const pages = req.files.map((files, index) => ({
            chapter_id,
            image_url: `/uploads/${file.filename}`,
            page_number: index + 1
        }));

        await Page.bulkCreate(pages);

        res.json({ message: "page uploadé" })
    } catch (error) {
        res.status(500).json({ message: "erreur l'hors d'une creation d'une page" })
    }
}

export { CreatePage }