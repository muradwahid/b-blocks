const SoldCount = ( { product, attributes } ) => {
	const showProgressBar = attributes.elements?.progressBar;
	const { soldLabel = '', soldPercent = 0, soldBarLabel = '' } = product;

	return <div className='b-blocks-woo-product-grid-sold'>
		{ showProgressBar && <div className='b-blocks-woo-product-grid-progress' role='img' aria-label={ soldBarLabel }>
			<span className='b-blocks-woo-product-grid-progress-fill' style={ { width: `${ soldPercent }%` } } />
		</div> }

		<span className='b-blocks-woo-product-grid-sold-text'>{ soldLabel }</span>
	</div>;
};

export default SoldCount;
