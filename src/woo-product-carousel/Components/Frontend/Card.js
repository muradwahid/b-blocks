import CartButton from './CartButton';
import Rating from './Rating';
import { BOX, CENTERED_PRESETS, HOVER_PRESETS, PRESET_HIDDEN, titleTags } from '../../utils/data';
import { externalIcon } from '../../utils/icons';

// Hidden elements (switched off, left out by the preset, or nothing to show) render nothing, so they leave no gap.
const Card = ( { product, attributes, labels, eager = false, first = false } ) => {
	const { preset, layout = {}, elements = {}, badge = {}, button = {}, viewButton = {} } = attributes;
	const { image = {}, categories = [] } = product;

	const Tag = titleTags.includes( layout.titleTag ) ? layout.titleTag : 'h3';
	const badgeText = badge.text;
	const buttonText = viewButton.text;
	const cartText = product.cartText;
	const show = ( element ) => elements[ element ] && ! PRESET_HIDDEN[ preset ]?.includes( element );
	const hoverPreset = HOVER_PRESETS.includes( preset );
	// Centred presets put the buttons under the image, the rest of the content above it (style.scss).
	const footerOutside = hoverPreset || CENTERED_PRESETS.includes( preset );

	const view = buttonText && ! PRESET_HIDDEN[ preset ]?.includes( 'view' ) && <a
		className={ `${ BOX }-button ${ BOX }-view-button` }
		href={ product.link }
		// A function, not the string: a product name with "$&" would be read as a replace pattern.
		aria-label={ labels.buttonAria.replace( '%1$s', () => buttonText ).replace( '%2$s', () => product.title ) }
	>{ externalIcon }<span className={ `${ BOX }-button-label` }>{ buttonText }</span></a>;

	const cart = elements.cart && cartText && <CartButton product={ product } labels={ labels } className={ `${ BOX }-button` } texts={ button.cartText } />;

	// The footer takes the free space, so with Equal Height every button lines up at the bottom.
	const footer = ( view || cart ) && <div className={ `${ BOX }-footer` }>{ view }{ cart }</div>;

	const content = <div className={ `${ BOX }-content` }>
		{ show( 'category' ) && 0 < categories.length && <div className={ `${ BOX }-category` }>
			{ categories.map( ( category, index ) => <span key={ category.link }>
				{ 0 < index && ', ' }
				<a href={ category.link } rel='tag'>{ category.name }</a>
			</span> ) }
		</div> }

		{ product.title && <Tag className={ `${ BOX }-title` }>
			<a className={ `${ BOX }-title-link` } href={ product.link }>{ product.title }</a>
		</Tag> }

		{ show( 'rating' ) && <Rating product={ product } /> }

		{ show( 'price' ) && product.priceHtml && <div className={ `${ BOX }-price` } dangerouslySetInnerHTML={ { __html: product.priceHtml } } /> }

		{ ! footerOutside && footer }
	</div>;

	return <article className={ `${ BOX }-card` }>
		<div className={ `${ BOX }-media` }>
			{ elements.saleBadge && product.onSale && badgeText && <span className={ `${ BOX }-badge` }>{ badgeText }</span> }

			{ /* The title link carries the name; this one is a duplicate for pointers only. */ }
			<a className={ `${ BOX }-image-link` } href={ product.link } tabIndex={ -1 } aria-hidden='true'>
				{ image.url && <img
					className={ `${ BOX }-image` }
					src={ image.url }
					srcSet={ image.srcset || undefined }
					sizes={ image.sizes || undefined }
					width={ image.width || undefined }
					height={ image.height || undefined }
					alt={ image.alt || '' }
					loading={ eager ? 'eager' : 'lazy' }
					// eslint-disable-next-line react/no-unknown-property
					fetchpriority={ first ? 'high' : undefined }
					decoding='async'
					draggable={ false }
				/> }
			</a>
		</div>

		{ /* Hover presets: content and a full-width button bar in one panel that slides up over the image. */ }
		{ hoverPreset
			? <div className={ `${ BOX }-panel` }>{ content }{ footer }</div>
			: <>{ content }{ footerOutside && footer }</> }
	</article>;
};

export default Card;