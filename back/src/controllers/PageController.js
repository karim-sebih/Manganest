import Page from "../models/Page.js"
import Chapter from "../models/Chapter.js"
import upload from "../middlewares/upload.js";

async function CreatePage(res, req) {
    try {
        const { id: chapter_id } = req.params;

    } catch (error) {
        res.status(500).json({ message: "erreur l'hors d'une creation d'une page" })
    }
}