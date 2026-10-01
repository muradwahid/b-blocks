import { formatLabel, asText } from '../../utils/functions';

const pageNumbers = (page, maxPages) => {
	if (maxPages <= 7) return Array.from({ length: maxPages }, (__unused, i) => i + 1);

	const pages = [1];
	if (page > 3) pages.push('...');

	for (let i = Math.max(2, page - 1); i <= Math.min(maxPages - 1, page + 1); i++) pages.push(i);

	if (page < maxPages - 2) pages.push('...');
	pages.push(maxPages);

	return pages;
};

const Pager = ({ attributes, page = 1, maxPages = 1, isLoading = false, labels = {}, onPage }) => {
	const { enable: enableLoadMore, type: morePostsType, text: loadMoreText } = attributes.pager || {};

	if (!enableLoadMore || maxPages <= 1) return null;

	if ('pagination' === morePostsType) {
		return <nav className='b-blocks-woo-product-grid-pager b-blocks-woo-product-grid-pager--pagination' aria-label={labels.pagination}>
			{pageNumbers(page, maxPages).map((number, index) => ('...' === number
				? <span key={`gap-${index}`} className='b-blocks-woo-product-grid-page-gap' aria-hidden='true'>&hellip;</span>
				: <button
					key={number}
					type='button'
					className={`b-blocks-woo-product-grid-page-btn${number === page ? ' is-active' : ''}`}
					aria-current={number === page ? 'page' : undefined}
					disabled={isLoading}
					aria-label={formatLabel(labels.goToPage, number)}
					onClick={() => number !== page && onPage(number)}
				>{number}</button>
			))}
		</nav>;
	}

	if ('prev-next' === morePostsType) {
		return <nav className='b-blocks-woo-product-grid-pager b-blocks-woo-product-grid-pager--prev-next' aria-label={labels.pagination}>
			<button
				type='button'
				className='b-blocks-woo-product-grid-page-btn b-blocks-woo-product-grid-page-prev'
				disabled={isLoading || page <= 1}
				aria-label={labels.prevPage}
				onClick={() => onPage(page - 1)}
			>{labels.prev}</button>

			<button
				type='button'
				className='b-blocks-woo-product-grid-page-btn b-blocks-woo-product-grid-page-next'
				disabled={isLoading || page >= maxPages}
				aria-label={labels.nextPage}
				onClick={() => onPage(page + 1)}
			>{labels.next}</button>
		</nav>;
	}

	if (page >= maxPages) return null;

	return <div className='b-blocks-woo-product-grid-pager b-blocks-woo-product-grid-pager--button'>
		<button
			type='button'
			className={`b-blocks-woo-product-grid-load-more${isLoading ? ' is-loading' : ''}`}
			aria-busy={isLoading}
			disabled={isLoading}
			onClick={() => onPage(page + 1, { append: true })}
		>
			<span className='b-blocks-woo-product-grid-load-more-label'>{asText( loadMoreText )}</span>
			{isLoading && <span className='b-blocks-woo-product-grid-spinner' aria-hidden='true' />}
		</button>
	</div>;
};

export default Pager;