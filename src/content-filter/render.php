<?php
/**
 * Content Filter Block server-side render.
 *
 * Renders a filter button bar (one button per category derived from
 * `categories` plus an optional "All" button) followed by a CSS grid of
 * inner blocks (each inner block is a `b-blocks/content-filter-item`
 * tagged container). All filter logic is CSS-class toggling in view.js.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (the same pattern used in comparison-table and process-steps).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksContentFilter';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named) -----
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
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Slugify a category label for use in data attributes ---------------
$slugify = static function ( $label ) {
	$slug = sanitize_title( (string) $label );
	if ( '' === $slug ) {
		// sanitize_title may return empty for purely non-ASCII strings.
		$slug = strtolower( preg_replace( '/[^a-z0-9]+/i', '-', (string) $label ) );
		$slug = trim( $slug, '-' );
	}
	return '' === $slug ? 'cat' : $slug;
};

// --- Resolve and sanitize attributes -----------------------------------
$rawCategories = ( isset( $attributes['categories'] ) && is_array( $attributes['categories'] ) ) ? $attributes['categories'] : [];
$categories    = [];
$seenSlugs     = [];
foreach ( $rawCategories as $rawCat ) {
	$label = trim( (string) $rawCat );
	if ( '' === $label ) {
		continue;
	}
	$slug = $slugify( $label );
	// De-dupe slugs to avoid two filter buttons targeting the same value.
	if ( isset( $seenSlugs[ $slug ] ) ) {
		continue;
	}
	$seenSlugs[ $slug ] = true;
	$categories[]       = [
		'label' => $label,
		'slug'  => $slug,
	];
}

$showAllButton = ! isset( $attributes['showAllButton'] ) ? true : ! empty( $attributes['showAllButton'] );
$allLabel      = isset( $attributes['allLabel'] ) ? trim( (string) $attributes['allLabel'] ) : 'All';
if ( '' === $allLabel ) {
	$allLabel = __( 'All', 'b-blocks' );
}

$defaultFilter = isset( $attributes['defaultFilter'] ) ? sanitize_title( (string) $attributes['defaultFilter'] ) : 'all';
if ( 'all' !== $defaultFilter ) {
	// Make sure defaultFilter matches one of the resolved category slugs;
	// otherwise fall back to "all" so we don't initialize to a hidden state.
	$validSlugs = array_keys( $seenSlugs );
	if ( ! in_array( $defaultFilter, $validSlugs, true ) ) {
		$defaultFilter = 'all';
	}
}
// If the "All" button is disabled and defaultFilter is "all" but we have
// categories, fall back to the first category so something is visible.
if ( 'all' === $defaultFilter && ! $showAllButton && ! empty( $categories ) ) {
	$defaultFilter = $categories[0]['slug'];
}

$filterLayout = isset( $attributes['filterLayout'] ) ? sanitize_key( (string) $attributes['filterLayout'] ) : 'horizontal';
$filterLayout = in_array( $filterLayout, [ 'horizontal', 'vertical' ], true ) ? $filterLayout : 'horizontal';

$buttonAlign = isset( $attributes['buttonAlign'] ) ? sanitize_key( (string) $attributes['buttonAlign'] ) : 'left';
$buttonAlign = in_array( $buttonAlign, [ 'left', 'center', 'right' ], true ) ? $buttonAlign : 'left';

$gridMinColWidth   = isset( $attributes['gridMinColWidth'] ) ? max( 120, min( 600, (int) $attributes['gridMinColWidth'] ) ) : 280;
$gridGap           = isset( $attributes['gridGap'] ) ? max( 0, min( 80, (int) $attributes['gridGap'] ) ) : 24;
$animationDuration = isset( $attributes['animationDuration'] ) ? max( 0, min( 1200, (int) $attributes['animationDuration'] ) ) : 300;

$buttonBg    = $sanitizeColor( $attributes['buttonBg'] ?? '', '#f0f0f0' );
$buttonText  = $sanitizeColor( $attributes['buttonText'] ?? '', '#333333' );
$activeBg    = $sanitizeColor( $attributes['activeBg'] ?? '', '#0073aa' );
$activeText  = $sanitizeColor( $attributes['activeText'] ?? '', '#ffffff' );

$buttonBorderRadius   = isset( $attributes['buttonBorderRadius'] ) ? max( 0, min( 50, (int) $attributes['buttonBorderRadius'] ) ) : 4;
$buttonPaddingV       = isset( $attributes['buttonPaddingV'] ) ? max( 0, min( 64, (int) $attributes['buttonPaddingV'] ) ) : 8;
$buttonPaddingH       = isset( $attributes['buttonPaddingH'] ) ? max( 0, min( 96, (int) $attributes['buttonPaddingH'] ) ) : 16;
$buttonFontSize       = isset( $attributes['buttonFontSize'] ) ? max( 10, min( 24, (int) $attributes['buttonFontSize'] ) ) : 14;
$buttonGap            = isset( $attributes['buttonGap'] ) ? max( 0, min( 32, (int) $attributes['buttonGap'] ) ) : 8;
$buttonBarMarginBottom = isset( $attributes['buttonBarMarginBottom'] ) ? max( 0, min( 96, (int) $attributes['buttonBarMarginBottom'] ) ) : 24;

$buttonFontWeight = isset( $attributes['buttonFontWeight'] ) ? sanitize_key( (string) $attributes['buttonFontWeight'] ) : '500';
$buttonFontWeight = in_array( $buttonFontWeight, [ '400', '500', '600', '700' ], true ) ? $buttonFontWeight : '500';

// --- Wrapper CSS custom properties --------------------------------------
$wrapperStyleParts = [
	'--bb-cf-button-bg:' . $buttonBg,
	'--bb-cf-button-text:' . $buttonText,
	'--bb-cf-active-bg:' . $activeBg,
	'--bb-cf-active-text:' . $activeText,
	'--bb-cf-button-radius:' . $buttonBorderRadius . 'px',
	'--bb-cf-button-padding-v:' . $buttonPaddingV . 'px',
	'--bb-cf-button-padding-h:' . $buttonPaddingH . 'px',
	'--bb-cf-button-font-size:' . $buttonFontSize . 'px',
	'--bb-cf-button-font-weight:' . $buttonFontWeight,
	'--bb-cf-button-gap:' . $buttonGap . 'px',
	'--bb-cf-bar-margin-bottom:' . $buttonBarMarginBottom . 'px',
	'--bb-cf-grid-gap:' . $gridGap . 'px',
	'--bb-cf-grid-min-col:' . $gridMinColWidth . 'px',
	'--bb-cf-animation-duration:' . $animationDuration . 'ms',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-cf-wrapper'
	. ' bb-cf-layout--' . $filterLayout
	. ' bb-cf-align--' . $buttonAlign
);

$toolbarLabel = __( 'Filter content', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-bb-cf-init='0'
	data-bb-cf-default='<?php echo esc_attr( $defaultFilter ); ?>'
	data-bb-cf-duration='<?php echo esc_attr( (string) $animationDuration ); ?>'
>
	<?php if ( ! empty( $categories ) || $showAllButton ) : ?>
		<div
			class='bb-cf-bar'
			role='toolbar'
			aria-label='<?php echo esc_attr( $toolbarLabel ); ?>'
		>
			<?php if ( $showAllButton ) :
				$isAllActive = ( 'all' === $defaultFilter );
				?>
				<button
					type='button'
					class='bb-cf-btn<?php echo esc_attr( $isAllActive ? ' is-active' : '' ); ?>'
					data-bb-cf-filter='*'
					aria-pressed='<?php echo esc_attr( $isAllActive ? 'true' : 'false' ); ?>'
				>
					<?php echo esc_html( $allLabel ); ?>
				</button>
			<?php endif; ?>

			<?php foreach ( $categories as $cat ) :
				$isActive = ( $cat['slug'] === $defaultFilter );
				?>
				<button
					type='button'
					class='bb-cf-btn<?php echo esc_attr( $isActive ? ' is-active' : '' ); ?>'
					data-bb-cf-filter='<?php echo esc_attr( $cat['slug'] ); ?>'
					aria-pressed='<?php echo esc_attr( $isActive ? 'true' : 'false' ); ?>'
				>
					<?php echo esc_html( $cat['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class='bb-cf-grid'>
		<?php
		// $content holds the saved InnerBlocks markup (which is a series of
		// .bb-cf-item divs rendered by the child block's render.php). Output
		// it as-is; each child has already escaped/sanitized its own content.
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks are individually sanitized by their own render.php files
		?>
	</div>
</div>
