import Price from './Price';
import Rating from './Rating';
import Title from './Title';
import Category from './Category';
import SoldCount from './SoldCount';
import Actions from './Actions';
import { at, asText } from '../../../utils/functions';

const ELEMENTS = {
	price: { Component: Price, toggle: 'price' },
	rating: { Component: Rating, toggle: 'rating' },
	title: { Component: Title, toggle: 'title' },
	category: { Component: Category, toggle: 'category' },
	soldCount: { Component: SoldCount, toggle: 'soldCount' }
};

const Card = ( { product, attributes, isBackend = false, index = 0 } ) => {

	const contentOrder = Array.isArray( attributes.contentOrder ) ? attributes.contentOrder : [];
	const elements = attributes.elements || {};
	const badge = attributes.badge || {};
	const { image: showImage, saleBadge: showSaleBadge } = elements;
	const { text: saleBadgeLabel } = badge;

	const actions = <Actions { ...{ product, attributes, isBackend } } />;

	const { actionPosition } = attributes.layout || {};
	const isSplit = 'split' === actionPosition;
	const inMedia = showImage && 'below' !== actionPosition && ! isSplit;

	const splitView = isSplit && showImage;
	const footerHasButton = elements.cart || ( ! splitView && elements.viewButton );
	const footer = isSplit && ( elements.price || footerHasButton ) && <div className='b-blocks-woo-product-grid-card-footer'>
		{ elements.price && <Price product={ product } attributes={ attributes } /> }
		<Actions { ...{ product, attributes, isBackend } } only={ splitView ? 'cart' : '' } />
	</div>;

	const { content: badgeContent } = badge;
	const badgeLabel = ( 'amount' === badgeContent && product.saveLabel )
		|| ( 'percent' === badgeContent && product.percentLabel )
		|| asText( saleBadgeLabel );

	const { image = {} } = product;

	const isAboveFold = index < ( parseInt( at( attributes.layout, 'desktop', 'columns' ), 10 ) || 4 );

	return <article className='b-blocks-woo-product-grid-card' role='listitem' aria-label={ product.title }>
		{ showImage && <div className='b-blocks-woo-product-grid-media'>
			{ showSaleBadge && product.onSale && (
				<span className='b-blocks-woo-product-grid-sale-badge'>{ badgeLabel }</span>
			) }

			<a className='b-blocks-woo-product-grid-image-link' href={ product.link } tabIndex={ -1 } aria-hidden='true'>
				{ image.url && <img
					className='b-blocks-woo-product-grid-image'
					src={ image.url }
					srcSet={ image.srcset || undefined }
					sizes={ image.sizes || undefined }
					width={ image.width || undefined }
					height={ image.height || undefined }
					alt={ image.alt || '' }
					loading={ isAboveFold ? 'eager' : 'lazy' }
					// eslint-disable-next-line react/no-unknown-property
					fetchpriority={ 0 === index ? 'high' : undefined }
					decoding='async'
				/> }
			</a>

			{ inMedia && actions }
			{ splitView && <Actions { ...{ product, attributes, isBackend } } only='view' /> }
		</div> }

		<div className={ `b-blocks-woo-product-grid-card-body${ footer ? ' has-footer' : '' }` }>
			{ ! inMedia && ! isSplit && actions }

			{ contentOrder.map( ( key ) => {
				const element = ELEMENTS[ key ];
				if (!element || !elements[element.toggle]) return null;

				if ( isSplit && 'price' === key ) return null;

				const { Component } = element;
				return <Component key={ key } product={ product } attributes={ attributes } />;
			} ) }

			{ footer }
		</div>
	</article>;
};

export default Card;