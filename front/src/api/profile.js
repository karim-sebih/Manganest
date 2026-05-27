import instance from "./config";

async function getProfile() {
    return await instance.get("profile");
}

async function createProfile(newUser) {
    return await instance.post("profile", newUser);
}


async function updateProfile(id, updatedUser) {
    return await instance.put(`profile/${id}`, updatedUser);
}

async function deleteProfile(id) {
    return await instance.delete(`profile/${id}`);
}

async function getProfileById(id) {
    return await instance.get(`profile/${id}`);
}

async function getRoles() {
    return await instance.get("profile/roles");
}

export { getProfile, createProfile, updateProfile, deleteProfile, getProfileById, getRoles };
