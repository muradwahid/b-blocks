

const starClass = ( rounded, position ) => {
	if ( rounded >= position ) return 'b-blocks-woo-product-grid-star is-full';
	if ( rounded >= position - 0.5 ) return 'b-blocks-woo-product-grid-star is-half';
	return 'b-blocks-woo-product-grid-star';
};

const Rating = ( { product, attributes } ) => {
	const { style: ratingStyle, showEmpty = true } = attributes.rating || {};
	const { rating = 0, ratingCount = 0 } = product;

	if ( ! ratingCount && ! showEmpty ) return null;

	const rounded = Math.round( rating * 2 ) / 2;

	return <div className='b-blocks-woo-product-grid-rating' role='img' aria-label={ product.ratingLabel }>
		{ 'number' !== ratingStyle && [ 1, 2, 3, 4, 5 ].map( ( position ) => (
			<span key={ position } className={ starClass( rounded, position ) } aria-hidden='true'>&#9733;</span>
		) ) }

		{ 'star-count' === ratingStyle && (
			<span className='b-blocks-woo-product-grid-rating-count' aria-hidden='true'>({ ratingCount })</span>
		) }

		{ 'number' === ratingStyle && (
			<span className='b-blocks-woo-product-grid-rating-value' aria-hidden='true'>
				{ ratingCount > 0 && <>{ rating.toFixed( 1 ) } </> }
				<span className='b-blocks-woo-product-grid-rating-count'>({ ratingCount })</span>
			</span>
		) }
	</div>;
};

export default Rating;
