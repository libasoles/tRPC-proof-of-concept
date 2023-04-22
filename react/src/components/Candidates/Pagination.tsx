import { useState, useEffect } from "react";
import "./Pagination.css";

// @ts-ignore
const Pagination = ({ currentPage, setCurrentPage, totalRows, rowsPerPage }) => {
    const numberOfPages = Math.ceil(totalRows / rowsPerPage);

    const pages = [...new Array(numberOfPages)];

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoNext, setCanGoNext] = useState(true);

    const onNextPage = () => setCurrentPage(currentPage + 1);
    const onPrevPage = () => setCurrentPage(currentPage - 1);
    const onPageSelect = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };

    useEffect(() => {
        if (numberOfPages === currentPage) {
            setCanGoNext(false);
        } else {
            setCanGoNext(true);
        }
        if (currentPage === 1) {
            setCanGoBack(false);
        } else {
            setCanGoBack(true);
        }
    }, [numberOfPages, currentPage]);

    if (numberOfPages <= 1)
        return null

    return (
        <div className="pagination">
            <div className="pageButtons">
                <button
                    className="pageButton"
                    onClick={onPrevPage}
                    disabled={!canGoBack}
                >
                    &#8249;
                </button>
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onPageSelect(index + 1)}
                        className={`${"pageButton"} ${index + 1 === currentPage ? "activePage" : ""}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="pageButton"
                    onClick={onNextPage}
                    disabled={!canGoNext}
                >
                    &#8250;
                </button>
            </div>
        </div>
    );
};

export default Pagination;