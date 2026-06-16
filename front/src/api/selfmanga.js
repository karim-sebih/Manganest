import instance from "./config.js";

async function getAllSelfMangas() {
    try {
        const response = await instance.get("/manga");
        return response.data;
    } catch (error) {
        console.error("Error fetching selfmanga:", error);
        throw error;
    }

}

async function getSelfMangaById(id) {
    try {
        const response = await instance.get(`/manga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching selfmanga by id:", error);
        throw error;
    }

}

async function createSelfManga(data) {
    try {
        const response = await instance.post("/manga", data);
        return response.data;
    } catch (error) {
        console.error("Error creating selfmanga :", error);
        throw error;
    }
}

async function updateSelfManga(id, data) {
    try {
        const response = await instance.put(`/manga/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating selfmanga :", error);
        throw error;
    }
}

async function deleteSelfManga(id) {
    try {
        const response = await instance.delete(`/manga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting selfmanga :", error);
        throw error;
    }
}

async function submitManga(id) {
    try {
        const response = await instance.put(`/manga/${id}/submit`);
        return response.data;
    } catch (error) {
        console.error("Error submitting manga:", error);
        throw error;
    }
}

export { getAllSelfMangas, getSelfMangaById, createSelfManga, updateSelfManga, deleteSelfManga, submitManga }