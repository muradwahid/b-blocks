<?php
/**
 * Typing Headline Block server-side render.
 *
 * Emits a semantic heading with a static prefix, an animated span (the
 * target Typed.js writes into on the frontend), and a static suffix. The
 * heading itself carries an aria-label that concatenates the prefix, ALL
 * rotating words, and the suffix so screen readers receive the complete
 * meaning in a single pass — the animated span is aria-hidden so the
 * live-updating innerHTML from Typed.js is never announced.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as icon-list, contact-card,
 * callout, divider).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksTypingHeadline';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Allow-listed heading tags ----------------------------------------
$allowedTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ];

// --- Allow-listed alignment values ------------------------------------
$allowedAligns = [ 'left', 'center', 'right' ];

// --- Allow-listed font weights ----------------------------------------
$allowedWeights = [ '300', '400', '500', '600', '700', '800', '900' ];

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), named).
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
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Sanitize a CSS length token ("42px", "1.2rem", "0", etc.) --------
$sanitizeLength = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(?:\.\d+)?(px|em|rem|%)?$/', $value ) ) {
		return $value;
	}
	if ( is_numeric( $value ) ) {
		return ( (float) $value ) . 'px';
	}
	return $fallback;
};

// --- Sanitize a line-height (unitless decimal, or length token). -------
$sanitizeLineHeight = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^\d+(?:\.\d+)?$/', $value ) ) {
		return $value;
	}
	if ( preg_match( '/^\d+(?:\.\d+)?(px|em|rem|%)$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Clamp an integer within [min, max] -------------------------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$i = (int) $value;
	if ( $i < $min ) {
		return $min;
	}
	if ( $i > $max ) {
		return $max;
	}
	return $i;
};

// --- Resolve and sanitize attributes ----------------------------------
$prefixRaw    = isset( $attributes['prefix'] ) ? (string) $attributes['prefix'] : '';
$suffixRaw    = isset( $attributes['suffix'] ) ? (string) $attributes['suffix'] : '';

$headingTag   = isset( $attributes['headingTag'] ) ? strtolower( (string) $attributes['headingTag'] ) : 'h2';
$headingTag   = in_array( $headingTag, $allowedTags, true ) ? $headingTag : 'h2';

$textAlign    = isset( $attributes['textAlign'] ) ? strtolower( (string) $attributes['textAlign'] ) : 'center';
$textAlign    = in_array( $textAlign, $allowedAligns, true ) ? $textAlign : 'center';

$typeSpeed    = $clampInt( $attributes['typeSpeed']  ?? 80,   20, 300,  80 );
$backSpeed    = $clampInt( $attributes['backSpeed']  ?? 40,   10, 200,  40 );
$backDelay    = $clampInt( $attributes['backDelay']  ?? 1500, 200, 5000, 1500 );
$startDelay   = $clampInt( $attributes['startDelay'] ?? 300,  0,   3000, 300 );

$loop          = isset( $attributes['loop'] ) ? (bool) $attributes['loop'] : true;
$showCursor    = isset( $attributes['showCursor'] ) ? (bool) $attributes['showCursor'] : true;
$smartBackspace = isset( $attributes['smartBackspace'] ) ? (bool) $attributes['smartBackspace'] : true;

$cursorCharRaw = isset( $attributes['cursorChar'] ) ? (string) $attributes['cursorChar'] : '|';
// Cursor must be a single visible character — strip everything else,
// then take the first multi-byte char.
$cursorChar = function_exists( 'mb_substr' )
	? mb_substr( $cursorCharRaw, 0, 1 )
	: substr( $cursorCharRaw, 0, 1 );
if ( '' === trim( $cursorChar ) ) {
	$cursorChar = '|';
}

$fontSizeAttr = isset( $attributes['fontSize'] ) && is_array( $attributes['fontSize'] ) ? $attributes['fontSize'] : [];
$fontSize     = [
	'desktop' => $sanitizeLength( $fontSizeAttr['desktop'] ?? '', '42px' ),
	'tablet'  => $sanitizeLength( $fontSizeAttr['tablet']  ?? '', '32px' ),
	'mobile'  => $sanitizeLength( $fontSizeAttr['mobile']  ?? '', '24px' ),
];

$fontWeight = isset( $attributes['fontWeight'] ) ? (string) $attributes['fontWeight'] : '700';
$fontWeight = in_array( $fontWeight, $allowedWeights, true ) ? $fontWeight : '700';

$lineHeight = $sanitizeLineHeight( $attributes['lineHeight'] ?? '1.2', '1.2' );

$prefixColor    = $sanitizeColor( $attributes['prefixColor']    ?? '', '' );
$animatedColor  = $sanitizeColor( $attributes['animatedColor']  ?? '', '#146EF5' );
$cursorColor    = $sanitizeColor( $attributes['cursorColor']    ?? '', $animatedColor );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '' );

$paddingAttr = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padding = [
	'top'    => $sanitizeLength( $paddingAttr['top']    ?? '', '20px' ),
	'bottom' => $sanitizeLength( $paddingAttr['bottom'] ?? '', '20px' ),
	'left'   => $sanitizeLength( $paddingAttr['left']   ?? '', '0px' ),
	'right'  => $sanitizeLength( $paddingAttr['right']  ?? '', '0px' ),
];

// --- Build clean words list (drop empty rows, sanitize each) ----------
$rawWords  = ( isset( $attributes['words'] ) && is_array( $attributes['words'] ) ) ? $attributes['words'] : [];
$cleanWords = [];
foreach ( $rawWords as $row ) {
	$text = isset( $row['text'] ) ? trim( wp_strip_all_tags( (string) $row['text'] ) ) : '';
	if ( '' === $text ) {
		continue;
	}
	$cleanWords[] = [
		'text'  => $text,
		'color' => $sanitizeColor( $row['color'] ?? '', '' ),
	];
	if ( count( $cleanWords ) >= 20 ) {
		break;
	}
}

// Plain-text word list for the JS config + the heading aria-label.
$wordTexts  = array_map( static function ( $w ) { return $w['text']; }, $cleanWords );
// Per-word color overrides (empty string = fall back to --bb-th-animated-color CSS var).
$wordColors = array_map( static function ( $w ) { return $w['color']; }, $cleanWords );

// --- Compose the heading aria-label so screen readers get every word.
// Pattern: "<prefix> word1, word2, word3 <suffix>"
$ariaParts = [];
$prefixForAria = trim( $prefixRaw );
if ( '' !== $prefixForAria ) {
	$ariaParts[] = $prefixForAria;
}
if ( ! empty( $wordTexts ) ) {
	$ariaParts[] = implode( ', ', $wordTexts );
}
$suffixForAria = trim( $suffixRaw );
if ( '' !== $suffixForAria ) {
	$ariaParts[] = $suffixForAria;
}
$ariaLabel = implode( ' ', $ariaParts );

// --- Build the JSON config view.js will read off `data-bb-th-config`.
$jsConfig = [
	'strings'        => $wordTexts,
	'colors'         => $wordColors,
	'typeSpeed'      => (int) $typeSpeed,
	'backSpeed'      => (int) $backSpeed,
	'backDelay'      => (int) $backDelay,
	'startDelay'     => (int) $startDelay,
	'loop'           => (bool) $loop,
	'smartBackspace' => (bool) $smartBackspace,
	'showCursor'     => (bool) $showCursor,
	'cursorChar'     => $cursorChar,
];
$jsonConfig = wp_json_encode( $jsConfig, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE );
if ( false === $jsonConfig ) {
	$jsonConfig = '{}';
}

// --- Wrapper CSS variables (per-instance scoping) ---------------------
$wrapperStyleParts = [
	'--bb-th-prefix-color:' . ( '' === $prefixColor ? 'inherit' : $prefixColor ),
	'--bb-th-animated-color:' . $animatedColor,
	'--bb-th-cursor-color:' . $cursorColor,
	'--bb-th-bg:' . ( '' === $backgroundColor ? 'transparent' : $backgroundColor ),
	'--bb-th-font-size-desktop:' . $fontSize['desktop'],
	'--bb-th-font-size-tablet:' . $fontSize['tablet'],
	'--bb-th-font-size-mobile:' . $fontSize['mobile'],
	'--bb-th-font-weight:' . $fontWeight,
	'--bb-th-line-height:' . $lineHeight,
	'--bb-th-pad-top:' . $padding['top'],
	'--bb-th-pad-right:' . $padding['right'],
	'--bb-th-pad-bottom:' . $padding['bottom'],
	'--bb-th-pad-left:' . $padding['left'],
	'--bb-th-text-align:' . $textAlign,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-th-block'
	. ' bb-th-align--' . $textAlign
	. ( $showCursor ? ' has-cursor' : ' no-cursor' )
);

// If the editor saved an empty word list, show a placeholder note.
$hasWords = ! empty( $cleanWords );

// Heading tag — allowlist already enforced above; tag_escape() is the
// semantically-correct WP function for tag names (same pattern used by
// callout, contact-card, howto-schema, process-steps in this plugin).
$safeTag = tag_escape( $headingTag );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( ! $hasWords ) : ?>
		<p class='bb-th-empty'><?php esc_html_e( 'Add at least one rotating word in the sidebar to display this headline.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<<?php echo $safeTag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- allowlisted heading tag, escaped via tag_escape(). ?>
			class='bb-th'
			aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
		>
			<?php if ( '' !== $prefixRaw ) : ?>
				<span class='bb-th-prefix'><?php echo esc_html( $prefixRaw ); ?></span>
			<?php endif; ?>
			<span
				class='bb-th-animated'
				aria-hidden='true'
				data-bb-th-config='<?php echo esc_attr( $jsonConfig ); ?>'
			><?php // Server-side fallback first word so the heading is not visually empty before view.js runs.
				echo esc_html( $wordTexts[0] );
			?></span>
			<?php if ( '' !== $suffixRaw ) : ?>
				<span class='bb-th-suffix'><?php echo esc_html( $suffixRaw ); ?></span>
			<?php endif; ?>
		</<?php echo $safeTag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- allowlisted heading tag, escaped via tag_escape(). ?>>
	<?php endif; ?>
</div>
