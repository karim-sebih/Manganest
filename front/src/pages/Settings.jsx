

export default function Settings() {

    return (
        <div className="min-h-screen bg-[#0B1220] text-white flex">

            {/* SIDEBAR */}

            <aside className="w-64 border-r border-gray-700 p-6">

                <h1 className="text-3xl font-bold mb-10">
                    Settings
                </h1>

                <nav className="space-y-3">

                    <button className="w-full text-left bg-blue-600 px-4 py-2 rounded-xl">
                        View all
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        Language
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        Reading
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        Content Filters
                    </button>

                    <button className="w-full text-left hover:bg-[#1E293B] px-4 py-2 rounded-xl transition">
                        Account
                    </button>

                </nav>

            </aside>

            {/* CONTENT */}

            <main className="flex-1 p-10">

                <div className="max-w-5xl">

                    <h2 className="text-4xl font-bold mb-10">
                        Settings
                    </h2>

                    {/* INTERFACE LANGUAGE */}

                    <section className="border-b border-gray-700 py-8">

                        <div className="flex items-start justify-between gap-10">

                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    Interface Language
                                </h3>

                                <p className="text-gray-400 max-w-xl">
                                    Choose the language used for the interface.
                                </p>
                            </div>

                            <select className="bg-[#1E293B] border border-gray-600 rounded-xl px-4 py-3 min-w-[220px]">
                                <option>English</option>
                                <option>Français</option>
                                <option>日本語</option>
                            </select>

                        </div>

                    </section>

                    {/* CHAPTER LANGUAGE */}

                    <section className="border-b border-gray-700 py-8">

                        <div className="flex items-start justify-between gap-10">

                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    Chapter Language
                                </h3>

                                <p className="text-gray-400 max-w-xl">
                                    The default language the filter for chapter list is set to. Changing the filter in chapter list will not modify this value.
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
                                    Content Filter
                                </h3>

                                <p className="text-gray-400 max-w-xl">
                                    Choose what type of content appears.
                                </p>
                            </div>

                            <div className="space-y-3">

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    Safe
                                </label>

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    Suggestive
                                </label>

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    NSFW
                                </label>

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" />
                                    Mature
                                </label>
                            </div>

                        </div>

                    </section>

                    {/* ACCOUNT */}

                    <section className="py-8">

                        <div className="flex items-start justify-between gap-10">

                            <div>
                                <h3 className="text-2xl font-semibold mb-2 text-red-500">
                                    Danger Zone
                                </h3>

                                <p className="text-gray-400 max-w-xl">
                                    Manage your account actions.
                                </p>
                            </div>

                            <div className="space-y-4">

                                <button className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-xl">
                                    Delete account
                                </button>

                                <button className="bg-gray-700 hover:bg-gray-600 transition px-6 py-3 rounded-xl w-full">
                                    Logout
                                </button>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}