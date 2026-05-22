import React from "react";

export default function Pagination({
    page,
    setPage,
    hasNextPage = true
}) {

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            setPage(page + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-6 mt-10">

            {/* Gauche */}
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className="
                    w-12 h-12
                    rounded-full
                    bg-[#1E293B]
                    hover:bg-[#334155]
                    transition-all
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    text-2xl
                    flex items-center justify-center
                "
            >
                ←
            </button>

            {/* Droite */}
            <button
                onClick={handleNext}
                disabled={!hasNextPage}
                className="
                    w-12 h-12
                    rounded-full
                    bg-[#1E293B]
                    hover:bg-[#334155]
                    transition-all
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    text-2xl
                    flex items-center justify-center
                "
            >
                →
            </button>
        </div>
    );
}