import instance from "./config.js";

async function getUserLibrary() {
    try {
        const response = await instance.get("/library");
        return response.data;
    } catch (error) {
        console.error("Error fetching library:", error);
        throw error;
    }
}

async function addOrUpdateEntry(mangadexId, status) {
    return instance.post("/library", {
        mangadex_id: mangadexId,
        status
    });
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



export { addOrUpdateEntry, deleteEntry, getUserLibrary };