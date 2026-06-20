<?php
/**
 * Taxonomy Grid block server-side render.
 *
 * Renders a responsive grid of taxonomy term cards using a sanitized
 * `get_terms()` query. Each card is a `<li>` containing a single `<a>` that
 * wraps the whole card (term thumbnail or fallback color block, name, an
 * optional post-count badge, and an optional description) and links to the
 * term archive. The grid is a `<ul role="list" aria-label="…">`. Per-instance
 * CSS custom properties are emitted inline, scoped under a `wp_unique_id()`
 * wrapper id, so multiple grids on one page never collide.
 *
 * Every `get_terms()` argument is sanitized (taxonomy via `sanitize_key` +
 * `taxonomy_exists`, orderby/order via strict allowlists, number/hide_empty via
 * `absint`/bool, include/exclude term IDs via `absint` + `array_filter`).
 * `get_term_link()` is checked for `WP_Error`. All dynamic output is escaped.
 *
 * All `render.php` helpers are inlined as static closures to avoid the
 * "Cannot redeclare function" fatal Gutenberg can trigger by including this
 * file more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksTaxonomyGrid';
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

// --- Resolve query attributes. ---
$taxonomyRaw = isset( $attributes['taxonomy'] ) ? sanitize_key( (string) $attributes['taxonomy'] ) : 'category';
$taxonomy    = taxonomy_exists( $taxonomyRaw ) ? $taxonomyRaw : 'category';

$orderby = $pickFrom( $attributes['orderby'] ?? 'name', [ 'name', 'count', 'term_id', 'slug' ], 'name' );
$order   = $pickFrom( strtoupper( (string) ( $attributes['order'] ?? 'ASC' ) ), [ 'ASC', 'DESC' ], 'ASC' );

// 0 = all terms; otherwise 1–48.
$numberRaw = isset( $attributes['number'] ) ? absint( $attributes['number'] ) : 6;
$number    = ( 0 === $numberRaw ) ? 0 : $clampInt( $numberRaw, 1, 48, 6 );

$hideEmpty  = isset( $attributes['hideEmpty'] ) ? (bool) $attributes['hideEmpty'] : true;
$includeIds = $parseIds( $attributes['includeIds'] ?? '' );
$excludeIds = $parseIds( $attributes['excludeIds'] ?? '' );

// --- Resolve layout attributes. ---
$layout    = $pickFrom( $attributes['layout'] ?? 'grid', [ 'grid', 'masonry' ], 'grid' );
$colDesktop = $clampInt( $attributes['columnsDesktop'] ?? 3, 1, 6, 3 );
$colTablet  = $clampInt( $attributes['columnsTablet'] ?? 2, 1, 4, 2 );
$colMobile  = $clampInt( $attributes['columnsMobile'] ?? 1, 1, 2, 1 );
$colGap     = $clampInt( $attributes['columnGap'] ?? 24, 0, 80, 24 );
$rowGap     = $clampInt( $attributes['rowGap'] ?? 24, 0, 80, 24 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );
$alignment  = $pickFrom( $attributes['alignment'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

// --- Resolve card-style attributes. ---
$cardStyle  = $pickFrom( $attributes['cardStyle'] ?? 'overlay', [ 'overlay', 'below', 'plain' ], 'overlay' );
$imageRatio = $pickFrom( $attributes['imageRatio'] ?? '3/2', [ '1/1', '4/3', '3/2', '16/9', '3/4' ], '3/2' );
$imageSize  = $pickFrom( $attributes['imageSize'] ?? 'medium', [ 'thumbnail', 'medium', 'large', 'full' ], 'medium' );

$fallbackColor = $sanitizeColor( $attributes['fallbackColor'] ?? '', '#3b82f6' );
$overlayColor  = $sanitizeColor( $attributes['overlayColor'] ?? '', 'rgba(0,0,0,0.45)' );
$accentColor   = $sanitizeColor( $attributes['accentColor'] ?? '', '#3b82f6' );

$cardBg       = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$cardRadius   = $clampInt( $attributes['cardRadius'] ?? 8, 0, 48, 8 );
$cardPaddingV = $clampInt( $attributes['cardPaddingV'] ?? 16, 0, 64, 16 );
$cardPaddingH = $clampInt( $attributes['cardPaddingH'] ?? 16, 0, 64, 16 );
$shadowPreset = $pickFrom( $attributes['shadowPreset'] ?? 'small', [ 'none', 'small', 'medium', 'large' ], 'small' );
$borderWidth  = $clampInt( $attributes['borderWidth'] ?? 0, 0, 8, 0 );
$borderColor  = $sanitizeColor( $attributes['borderColor'] ?? '', '#e5e7eb' );

// --- Resolve content attributes. ---
$showCount         = isset( $attributes['showCount'] ) ? (bool) $attributes['showCount'] : true;
$countLabel        = isset( $attributes['countLabel'] ) ? sanitize_text_field( (string) $attributes['countLabel'] ) : '';
$showDescription   = isset( $attributes['showDescription'] ) ? (bool) $attributes['showDescription'] : false;
$descriptionLength = $clampInt( $attributes['descriptionLength'] ?? 80, 0, 200, 80 );
$openInNewTab      = isset( $attributes['openInNewTab'] ) ? (bool) $attributes['openInNewTab'] : false;

// --- Resolve typography / color attributes. ---
$nameColor      = $sanitizeColor( $attributes['nameColor'] ?? '', '' );
$nameFontSize   = $clampInt( $attributes['nameFontSize'] ?? 18, 10, 48, 18 );
$nameFontWeight = $pickFrom( (string) ( $attributes['nameFontWeight'] ?? '600' ), [ '400', '500', '600', '700', '800' ], '600' );

$countColor    = $sanitizeColor( $attributes['countColor'] ?? '', '#ffffff' );
$countBg       = $sanitizeColor( $attributes['countBg'] ?? '', $accentColor );
$countFontSize = $clampInt( $attributes['countFontSize'] ?? 13, 10, 20, 13 );

$descColor    = $sanitizeColor( $attributes['descColor'] ?? '', '' );
$descFontSize = $clampInt( $attributes['descFontSize'] ?? 14, 10, 24, 14 );

$hoverEffect   = $pickFrom( $attributes['hoverEffect'] ?? 'zoom', [ 'zoom', 'lift', 'darken', 'none' ], 'zoom' );
$hoverDuration = $clampInt( $attributes['hoverDuration'] ?? 300, 0, 800, 300 );

// --- Default name color depends on card style (white over overlay images). ---
$resolvedNameColor = '' !== $nameColor
	? $nameColor
	: ( 'overlay' === $cardStyle ? '#ffffff' : '#111827' );
$resolvedDescColor = '' !== $descColor
	? $descColor
	: ( 'overlay' === $cardStyle ? 'rgba(255,255,255,0.88)' : '#6B7280' );

// --- Build the get_terms() query. ---
$termArgs = [
	'taxonomy'   => $taxonomy,
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => $hideEmpty,
];

if ( $number > 0 ) {
	$termArgs['number'] = $number;
}
if ( ! empty( $includeIds ) ) {
	$termArgs['include'] = $includeIds;
}
if ( ! empty( $excludeIds ) ) {
	$termArgs['exclude'] = $excludeIds;
}

$terms = get_terms( $termArgs );

if ( is_wp_error( $terms ) || empty( $terms ) ) {
	return;
}

// --- Per-instance CSS variables. ---
$maxWidthCss = 0 === $maxWidth ? '100%' : "{$maxWidth}px";
$blockMargin = 'left' === $alignment ? '0 auto 0 0' : ( 'right' === $alignment ? '0 0 0 auto' : '0 auto' );

$css  = "#$id.bb-tg{";
$css .= "--bb-tg-cols-desktop:$colDesktop;";
$css .= "--bb-tg-cols-tablet:$colTablet;";
$css .= "--bb-tg-cols-mobile:$colMobile;";
$css .= "--bb-tg-col-gap:{$colGap}px;";
$css .= "--bb-tg-row-gap:{$rowGap}px;";
$css .= "--bb-tg-max-width:$maxWidthCss;";
$css .= "--bb-tg-margin:$blockMargin;";
$css .= "--bb-tg-aspect:$imageRatio;";
$css .= "--bb-tg-fallback:$fallbackColor;";
$css .= "--bb-tg-overlay:$overlayColor;";
$css .= "--bb-tg-accent:$accentColor;";
$css .= "--bb-tg-card-bg:$cardBg;";
$css .= "--bb-tg-card-radius:{$cardRadius}px;";
$css .= "--bb-tg-pad-v:{$cardPaddingV}px;";
$css .= "--bb-tg-pad-h:{$cardPaddingH}px;";
$css .= '--bb-tg-shadow:' . $shadowFor( $shadowPreset ) . ';';
$css .= "--bb-tg-border-width:{$borderWidth}px;";
$css .= "--bb-tg-border-color:$borderColor;";
$css .= "--bb-tg-name-color:$resolvedNameColor;";
$css .= "--bb-tg-name-size:{$nameFontSize}px;";
$css .= "--bb-tg-name-weight:$nameFontWeight;";
$css .= "--bb-tg-count-color:$countColor;";
$css .= "--bb-tg-count-bg:$countBg;";
$css .= "--bb-tg-count-size:{$countFontSize}px;";
$css .= "--bb-tg-desc-color:$resolvedDescColor;";
$css .= "--bb-tg-desc-size:{$descFontSize}px;";
$css .= "--bb-tg-transition:{$hoverDuration}ms;";
$css .= '}';

// --- Accessible list label from the taxonomy. ---
$taxObject = get_taxonomy( $taxonomy );
$taxLabel  = ( $taxObject && ! empty( $taxObject->labels->name ) )
	? $taxObject->labels->name
	: $taxonomy;
/* translators: %s: taxonomy label (e.g. Categories). */
$listLabel = sprintf( __( 'Browse by %s', 'b-blocks' ), $taxLabel );

$wrapperClasses = trim(
	$planClass
	. ' bb-tg'
	. ' bb-tg--' . $cardStyle
	. ' bb-tg--layout-' . $layout
	. ' bb-tg--hover-' . $hoverEffect
	. ( $borderWidth > 0 ? ' bb-tg--has-border' : '' )
	. ( $maxWidth > 0 ? ' bb-tg--has-max-width bb-tg--align-' . $alignment : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-tg-prm='true'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<ul class='bb-tg-grid' role='list' aria-label='<?php echo esc_attr( $listLabel ); ?>'>
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

			// Term thumbnail via term meta (set by plugins such as "Category Images").
			$imageUrl = '';
			$imageId  = 0;
			if ( 'plain' !== $cardStyle ) {
				foreach ( [ 'thumbnail_id', 'image_id', 'category-image-id', 'z_taxonomy_image_id', 'wpcf-category-image' ] as $metaKey ) {
					$metaVal = get_term_meta( $term->term_id, $metaKey, true );
					if ( $metaVal && is_numeric( $metaVal ) ) {
						$imageId = absint( $metaVal );
						break;
					}
					if ( is_string( $metaVal ) && '' !== $metaVal && filter_var( $metaVal, FILTER_VALIDATE_URL ) ) {
						$imageUrl = esc_url_raw( $metaVal );
						break;
					}
				}
				if ( $imageId > 0 ) {
					$src = wp_get_attachment_image_url( $imageId, $imageSize );
					if ( $src ) {
						$imageUrl = $src;
					}
				}
			}

			$hasImage = ( 'plain' !== $cardStyle ) && ( '' !== $imageUrl );

			// Term description.
			$descText = '';
			if ( $showDescription ) {
				$rawDesc = trim( (string) $term->description );
				if ( '' !== $rawDesc ) {
					$descText = wp_strip_all_tags( $rawDesc );
					if ( $descriptionLength > 0 && mb_strlen( $descText ) > $descriptionLength ) {
						$descText = rtrim( mb_substr( $descText, 0, $descriptionLength ) ) . '…';
					}
				}
			}

			// Accessible link label: "Term name, N posts".
			$linkLabel = $termName;
			if ( $showCount ) {
				/* translators: 1: term name, 2: post count. */
				$linkLabel = sprintf( _n( '%1$s, %2$d item', '%1$s, %2$d items', $termCount, 'b-blocks' ), $termName, $termCount );
			}

			// Count badge: "12 posts" if a label is set, otherwise just "12".
			$countText  = (string) $termCount;
			$countAria  = (string) $termCount;
			if ( '' !== $countLabel ) {
				$countText = $termCount . ' ' . $countLabel;
				$countAria = $countText;
			}
			?>
			<li class='bb-tg-item'>
				<a
					class='bb-tg-card'
					href='<?php echo esc_url( $termLink ); ?>'
					aria-label='<?php echo esc_attr( $linkLabel ); ?>'
					<?php if ( $openInNewTab ) : ?>target='_blank' rel='noopener noreferrer'<?php endif; ?>
				>
					<?php if ( 'plain' !== $cardStyle ) : ?>
						<span class='bb-tg-media'>
							<?php if ( $hasImage ) : ?>
								<img
									class='bb-tg-image'
									src='<?php echo esc_url( $imageUrl ); ?>'
									alt='<?php echo esc_attr( $termName ); ?>'
									loading='lazy'
									decoding='async'
								/>
							<?php else : ?>
								<span class='bb-tg-fallback' aria-hidden='true'></span>
							<?php endif; ?>

							<?php if ( 'overlay' === $cardStyle ) : ?>
								<span class='bb-tg-overlay' aria-hidden='true'></span>
							<?php endif; ?>

							<?php if ( 'overlay' === $cardStyle ) : ?>
								<span class='bb-tg-body bb-tg-body--overlay'>
									<span class='bb-tg-name'><?php echo esc_html( $termName ); ?></span>
									<?php if ( $showCount ) : ?>
										<span class='bb-tg-count' aria-label='<?php echo esc_attr( $countAria ); ?>'>
											<?php echo esc_html( $countText ); ?>
										</span>
									<?php endif; ?>
									<?php if ( '' !== $descText ) : ?>
										<span class='bb-tg-desc'><?php echo esc_html( $descText ); ?></span>
									<?php endif; ?>
								</span>
							<?php endif; ?>
						</span>
					<?php endif; ?>

					<?php if ( 'overlay' !== $cardStyle ) : ?>
						<span class='bb-tg-body'>
							<span class='bb-tg-name'><?php echo esc_html( $termName ); ?></span>
							<?php if ( $showCount ) : ?>
								<span class='bb-tg-count' aria-label='<?php echo esc_attr( $countAria ); ?>'>
									<?php echo esc_html( $countText ); ?>
								</span>
							<?php endif; ?>
							<?php if ( '' !== $descText ) : ?>
								<span class='bb-tg-desc'><?php echo esc_html( $descText ); ?></span>
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
</div>
