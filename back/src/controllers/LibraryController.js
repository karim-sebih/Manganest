import User from '../models/User.js';
import Library from '../models/Library.js';
import mangadexService from "../services/mangadex.service.js";


async function getLibrary(req, res) {
    try {
        const user_id = req.user.id;
        const { status } = req.query;

        const where = { user_id };
        if (status) where.status = status;

        const library = await Library.findAll({ where });

        res.json(library);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching library' });
    }
}

async function addOrUpdateEntry(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id, status } = req.body;

        await Library.upsert({
            user_id,
            mangadex_id,
            status
        });

        const entry = await Library.findOne({
            where: { user_id, mangadex_id }
        });

        res.json({ entry });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving library entry' });
    }
}

async function deleteEntry(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id } = req.params;

        const deleted = await Library.destroy({
            where: { user_id, mangadex_id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting entry' });
    }
}



async function getLibraryLatestChapters(req, res) {
    try {
        const user_id = req.user.id;

        const library = await Library.findAll({
            where: { user_id }
        });

        const ids = library.map(l => l.mangadex_id);

        if (!ids.length) return res.json([]);

        const languages = req.query.languages || ["fr"];

        const chapters = await mangadexService.getLatestChaptersByMangaIds(
            ids,
            languages
        );

        // ✅ 1 chapitre par manga
        const seen = new Set();

        const uniqueChapters = chapters.filter(chapter => {
            if (!chapter.mangaId || seen.has(chapter.mangaId)) return false;

            seen.add(chapter.mangaId);
            return true;
        });

        res.json(uniqueChapters);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching library chapters" });
    }
}




export { getLibrary, addOrUpdateEntry, deleteEntry, getLibraryLatestChapters };