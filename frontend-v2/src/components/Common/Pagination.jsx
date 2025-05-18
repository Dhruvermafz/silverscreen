import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Adjust currentPage for react-paginate (0-based index)
  const adjustedCurrentPage = currentPage - 1;

  // Calculate the total number of items (assuming 20 items per page, adjust as needed)
  const itemsPerPage = 20;
  const totalItems = totalPages * itemsPerPage;
  const startItem = currentPage * itemsPerPage - itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="row">
      <div className="col-12">
        {/* Mobile Paginator */}
        <div className="paginator-mob">
          <span className="paginator-mob__pages">
            {startItem} of {totalItems}
          </span>
          <ul className="paginator-mob__nav">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "disabled" : ""}
              >
                <FiChevronLeft />
                <span>Prev</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "disabled" : ""}
              >
                <span>Next</span>
                <FiChevronRight />
              </button>
            </li>
          </ul>
        </div>

        {/* Desktop Paginator */}
        <ReactPaginate
          previousLabel={<FiChevronLeft />}
          nextLabel={<FiChevronRight />}
          breakLabel={<span>...</span>}
          pageCount={totalPages}
          forcePage={adjustedCurrentPage}
          onPageChange={({ selected }) => onPageChange(selected + 1)}
          containerClassName="paginator"
          pageClassName="paginator__item"
          previousClassName="paginator__item paginator__item--prev"
          nextClassName="paginator__item paginator__item--next"
          activeClassName="paginator__item--active"
          disabledClassName="paginator__item--disabled"
          pageLinkClassName=""
          previousLinkClassName=""
          nextLinkClassName=""
          breakClassName="paginator__item"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Pagination;
