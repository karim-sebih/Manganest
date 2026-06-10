import { useParams, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getChapterPages } from "../../api/manga.js";
import { getCommentsByChapter, createComment, deleteComment, updateComment } from "../../api/comments.js";
import { addLike, getLikesByChapter, removeLike } from "../../api/like.js";
import { useTranslation } from "react-i18next";

export default function Chapter() {
    const { t } = useTranslation();
    const { id } = useParams();
    const username = localStorage.getItem("username");
    const location = useLocation();
    const navigate = useNavigate();

    const { mangaId, chapters, currentIndex } = location.state || {};
    const prevChapter = chapters?.[currentIndex + 1];
    const nextChapter = chapters?.[currentIndex - 1];

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);


    useEffect(() => {
        async function fetchPage() {
            try {
                setLoading(true);
                const data = await getChapterPages(id);
                setPages(data.pages);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger la page");
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [id]);

    const fetchComments = async () => {
        try {
            const data = await getCommentsByChapter(id);
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleCreate = async () => {
        if (!content.trim()) return;

        await createComment({
            content,
            mangadex_id: mangaId,
            mangadex_chapter_id: id,
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

    const fetchLikes = async () => {
        try {
            const data = await getLikesByChapter(id);

            setLikesCount(data.length);
            const userLiked = data.some(
                (like) => like.User?.username === username
            );
            setLiked(userLiked);
        } catch (err) {
            console.error(err);
        }
    };


    const handleLike = async () => {
        if (!username) return;

        try {
            if (liked) {
                await removeLike(id);
                setLikesCount((prev) => prev - 1);
            } else {
                await addLike(id);
                setLikesCount((prev) => prev + 1);
            }

            setLiked(!liked);
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        fetchLikes();
    }, [id]);



    // scroll top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <p className="text-xl text-gray-400">{t('chapter.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {t('chapter.error')}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center">

            {pages.map((page, index) => (
                <img
                    key={index}
                    src={page}
                    alt={`Page ${index + 1}`}
                    className="w-full max-w-5xl"
                    loading="lazy"
                />
            ))}

            <div className="w-full max-w-5xl flex justify-between items-center py-10">
                <button
                    disabled={!prevChapter}
                    onClick={() =>
                        navigate(`/chapter/${prevChapter.id}`, {
                            state: {
                                mangaId,
                                chapters,
                                currentIndex: currentIndex + 1
                            }
                        })
                    }
                    className="bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-30"
                >
                    ⬅️ Précédent
                </button>

                <button
                    disabled={!nextChapter}
                    onClick={() =>
                        navigate(`/chapter/${nextChapter.id}`, {
                            state: {
                                mangaId,
                                chapters,
                                currentIndex: currentIndex - 1
                            }
                        })
                    }
                    className="bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-30"
                >
                    Suivant ➡️
                </button>
            </div>

            <div className="w-full max-w-5xl flex items-center justify-between py-6 text-white">

                <button
                    onClick={handleLike}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${liked ? "bg-red-600" : "bg-gray-800"
                        }`}
                >
                    ❤️ {likesCount}
                </button>

                {!username && (
                    <p className="text-gray-400 text-sm">
                        Connecte-toi pour liker
                    </p>
                )}

            </div>

            <div className="w-full max-w-5xl text-white mb-20">
                <h2 className="text-2xl mb-4">Commentaires</h2>

                {/* CREATE */}
                {!username && (
                    <p className="text-gray-400 mb-4">
                        Connecte-toi pour écrire un commentaire
                    </p>
                )}

                {username && (
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
                )}


                {/* LIST */}
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-900 p-4 rounded">
                            <p className="text-sm text-gray-400 mb-1">
                                {comment.User?.username || "User"}
                            </p>

                            {editingId === comment.id ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="flex-1 px-2 py-1 bg-gray-800 rounded"
                                    />
                                    <button
                                        onClick={() => handleUpdate(comment.id)}
                                        className="bg-green-600 px-2 rounded"
                                    >
                                        ✓
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
    );
}
