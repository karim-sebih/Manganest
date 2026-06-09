import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import handleLogout from "../../utils/helpers.js";
import { useTranslation } from "react-i18next";



export default function Login() {
    const { t } = useTranslation();
    const loginSchema = z.object({
        email: z.string().email("Email invalide").optional().or(z.string().email()),
        password: z.string().min(1, "Mot de passe requis"),
    })
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            return await login(data);
        },
        onSuccess: (response) => {
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("email", response.data?.email);
            localStorage.setItem("role", response.data?.role);
            localStorage.setItem("token", response.data?.token);
            localStorage.setItem("userId", response.data?.id);

            navigate("/");

        },
        onError: (error) => {
            if (error.code === "ERR_NETWORK") {
                alert("Impossible de contacter le serveur.");
            } else if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Erreur lors de la connexion");
            }
        },
    });

    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
        return (
            <>
                <h1>
                    {t('auth.login.alreadyLoggedIn', { username: localStorage.getItem("username") })}
                </h1>
                <button onClick={handleLogout} className="bg-red-500 text-white p-2">
                    {t('auth.login.logout')}
                </button>
            </>
        );
    }

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full" >
                <input placeholder={t('auth.login.email')} {...register("email")} className="border p-2 mb-2 w-full" type="text" autoComplete="username" />
                <input placeholder={t('auth.login.password')} {...register("password")} className="border p-2 mb-2 w-full" type="password" autoComplete="current-password" />
                <button type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending
                        ? t('auth.login.loggingIn')
                        : t('auth.login.loginButton')
                    }
                </button>
            </form>
        </>
    );

}