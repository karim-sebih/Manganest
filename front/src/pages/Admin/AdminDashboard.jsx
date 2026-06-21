import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminuser.js";
import { GetPendingManga } from "../../api/adminmanga.js";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        mangas: 0,
        pending: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const users = await getAllUsers();
                const pending = await GetPendingManga();

                setStats({
                    users: users.length,
                    mangas: 0,
                    pending: pending.length,
                });
            } catch (err) {
                console.error(err);
            }
        }

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

            {/* ✅ CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* USERS */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Users</h2>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>

                {/* MANGAS */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Mangas</h2>
                    <p className="text-3xl font-bold">{stats.mangas}</p>
                </div>

                {/* PENDING */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">En attente</h2>
                    <p className="text-3xl font-bold text-yellow-500">
                        {stats.pending}
                    </p>
                </div>
            </div>

            {/* ✅ SECTION ACTIVITÉ */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Activité récente</h2>

                <ul className="space-y-2 text-gray-600">
                    <li>✅ Nouveau user inscrit</li>
                    <li>📖 Manga soumis pour validation</li>
                    <li>❌ Manga refusé</li>
                </ul>
            </div>
        </div>
    );
}
