import instance from "./config.js";

async function CreateChapter(data) {
    try {
        const response = await instance.post("/chapter", data);
        return response.data;
    } catch (error) {
        console.error("error creating chapter:", error);
        throw error;
    }
}

async function GetChaptersByManga(id) {
    try {
        const response = await instance.get(`/chapter/manga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapters:", error);
        throw error;
    }
}

async function GetChapterById(id) {
    try {
        const response = await instance.get(`/chapter/${id}`);
        return response.data;
    } catch (error) {
        console.error("error fetching chapter:", error);
    }
}

async function UpdateChapter(id, data) {
    try {
        const response = await instance.put(`/chapter/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("error updating chapter:", error);
        throw error;
    }
}

async function DeleteChapter(id) {
    try {
        const response = await instance.delete(`/chapter/${id}`)
        return response.data;
    } catch (error) {
        console.error("error deleting chapter:", error);
        throw error;
    }
}

export default { CreateChapter, GetChapterById, GetChaptersByManga, UpdateChapter, DeleteChapter };