import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "fr",
        fallbackLng: "fr",
        debug: true,

        interpolation: {
            escapeValue: false,
        },

        backend: {
            loadPath: "http://localhost:3000/translations/{{lng}}",
            requestOptions: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            },
        },

        react: {
            useSuspense: false,     // Très important avec React 19
        },
    });

export default i18n;