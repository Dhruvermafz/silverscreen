// Pagination.jsx
import React from "react";

const Pagination = ({ page, total, pageSize, handlePageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  const maxPagesToShow = 8;
  const currentPageGroup = Math.floor((page - 1) / maxPagesToShow);
  const startPage = currentPageGroup * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="mn-pro-pagination m-b-15">
      <ul className="mn-pro-pagination-inner">
        {page > 1 && (
          <li>
            <a
              href="javascript:void(0)"
              onClick={() => handlePageChange(page - 1)}
            >
              <i className="ri-arrow-left-double-line"></i> Prev
            </a>
          </li>
        )}
        {pages.map((p) => (
          <li key={p}>
            <a
              className={p === page ? "active" : ""}
              href="javascript:void(0)"
              onClick={() => handlePageChange(p)}
            >
              {p}
            </a>
          </li>
        ))}
        {endPage < totalPages && (
          <>
            <li>
              <span>...</span>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                onClick={() => handlePageChange(page + 1)}
              >
                Next <i className="ri-arrow-right-double-line"></i>
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
