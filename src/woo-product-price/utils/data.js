import { __, sprintf } from '@wordpress/i18n';

export const withBdi = ( html ) => {
	if ( ! html || ! html.includes( 'woocommerce-Price-amount' ) ) return html;

	const doc = new window.DOMParser().parseFromString( `<div>${ html }</div>`, 'text/html' );
	doc.querySelectorAll( '.woocommerce-Price-amount' ).forEach( ( amount ) => {
		if ( amount.querySelector( 'bdi' ) ) return;
		const bdi = doc.createElement( 'bdi' );
		bdi.append( ...amount.childNodes );
		amount.append( bdi );
	} );
	return doc.body.firstChild.innerHTML;
};

const formatNumber = ( value, { decimals = 2, decimalSeparator = '.', thousandSeparator = ',' } = {} ) => {
	const [ whole, fraction ] = value.toFixed( decimals ).split( '.' );
	return whole.replace( /\B(?=(\d{3})+(?!\d))/g, thousandSeparator ) + ( fraction ? decimalSeparator + fraction : '' );
};

const sampleCurrency = () => {
	const currency = window.wcSettings?.currency || {};
	return {
		symbol: currency.symbol || '$',
		position: currency.symbolPosition || 'left',
		decimals: Number.isInteger( currency.precision ) ? currency.precision : 2,
		decimalSeparator: currency.decimalSeparator ?? '.',
		thousandSeparator: currency.thousandSeparator ?? ','
	};
};


const sampleAmount = ( value, sign, { position, ...format } = sampleCurrency() ) => {
	const number = formatNumber( value, format );
	return {
		left: sign + number,
		right: number + sign,
		left_space: `${ sign }\u00a0${ number }`,
		right_space: `${ number }\u00a0${ sign }`
	}[ position ] || sign + number;
};


export const savingsOf = ( prices ) => {
	if ( ! prices ) return { percent: 38, amount: sampleAmount( 30, sampleCurrency().symbol ) };

	const unit = 10 ** ( prices.currency_minor_unit ?? 2 );
	const regular = Number( prices.regular_price ) / unit;
	const sale = Number( prices.sale_price ) / unit;
	if ( ! ( regular > 0 ) || ! ( sale < regular ) ) return { percent: 0, amount: '' };

	const number = formatNumber( regular - sale, { decimals: prices.currency_minor_unit ?? 2, decimalSeparator: prices.currency_decimal_separator ?? '.', thousandSeparator: prices.currency_thousand_separator ?? ',' } );
	return { percent: Math.round( ( regular - sale ) / regular * 100 ), amount: `${ prices.currency_prefix || '' }${ number }${ prices.currency_suffix || '' }`.trim() };
};

export const samplePriceHtml = ( regular = 80, sale = 50 ) => {
	const currency = sampleCurrency();
	// Into markup: the symbol escaped.
	const symbol = currency.symbol.replace( /[&<>"]/g, ( c ) => ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ c ] ) );

	const amount = ( value ) => `<span class="woocommerce-Price-amount amount"><bdi>${ sampleAmount( value, `<span class="woocommerce-Price-currencySymbol">${ symbol }</span>`, currency ) }</bdi></span>`;
	const text = ( value ) => sampleAmount( value, symbol, currency );

	return `<del aria-hidden="true">${ amount( regular ) }</del> <span class="screen-reader-text">${
		/* translators: %s: original price. */
		sprintf( __( 'Original price was: %s.', 'b-blocks' ), text( regular ) )
	}</span><ins aria-hidden="true">${ amount( sale ) }</ins><span class="screen-reader-text">${
		/* translators: %s: current price. */
		sprintf( __( 'Current price is: %s.', 'b-blocks' ), text( sale ) )
	}</span>`;
};
