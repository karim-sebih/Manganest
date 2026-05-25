import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMangaById } from "../api/manga.js";



export default function MangaDetails() {
    const { id } = useParams();

    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchManga() {
            try {
                setLoading(true);

                const data = await getMangaById(id);

                setManga(data);
            } catch (error) {
                console.error(error);
                setError('')
            }
        }
    })
}