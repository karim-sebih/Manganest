import mangadexService from "../services/mangadex.service.js";

async function searchManga(req, res) {
  try {
    const { q, limit = 10, offset = 0 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: "La recherche doit contenir au moins 2 caractères",
      });
    }

    const results = await mangadexService.searchManga(
      q,
      parseInt(limit),
      parseInt(offset),
    );

    res.json({
      success: true,
      count: results.length,
      mangas: results.map((manga) => ({
        id: manga.id,
        title: manga.localTitle || manga.title?.en,
        description:
          typeof manga.localDescription === "string"
            ? manga.localDescription.substring(0, 150) + "..."
            : null,
        cover: manga.mainCover?.url || null,
        tags: manga.tags?.map((tag) => tag.localName) || [],
        year: manga.year,
        status: manga.status,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getMangaById(req, res) {
  try {
    const { id } = req.params;
    const manga = await mangadexService.getMangaById(id);

    if (!manga) {
      return res
        .status(404)
        .json({ success: false, error: "Manga non trouvé" });
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
        tags: manga.tags?.map((tag) => tag.localName) || [],

        authors:
          manga.authors?.map((a) => a.name || a.localName || "Unknown") || [],

        artists:
          manga.artists?.map((a) => a.name || a.localName || "Unknown") || [],

        cover:
          manga.mainCover?.url ||
          (manga.mainCover && manga.mainCover.fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${manga.mainCover.fileName}`
            : null),

        lastChapter: manga.lastChapter,
        lastVolume: manga.lastVolume,
      },
    });
  } catch (error) {
    console.error("Erreur getMangaById:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ← getMangaById est bien fermé ici

async function getAllManga(req, res) {
  try {
    const { limit = 20, offset = 0, orderby = 'latest' } = req.query;
    const mangaList = await mangadexService.getAllManga(
      parseInt(limit, 10),
      parseInt(offset, 10)
    );
    res.json({
      success: true,
      mangas: mangaList.map((manga) => ({
        id: manga.id,
        title: manga.localTitle || manga.title?.en,
        description: manga.localDescription
          ? manga.localDescription.substring(0, 150) + "..."
          : null,
        cover: manga.mainCover?.url || null,
        tags: manga.tags?.map((tag) => tag.localName) || [],
        year: manga.year,
        status: manga.status,
      })),
    });
  } catch (error) {
    console.error("Erreur getAllManga:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getLatestChapters(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 12;

    const data = await mangadexService.getLatestChapters(limit);

    res.json({
      success: true,
      chapters: data
    });
  } catch (error) {
    console.error("Erreur getLatestChapters:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

export { searchManga, getMangaById, getAllManga, getLatestChapters };