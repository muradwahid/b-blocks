<?php
/**
 * Search Bar block server-side render.
 *
 * Outputs a standard HTML <form action="<home_url>" method="get"> shell with an
 * <input name="s"> so a no-JS ?s= submit always works (native WordPress search).
 * Block configuration is emitted into data-* attributes on the wrapper; view.js
 * reads them and attaches a debounced listener that queries the public
 * /wp-json/wp/v2/search REST endpoint for live suggestions. No custom AJAX
 * handler, no database access.
 *
 * SECURITY: every color is pattern-validated (hex / rgb / rgba / hsl / hsla /
 * named plus the hardened var() comma-fallback allowlist
 * `(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?`); every integer is clamped to its safe range;
 * the form action and REST URL are esc_url()'d; placeholders and labels are esc_attr()'d; the
 * post-type list is filtered against an allowlist of registered, searchable
 * public post types. All render.php helpers are inlined as static closures to
 * avoid the "Cannot redeclare function" fatal when Gutenberg includes this file
 * more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksSearchBar';
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

$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$value = (int) $value;
	if ( $value < $min ) {
		return $min;
	}
	if ( $value > $max ) {
		return $max;
	}
	return $value;
};

// A CSS length value like "10px", "1.5rem", "100%", "20vw". Falls back when unsafe.
$sanitizeLength = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( preg_match( '/^-?[0-9]+(\.[0-9]+)?(px|em|rem|%|vw|vh|ch)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Resolve attributes ------------------------------------------------

$placeholder  = isset( $attributes['placeholder'] ) ? (string) $attributes['placeholder'] : __( 'Search…', 'b-blocks' );
$buttonLabel  = isset( $attributes['buttonLabel'] ) ? (string) $attributes['buttonLabel'] : __( 'Search', 'b-blocks' );
$buttonLabel  = '' !== trim( $buttonLabel ) ? $buttonLabel : __( 'Search', 'b-blocks' );

$buttonStyle  = isset( $attributes['buttonStyle'] ) ? (string) $attributes['buttonStyle'] : 'text';
if ( ! in_array( $buttonStyle, [ 'text', 'icon', 'both' ], true ) ) {
	$buttonStyle = 'text';
}

$alignment = isset( $attributes['alignment'] ) ? (string) $attributes['alignment'] : 'left';
if ( ! in_array( $alignment, [ 'left', 'center', 'right' ], true ) ) {
	$alignment = 'left';
}

$liveSearch    = ! empty( $attributes['liveSearch'] );
$showPostType  = ! empty( $attributes['showPostType'] );
$maxSuggestions = $clampInt( $attributes['maxSuggestions'] ?? 5, 1, 10, 5 );

// Restrict to registered, public, searchable post types; MVP allows post & page.
$requestedTypes = isset( $attributes['searchPostTypes'] ) && is_array( $attributes['searchPostTypes'] )
	? $attributes['searchPostTypes']
	: [ 'post', 'page' ];
$allowedTypes = [];
foreach ( $requestedTypes as $type ) {
	$type = sanitize_key( (string) $type );
	if ( in_array( $type, [ 'post', 'page' ], true ) && post_type_exists( $type ) ) {
		$allowedTypes[] = $type;
	}
}
if ( empty( $allowedTypes ) ) {
	$allowedTypes = [ 'post' ];
}
$allowedTypes = array_values( array_unique( $allowedTypes ) );

$width    = $sanitizeLength( $attributes['width'] ?? '100%', '100%' );
$fontSize = $sanitizeLength( $attributes['fontSize'] ?? '16px', '16px' );

$inputBg      = $sanitizeColor( $attributes['inputBgColor'] ?? '', '#ffffff' );
$inputText    = $sanitizeColor( $attributes['inputTextColor'] ?? '', '#333333' );
$borderColor  = $sanitizeColor( $attributes['borderColor'] ?? '', '#cccccc' );
$borderWidth  = $clampInt( $attributes['borderWidth'] ?? 1, 0, 6, 1 );
$borderRadius = $clampInt( $attributes['borderRadius'] ?? 4, 0, 50, 4 );

$buttonBg           = $sanitizeColor( $attributes['buttonBgColor'] ?? '', '#0073aa' );
$buttonText         = $sanitizeColor( $attributes['buttonTextColor'] ?? '', '#ffffff' );
$buttonBorderRadius = $clampInt( $attributes['buttonBorderRadius'] ?? 4, 0, 50, 4 );

$dropdownBg      = $sanitizeColor( $attributes['dropdownBgColor'] ?? '', '#ffffff' );
$dropdownText    = $sanitizeColor( $attributes['dropdownTextColor'] ?? '', '#333333' );
$dropdownHoverBg = $sanitizeColor( $attributes['dropdownHoverBgColor'] ?? '', '#f0f0f0' );

$noResultsText = isset( $attributes['noResultsText'] ) ? (string) $attributes['noResultsText'] : __( 'No results found.', 'b-blocks' );
$noResultsText = '' !== trim( $noResultsText ) ? $noResultsText : __( 'No results found.', 'b-blocks' );

// Padding object.
$padDefaults = [
	'top'    => '10px',
	'right'  => '14px',
	'bottom' => '10px',
	'left'   => '14px',
];
$padding = isset( $attributes['inputPadding'] ) && is_array( $attributes['inputPadding'] ) ? $attributes['inputPadding'] : [];
$padTop    = $sanitizeLength( $padding['top'] ?? $padDefaults['top'], $padDefaults['top'] );
$padRight  = $sanitizeLength( $padding['right'] ?? $padDefaults['right'], $padDefaults['right'] );
$padBottom = $sanitizeLength( $padding['bottom'] ?? $padDefaults['bottom'], $padDefaults['bottom'] );
$padLeft   = $sanitizeLength( $padding['left'] ?? $padDefaults['left'], $padDefaults['left'] );

// --- Build per-instance CSS variables ---------------------------------

$css  = "#$id.bb-search{";
$css .= '--bb-sb-width:' . $width . ';';
$css .= '--bb-sb-font:' . $fontSize . ';';
$css .= '--bb-sb-input-bg:' . $inputBg . ';';
$css .= '--bb-sb-input-text:' . $inputText . ';';
$css .= '--bb-sb-border-color:' . $borderColor . ';';
$css .= '--bb-sb-border-width:' . $borderWidth . 'px;';
$css .= '--bb-sb-radius:' . $borderRadius . 'px;';
$css .= '--bb-sb-btn-bg:' . $buttonBg . ';';
$css .= '--bb-sb-btn-text:' . $buttonText . ';';
$css .= '--bb-sb-btn-radius:' . $buttonBorderRadius . 'px;';
$css .= '--bb-sb-pad-top:' . $padTop . ';';
$css .= '--bb-sb-pad-right:' . $padRight . ';';
$css .= '--bb-sb-pad-bottom:' . $padBottom . ';';
$css .= '--bb-sb-pad-left:' . $padLeft . ';';
$css .= '--bb-sb-dd-bg:' . $dropdownBg . ';';
$css .= '--bb-sb-dd-text:' . $dropdownText . ';';
$css .= '--bb-sb-dd-hover:' . $dropdownHoverBg . ';';
$css .= '}';

// --- Accessibility / DOM ids ------------------------------------------

$inputId    = 'bb-search-input-' . $id;
$labelId    = 'bb-search-label-' . $id;
$listboxId  = 'bb-search-listbox-' . $id;
$statusId   = 'bb-search-status-' . $id;

$actionUrl = home_url( '/' );

// REST root for the public search endpoint; view.js appends the query string.
$restUrl = rest_url( 'wp/v2/search' );

$wrapperClasses = trim(
	$planClass
	. ' bb-search'
	. ' bb-search--btn-' . $buttonStyle
	. ' bb-search--align-' . $alignment
);

$showButtonLabel = in_array( $buttonStyle, [ 'text', 'both' ], true );
$showButtonIcon  = in_array( $buttonStyle, [ 'icon', 'both' ], true );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-rest-url='<?php echo esc_url( $restUrl ); ?>'
	data-live-search='<?php echo esc_attr( $liveSearch ? '1' : '0' ); ?>'
	data-post-types='<?php echo esc_attr( implode( ',', $allowedTypes ) ); ?>'
	data-max-suggestions='<?php echo esc_attr( (string) $maxSuggestions ); ?>'
	data-show-post-type='<?php echo esc_attr( $showPostType ? '1' : '0' ); ?>'
	data-no-results='<?php echo esc_attr( $noResultsText ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<form
		role='search'
		method='get'
		class='bb-search-form'
		action='<?php echo esc_url( $actionUrl ); ?>'
	>
		<label id='<?php echo esc_attr( $labelId ); ?>' for='<?php echo esc_attr( $inputId ); ?>' class='bb-search-label screen-reader-text'>
			<?php echo esc_html( $placeholder ); ?>
		</label>

		<div class='bb-search-field'>
			<input
				type='search'
				name='s'
				id='<?php echo esc_attr( $inputId ); ?>'
				class='bb-search-input'
				placeholder='<?php echo esc_attr( $placeholder ); ?>'
				value='<?php echo esc_attr( get_search_query() ); ?>'
				autocomplete='off'
				<?php if ( $liveSearch ) : ?>
				role='combobox'
				aria-expanded='false'
				aria-autocomplete='list'
				aria-haspopup='listbox'
				aria-controls='<?php echo esc_attr( $listboxId ); ?>'
				<?php endif; ?>
			/>

			<button
				type='submit'
				class='bb-search-submit'
				<?php if ( ! $showButtonLabel ) : ?>
				aria-label='<?php echo esc_attr( $buttonLabel ); ?>'
				<?php endif; ?>
			>
				<?php if ( $showButtonIcon ) : ?>
					<i class='fa-solid fa-magnifying-glass bb-search-icon' aria-hidden='true'></i>
				<?php endif; ?>
				<?php if ( $showButtonLabel ) : ?>
					<span class='bb-search-submit-label'><?php echo esc_html( $buttonLabel ); ?></span>
				<?php endif; ?>
			</button>
		</div>

		<?php if ( $liveSearch ) : ?>
			<ul
				id='<?php echo esc_attr( $listboxId ); ?>'
				class='bb-search-listbox'
				role='listbox'
				aria-label='<?php echo esc_attr__( 'Search suggestions', 'b-blocks' ); ?>'
				hidden
			></ul>
			<div id='<?php echo esc_attr( $statusId ); ?>' class='bb-search-status screen-reader-text' aria-live='polite' aria-atomic='true'></div>
		<?php endif; ?>
	</form>
</div>
