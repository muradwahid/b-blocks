import { BOX } from '../../utils/functions';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const Price = ( { attributes } ) => {
	const { options = {}, prefix = {}, suffix = {}, savings = {}, product = {} } = attributes;
	const showAffixes = ! options.onSaleOnly || !! product.onSale;

	const saved = product.savings || {};
	const savingsText = savings.show && product.onSale && saved.percent > 0
		? String( savings.text ?? '' ).replace( /\{percent\}/g, `${ saved.percent }%` ).replace( /\{amount\}/g, saved.amount || '' ).trim()
		: '';

	const part = ( affix, which ) => {
		if ( ! showAffixes || false === affix.show ) return null;
		const className = `${ BOX }-${ which }`;

		if ( 'icon' === affix.type ) {
			return affix.icon ? <span className={ `${ className } ${ className }--icon` } aria-hidden='true' dangerouslySetInnerHTML={ { __html: sanitizeHtml( affix.icon ) } } /> : null;
		}

		const text = String( affix.text ?? '' ).trim();
		return text ? <span className={ className }>{ text }</span> : null;
	};

	if ( ! product.priceHtml ) return null;

	return <div className={ [ BOX, 'before' === options.salePosition && `${ BOX }--sale-before` ].filter( Boolean ).join( ' ' ) }>
		{ part( prefix, 'prefix' ) }
		<span className={ `${ BOX }-price` } dangerouslySetInnerHTML={ { __html: product.priceHtml } } />
		{ savingsText && <span className={ `${ BOX }-savings` }>{ savingsText }</span> }
		{ part( suffix, 'suffix' ) }
	</div>;
};

export default Price;