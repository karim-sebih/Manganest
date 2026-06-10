import instance from "./config.js";

async function getLibrary() {
    try {
        const response = await instance.get("/library");
        return response.data;
    } catch (error) {
        console.error("Error fetching library:", error);
        throw error;
    }
}

async function addOrUpdateEntry(mangadexId, status, rating) {
    try {
        const response = await instance.post("/library", { mangadexId, status, rating });
        return response.data;
    } catch (error) {
        console.error("Error adding/updating library entry:", error);
        throw error;
    }
}

async function deleteEntry(mangadexId) {
    try {
        const response = await instance.delete(`/library/${mangadexId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting library entry:", error);
        throw error;
    }
}

export { getLibrary, addOrUpdateEntry, deleteEntry };