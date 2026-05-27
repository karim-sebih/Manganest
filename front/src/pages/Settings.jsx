import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {
    const { t, i18n } = useTranslation();

    const [currentLang, setCurrentLang] = useState(i18n.language || 'fr');

    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng') || 'fr';
        i18n.changeLanguage(savedLang);
        setCurrentLang(savedLang);
    }, [i18n]);

    const handleLanguageChange = (newLang) => {
        i18n.changeLanguage(newLang);
        setCurrentLang(newLang);
        localStorage.setItem('i18nextLng', newLang);
    };

    return (
        <div className="min-h-screen bg-[#0B1220] text-white flex">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-700 p-6">
                <h1 className="text-3xl font-bold mb-10">
                    {t('settings.title')}
                </h1>

                <nav className="space-y-3">
                    <button className="w-full text-left bg-blue-600 px-4 py-2 rounded-xl">
                        {t('settings.sidebar.viewAll')}
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        {t('settings.sidebar.language')}
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        {t('settings.sidebar.reading')}
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        {t('settings.sidebar.contentFilters')}
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        {t('settings.sidebar.account')}
                    </button>
                </nav>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-10">
                <div className="max-w-5xl">
                    <h2 className="text-4xl font-bold mb-10">
                        {t('settings.title')}
                    </h2>

                    {/* INTERFACE LANGUAGE */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex items-start justify-between gap-10">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.interfaceLanguage.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.interfaceLanguage.description')}
                                </p>
                            </div>

                            <select
                                value={currentLang}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-[#1E293B] border border-gray-600 rounded-xl px-4 py-3 min-w-[220px]"
                            >
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>
                    </section>

                    {/* CHAPTER LANGUAGE */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex items-start justify-between gap-10">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.chapterLanguage.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.chapterLanguage.description')}
                                </p>
                            </div>

                            <select className="bg-[#1E293B] border border-gray-600 rounded-xl px-4 py-3 min-w-[220px]">
                                <option>French</option>
                                <option>English</option>
                            </select>
                        </div>
                    </section>

                    {/* CONTENT FILTER */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex items-start justify-between gap-10">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.contentFilter.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.contentFilter.description')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    {t('settings.contentFilter.safe')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    {t('settings.contentFilter.suggestive')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    {t('settings.contentFilter.nsfw')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    {t('settings.contentFilter.mature')}
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* DANGER ZONE */}
                    <section className="py-8">
                        <div className="flex items-start justify-between gap-10">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2 text-red-500">
                                    {t('settings.dangerZone.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.dangerZone.description')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-xl">
                                    {t('settings.dangerZone.deleteAccount')}
                                </button>

                                <button className="bg-gray-700 hover:bg-gray-600 transition px-6 py-3 rounded-xl w-full">
                                    {t('settings.dangerZone.logout')}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}