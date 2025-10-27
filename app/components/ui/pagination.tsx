import Image from "next/image";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import React from "react";


const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = React.memo(({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number | undefined;

        range.push(1);

        if (totalPages <= 1) return range;

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }
        range.push(totalPages);

        for (let i = 0; i < range.length; i++) {
            if (l !== undefined) {
                if (range[i] - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (range[i] - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(range[i]);
            l = range[i];
        }

        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                    }`}
            >
                <Image src={previous} width={24} height={24} alt="Previous" />
            </button>

            <div className="flex items-center gap-2">
                {getPageNumbers().map((pageNumber, index) => (
                    <button
                        key={index}
                        onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
                        className={`px-3 py-1 rounded-lg transition-colors ${pageNumber === currentPage
                            ? "bg-black text-white"
                            : typeof pageNumber === 'number'
                                ? "hover:bg-gray-100"
                                : ""
                            }`}
                    >
                        {pageNumber}

                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                    }`}
            >
                <Image src={next} width={24} height={24} alt="Next" />
            </button>
        </div>
    );
});

export default Pagination;