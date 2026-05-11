import * as z from "zod";
import { register } from "../../api/auth.js";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {Link} from "react-router";

const registerSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path : ["confirmPassword"],
    });

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: async (data) =>{
            return await register({
                username: data.username,
                email: data.email,
                password: data.password,
            });
        },
        onSuccess: ()=> {
            navigate("/auth/login");
        },
        onError: (err)=>{
            alert(err.response?.data?.error || "Une erreur est survenue");
        },

    });

    const onSubmit = (data) =>{
        registerMutation.mutate(data);
    };

    if (localStorage.getItem("token")) {
        return(
            <>
            <h1 className="text-2xl font-bold mb-4">Vous êtes déjà connecté en tant que {localStorage.getItem("username")}</h1>
            <Link to ="/">Go to homepage</Link>
            </>
        );
    }
        return(
        <>
<form onSubmit={handleSubmit(onSubmit)} className="w-full" >
            <input placeholder="Username" {...register("username")} className="border p-2 mb-2 w-full" type="text" autoComplete="given-username"/>
            <input placeholder="Email" {...register("email")} className="border p-2 mb-2 w-full" type="email" autoComplete="email"/>
            <input placeholder="Password" {...register("password")} className="border p-2 mb-2 w-full" type="password" autoComplete="new-password"/>
            <input placeholder="Confirm Password" {...register("confirmPassword")} className="border p-2 mb-2 w-full" type="password" autoComplete="new-password"/>
            <button onClick={handleSubmit(onSubmit)} className="bg-blue-500 text-white p-2 w-full">Register</button>
</form>
        </>


        );   
    }