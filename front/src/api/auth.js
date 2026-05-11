import instance from "./instance";

async function register(user) {
    return await instance.post("/auth/register",user);
}

async function login(user){
    return await instance.post("/auth/login", user);
}

export default {register, login};