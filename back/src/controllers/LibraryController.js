import User from '../models/User.js';
import Library from '../models/Library.js';

async function getLibrary(req, res) {
    try {
        const userId = req.user.id;
        const library = await Library.findAll({ where: { userId } });
        res.json(library);
    } catch (error) {
        console.error('Error fetching library:', error);
        res.status(500).json({ error: 'An error occurred while fetching the library' });
    }
}

async function addOrUpdateEntry(req, res) {
    try {
        const userId = req.user.id;
        const { mangadexId, status, rating } = req.body;

        const [entry, created] = await Library.upsert(
            { userId, mangadexId, status, rating },
            { where: { userId, mangadexId } }
        );

        res.json({ entry, created });
    } catch (error) {
        console.error('Error adding/updating library entry:', error);
        res.status(500).json({ error: 'An error occurred while adding/updating the library entry' });
    }
}

async function deleteEntry(req, res) {
    try {
        const userId = req.user.id;
        const { mangadexId } = req.params;
        const deleted = await Library.destroy({ where: { userId, mangadexId } });
        if (deleted) {
            res.json({ message: 'Entry deleted successfully' });
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        console.error('Error deleting library entry:', error);
        res.status(500).json({ error: 'An error occurred while deleting the library entry' });
    }
}

export { getLibrary, addOrUpdateEntry, deleteEntry };