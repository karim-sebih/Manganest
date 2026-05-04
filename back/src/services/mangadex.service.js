import { Manga, loginPersonal } from 'mangadex-full-api';
import dotenv from "dotenv";

dotenv.config()

const initMangaDex = async () => {
    try {
        console.log('✅ MangaDex API initialisée avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation MangaDex:', error);
    }
};

const {MANGADEX_CLIENT_ID,MANGADEX_CLIENT_SECRET,MANGADEX_USERNAME,MANGADEX_PASSWORD} = process.env;

const loginToMangadex = async ()=> {
    try {
        await loginPersonal ({
           MANGADEX_CLIENT_ID,
           MANGADEX_CLIENT_SECRET,
           MANGADEX_USERNAME,
           MANGADEX_PASSWORD,
        });
        console.log("Connexion à Mangadex réussite");
    }catch(error){
        console.log ("Echec de connexion avec Mangadex:",error.message)
    }
};

const mangadexService = {
    initMangaDex,
    loginPersonal,

   searchManga: async (title, limit = 20) => {
        return await Manga.search({
            title,
            limit,
            hasAvailableChapters: true,
            availableTranslatedLanguage: ['fr', 'en']
        });
    },

 getMangaById: async (mangadexId) => {
    const manga = await Manga.get(mangadexId, {
        includes: ['author', 'artist', 'cover_art']
    });

    // Résolution manuelle des relations si nécessaire
    if (manga.authors && manga.authors.length > 0) {
        manga.authors = await Promise.all(
            manga.authors.map(author => author.resolve ? author.resolve() : author)
        );
    }

    if (manga.artists && manga.artists.length > 0) {
        manga.artists = await Promise.all(
            manga.artists.map(artist => artist.resolve ? artist.resolve() : artist)
        );
    }

    return manga;
},

    getChapters: async (mangaIdOrObject) => {
        let manga;

        if (typeof mangaIdOrObject === 'string') {
            manga = await Manga.get(mangaIdOrObject);
        } else {
            manga = mangaIdOrObject;
        }

        return await manga.getFeed({
            availableTranslatedLanguage: ['fr', 'en'],
            limit: 100,
            order: { chapter: 'desc' }
        });
    },

    getChapterPages: async (chapter) => {
        return await chapter.getReadablePages();
    }
};
export default mangadexService;