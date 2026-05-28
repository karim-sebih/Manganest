import instance from "./config.js";

async function searchManga(query, limit = 10, offset = 0) {
  try {
    const response = await instance.get("/api/manga/search", {
      params: { q: query, limit, offset },
    });

    return response.data;
  } catch (error) {
    console.error("Search API Error:", error.response?.data || error.message);
    throw error;
  }
}


async function getAllManga(
  limit,
  offset,
  contentFilters
) {

  const filters =
    contentFilters.join(",");

  const response = await instance.get(
    `/api/manga/all-mangas?limit=${limit}&offset=${offset}&contentRating=${filters}`
  );

  return response.data;
}

async function getLatestChapters(
  limit,
  offset,
  language,
  contentFilters = []
) {

  const filters = contentFilters.join(",");

  const response = await instance.get(
    "/api/manga/latest-chapters",
    {
      params: {
        limit,
        offset,
        language,
        filters
      }
    }
  );

  return response.data;
}


async function getMangaById(
  id,
  languages = ["fr"]
) {

  const langQuery = languages.join(",");

  const response = await instance.get(
    `/api/manga/${id}?lang=${langQuery}`
  );

  return response.data;
}
async function getMangaCover(id) {
  const response = await instance.get(`/api/manga/${id}/cover`);
  return response.data;
}

async function getChapterPages(id) {
  const response = await instance.get(`/api/manga/chapter/${id}/pages`);
  return response.data;
}

export { searchManga, getMangaById, getAllManga, getLatestChapters, getMangaCover, getChapterPages };

