import express from 'express';

import {
    searchManga,
    getMangaById,
    getAllManga,
    getLatestChapters,
    getMangaCover,
    getChapterPages
} from '../controllers/MangaController.js';

const Mangarouter = express.Router();

Mangarouter.get('/search', searchManga);

Mangarouter.get('/all-mangas', getAllManga);

Mangarouter.get('/latest-chapters', getLatestChapters);

Mangarouter.get('/:id/cover', getMangaCover);

Mangarouter.get('/chapter/:id/pages', getChapterPages);

/* Route dynamique  */
Mangarouter.get('/:id', getMangaById);

export default Mangarouter;