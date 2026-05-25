import express from 'express';

import {
    searchManga,
    getMangaById,
    getAllManga,
    getLatestChapters,
    getMangaCover
} from '../controllers/MangaController.js';

const Mangarouter = express.Router();

Mangarouter.get('/search', searchManga);

Mangarouter.get('/all-mangas', getAllManga);

Mangarouter.get('/chapter', getLatestChapters);

Mangarouter.get('/:id/cover', getMangaCover);

/* Route dynamique  */
Mangarouter.get('/:id', getMangaById);

export default Mangarouter;