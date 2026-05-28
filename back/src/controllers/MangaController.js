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

function getTitle(manga, lang = "en") {
  return (
    manga.attributes?.title?.[lang] ||
    manga.attributes?.title?.en ||
    Object.values(manga.attributes?.title || {})[0] ||
    "Titre inconnu"
  );
}

function getDescription(manga, lang = "fr") {
  return (
    manga.attributes?.description?.[lang] ||
    manga.attributes?.description?.en ||
    Object.values(manga.attributes?.description || {})[0] ||
    null
  );
}

async function searchManga(req, res) {
  try {

    const { q, limit = 10, offset = 0 } = req.query;
    const lang = req.query.lang || "fr";

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

        title: getTitle(manga, lang),

        description:
          typeof getDescription(manga, lang) === "string"
            ? getDescription(manga, lang).substring(0, 150) + "..."
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

    const lang = req.query.lang || "fr";

    const manga =
      await mangadexService.getMangaById(id);

    const chaptersData =
      await mangadexService.getMangaChapters(
        id,
        [lang]
      );

    if (!manga) {
      return res.status(404).json({
        success: false,
        error: "Manga non trouvé",
      });
    }

    const authors = manga.relationships
      ?.filter((rel) => rel.type === "author")
      ?.map(
        (author) =>
          author.attributes?.name || "Unknown"
      ) || [];

    const artists = manga.relationships
      ?.filter((rel) => rel.type === "artist")
      ?.map(
        (artist) =>
          artist.attributes?.name || "Unknown"
      ) || [];

    const chapters = chaptersData.map(
      (chapter) => ({
        id: chapter.id,

        title: getTitle(manga, lang),

        chapter:
          chapter.attributes?.chapter || "?",

        volume:
          chapter.attributes?.volume,

        publishAt:
          chapter.attributes?.publishAt,

        language:
          chapter.attributes
            ?.translatedLanguage,
      })
    );

    res.json({
      success: true,

      manga: {
        id: manga.id,

        title: getTitle(manga, lang),

        altTitles:
          manga.attributes?.altTitles || [],

        description:
          getDescription(manga, lang) || "Aucune description disponible",

        status:
          manga.attributes?.status,

        year:
          manga.attributes?.year,

        tags:
          manga.attributes?.tags?.map(
            (tag) =>
              tag.attributes?.name?.en
          ) || [],

        authors,

        artists,

        cover: buildCoverUrl(manga),

        lastChapter:
          manga.attributes?.lastChapter,

        lastVolume:
          manga.attributes?.lastVolume,
      },

      chapters,
    });
    console.log(chaptersData);
  } catch (error) {

    console.error(
      "Erreur getMangaById:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getAllManga(req, res) {
  try {

    const contentFilters = req.query.filters
      ? req.query.filters.split(",")
      : ["safe", "suggestive"];

    const included = req.query.included
      ? req.query.included.split(",")
      : [];

    const excluded = req.query.excluded
      ? req.query.excluded.split(",")
      : [];

    const { limit = 20, offset = 0 } = req.query;
    const lang = req.query.lang || "fr";

    const mangaList = await mangadexService.getAllManga(
      parseInt(limit, 10),
      parseInt(offset, 10),
      contentFilters,
      included,
      excluded
    );

    res.json({
      success: true,

      mangas: mangaList.map((manga) => ({

        id: manga.id,

        title: getTitle(manga, lang),

        description:
          typeof getDescription(manga, lang) === "string"
            ? getDescription(manga, lang).substring(0, 150) + "..."
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

    const contentFilters = req.query.filters
      ? req.query.filters.split(",")
      : ["safe", "suggestive"];
    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = parseInt(req.query.offset, 10) || 0;

    const language = req.query.language || "fr";

    const included = req.query.included
      ? req.query.included.split(",")
      : [];

    const excluded = req.query.excluded
      ? req.query.excluded.split(",")
      : [];
    const data =
      await mangadexService.getLatestChapters(
        limit,
        offset,
        language,
        contentFilters,
        included,
        excluded
      );
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

async function getChapterPages(req, res) {

  try {

    const { id } = req.params;

    const chapterData =
      await mangadexService.getChapterPages(id);

    if (!chapterData) {

      return res.status(404).json({
        success: false,
        error: "Pages non trouvées",
      });
    }

    const baseUrl = chapterData.baseUrl;

    const hash =
      chapterData.chapter.hash;

    const pages =
      chapterData.chapter.data.map(
        (page) =>
          `${baseUrl}/data/${hash}/${page}`
      );

    res.json({
      success: true,
      pages,
    });

  } catch (error) {

    console.error(
      "Erreur getChapterPages:",
      error.message
    );

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
  getChapterPages
};