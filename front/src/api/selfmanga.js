import instance from "./config.js";

async function getAllMangas() {
    try {
        const response = await instance.get("/manga");
        return response.data;
    } catch (error) {

    }

}

async function getMangaById(id) {
    const res = await instance.get(`/manga/${id}`);
    return res.data;
}

async function createManga(data) {
    const res = await instance.post("/manga", data);
    return res.data;
}

async function updateManga(id, data) {
    const res = await instance.put(`/manga/${id}`, data);
    return res.data;
}

async function deleteManga(id) {
    const res = await instance.delete(`/manga/${id}`);
    return res.data;
}

export default { getAllMangas, getMangaById, createManga, updateManga, deleteManga }