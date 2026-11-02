import CartButton from './CartButton';
import Rating from './Rating';
import { BOX, titleTags } from '../../utils/data';

/**
 * Featured presets: one slide of the large-card slider (ProductCarousel.js), its image filling the card
 * under a gradient with the details on top. Its own class names keep the small cards' styles (Style.js)
 * off it and the featured attribute styles it instead; the Sale Badge and the Rating share the small
 * cards' classes, so their settings style both.
 */
const FeaturedCard = ( { product, attributes, labels, eager = false } ) => {
	const { layout = {}, elements = {}, badge = {}, button = {} } = attributes;
	const { image = {}, categories = [] } = product;

	const Tag = titleTags.includes( layout.titleTag ) ? layout.titleTag : 'h3';
	const badgeText = badge.text;
	const F = `${ BOX }-featured`;

	return <article className={ `${ F }-card` }>
		{ /* The title link carries the name; this one is a duplicate for pointers only. */ }
		<a className={ `${ F }-image-link` } href={ product.link } tabIndex={ -1 } aria-hidden='true'>
			{ image.url && <img
				className={ `${ F }-image` }
				src={ image.url }
				srcSet={ image.srcset || undefined }
				sizes={ image.sizes || undefined }
				width={ image.width || undefined }
				height={ image.height || undefined }
				alt={ image.alt || '' }
				loading={ eager ? 'eager' : 'lazy' }
				// eslint-disable-next-line react/no-unknown-property
				fetchpriority={ eager ? 'high' : undefined }
				decoding='async'
				draggable={ false }
			/> }
		</a>

		{ elements.saleBadge && product.onSale && badgeText && <span className={ `${ BOX }-badge` }>{ badgeText }</span> }

		<div className={ `${ F }-content` }>
			{ elements.category && 0 < categories.length && <div className={ `${ F }-category` }>
				{ categories.map( ( category, index ) => <span key={ category.link }>
					{ 0 < index && ', ' }
					<a href={ category.link } rel='tag'>{ category.name }</a>
				</span> ) }
			</div> }

			{ product.title && <Tag className={ `${ F }-title` }>
				<a href={ product.link }>{ product.title }</a>
			</Tag> }

			{ elements.rating && <Rating product={ product } /> }

			{ elements.price && product.priceHtml && <div className={ `${ F }-price` } dangerouslySetInnerHTML={ { __html: product.priceHtml } } /> }

			{ elements.cart && <CartButton product={ product } labels={ labels } className={ `${ F }-button` } texts={ button.cartText } /> }
		</div>
	</article>;
};

export default FeaturedCard;