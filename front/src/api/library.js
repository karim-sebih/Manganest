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
};

async function getLibraryLatestChapters() {
    try {
        const res = await instance.get("/library/latest-chapters");
        return res.data;
    } catch (error) {
        console.error("Error fetching library latest chapters:", error);
        throw error;
    }
}



export { getLibrary, addOrUpdateEntry, deleteEntry, getLibraryLatestChapters };