import { useRef } from "react";

export default function Carousel({ title, items, renderItem }) {
    const scrollRef = useRef();

    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = 300;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{title}</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            >
                {items.length === 0 ? (
                    <p className="text-gray-400">Aucun contenu</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="min-w-[150px] flex-shrink-0">
                            {renderItem(item)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
