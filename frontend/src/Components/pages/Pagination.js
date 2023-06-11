import ReactPaginate from 'react-paginate';
import React from 'react';
const Pagination = ({ pageCount, handlePageChange }) => {
  return (
    <ReactPaginate 
      pageCount={pageCount}
      onPageChange={(selectedItem) => handlePageChange(selectedItem.selected + 1)}
      containerClassName="pagination"
      activeClassName="active"
      previousLabel="Previous"
      nextLabel="Next"
      breakLabel="...."
    />
  );
};

export default Pagination;
