import instance from "./config.js";

async function searchManga(query, limit = 10, offset = 0) {
  try {
    const response = await instance.get("/api/manga/search", {   // ← AJOUTE /api ici
      params: { q: query, limit, offset },
    });

    return response.data;
  } catch (error) {
    console.error("Search API Error:", error.response?.data || error.message);
    throw error;
  }
}


async function getAllManga() {
  const response = await instance.get(`/api/manga/all-mangas`);
  return response.data;
}

async function getLatestChapters(limit = 20, offset = 0) {
  const response = await instance.get(`/api/manga/chapter`, {
    params: { limit, offset }
  });
  return response.data;
}

async function getMangaById(id) {
  const response = await instance.get(`/api/manga/${id}`);   // ← AJOUTE /api ici aussi
  return response.data;
}

async function getMangaCover(id) {
  const response = await instance.get(`/api/manga/${id}/cover`);
  return response.data;
}


export { searchManga, getMangaById, getAllManga, getLatestChapters, getMangaCover };

