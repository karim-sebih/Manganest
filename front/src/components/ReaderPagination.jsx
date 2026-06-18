export default function Pagination({
    page,
    setPage,
    hasNextPage = true,
    totalPages = null
}) {

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">

            <div className="flex items-center gap-6">

                {/*  PREV */}
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="
                        w-12 h-12 rounded-full
                        bg-[#1E293B]
                        hover:bg-[#334155]
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        text-xl flex items-center justify-center
                    "
                >
                    ←
                </button>

                {/* PAGE */}
                <span className="text-white font-semibold text-lg min-w-[4rem] text-center">
                    {totalPages ? `${page} / ${totalPages}` : page}
                </span>

                {/* NEXT */}
                <button
                    onClick={handleNext}
                    disabled={!hasNextPage}
                    className="
                        w-12 h-12 rounded-full
                        bg-[#1E293B]
                        hover:bg-[#334155]
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        text-xl flex items-center justify-center
                    "
                >
                    →
                </button>
            </div>

        </div>
    );
}
