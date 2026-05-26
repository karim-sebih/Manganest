import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getChapterPages } from "../api/manga";

export default function Chapter() {

    const { id } = useParams();

    const navigate = useNavigate();
    const [page, setPage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPage() {
            try {
                setLoading(true)

                const data = await getChapterPages(id);

                setPage(data.pages);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger la page")
            } finally {
                setLoading(false);
            }
        }

        fetchPage();

    }, [id])

    // const handleMangaClick = (id) => {
    //     navigate(`/manga/${id}`);
    // }; (C POUR LA NARBAR)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <p className="text-xl text-gray-400">Chargement des pages</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    console.log(id);

    return (
        <div>

        </div>
    );
}