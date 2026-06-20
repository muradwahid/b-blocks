import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const {
		businessName,
		tagline,
		headingTag,
		logoUrl,
		logoAlt,
		phone,
		email,
		website,
		addressStreet,
		addressCity,
		addressState,
		addressPostal,
		addressCountry,
		mapUrl,
		showDirectionsBtn,
		directionsLabel,
		layout,
		theme,
		alignment,
		showLogo,
		showTagline,
		showAddress,
		showPhone,
		showEmail,
		showWebsite,
		logoShape,
		logoSize,
		nameFontSize,
		nameFontWeight,
		labelFontSize,
		rowIconSize,
		accentColor,
		backgroundColor,
		textColor,
		nameColor,
		linkColor,
		iconColor,
		borderColor,
		borderRadius,
		borderWidth,
		padding,
	} = attributes;

	const safeHeadingTag = [ 'h2', 'h3', 'h4', 'h5', 'h6' ].includes( headingTag ) ? headingTag : 'h3';
	const HeadingTag = safeHeadingTag;
	const safeLayout = [ 'card', 'horizontal' ].includes( layout ) ? layout : 'card';
	const safeTheme = [ 'classic', 'corporate', 'gradient', 'elegant', 'bold' ].includes( theme ) ? theme : 'classic';
	const safeAlignment = [ 'left', 'center' ].includes( alignment ) ? alignment : 'left';
	const safeLogoShape = [ 'circle', 'rounded', 'square' ].includes( logoShape ) ? logoShape : 'rounded';

	const pad = padding || {};
	const padTop = Number.isFinite( parseInt( pad.top, 10 ) ) ? parseInt( pad.top, 10 ) : 32;
	const padRight = Number.isFinite( parseInt( pad.right, 10 ) ) ? parseInt( pad.right, 10 ) : 32;
	const padBottom = Number.isFinite( parseInt( pad.bottom, 10 ) ) ? parseInt( pad.bottom, 10 ) : 32;
	const padLeft = Number.isFinite( parseInt( pad.left, 10 ) ) ? parseInt( pad.left, 10 ) : 32;

	const logoRadius = 'circle' === safeLogoShape ? '50%' : ( 'rounded' === safeLogoShape ? '12px' : '0' );

	const wrapperStyle = {
		'--bb-cc-accent': accentColor || '#146EF5',
		'--bb-cc-bg': backgroundColor || '#ffffff',
		'--bb-cc-text': textColor || '#1a1a1a',
		'--bb-cc-name-color': nameColor || textColor || '#1a1a1a',
		'--bb-cc-link-color': linkColor || accentColor || '#146EF5',
		'--bb-cc-icon-color': iconColor || accentColor || '#146EF5',
		'--bb-cc-border-color': borderColor || '#e5e7eb',
		'--bb-cc-border-width': `${ parseInt( borderWidth, 10 ) || 0 }px`,
		'--bb-cc-radius': `${ parseInt( borderRadius, 10 ) || 0 }px`,
		'--bb-cc-logo-size': `${ parseInt( logoSize, 10 ) || 80 }px`,
		'--bb-cc-logo-radius': logoRadius,
		'--bb-cc-name-size': `${ parseInt( nameFontSize, 10 ) || 22 }px`,
		'--bb-cc-name-weight': nameFontWeight || '700',
		'--bb-cc-label-size': `${ parseInt( labelFontSize, 10 ) || 14 }px`,
		'--bb-cc-icon-size': `${ parseInt( rowIconSize, 10 ) || 16 }px`,
		'--bb-cc-pad-top': `${ padTop }px`,
		'--bb-cc-pad-right': `${ padRight }px`,
		'--bb-cc-pad-bottom': `${ padBottom }px`,
		'--bb-cc-pad-left': `${ padLeft }px`,
	};

	const wrapperClasses = [
		'bb-cc',
		`bb-cc-layout--${ safeLayout }`,
		`bb-cc-theme--${ safeTheme }`,
		`bb-cc-align--${ safeAlignment }`,
		`bb-cc-logo--${ safeLogoShape }`,
	].join( ' ' );

	const blockProps = useBlockProps( {
		className: wrapperClasses,
		style: wrapperStyle,
	} );

	// Compose the address one-line for display.
	const addressParts = [ addressStreet, addressCity, addressState, addressPostal, addressCountry ]
		.map( ( v ) => ( v || '' ).toString().trim() )
		.filter( Boolean );
	const addressOneLine = addressParts.join( ', ' );

	const hasAddressRow = showAddress && addressOneLine;
	const hasPhoneRow = showPhone && ( phone || '' ).toString().trim();
	const hasEmailRow = showEmail && ( email || '' ).toString().trim();
	const hasWebsiteRow = showWebsite && ( website || '' ).toString().trim();
	const hasAnyRow = hasAddressRow || hasPhoneRow || hasEmailRow || hasWebsiteRow;

	// Display host (cleaned) for the website row.
	let websiteDisplay = '';
	if ( hasWebsiteRow ) {
		const raw = ( website || '' ).toString().trim();
		try {
			const parsed = new URL( /^https?:\/\//i.test( raw ) ? raw : `https://${ raw }` );
			websiteDisplay = parsed.host.replace( /^www\./i, '' ) + ( parsed.pathname && '/' !== parsed.pathname ? parsed.pathname : '' );
		} catch ( e ) {
			websiteDisplay = raw;
		}
	}

	const showDirections = showDirectionsBtn && ( mapUrl || addressOneLine );

	return (
		<>
			<Settings attributes={ attributes } setAttributes={ setAttributes } />

			<div { ...blockProps }>
				<section className='bb-cc-card' aria-label={ businessName ? `${ businessName } ${ __( 'contact information', 'b-blocks' ) }` : __( 'Contact information', 'b-blocks' ) }>
					{ ( ( showLogo && logoUrl ) || businessName || ( showTagline && tagline ) ) && (
						<header className='bb-cc-header'>
							{ showLogo && logoUrl ? (
								<div className='bb-cc-logo' aria-hidden='true'>
									<img
										src={ logoUrl }
										alt={ logoAlt || businessName || '' }
									/>
								</div>
							) : ( showLogo ? (
								<div className='bb-cc-logo bb-cc-logo-placeholder' aria-hidden='true'>
									{ __( 'Logo', 'b-blocks' ) }
								</div>
							) : null ) }

							<div className='bb-cc-heading'>
								{ businessName && (
									<HeadingTag className='bb-cc-name'>{ businessName }</HeadingTag>
								) }

								{ showTagline && tagline && (
									<p className='bb-cc-tagline'>{ tagline }</p>
								) }
							</div>
						</header>
					) }

					{ hasAnyRow && (
						<ul className='bb-cc-list'>
							{ hasAddressRow && (
								<li className='bb-cc-item bb-cc-item--address'>
									<span className='bb-cc-icon' aria-hidden='true'>
										<i className='fa-solid fa-location-dot'></i>
									</span>
									<address>{ addressOneLine }</address>
								</li>
							) }

							{ hasPhoneRow && (
								<li className='bb-cc-item bb-cc-item--phone'>
									<span className='bb-cc-icon' aria-hidden='true'>
										<i className='fa-solid fa-phone'></i>
									</span>
									<a className='bb-cc-link' href={ `tel:${ phone }` }>{ phone }</a>
								</li>
							) }

							{ hasEmailRow && (
								<li className='bb-cc-item bb-cc-item--email'>
									<span className='bb-cc-icon' aria-hidden='true'>
										<i className='fa-solid fa-envelope'></i>
									</span>
									<a className='bb-cc-link' href={ `mailto:${ email }` }>{ email }</a>
								</li>
							) }

							{ hasWebsiteRow && (
								<li className='bb-cc-item bb-cc-item--web'>
									<span className='bb-cc-icon' aria-hidden='true'>
										<i className='fa-solid fa-globe'></i>
									</span>
									<a className='bb-cc-link' href={ website }>{ websiteDisplay }</a>
								</li>
							) }
						</ul>
					) }

					{ showDirections && (
						<p className='bb-cc-actions'>
							<a className='bb-cc-directions' href={ mapUrl || '#' }>
								<i className='fa-solid fa-diamond-turn-right' aria-hidden='true'></i>
								<span>{ directionsLabel || __( 'Get Directions', 'b-blocks' ) }</span>
							</a>
						</p>
					) }

					{ ! businessName && ! hasAnyRow && (
						<p style={ { margin: 0, opacity: 0.6, fontStyle: 'italic' } }>
							{ __( 'Add your business details in the sidebar to populate this card.', 'b-blocks' ) }
						</p>
					) }
				</section>
			</div>
		</>
	);
};

export default Edit;
