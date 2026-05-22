import mangadexService from "../services/mangadex.service.js";

function buildCoverUrl(manga) {

  const coverRel = manga.relationships?.find(
    (rel) => rel.type === "cover_art"
  );

  if (coverRel?.attributes?.fileName) {
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`;
  }

  return null;
}

function getTitle(manga) {
  return (
    manga.attributes?.title?.en ||
    Object.values(manga.attributes?.title || {})[0] ||
    "Titre inconnu"
  );
}

function getDescription(manga) {
  return (
    manga.attributes?.description?.fr ||
    manga.attributes?.description?.en ||
    Object.values(manga.attributes?.description || {})[0] ||
    null
  );
}

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
      parseInt(limit, 10),
      parseInt(offset, 10),
    );

    res.json({
      success: true,

      count: results.length,

      mangas: results.map((manga) => ({

        id: manga.id,

        title: getTitle(manga),

        description:
          typeof getDescription(manga) === "string"
            ? getDescription(manga).substring(0, 150) + "..."
            : null,

        cover: buildCoverUrl(manga),

        tags:
          manga.attributes?.tags?.map(
            (tag) => tag.attributes?.name?.en
          ) || [],

        year: manga.attributes?.year,

        status: manga.attributes?.status,
      })),
    });

  } catch (error) {

    console.error("searchManga Error:", error.message);

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
      return res.status(404).json({
        success: false,
        error: "Manga non trouvé",
      });
    }

    const authors = manga.relationships
      ?.filter((rel) => rel.type === "author")
      ?.map((author) => author.attributes?.name || "Unknown") || [];

    const artists = manga.relationships
      ?.filter((rel) => rel.type === "artist")
      ?.map((artist) => artist.attributes?.name || "Unknown") || [];

    res.json({
      success: true,

      manga: {

        id: manga.id,

        title: getTitle(manga),

        altTitles: manga.attributes?.altTitles || [],

        description: getDescription(manga),

        status: manga.attributes?.status,

        year: manga.attributes?.year,

        tags:
          manga.attributes?.tags?.map(
            (tag) => tag.attributes?.name?.en
          ) || [],

        authors,

        artists,

        cover: buildCoverUrl(manga),

        lastChapter: manga.attributes?.lastChapter,

        lastVolume: manga.attributes?.lastVolume,
      },
    });

  } catch (error) {

    console.error("Erreur getMangaById:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getAllManga(req, res) {
  try {

    const { limit = 20, offset = 0 } = req.query;

    const mangaList = await mangadexService.getAllManga(
      parseInt(limit, 10),
      parseInt(offset, 10)
    );

    res.json({
      success: true,

      mangas: mangaList.map((manga) => ({

        id: manga.id,

        title: getTitle(manga),

        description:
          typeof getDescription(manga) === "string"
            ? getDescription(manga).substring(0, 150) + "..."
            : null,

        cover: buildCoverUrl(manga),

        tags:
          manga.attributes?.tags?.map(
            (tag) => tag.attributes?.name?.en
          ) || [],

        year: manga.attributes?.year,

        status: manga.attributes?.status,
      })),
    });

  } catch (error) {

    console.error("Erreur getAllManga:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getLatestChapters(req, res) {
  try {

    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = parseInt(req.query.offset, 10) || 0;

    const data = await mangadexService.getLatestChapters(limit, offset);

    res.json({
      success: true,
      chapters: data,
    });

  } catch (error) {

    console.error("Erreur getLatestChapters:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getMangaCover(req, res) {
  try {

    const { id } = req.params;

    const cover = await mangadexService.getMangaCover(id);

    if (!cover) {
      return res.status(404).json({
        success: false,
        error: "Cover non trouvé",
      });
    }

    res.json({
      success: true,
      cover
    });

  } catch (error) {

    console.error("Erreur getMangaCover:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export {
  searchManga,
  getMangaById,
  getAllManga,
  getLatestChapters,
  getMangaCover,
};