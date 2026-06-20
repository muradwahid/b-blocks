<?php
/**
 * Contact Card block server-side render.
 *
 * Renders a structured contact card with optional LocalBusiness JSON-LD
 * schema. All output is escaped; `tel:` hrefs are stripped to digits + `+`;
 * email addresses are validated with `is_email()` (and obfuscated for the
 * mailto URI via `antispambot()`); the website URL is `esc_url()`'d.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as business-hours, howto-schema).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksContactCard';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

$sanitizeColor = static function ( $color, $fallback ) {
	$color = trim( (string) $color );
	if ( '' === $color ) {
		return $fallback;
	}
	if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
		return $color;
	}
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// Strip a phone string down to digits + a leading "+" so it is safe to
// embed inside a `tel:` URI. The visible label stays the user-formatted
// version. Returns "" when the result has no digits.
$sanitizeTelHref = static function ( $raw ) {
	$raw = trim( (string) $raw );
	if ( '' === $raw ) {
		return '';
	}
	$hasPlus = ( '+' === substr( $raw, 0, 1 ) );
	$digits  = preg_replace( '/[^0-9]/', '', $raw );
	if ( '' === $digits ) {
		return '';
	}
	return ( $hasPlus ? '+' : '' ) . $digits;
};

// Compose a single-line postal address suitable for both `<address>`
// display (joined by ", ") and Google Maps `?q=` lookups.
$composeAddress = static function ( $street, $city, $region, $postal, $country ) {
	$parts = array_filter(
		[
			trim( (string) $street ),
			trim( (string) $city ),
			trim( (string) $region ),
			trim( (string) $postal ),
			trim( (string) $country ),
		],
		static function ( $v ) {
			return '' !== $v;
		}
	);
	return implode( ', ', $parts );
};

// --- Pull and clamp attributes ----------------------------------------

$businessName  = sanitize_text_field( (string) ( $attributes['businessName'] ?? '' ) );
$tagline       = sanitize_text_field( (string) ( $attributes['tagline'] ?? '' ) );

$businessType  = sanitize_key( (string) ( $attributes['businessType'] ?? 'LocalBusiness' ) );
$allowedTypes  = [
	'LocalBusiness',
	'Restaurant',
	'MedicalBusiness',
	'LodgingBusiness',
	'HealthAndBeautyBusiness',
	'HomeAndConstructionBusiness',
	'FinancialService',
	'LegalService',
	'ProfessionalService',
	'SportsActivityLocation',
	'Store',
	'FoodEstablishment',
];
// Schema types are PascalCase; sanitize_key lowercases. Look up against
// the lowercased allowlist so we accept user input regardless of case,
// then map back to the canonical PascalCase value.
$typeLcMap = [];
foreach ( $allowedTypes as $t ) {
	$typeLcMap[ strtolower( $t ) ] = $t;
}
$businessType = isset( $typeLcMap[ strtolower( $businessType ) ] )
	? $typeLcMap[ strtolower( $businessType ) ]
	: 'LocalBusiness';

$headingTagRaw = isset( $attributes['headingTag'] ) ? sanitize_key( (string) $attributes['headingTag'] ) : 'h3';
$headingTag    = in_array( $headingTagRaw, [ 'h2', 'h3', 'h4', 'h5', 'h6' ], true ) ? $headingTagRaw : 'h3';

$layoutRaw = isset( $attributes['layout'] ) ? sanitize_key( (string) $attributes['layout'] ) : 'card';
$layout    = in_array( $layoutRaw, [ 'card', 'horizontal' ], true ) ? $layoutRaw : 'card';

$themeRaw = isset( $attributes['theme'] ) ? sanitize_key( (string) $attributes['theme'] ) : 'classic';
$theme    = in_array( $themeRaw, [ 'classic', 'corporate', 'gradient', 'elegant', 'bold' ], true ) ? $themeRaw : 'classic';

$alignmentRaw = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center' ], true ) ? $alignmentRaw : 'left';

$logoShapeRaw = isset( $attributes['logoShape'] ) ? sanitize_key( (string) $attributes['logoShape'] ) : 'rounded';
$logoShape    = in_array( $logoShapeRaw, [ 'circle', 'rounded', 'square' ], true ) ? $logoShapeRaw : 'rounded';

$nameFontWeightRaw = isset( $attributes['nameFontWeight'] ) ? (string) $attributes['nameFontWeight'] : '700';
$nameFontWeight    = in_array( $nameFontWeightRaw, [ '400', '500', '600', '700', '800' ], true ) ? $nameFontWeightRaw : '700';

$showSchema       = isset( $attributes['showSchema'] ) ? (bool) $attributes['showSchema'] : true;
$showLogo         = isset( $attributes['showLogo'] ) ? (bool) $attributes['showLogo'] : true;
$showTagline      = isset( $attributes['showTagline'] ) ? (bool) $attributes['showTagline'] : true;
$showAddress      = isset( $attributes['showAddress'] ) ? (bool) $attributes['showAddress'] : true;
$showPhone        = isset( $attributes['showPhone'] ) ? (bool) $attributes['showPhone'] : true;
$showEmail        = isset( $attributes['showEmail'] ) ? (bool) $attributes['showEmail'] : true;
$showWebsite      = isset( $attributes['showWebsite'] ) ? (bool) $attributes['showWebsite'] : true;
$showDirectionsBtn = isset( $attributes['showDirectionsBtn'] ) ? (bool) $attributes['showDirectionsBtn'] : true;

$logoUrlRaw = isset( $attributes['logoUrl'] ) ? esc_url_raw( (string) $attributes['logoUrl'] ) : '';
$logoAltRaw = sanitize_text_field( (string) ( $attributes['logoAlt'] ?? '' ) );
$logoAlt    = '' !== $logoAltRaw ? $logoAltRaw : $businessName;

$phoneRaw     = sanitize_text_field( (string) ( $attributes['phone'] ?? '' ) );
$telHref      = $sanitizeTelHref( $phoneRaw );

$emailRaw     = trim( (string) ( $attributes['email'] ?? '' ) );
$emailValid   = ( '' !== $emailRaw && is_email( $emailRaw ) ) ? sanitize_email( $emailRaw ) : '';

$websiteRaw   = trim( (string) ( $attributes['website'] ?? '' ) );
$websiteUrl   = '' !== $websiteRaw ? esc_url_raw( $websiteRaw ) : '';

$addressStreet  = sanitize_text_field( (string) ( $attributes['addressStreet'] ?? '' ) );
$addressCity    = sanitize_text_field( (string) ( $attributes['addressCity'] ?? '' ) );
$addressState   = sanitize_text_field( (string) ( $attributes['addressState'] ?? '' ) );
$addressPostal  = sanitize_text_field( (string) ( $attributes['addressPostal'] ?? '' ) );
$addressCountry = sanitize_text_field( (string) ( $attributes['addressCountry'] ?? '' ) );

$addressOneLine = $composeAddress( $addressStreet, $addressCity, $addressState, $addressPostal, $addressCountry );

$mapUrlRaw    = trim( (string) ( $attributes['mapUrl'] ?? '' ) );
$mapUrl       = '' !== $mapUrlRaw ? esc_url_raw( $mapUrlRaw ) : '';
// Fallback: build a Google Maps query URL from the address when no mapUrl
// is set, so the directions button can still work out of the box.
if ( '' === $mapUrl && '' !== $addressOneLine ) {
	$mapUrl = esc_url_raw( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( $addressOneLine ) );
}

$directionsLabel = sanitize_text_field( (string) ( $attributes['directionsLabel'] ?? '' ) );
if ( '' === $directionsLabel ) {
	$directionsLabel = __( 'Get Directions', 'b-blocks' );
}

// --- Numeric clamps ----------------------------------------------------

$borderRadius = isset( $attributes['borderRadius'] ) ? max( 0, min( 64, (int) $attributes['borderRadius'] ) ) : 12;
$borderWidth  = isset( $attributes['borderWidth'] ) ? max( 0, min( 8, (int) $attributes['borderWidth'] ) ) : 1;
$logoSize     = isset( $attributes['logoSize'] ) ? max( 32, min( 200, (int) $attributes['logoSize'] ) ) : 80;
$nameFontSize = isset( $attributes['nameFontSize'] ) ? max( 14, min( 48, (int) $attributes['nameFontSize'] ) ) : 22;
$labelFontSize = isset( $attributes['labelFontSize'] ) ? max( 10, min( 24, (int) $attributes['labelFontSize'] ) ) : 14;
$rowIconSize   = isset( $attributes['rowIconSize'] ) ? max( 10, min( 28, (int) $attributes['rowIconSize'] ) ) : 16;

$paddingRaw = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop     = isset( $paddingRaw['top'] ) ? max( 0, min( 96, (int) $paddingRaw['top'] ) ) : 32;
$padRight   = isset( $paddingRaw['right'] ) ? max( 0, min( 96, (int) $paddingRaw['right'] ) ) : 32;
$padBottom  = isset( $paddingRaw['bottom'] ) ? max( 0, min( 96, (int) $paddingRaw['bottom'] ) ) : 32;
$padLeft    = isset( $paddingRaw['left'] ) ? max( 0, min( 96, (int) $paddingRaw['left'] ) ) : 32;

// --- Colors ------------------------------------------------------------

$accentColor     = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#ffffff' );
$textColor       = $sanitizeColor( $attributes['textColor'] ?? '', '#1a1a1a' );
$nameColor       = $sanitizeColor( $attributes['nameColor'] ?? '', '' );
$linkColor       = $sanitizeColor( $attributes['linkColor'] ?? '', '' );
$iconColor       = $sanitizeColor( $attributes['iconColor'] ?? '', '' );
$borderColor     = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );

$logoShapeRadius = 'circle' === $logoShape ? '50%' : ( 'rounded' === $logoShape ? '12px' : '0' );

// --- Wrapper CSS variables --------------------------------------------

$cssVars = [
	'--bb-cc-accent:' . $accentColor,
	'--bb-cc-bg:' . $backgroundColor,
	'--bb-cc-text:' . $textColor,
	'--bb-cc-name-color:' . ( '' === $nameColor ? $textColor : $nameColor ),
	'--bb-cc-link-color:' . ( '' === $linkColor ? $accentColor : $linkColor ),
	'--bb-cc-icon-color:' . ( '' === $iconColor ? $accentColor : $iconColor ),
	'--bb-cc-border-color:' . $borderColor,
	'--bb-cc-border-width:' . $borderWidth . 'px',
	'--bb-cc-radius:' . $borderRadius . 'px',
	'--bb-cc-logo-size:' . $logoSize . 'px',
	'--bb-cc-logo-radius:' . $logoShapeRadius,
	'--bb-cc-name-size:' . $nameFontSize . 'px',
	'--bb-cc-name-weight:' . $nameFontWeight,
	'--bb-cc-label-size:' . $labelFontSize . 'px',
	'--bb-cc-icon-size:' . $rowIconSize . 'px',
	'--bb-cc-pad-top:' . $padTop . 'px',
	'--bb-cc-pad-right:' . $padRight . 'px',
	'--bb-cc-pad-bottom:' . $padBottom . 'px',
	'--bb-cc-pad-left:' . $padLeft . 'px',
];
$wrapperStyle = implode( ';', $cssVars ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-cc'
	. ' bb-cc-layout--' . $layout
	. ' bb-cc-theme--' . $theme
	. ' bb-cc-align--' . $alignment
	. ' bb-cc-logo--' . $logoShape
);

$ariaLabelText = '' !== $businessName
	? sprintf(
		/* translators: %s: business name */
		__( '%s contact information', 'b-blocks' ),
		$businessName
	)
	: __( 'Contact information', 'b-blocks' );

// Tally rows so the list element is omitted entirely when nothing is shown.
$hasAddressRow  = ( $showAddress && '' !== $addressOneLine );
$hasPhoneRow    = ( $showPhone && '' !== $telHref );
$hasEmailRow    = ( $showEmail && '' !== $emailValid );
$hasWebsiteRow  = ( $showWebsite && '' !== $websiteUrl );
$hasAnyRow      = ( $hasAddressRow || $hasPhoneRow || $hasEmailRow || $hasWebsiteRow );

$showDirections = ( $showDirectionsBtn && '' !== $mapUrl );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<section class='bb-cc-card' aria-label='<?php echo esc_attr( $ariaLabelText ); ?>'>
		<?php if ( ( $showLogo && '' !== $logoUrlRaw ) || ( '' !== $businessName ) || ( $showTagline && '' !== $tagline ) ) : ?>
			<header class='bb-cc-header'>
				<?php if ( $showLogo && '' !== $logoUrlRaw ) : ?>
					<div class='bb-cc-logo' aria-hidden='<?php echo esc_attr( '' !== $businessName ? 'true' : 'false' ); ?>'>
						<img
							src='<?php echo esc_url( $logoUrlRaw ); ?>'
							alt='<?php echo esc_attr( $logoAlt ); ?>'
							width='<?php echo esc_attr( (string) $logoSize ); ?>'
							height='<?php echo esc_attr( (string) $logoSize ); ?>'
							loading='lazy'
							decoding='async'
						/>
					</div>
				<?php endif; ?>

				<div class='bb-cc-heading'>
					<?php if ( '' !== $businessName ) :
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() and esc_html() are applied to both substitutions.
						printf(
							'<%1$s class="bb-cc-name">%2$s</%1$s>',
							tag_escape( $headingTag ),
							esc_html( $businessName )
						);
					endif; ?>

					<?php if ( $showTagline && '' !== $tagline ) : ?>
						<p class='bb-cc-tagline'><?php echo esc_html( $tagline ); ?></p>
					<?php endif; ?>
				</div>
			</header>
		<?php endif; ?>

		<?php if ( $hasAnyRow ) : ?>
			<ul class='bb-cc-list'>
				<?php if ( $hasAddressRow ) : ?>
					<li class='bb-cc-item bb-cc-item--address'>
						<span class='bb-cc-icon' aria-hidden='true'>
							<i class='fa-solid fa-location-dot'></i>
						</span>
						<?php if ( '' !== $mapUrl ) : ?>
							<a
								class='bb-cc-link bb-cc-address-link'
								href='<?php echo esc_url( $mapUrl ); ?>'
								target='_blank'
								rel='noopener noreferrer'
								aria-label='<?php echo esc_attr(
									sprintf(
										/* translators: %s: business name */
										__( 'Open %s address in Google Maps', 'b-blocks' ),
										'' !== $businessName ? $businessName : $addressOneLine
									)
								); ?>'
							>
								<address><?php echo esc_html( $addressOneLine ); ?></address>
							</a>
						<?php else : ?>
							<address><?php echo esc_html( $addressOneLine ); ?></address>
						<?php endif; ?>
					</li>
				<?php endif; ?>

				<?php if ( $hasPhoneRow ) : ?>
					<li class='bb-cc-item bb-cc-item--phone'>
						<span class='bb-cc-icon' aria-hidden='true'>
							<i class='fa-solid fa-phone'></i>
						</span>
						<a
							class='bb-cc-link'
							href='<?php echo esc_url( 'tel:' . $telHref ); ?>'
							aria-label='<?php echo esc_attr(
								sprintf(
									/* translators: 1: business name, 2: phone number */
									__( 'Call %1$s: %2$s', 'b-blocks' ),
									'' !== $businessName ? $businessName : __( 'us', 'b-blocks' ),
									$phoneRaw
								)
							); ?>'
						><?php echo esc_html( $phoneRaw ); ?></a>
					</li>
				<?php endif; ?>

				<?php if ( $hasEmailRow ) : ?>
					<li class='bb-cc-item bb-cc-item--email'>
						<span class='bb-cc-icon' aria-hidden='true'>
							<i class='fa-solid fa-envelope'></i>
						</span>
						<a
							class='bb-cc-link'
							href='<?php echo esc_url( 'mailto:' . antispambot( $emailValid ) ); ?>'
							aria-label='<?php echo esc_attr(
								sprintf(
									/* translators: 1: business name, 2: email address */
									__( 'Email %1$s: %2$s', 'b-blocks' ),
									'' !== $businessName ? $businessName : __( 'us', 'b-blocks' ),
									$emailValid
								)
							); ?>'
						><?php echo esc_html( antispambot( $emailValid ) ); ?></a>
					</li>
				<?php elseif ( $showEmail && '' !== $emailRaw && '' === $emailValid ) : ?>
					<li class='bb-cc-item bb-cc-item--email is-invalid'>
						<span class='bb-cc-icon' aria-hidden='true'>
							<i class='fa-solid fa-envelope'></i>
						</span>
						<span><?php echo esc_html( $emailRaw ); ?></span>
					</li>
				<?php endif; ?>

				<?php if ( $hasWebsiteRow ) : ?>
					<li class='bb-cc-item bb-cc-item--web'>
						<span class='bb-cc-icon' aria-hidden='true'>
							<i class='fa-solid fa-globe'></i>
						</span>
						<a
							class='bb-cc-link'
							href='<?php echo esc_url( $websiteUrl ); ?>'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='<?php echo esc_attr(
								sprintf(
									/* translators: %s: business name */
									__( 'Visit %s website', 'b-blocks' ),
									'' !== $businessName ? $businessName : __( 'our website', 'b-blocks' )
								)
							); ?>'
						><?php
							// Display the host without the protocol for a cleaner read.
							$displayHost = wp_parse_url( $websiteUrl, PHP_URL_HOST );
							$displayPath = wp_parse_url( $websiteUrl, PHP_URL_PATH );
							$displayText = is_string( $displayHost ) && '' !== $displayHost
								? preg_replace( '/^www\./i', '', $displayHost ) . ( ( is_string( $displayPath ) && '' !== $displayPath && '/' !== $displayPath ) ? $displayPath : '' )
								: $websiteUrl;
							echo esc_html( $displayText );
						?></a>
					</li>
				<?php endif; ?>
			</ul>
		<?php endif; ?>

		<?php if ( $showDirections ) : ?>
			<p class='bb-cc-actions'>
				<a
					class='bb-cc-directions'
					href='<?php echo esc_url( $mapUrl ); ?>'
					target='_blank'
					rel='noopener noreferrer'
					aria-label='<?php echo esc_attr(
						sprintf(
							/* translators: %s: business name */
							__( 'Get directions to %s', 'b-blocks' ),
							'' !== $businessName ? $businessName : __( 'our location', 'b-blocks' )
						)
					); ?>'
				>
					<i class='fa-solid fa-diamond-turn-right' aria-hidden='true'></i>
					<span><?php echo esc_html( $directionsLabel ); ?></span>
				</a>
			</p>
		<?php endif; ?>
	</section>

	<?php
	// ---------------------------------------------------------------
	// JSON-LD LocalBusiness schema output. Only emit when:
	//   - showSchema is true
	//   - businessName is non-empty (Google requires `name`)
	// Strip HTML so the JSON-LD payload validates cleanly. Use
	// JSON_HEX_TAG so a stray "</script>" inside user content cannot
	// break out of the <script type="application/ld+json"> block.
	// ---------------------------------------------------------------
	$canEmitSchema = ( $showSchema && '' !== wp_strip_all_tags( $businessName ) );

	if ( $canEmitSchema ) :
		$schema = [
			'@context' => 'https://schema.org',
			'@type'    => $businessType,
			'name'     => wp_strip_all_tags( $businessName ),
		];

		// PostalAddress sub-node — only include when at least one piece is set.
		$addressNode = [];
		if ( '' !== $addressStreet ) {
			$addressNode['streetAddress'] = wp_strip_all_tags( $addressStreet );
		}
		if ( '' !== $addressCity ) {
			$addressNode['addressLocality'] = wp_strip_all_tags( $addressCity );
		}
		if ( '' !== $addressState ) {
			$addressNode['addressRegion'] = wp_strip_all_tags( $addressState );
		}
		if ( '' !== $addressPostal ) {
			$addressNode['postalCode'] = wp_strip_all_tags( $addressPostal );
		}
		if ( '' !== $addressCountry ) {
			$addressNode['addressCountry'] = wp_strip_all_tags( $addressCountry );
		}
		if ( ! empty( $addressNode ) ) {
			$addressNode = array_merge( [ '@type' => 'PostalAddress' ], $addressNode );
			$schema['address'] = $addressNode;
		}

		if ( '' !== $telHref ) {
			$schema['telephone'] = $telHref;
		}
		if ( '' !== $emailValid ) {
			$schema['email'] = $emailValid;
		}
		if ( '' !== $websiteUrl ) {
			$schema['url'] = esc_url_raw( $websiteUrl );
		}
		if ( '' !== $logoUrlRaw ) {
			$schema['image'] = esc_url_raw( $logoUrlRaw );
			$schema['logo']  = esc_url_raw( $logoUrlRaw );
		}
		if ( '' !== $tagline ) {
			$schema['description'] = wp_strip_all_tags( $tagline );
		}
		if ( '' !== $mapUrl ) {
			$schema['hasMap'] = esc_url_raw( $mapUrl );
		}

		$jsonLd = wp_json_encode( $schema, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE );
		if ( false !== $jsonLd ) :
			?>
			<script type='application/ld+json'><?php echo $jsonLd; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output is safe within a JSON-LD script tag (JSON_HEX_TAG prevents </script> breakout). ?></script>
			<?php
		endif;
	endif;
	?>
</div>
