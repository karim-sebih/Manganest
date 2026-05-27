import * as z from "zod";
import { register } from "../../api/auth.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();

    // Schema Zod 
    const registerSchema = z.object({
        username: z.string().min(1, t('auth.register.validation.usernameRequired')),
        email: z.string().email(t('auth.register.validation.emailInvalid')),
        password: z.string().min(8, t('auth.register.validation.passwordMin')),
        confirmPassword: z.string(),
    })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.register.validation.passwordsNotMatch'),
            path: ["confirmPassword"],
        });

    const navigate = useNavigate();

    const {
        register: formRegister,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/auth/login");
        },
        onError: (err) => {
            alert(err.response?.data?.error || t('common.error'));
        },
    });

    const onSubmit = (data) => {
        registerMutation.mutate(data);
    };

    if (localStorage.getItem("token")) {
        return (
            <>
                <h1 className="text-2xl font-bold mb-4">
                    {t('auth.register.alreadyLoggedIn', {
                        username: localStorage.getItem("username")
                    })}
                </h1>
                <Link to="/">{t('auth.register.goToHomepage')}</Link>
            </>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
            <input
                placeholder={t('auth.register.username')}
                {...formRegister("username")}
                className="border p-2 mb-2 w-full"
                type="text"
                autoComplete="given-username"
            />
            <input
                placeholder={t('auth.register.email')}
                {...formRegister("email")}
                className="border p-2 mb-2 w-full"
                type="email"
                autoComplete="email"
            />
            <input
                placeholder={t('auth.register.password')}
                {...formRegister("password")}
                className="border p-2 mb-2 w-full"
                type="password"
                autoComplete="new-password"
            />
            <input
                placeholder={t('auth.register.confirmPassword')}
                {...formRegister("confirmPassword")}
                className="border p-2 mb-2 w-full"
                type="password"
                autoComplete="new-password"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 w-full"
                disabled={registerMutation.isPending}
            >
                {registerMutation.isPending ? t('auth.login.loggingIn') : t('auth.register.registerButton')}
            </button>
        </form>
    );
}