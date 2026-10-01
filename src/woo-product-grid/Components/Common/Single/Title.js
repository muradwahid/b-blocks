import { titleTags } from '../../../utils/data';

const Title = ( { product, attributes } ) => {
	const { titleTag } = attributes.layout || {};

	if ( ! product.title ) return null;

	const Tag = titleTags.includes( titleTag ) ? titleTag : 'h4';

	return <Tag className='b-blocks-woo-product-grid-title'>
		<a className='b-blocks-woo-product-grid-title-link' href={ product.link }>{ product.title }</a>
	</Tag>;
};

export default Title;
