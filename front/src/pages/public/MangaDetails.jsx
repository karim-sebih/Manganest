import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getMangaById } from "../../api/manga.js";
import { useTranslation } from "react-i18next";
import {
    getCommentsByManga,
    createComment,
    deleteComment,
    updateComment
} from "../../api/comments.js";

export default function MangaDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    //  STATES
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chapters, setChapters] = useState([]);

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const username = localStorage.getItem("username");

    //  FETCH MANGA
    useEffect(() => {
        async function fetchManga() {
            try {
                setLoading(true);

                const chapterLanguage =
                    localStorage.getItem("chapterLanguage") || "fr";

                const data = await getMangaById(id, [chapterLanguage]);

                setManga(data.manga);
                setChapters(data.chapters);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger le manga");
            } finally {
                setLoading(false);
            }
        }

        fetchManga();
    }, [id]);

    //  FETCH COMMENTS
    const fetchComments = async () => {
        try {
            const data = await getCommentsByManga(id);
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    //  ACTIONS
    const handleCreate = async () => {
        if (!content.trim()) return;

        await createComment({
            content,
            mangadex_id: id,
            mangadex_chapter_id: null,
        });

        setContent("");
        fetchComments();
    };

    const handleDelete = async (commentId) => {
        await deleteComment(commentId);
        fetchComments();
    };

    const handleUpdate = async (commentId) => {
        await updateComment(commentId, editContent);

        setEditingId(null);
        setEditContent("");
        fetchComments();
    };

    const handleChapterClick = (chapterId, index) => {
        navigate(`/chapter/${chapterId}`, {
            state: {
                mangaId: id,
                chapters,
                currentIndex: index
            }
        });
    };

    //  CONDITIONS (APRÈS LES HOOKS)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
                {t('mangaDetails.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {t('mangaDetails.error')}
            </div>
        );
    }

    //  RENDER
    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex flex-col md:flex-row gap-10">
                    <img
                        src={manga.cover}
                        alt={manga.title}
                        className="w-64 h-[380px] object-cover rounded-2xl shadow-lg"
                    />

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">
                            {manga.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {manga.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 leading-7">
                            {manga.description}
                        </p>

                        <div className="mt-8 space-y-2 text-gray-400">
                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.author')}
                                </span>{" "}
                                {manga.authors?.join(", ")}
                            </p>

                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.artist')}
                                </span>{" "}
                                {manga.artists?.join(", ")}
                            </p>

                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.status')}
                                </span>{" "}
                                {manga.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/*  CHAPTERS */}
                <div className="mt-14">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('mangaDetails.chaptersSection')}
                    </h2>

                    <div className="space-y-3">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                onClick={() => handleChapterClick(chapter.id, index)}
                                className="bg-[#1E293B] p-5 rounded-xl cursor-pointer hover:bg-[#334155]"
                            >
                                <p className="text-lg font-semibold">
                                    {t('mangaDetails.chapterPrefix')} {chapter.chapter}
                                </p>

                                <p className="text-gray-400">
                                    {chapter.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💬 COMMENTS */}
                <div className="mt-16 max-w-5xl">
                    <h2 className="text-2xl mb-4">Commentaires</h2>

                    {username ? (
                        <div className="flex gap-2 mb-6">
                            <input
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Écrire un commentaire..."
                                className="flex-1 px-4 py-2 rounded bg-gray-800"
                            />
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 px-4 py-2 rounded"
                            >
                                Envoyer
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-4">
                            Connecte-toi pour écrire un commentaire
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-900 p-4 rounded">

                                <p className="text-sm text-gray-400 mb-1">
                                    {comment.User?.username || "Utilisateur inconnu"}
                                </p>

                                {editingId === comment.id ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="flex-1 px-2 py-1 bg-gray-800 rounded"
                                        />
                                        <button
                                            onClick={() => handleUpdate(comment.id)}
                                            className="bg-green-600 px-2 rounded"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}

                                {comment.User?.username === username && (
                                    <div className="flex gap-3 mt-2 text-sm">
                                        <button
                                            onClick={() => {
                                                setEditingId(comment.id);
                                                setEditContent(comment.content);
                                            }}
                                            className="text-yellow-400"
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-400"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
