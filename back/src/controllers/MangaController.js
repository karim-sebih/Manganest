import mangadexService from "../services/mangadex.service.js";

async function searchManga(req, res) {
    try{
        const {q , limit= 10} = req.query;

        if (!q) {
            return res.status(400).json({error: "Le paramètre 'q' (titre) est obligatoire"});
        }
         const results = await mangadexService.searchManga(q, parseInt(limit));
            res.json({
                success: true,
                count: results.length,
                mangas: results.map(manga => ({
                    id: manga.id,
                    title: manga.localTitle || manga.title?.en,
                    description: manga.localDescription?manga.localDescription.substring(0, 150) + '...': null,
                    tags: manga.tags?.map(tag => tag.localName) || []
                }))
            });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }};


  async function getMangaById(req, res) {
    try {
        const { id } = req.params;
        const manga = await mangadexService.getMangaById(id);

        if (!manga) {
            return res.status(404).json({ success: false, error: "Manga non trouvé" });
        }

        res.json({
            success: true,
            manga: {
                id: manga.id,
                title: manga.localTitle,
                altTitles: manga.localAltTitles || [],
                description: manga.localDescription,
                status: manga.status,
                year: manga.year,
                tags: manga.tags?.map(tag => tag.localName) || [],
                
                // Authors & Artists corrigés
                authors: manga.authors?.map(a => a.name || a.localName || 'Unknown') || [],
                artists: manga.artists?.map(a => a.name || a.localName || 'Unknown') || [],
                
                // Cover
                cover: manga.mainCover?.url || 
                       (manga.mainCover && manga.mainCover.fileName ? 
                        `https://uploads.mangadex.org/covers/${manga.id}/${manga.mainCover.fileName}` : null),
                
                lastChapter: manga.lastChapter,
                lastVolume: manga.lastVolume
            }
        });

    } catch (error) {
        console.error('Erreur getMangaById:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

    export { searchManga, getMangaById};