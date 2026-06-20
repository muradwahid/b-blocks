<?php
/**
 * Woo Category Grid block server-side render.
 *
 * Renders a responsive "Shop by Category" grid of WooCommerce product
 * categories (`product_cat` terms) using a sanitized `get_terms()` query. Each
 * card is a `<li>` containing a single `<a>` that wraps the whole card (the
 * WooCommerce-native category thumbnail — resolved from
 * `get_term_meta( $term->term_id, 'thumbnail_id', true )` — or a colored
 * fallback block with a Font Awesome icon, the category name, an optional
 * product-count badge, and an optional "Shop Now" CTA) and links to the
 * category archive. The grid is a `<ul role="list" aria-label="…">`.
 * Per-instance CSS custom properties are emitted inline, scoped under a
 * `wp_unique_id()` wrapper id (block-specific `bb-wcg-` prefix), so multiple
 * grids on one page never collide.
 *
 * Every `get_terms()` argument is sanitized (orderby/order via strict
 * allowlists, number/hide_empty via `absint`/bool, include/exclude term IDs via
 * `absint` + `array_filter`, parent via the top-level-only toggle).
 * `get_term_link()` is checked for `WP_Error`. All dynamic output is escaped.
 *
 * If WooCommerce is not active, a friendly `role="alert"` notice is shown
 * instead of fataling. All `render.php` helpers are inlined as static closures
 * to avoid the "Cannot redeclare function" fatal Gutenberg can trigger by
 * including this file more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksWooCategoryGrid';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named). ---
$sanitizeColor = static function ( $color, $fallback = '' ) {
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
	// Hardened var() allowlist: optional comma-fallback restricted to safe chars only.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp a numeric attribute. ---
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return (int) $fallback;
	}
	$value = (int) $value;
	if ( $value < $min ) {
		return (int) $min;
	}
	if ( $value > $max ) {
		return (int) $max;
	}
	return $value;
};

// --- Allowlist helper. ---
$pickFrom = static function ( $value, array $allowed, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allowed, true ) ? $value : $fallback;
};

// --- Parse a comma-separated list of term IDs into a clean positive-int array. ---
$parseIds = static function ( $value ) {
	if ( ! is_string( $value ) || '' === trim( $value ) ) {
		return [];
	}
	$parts = array_map( 'absint', explode( ',', $value ) );
	$parts = array_filter(
		$parts,
		static function ( $v ) {
			return $v > 0;
		}
	);
	return array_values( array_unique( $parts ) );
};

// --- Box-shadow presets. ---
$shadowFor = static function ( $preset ) {
	switch ( $preset ) {
		case 'small':
			return '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)';
		case 'medium':
			return '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)';
		case 'large':
			return '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)';
		case 'none':
		default:
			return 'none';
	}
};

// --- Sanitize a Font Awesome icon class string (space-separated tokens). ---
$sanitizeIconClass = static function ( $value, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	if ( '' === $value ) {
		return $fallback;
	}
	$tokens = preg_split( '/\s+/', $value );
	$clean  = [];
	foreach ( $tokens as $token ) {
		$token = sanitize_html_class( $token );
		if ( '' !== $token ) {
			$clean[] = $token;
		}
	}
	return empty( $clean ) ? $fallback : implode( ' ', array_slice( $clean, 0, 4 ) );
};

// --- Resolve content attributes early (needed for the WC-missing notice). ---
$noWooMessage  = isset( $attributes['noWooMessage'] ) ? sanitize_text_field( (string) $attributes['noWooMessage'] ) : __( 'WooCommerce is required for this block.', 'b-blocks' );
$noTermsMessage = isset( $attributes['noTermsMessage'] ) ? sanitize_text_field( (string) $attributes['noTermsMessage'] ) : __( 'No product categories found.', 'b-blocks' );

if ( '' === $noWooMessage ) {
	$noWooMessage = __( 'WooCommerce is required for this block.', 'b-blocks' );
}
if ( '' === $noTermsMessage ) {
	$noTermsMessage = __( 'No product categories found.', 'b-blocks' );
}

// --- WooCommerce missing — show a friendly alert instead of fataling. ---
if ( ! class_exists( 'WooCommerce' ) || ! taxonomy_exists( 'product_cat' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wcg" ] ); ?>
	>
		<div class='bb-wcg-notice' role='alert'>
			<p><?php echo esc_html( $noWooMessage ); ?></p>
		</div>
	</div>
	<?php
	return;
}

// --- Resolve query attributes. ---
$orderby = $pickFrom( $attributes['orderby'] ?? 'name', [ 'name', 'count', 'term_id', 'slug' ], 'name' );
$order   = $pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'ASC' ) ), [ 'ASC', 'DESC' ], 'ASC' );

// 0 = all terms; otherwise 1–48.
$numberRaw = isset( $attributes['number'] ) ? absint( $attributes['number'] ) : 8;
$number    = ( 0 === $numberRaw ) ? 0 : $clampInt( $numberRaw, 1, 48, 8 );

$hideEmpty    = isset( $attributes['hideEmpty'] ) ? (bool) $attributes['hideEmpty'] : true;
$topLevelOnly = isset( $attributes['topLevelOnly'] ) ? (bool) $attributes['topLevelOnly'] : true;
$includeIds   = $parseIds( $attributes['includeIds'] ?? '' );
$excludeIds   = $parseIds( $attributes['excludeIds'] ?? '' );

// --- Resolve layout attributes. ---
$colDesktop = $clampInt( $attributes['columnsDesktop'] ?? 4, 1, 6, 4 );
$colTablet  = $clampInt( $attributes['columnsTablet'] ?? 2, 1, 4, 2 );
$colMobile  = $clampInt( $attributes['columnsMobile'] ?? 1, 1, 2, 1 );
$colGap     = $clampInt( $attributes['columnGap'] ?? 20, 0, 80, 20 );
$rowGap     = $clampInt( $attributes['rowGap'] ?? 20, 0, 80, 20 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );
$alignment  = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

// --- Resolve card-style attributes. ---
$cardStyle  = $pickFrom( $attributes['cardStyle'] ?? 'overlay', [ 'overlay', 'below', 'plain' ], 'overlay' );
$imageRatio = $pickFrom( $attributes['imageRatio'] ?? '1/1', [ '1/1', '4/3', '3/2', '16/9', '3/4' ], '1/1' );
$imageSize  = $pickFrom( $attributes['imageSize'] ?? 'medium', [ 'thumbnail', 'medium', 'large', 'full' ], 'medium' );

$fallbackColor     = $sanitizeColor( $attributes['fallbackColor'] ?? '', '#7c3aed' );
$fallbackIconClass = $sanitizeIconClass( $attributes['fallbackIconClass'] ?? '', 'fa-solid fa-tag' );
$overlayColor      = $sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.40)' );
$accentColor       = $sanitizeColor( $attributes['accentColor'] ?? '', '#7c3aed' );

$cardBg       = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$cardRadius   = $clampInt( $attributes['cardRadius'] ?? 8, 0, 48, 8 );
$cardPaddingV = $clampInt( $attributes['cardPaddingV'] ?? 16, 0, 64, 16 );
$cardPaddingH = $clampInt( $attributes['cardPaddingH'] ?? 16, 0, 64, 16 );
$shadowPreset = $pickFrom( $attributes['shadowPreset'] ?? 'small', [ 'none', 'small', 'medium', 'large' ], 'small' );
$borderWidth  = $clampInt( $attributes['borderWidth'] ?? 0, 0, 8, 0 );
$borderColor  = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );

// --- Resolve content attributes. ---
$showCount    = isset( $attributes['showCount'] ) ? (bool) $attributes['showCount'] : true;
$countLabel   = isset( $attributes['countLabel'] ) ? sanitize_text_field( (string) $attributes['countLabel'] ) : '';
$showCta      = isset( $attributes['showCta'] ) ? (bool) $attributes['showCta'] : false;
$ctaLabel     = isset( $attributes['ctaLabel'] ) ? sanitize_text_field( (string) $attributes['ctaLabel'] ) : '';
$openInNewTab = isset( $attributes['openInNewTab'] ) ? (bool) $attributes['openInNewTab'] : false;

if ( $showCta && '' === $ctaLabel ) {
	$ctaLabel = __( 'Shop Now', 'b-blocks' );
}

// --- Resolve typography / color attributes. ---
$nameColor      = $sanitizeColor( $attributes['nameColor'] ?? '', '' );
$nameFontSize   = $clampInt( $attributes['nameFontSize'] ?? 18, 10, 48, 18 );
$nameFontWeight = $pickFrom( (string) ( $attributes['nameFontWeight'] ?? '600' ), [ '400', '500', '600', '700', '800' ], '600' );

$countColor    = $sanitizeColor( $attributes['countColor'] ?? '', '#ffffff' );
$countBg       = $sanitizeColor( $attributes['countBg'] ?? '', $accentColor );
$countFontSize = $clampInt( $attributes['countFontSize'] ?? 12, 10, 20, 12 );

$ctaColor    = $sanitizeColor( $attributes['ctaColor'] ?? '', '' );
$ctaFontSize = $clampInt( $attributes['ctaFontSize'] ?? 13, 10, 20, 13 );

$hoverEffect   = $pickFrom( $attributes['hoverEffect'] ?? 'zoom', [ 'zoom', 'lift', 'darken', 'none' ], 'zoom' );
$hoverDuration = $clampInt( $attributes['hoverDuration'] ?? 300, 0, 800, 300 );

// --- Default name / CTA colors depend on card style (white over overlay). ---
$resolvedNameColor = '' !== $nameColor
	? $nameColor
	: ( 'overlay' === $cardStyle ? '#ffffff' : '#111827' );
$resolvedCtaColor = '' !== $ctaColor
	? $ctaColor
	: ( 'overlay' === $cardStyle ? '#ffffff' : $accentColor );

// --- Build the get_terms() query for product categories. ---
$termArgs = [
	'taxonomy'   => 'product_cat',
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => $hideEmpty,
];

if ( $number > 0 ) {
	$termArgs['number'] = $number;
}
if ( $topLevelOnly && empty( $includeIds ) ) {
	$termArgs['parent'] = 0;
}
if ( ! empty( $includeIds ) ) {
	$termArgs['include'] = $includeIds;
}
if ( ! empty( $excludeIds ) ) {
	$termArgs['exclude'] = $excludeIds;
}

$terms = get_terms( $termArgs );

if ( is_wp_error( $terms ) ) {
	$terms = [];
}

// --- Per-instance CSS variables. ---
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";
$blockMargin = 'left' === $alignment ? '0 auto 0 0' : ( 'right' === $alignment ? '0 0 0 auto' : '0 auto' );

$css  = "#$id.bb-wcg{";
$css .= "--bb-wcg-cols-desktop:$colDesktop;";
$css .= "--bb-wcg-cols-tablet:$colTablet;";
$css .= "--bb-wcg-cols-mobile:$colMobile;";
$css .= "--bb-wcg-col-gap:{$colGap}px;";
$css .= "--bb-wcg-row-gap:{$rowGap}px;";
$css .= "--bb-wcg-max-width:$maxWidthCss;";
$css .= "--bb-wcg-margin:$blockMargin;";
$css .= "--bb-wcg-aspect:$imageRatio;";
$css .= "--bb-wcg-fallback:$fallbackColor;";
$css .= "--bb-wcg-overlay:$overlayColor;";
$css .= "--bb-wcg-accent:$accentColor;";
$css .= "--bb-wcg-card-bg:$cardBg;";
$css .= "--bb-wcg-card-radius:{$cardRadius}px;";
$css .= "--bb-wcg-pad-v:{$cardPaddingV}px;";
$css .= "--bb-wcg-pad-h:{$cardPaddingH}px;";
$css .= '--bb-wcg-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= "--bb-wcg-border-width:{$borderWidth}px;";
$css .= "--bb-wcg-border-color:$borderColor;";
$css .= "--bb-wcg-name-color:$resolvedNameColor;";
$css .= "--bb-wcg-name-size:{$nameFontSize}px;";
$css .= "--bb-wcg-name-weight:$nameFontWeight;";
$css .= "--bb-wcg-count-color:$countColor;";
$css .= "--bb-wcg-count-bg:$countBg;";
$css .= "--bb-wcg-count-size:{$countFontSize}px;";
$css .= "--bb-wcg-cta-color:$resolvedCtaColor;";
$css .= "--bb-wcg-cta-size:{$ctaFontSize}px;";
$css .= "--bb-wcg-transition:{$hoverDuration}ms;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-wcg'
	. ' bb-wcg--' . $cardStyle
	. ' bb-wcg--hover-' . $hoverEffect
	. ( $borderWidth > 0 ? ' bb-wcg--has-border' : '' )
	. ( $maxWidth > 0 ? ' bb-wcg--has-max-width bb-wcg--align-' . $alignment : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wcg='true'
	data-hover-duration='<?php echo esc_attr( (string) $hoverDuration ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<?php if ( empty( $terms ) ) : ?>
		<p class='bb-wcg-empty'><?php echo esc_html( $noTermsMessage ); ?></p>
	<?php else : ?>
		<ul class='bb-wcg-grid' role='list' aria-label='<?php echo esc_attr__( 'Product categories', 'b-blocks' ); ?>'>
			<?php
			foreach ( $terms as $term ) :
				if ( ! ( $term instanceof WP_Term ) ) {
					continue;
				}

				$termLink = get_term_link( $term );
				if ( is_wp_error( $termLink ) ) {
					continue;
				}

				$termName  = $term->name;
				$termCount = (int) $term->count;

				// WooCommerce-native category thumbnail via term meta.
				$imageUrl = '';
				$imageAlt = '';
				if ( 'plain' !== $cardStyle ) {
					$thumbId = get_term_meta( $term->term_id, 'thumbnail_id', true );
					$thumbId = is_numeric( $thumbId ) ? absint( $thumbId ) : 0;
					if ( $thumbId > 0 ) {
						$src = wp_get_attachment_image_url( $thumbId, $imageSize );
						if ( $src ) {
							$imageUrl = $src;
							$rawAlt   = get_post_meta( $thumbId, '_wp_attachment_image_alt', true );
							$imageAlt = is_string( $rawAlt ) ? trim( $rawAlt ) : '';
						}
					}
				}

				if ( '' === $imageAlt ) {
					$imageAlt = $termName;
				}

				$hasImage = ( 'plain' !== $cardStyle ) && ( '' !== $imageUrl );

				// Accessible link label: "Category name, N Products".
				$linkLabel = $termName;
				if ( $showCount ) {
					$countPhrase = $termCount . ( '' !== $countLabel ? ' ' . $countLabel : '' );
					/* translators: 1: category name, 2: product count phrase (e.g. "24 Products"). */
					$linkLabel = sprintf( _x( '%1$s, %2$s', 'category link accessible name', 'b-blocks' ), $termName, $countPhrase );
				}

				// Count badge text: "12 Products" if a label is set, otherwise just "12".
				$countText = (string) $termCount;
				if ( '' !== $countLabel ) {
					$countText = $termCount . ' ' . $countLabel;
				}
				?>
				<li class='bb-wcg-item'>
					<a
						class='bb-wcg-card'
						href='<?php echo esc_url( $termLink ); ?>'
						aria-label='<?php echo esc_attr( $linkLabel ); ?>'
						<?php if ( $openInNewTab ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
					>
						<?php if ( 'plain' !== $cardStyle ) : ?>
							<span class='bb-wcg-media'>
								<?php if ( $hasImage ) : ?>
									<img
										class='bb-wcg-image'
										src='<?php echo esc_url( $imageUrl ); ?>'
										alt='<?php echo esc_attr( $imageAlt ); ?>'
										loading='lazy'
										decoding='async'
									/>
								<?php else : ?>
									<span class='bb-wcg-fallback' aria-hidden='true'>
										<i class='<?php echo esc_attr( $fallbackIconClass ); ?> bb-wcg-fallback-icon'></i>
									</span>
								<?php endif; ?>

								<?php if ( 'overlay' === $cardStyle ) : ?>
									<span class='bb-wcg-overlay' aria-hidden='true'></span>
								<?php endif; ?>

								<?php if ( 'overlay' === $cardStyle ) : ?>
									<span class='bb-wcg-body bb-wcg-body--overlay'>
										<span class='bb-wcg-name'><?php echo esc_html( $termName ); ?></span>
										<?php if ( $showCount ) : ?>
											<span class='bb-wcg-count' aria-hidden='true'><?php echo esc_html( $countText ); ?></span>
										<?php endif; ?>
										<?php if ( $showCta && '' !== $ctaLabel ) : ?>
											<span class='bb-wcg-cta' aria-hidden='true'><?php echo esc_html( $ctaLabel ); ?></span>
										<?php endif; ?>
									</span>
								<?php endif; ?>
							</span>
						<?php endif; ?>

						<?php if ( 'overlay' !== $cardStyle ) : ?>
							<span class='bb-wcg-body'>
								<span class='bb-wcg-name'><?php echo esc_html( $termName ); ?></span>
								<?php if ( $showCount ) : ?>
									<span class='bb-wcg-count' aria-hidden='true'><?php echo esc_html( $countText ); ?></span>
								<?php endif; ?>
								<?php if ( $showCta && '' !== $ctaLabel ) : ?>
									<span class='bb-wcg-cta' aria-hidden='true'><?php echo esc_html( $ctaLabel ); ?></span>
								<?php endif; ?>
							</span>
						<?php endif; ?>

						<?php if ( $openInNewTab ) : ?>
							<span class='screen-reader-text'><?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
						<?php endif; ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>
