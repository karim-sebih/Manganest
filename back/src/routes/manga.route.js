import express from 'express';
import {searchManga, getMangaById} from '../controllers/MangaController.js';

const Mangarouter = express.Router();

Mangarouter.get('/search', searchManga);
Mangarouter.get('/:id', getMangaById);

export default Mangarouter;