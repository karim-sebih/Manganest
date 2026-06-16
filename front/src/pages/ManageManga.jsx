import { useQuery } from "@tanstack/react-query";
import { getAllSelfMangas } from "../api/selfmanga.js";
import { useNavigate } from "react-router";

export default function CreatorDashboard() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["my-mangas"],
        queryFn: getAllSelfMangas,
    });

    if (isLoading) return <div>Loading...</div>;

    const mangas = data;

    if (!mangas || mangas.length === 0) {
        navigate("/creator/rules");
        return null;
    }

    if (manga.status === "pending") {
        return <div> En attente de validation admin</div>;
    }

    if (manga.status === "rejected") {
        return <div> Refusé</div>;
    }

    return (
        <div>
            <h1>Mes mangas</h1>

            {mangas.map((manga) => (
                <div key={manga.id}>
                    <h2>{manga.title}</h2>
                    <p>Status: {manga.status}</p>

                    <button
                        onClick={() => navigate(`/creator/manga/${manga.id}`)}
                    >
                        Gérer
                    </button>
                </div>
            ))}
        </div>
    );
}
