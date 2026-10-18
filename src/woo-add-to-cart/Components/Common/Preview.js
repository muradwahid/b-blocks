import { __ } from '@wordpress/i18n';

import { MAX_QUANTITY } from '../../utils/data';
import { BOX, boxClasses } from '../../utils/functions';
import ButtonContent from './ButtonContent';
import ViewCart from './ViewCart';

const previewQuantity = ( quantity ) => {
	const n = parseInt( quantity, 10 );
	return Number.isNaN( n ) ? 1 : Math.min( MAX_QUANTITY, Math.max( 0, n ) );
};

const labelFor = ( buttonText, type, real ) => {
	const own = 'string' === typeof buttonText ? buttonText.trim() : '';
	if ( 'external' === type ) return real?.ownText || own || real?.data?.add_to_cart?.single_text || __( 'Buy product', 'b-blocks' );
	return own || real?.data?.add_to_cart?.single_text || __( 'Add to cart', 'b-blocks' );
};

const samplePrice = ( amount ) => {
	const { symbol = '$', symbolPosition = 'left', decimalSeparator = '.', precision = 2 } = window.wcSettings?.currency || {};
	const value = amount.toFixed( precision ).replace( '.', decimalSeparator );
	return { left: `${ symbol }${ value }`, right: `${ value }${ symbol }`, left_space: `${ symbol } ${ value }`, right_space: `${ value } ${ symbol }` }[ symbolPosition ] || `${ symbol }${ value }`;
};

const Price = ( { html } ) => {
	const doc = new window.DOMParser().parseFromString( `<div>${ html || '' }</div>`, 'text/html' );
	doc.querySelectorAll( '.screen-reader-text' ).forEach( ( el ) => el.remove() );
	const was = doc.querySelector( 'del' )?.textContent.trim();
	const now = doc.querySelector( 'ins' )?.textContent.trim();

	return was && now
		? <><del><span className='woocommerce-Price-amount amount'>{ was }</span></del> <ins><span className='woocommerce-Price-amount amount'>{ now }</span></ins></>
		: <span className='woocommerce-Price-amount amount'>{ doc.body.textContent.replace( /\s+/g, ' ' ).trim() }</span>;
};

const Stock = ( { availability } ) => ( availability?.text
	? <p className={ `stock ${ availability.class || '' }` }>{ availability.text }</p>
	: null );

const Quantity = ( { id, label, value } ) => <div className='quantity'>
	<label className='screen-reader-text' htmlFor={ id }>{ label }</label>
	<input type='number' id={ id } className='input-text qty text' value={ value } min='0' step='1' inputMode='numeric' readOnly aria-label={ label } />
</div>;

const noOpen = ( e ) => e.preventDefault();

const Button = ( { label, icon } ) => <button type='button' className='single_add_to_cart_button button alt wp-element-button'>
	<ButtonContent icon={ icon }><span className={ `${ BOX }-btn-label` }>{ label }</span></ButtonContent>
</button>;

const Simple = ( { attributes, uid, viewCart, real } ) => {
	const { buttonText } = attributes.content || {};
	const { showQuantity, quantity, quantityStyle } = attributes.options || {};
	const qtyId = `${ uid }-qty`;
	const isInput = 'input' === quantityStyle;

	const hasQuantity = showQuantity && ! real?.data?.sold_individually;

	return <div className={ `${ BOX }-inner` }>
		{ hasQuantity && <div className={ `${ BOX }-qty ${ BOX }-qty--${ isInput ? 'input' : 'stepper' }` }>
			<label className='screen-reader-text' htmlFor={ qtyId }>{ __( 'Quantity', 'b-blocks' ) }</label>
			{ ! isInput && <button type='button' className={ `${ BOX }-qty-btn ${ BOX }-qty-minus` } aria-label={ __( 'Decrease quantity', 'b-blocks' ) }>&minus;</button> }
			<input type='number' className={ `${ BOX }-qty-input` } id={ qtyId } value={ previewQuantity( quantity ) } min='0' max={ MAX_QUANTITY } step='1' inputMode='numeric' readOnly />
			{ ! isInput && <button type='button' className={ `${ BOX }-qty-btn ${ BOX }-qty-plus` } aria-label={ __( 'Increase quantity', 'b-blocks' ) }>&#43;</button> }
		</div> }

		<button type='button' className={ `${ BOX }-btn` }>
			<ButtonContent icon={ attributes.button?.icon }><span className={ `${ BOX }-btn-label` }>{ labelFor( buttonText, 'simple', real ) }</span></ButtonContent>
		</button>

		{ viewCart && <ViewCart attributes={ attributes } fallback={ __( 'View cart', 'b-blocks' ) } /> }
	</div>;
};

const Unavailable = ( { real } ) => <div className={ `${ BOX }-inner` }>
	{ real.data.is_purchasable && real.data.stock_availability?.text
		? <Stock availability={ real.data.stock_availability } />
		: <p className='stock out-of-stock'>{ __( 'This product is currently unavailable.', 'b-blocks' ) }</p> }
</div>;

const sampleGrouped = () => [
	{ id: 1, name: __( 'Classic Cotton Tee', 'b-blocks' ), price: samplePrice( 19 ), stock_availability: { text: __( 'In stock', 'b-blocks' ), class: 'in-stock' } },
	{ id: 2, name: __( 'Everyday Zip Hoodie', 'b-blocks' ), price: samplePrice( 49 ), stock_availability: { text: __( '8 in stock', 'b-blocks' ), class: 'in-stock' } },
	{ id: 3, name: __( 'Wool Knit Beanie', 'b-blocks' ), price: samplePrice( 14 ), stock_availability: { text: __( 'In stock', 'b-blocks' ), class: 'in-stock' } }
];

const Grouped = ( { attributes, uid, real } ) => {
	const items = real?.children?.length ? real.children : sampleGrouped();

	return <form className='cart grouped_form' onSubmit={ ( e ) => e.preventDefault() }>
		<table cellSpacing='0' className='woocommerce-grouped-product-list group_table'>
			<tbody>
				{ items.map( ( item, i ) => <tr key={ item.id } className={ `woocommerce-grouped-product-list-item product type-product ${ false === item.is_in_stock ? 'outofstock' : 'instock' }` }>
					<td className='woocommerce-grouped-product-list-item__quantity'>
						<Quantity id={ `${ uid }-g${ i }` } label={ `${ item.name } ${ __( 'quantity', 'b-blocks' ) }` } value={ attributes.options?.showQuantity ? 0 : 1 } />
					</td>
					<td className='woocommerce-grouped-product-list-item__label'>
						<label htmlFor={ `${ uid }-g${ i }` }><a href='#preview' onClick={ ( e ) => e.preventDefault() }>{ item.name }</a></label>
					</td>
					<td className='woocommerce-grouped-product-list-item__price'>
						{ item.price_html ? <Price html={ item.price_html } /> : <span className='woocommerce-Price-amount amount'>{ item.price }</span> }
						<Stock availability={ item.stock_availability } />
					</td>
				</tr> ) }
			</tbody>
		</table>
		<Button label={ labelFor( attributes.content?.buttonText, 'grouped', real ) } icon={ attributes.button?.icon } />
	</form>;
};

const External = ( { attributes, real } ) => <form className='cart' onSubmit={ ( e ) => e.preventDefault() }>
	<Button label={ labelFor( attributes.content?.buttonText, 'external', real ) } icon={ attributes.button?.icon } />
</form>;

const sampleAttributes = () => [
	{ name: __( 'Size', 'b-blocks' ), slug: 'size', terms: [ { slug: 's', name: 'S' }, { slug: 'm', name: 'M' }, { slug: 'l', name: 'L' } ], selected: 'm' },
	{ name: __( 'Color', 'b-blocks' ), slug: 'color', terms: [ { slug: 'blue', name: __( 'Blue', 'b-blocks' ) }, { slug: 'black', name: __( 'Black', 'b-blocks' ) } ], selected: 'blue' }
];

const Variable = ( { attributes, uid, real } ) => {

	const data = real?.data;
	const rows = data
		? ( data.attributes || [] ).filter( ( a ) => a.has_variations ).map( ( a ) => ( { name: a.name, slug: a.taxonomy || a.name, terms: a.terms || [], selected: a.terms?.[ 0 ]?.slug || '' } ) )
		: sampleAttributes();

	return <form className='variations_form cart' onSubmit={ ( e ) => e.preventDefault() }>
		<table className='variations' cellSpacing='0' role='presentation'>
			<tbody>
				{ rows.map( ( row, i ) => <tr key={ row.slug }>
					<th className='label'><label htmlFor={ `${ uid }-a${ i }` }>{ row.name }</label></th>
					<td className='value'>
						<select id={ `${ uid }-a${ i }` } defaultValue={ row.selected } onMouseDown={ noOpen }>
							<option value=''>{ __( 'Choose an option', 'b-blocks' ) }</option>
							{ row.terms.map( ( t ) => <option key={ t.slug } value={ t.slug }>{ t.name }</option> ) }
						</select>
						{ rows.length - 1 === i && <a className='reset_variations' href='#preview' onClick={ ( e ) => e.preventDefault() }>{ __( 'Clear', 'b-blocks' ) }</a> }
					</td>
				</tr> ) }
			</tbody>
		</table>
		<div className='single_variation_wrap'>
			<div className='woocommerce-variation single_variation'>
				<div className='woocommerce-variation-price'>
					<span className='price'>{ data ? <Price html={ data.price_html } /> : <span className='woocommerce-Price-amount amount'>{ samplePrice( 24 ) }</span> }</span>
				</div>
				<div className='woocommerce-variation-availability'>
					<Stock availability={ data ? data.stock_availability : { text: __( '12 in stock', 'b-blocks' ), class: 'in-stock' } } />
				</div>
			</div>
			<div className='woocommerce-variation-add-to-cart variations_button'>
				<Quantity id={ `${ uid }-qty` } label={ __( 'Quantity', 'b-blocks' ) } value={ 1 } />
				<Button label={ labelFor( attributes.content?.buttonText, 'variable', real ) } icon={ attributes.button?.icon } />
			</div>
		</div>
	</form>;
};

const TYPES = { grouped: Grouped, external: External, variable: Variable };

const Preview = ( { attributes, type, uid, real = null } ) => {
	const Native = TYPES[ type ] || External;

	const unavailable = 'simple' === type && real?.data && ! ( real.data.is_purchasable && real.data.is_in_stock );
	const view = 'simple' === type && real?.data?.sold_individually ? { ...attributes, options: { ...attributes.options, showQuantity: false } } : attributes;

	const { viewCart: showViewCart, redirectToCart } = attributes.options || {};
	const viewCart = showViewCart && ! redirectToCart && 'external' !== type && ! unavailable;

	if ( unavailable ) {
		return <div className={ boxClasses( view, 'unavailable' ) }><Unavailable real={ real } /></div>;
	}

	return <div className={ boxClasses( view, type ) }>
		{ 'simple' === type
			? <Simple attributes={ view } uid={ uid } viewCart={ viewCart } real={ real } />
			: <div className={ `${ BOX }-native` }><Native attributes={ view } uid={ uid } real={ real } /></div> }
		{ viewCart && 'simple' !== type && <ViewCart attributes={ attributes } fallback={ __( 'View cart', 'b-blocks' ) } /> }
	</div>;
};

export default Preview;
