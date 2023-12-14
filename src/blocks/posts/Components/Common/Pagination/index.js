import { useState } from 'react';

import { usePagination, DOTS } from './usePagination';

const Pagination = ({ attributes, totalCount, onChange }) => {
	const { layout, isPostsPerPageAll, postsPerPage, isPagination, paginationPrevLabel, paginationNextLabel } = attributes;

	const [currentPage, setCurrentPage] = useState(1);

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		pageSize: postsPerPage,
		siblingCount: 1
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	let lastPage = paginationRange[paginationRange.length - 1];

	const setPageNumber = pageNumber => {
		onChange(pageNumber);
		setCurrentPage(pageNumber);
	}

	return isPagination && !isPostsPerPageAll && 'slider' !== layout && 'ticker' !== layout ? <ul className={`bBlocksPagination`}>
		<li className={`bBlocksPageNumber ${currentPage === 1 ? 'disabled' : ''}`}
			onClick={() => setPageNumber(currentPage - 1)}
		>{paginationPrevLabel}</li>

		{paginationRange.map((pageNumber, index) => {
			if (pageNumber === DOTS) {
				return <li key={index} className='dots'>&#183;&#183;&#183;&#183;&#183;</li>;
			}

			return <li key={index}
				className={`bBlocksPageNumber ${pageNumber === currentPage ? 'bBlocksActivePage' : ''}`}
				onClick={() => setPageNumber(pageNumber)}
			> {pageNumber}</li>;
		})}

		<li className={`bBlocksPageNumber ${currentPage === lastPage ? 'disabled' : ''}`}
			onClick={() => setPageNumber(currentPage + 1)}
		>{paginationNextLabel}</li>
	</ul> : null;
};
export default Pagination;