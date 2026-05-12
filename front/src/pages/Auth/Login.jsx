import {Link,useNavigate} from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import handleLogout from "../../utils/helpers.js";

const loginSchema = z.object({
    email: z.string().email("Email invalide").optional().or(z.string().email()),
    password: z.string().min(1, "Mot de passe requis"),
})

export default function Login(){
    const navigate = useNavigate();

    const {register, handleSubmit} = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async(data)=>{
            return await login(data);
        },
        onSuccess: (response)=>{
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("email", response.data?.email);
            localStorage.setItem("role", response.data?.role);
            localStorage.setItem("token", response.data?.token);
            localStorage.setItem("userId", response.data?.id);

            

        },
        onError: (error)=>{
            if (error.code === "ERR_NETWORK") {
                alert("Impossible de contacter le serveur.");
            } else if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Erreur lors de la connexion");
            }
        },
    });

    const isLoggedIn = !!localStorage.getItem("email");

    if (isLoggedIn){
        return(
            <>
            <h1 className="text-2xl font-bold mb-4">Vous êtes déjà connecté en tant que {localStorage.getItem("username")}</h1>
            <button onClick={()=>{handleLogout();
            navigate("/auth/login");
            }} className="bg-red-500 text-white p-2">Logout</button>
            </>
        );
    }

    const onSubmit=(data) =>{
        loginMutation.mutate(data);
    }

    return(
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full" >
            <input placeholder="Email " {...register("email")} className="border p-2 mb-2 w-full" type="text" autoComplete="username"/>
            <input placeholder="Password" {...register("password")} className="border p-2 mb-2 w-full" type="password" autoComplete="current-password"/>
<button 
    type="submit" 
    className="bg-blue-500 text-white p-2 w-full"
    disabled={loginMutation.isPending}
>
    {loginMutation.isPending ? "Connexion..." : "Login"}
</button>        </form>
        </>
    );

}