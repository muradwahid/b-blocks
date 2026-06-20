<?php
/**
 * Marquee block server-side render.
 *
 * Renders a continuously auto-scrolling horizontal strip. The item set is
 * duplicated `duplicateCount` times inside a single `.bb-mq-track`; a CSS
 * `@keyframes bb-mq-scroll` translates the track to create a seamless loop.
 * The accessible scroll region carries `role="marquee"` with an `aria-label`
 * (or `aria-labelledby` when a static label is present) and `aria-live="off"`
 * so screen readers don't re-announce content as it moves. Per-instance CSS is
 * emitted inline, scoped under a `wp_unique_id()` wrapper id, so multiple
 * marquees on one page never collide. The infinite scroll is driven entirely
 * by CSS; `view.js` only computes a width-aware duration, honors
 * `prefers-reduced-motion`, and wires pause-on-hover/focus.
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

$prefix    = 'bBlocksMarquee';
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

// --- Sanitize a Font Awesome icon class list (letters, digits, spaces, hyphens). ---
$sanitizeIconClass = static function ( $value ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	if ( '' === $value ) {
		return '';
	}
	return preg_replace( '/[^a-zA-Z0-9 _-]/', '', $value );
};

// --- Resolve attributes. ---
$itemType  = $pickFrom( $attributes['itemType'] ?? 'mixed', [ 'logo', 'text', 'mixed' ], 'mixed' );
$direction = $pickFrom( $attributes['direction'] ?? 'left', [ 'left', 'right' ], 'left' );

$speed          = $clampInt( $attributes['speed'] ?? 40, 20, 200, 40 );
$gap            = $clampInt( $attributes['gap'] ?? 48, 0, 120, 48 );
$fadeWidth      = $clampInt( $attributes['fadeWidth'] ?? 80, 20, 200, 80 );
$duplicateCount = $clampInt( $attributes['duplicateCount'] ?? 2, 2, 4, 2 );

$pauseOnHover = isset( $attributes['pauseOnHover'] ) ? (bool) $attributes['pauseOnHover'] : true;
$fadeEdges    = isset( $attributes['fadeEdges'] ) ? (bool) $attributes['fadeEdges'] : true;

$stripPaddingTop    = $clampInt( $attributes['stripPaddingTop'] ?? 20, 0, 96, 20 );
$stripPaddingBottom = $clampInt( $attributes['stripPaddingBottom'] ?? 20, 0, 96, 20 );
$backgroundColor    = $sanitizeColor( $attributes['backgroundColor'] ?? '', 'transparent' );
$borderRadius       = $clampInt( $attributes['borderRadius'] ?? 0, 0, 48, 0 );

$imageHeight         = $clampInt( $attributes['imageHeight'] ?? 40, 16, 200, 40 );
$imageGrayscale      = isset( $attributes['imageGrayscale'] ) ? (bool) $attributes['imageGrayscale'] : true;
$imageGrayscaleHover = isset( $attributes['imageGrayscaleHover'] ) ? (bool) $attributes['imageGrayscaleHover'] : true;

$textFontSize   = $clampInt( $attributes['textFontSize'] ?? 16, 10, 48, 16 );
$textFontWeight = preg_replace( '/[^0-9]/', '', (string) ( $attributes['textFontWeight'] ?? '500' ) );
$textFontWeight = '' !== $textFontWeight ? $textFontWeight : '500';
$textColor      = $sanitizeColor( $attributes['textColor'] ?? '', 'inherit' );

$badgeBackground   = $sanitizeColor( $attributes['badgeBackground'] ?? '', 'transparent' );
$badgeBorderRadius = $clampInt( $attributes['badgeBorderRadius'] ?? 4, 0, 50, 4 );
$badgePaddingV     = $clampInt( $attributes['badgePaddingV'] ?? 6, 0, 32, 6 );
$badgePaddingH     = $clampInt( $attributes['badgePaddingH'] ?? 12, 0, 64, 12 );

$separatorIcon  = $sanitizeIconClass( $attributes['separatorIcon'] ?? '' );
$separatorColor = $sanitizeColor( $attributes['separatorColor'] ?? '', 'currentColor' );
$separatorSize  = $clampInt( $attributes['separatorSize'] ?? 8, 4, 24, 8 );

$labelText       = isset( $attributes['labelText'] ) ? trim( wp_strip_all_tags( (string) $attributes['labelText'] ) ) : '';
$labelFontSize   = $clampInt( $attributes['labelFontSize'] ?? 14, 10, 24, 14 );
$labelFontWeight = preg_replace( '/[^0-9]/', '', (string) ( $attributes['labelFontWeight'] ?? '600' ) );
$labelFontWeight = '' !== $labelFontWeight ? $labelFontWeight : '600';
$labelColor      = $sanitizeColor( $attributes['labelColor'] ?? '', 'inherit' );

$items = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : [];

// Keep only items that actually render (text with content, or logo with image).
$validItems = [];
foreach ( $items as $item ) {
	if ( ! is_array( $item ) ) {
		continue;
	}
	$type = isset( $item['type'] ) && 'text' === $item['type'] ? 'text' : 'logo';
	if ( 'text' === $type ) {
		if ( '' !== trim( wp_strip_all_tags( (string) ( $item['text'] ?? '' ) ) ) ) {
			$validItems[] = $item;
		}
	} elseif ( '' !== trim( (string) ( $item['imageUrl'] ?? '' ) ) ) {
		$validItems[] = $item;
	}
}

if ( empty( $validItems ) ) {
	return;
}

$hasLabel = '' !== $labelText;
$labelId  = $id . '-label';

// Static fallback duration for no-JS / pre-hydration: assume ~1200px per loop.
$fallbackDuration = max( 5, (int) round( 1200 / $speed ) );

// --- Build per-instance CSS variables. ---
$css  = "#$id.bb-mq{";
$css .= "--bb-mq-duration:{$fallbackDuration}s;";
$css .= "--bb-mq-gap:{$gap}px;";
$css .= "--bb-mq-fade-w:{$fadeWidth}px;";
$css .= "--bb-mq-pt:{$stripPaddingTop}px;";
$css .= "--bb-mq-pb:{$stripPaddingBottom}px;";
$css .= "--bb-mq-bg:$backgroundColor;";
$css .= "--bb-mq-radius:{$borderRadius}px;";
$css .= "--bb-mq-img-h:{$imageHeight}px;";
$css .= "--bb-mq-text-size:{$textFontSize}px;";
$css .= "--bb-mq-text-weight:$textFontWeight;";
$css .= "--bb-mq-text-color:$textColor;";
$css .= "--bb-mq-badge-bg:$badgeBackground;";
$css .= "--bb-mq-badge-radius:{$badgeBorderRadius}px;";
$css .= "--bb-mq-badge-pv:{$badgePaddingV}px;";
$css .= "--bb-mq-badge-ph:{$badgePaddingH}px;";
$css .= "--bb-mq-sep-color:$separatorColor;";
$css .= "--bb-mq-sep-size:{$separatorSize}px;";
$css .= "--bb-mq-label-size:{$labelFontSize}px;";
$css .= "--bb-mq-label-weight:$labelFontWeight;";
$css .= "--bb-mq-label-color:$labelColor;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-mq'
	. ' bb-mq--dir-' . $direction
	. ' bb-mq--type-' . $itemType
	. ( $fadeEdges ? ' bb-mq--fade' : '' )
	. ( $imageGrayscale ? ' bb-mq--gray' : '' )
	. ( $imageGrayscale && $imageGrayscaleHover ? ' bb-mq--gray-hover' : '' )
);

// Config consumed by view.js (read off the wrapper, never echoed as HTML).
$config = [
	'speed'        => $speed,
	'direction'    => $direction,
	'pauseOnHover' => $pauseOnHover,
];

$ariaLabel = $hasLabel ? $labelText : __( 'Scrolling content', 'b-blocks' );

// --- Renders one full pass of the item set. ---
$renderSet = static function ( $set, $itemType, $separatorIcon, $sanitizeColor ) {
	$count = count( $set );
	$out   = '';
	foreach ( $set as $index => $item ) {
		$type = isset( $item['type'] ) && 'text' === $item['type'] ? 'text' : 'logo';

		$linkUrl    = isset( $item['linkUrl'] ) ? esc_url( (string) $item['linkUrl'] ) : '';
		$linkNewTab = isset( $item['linkNewTab'] ) ? (bool) $item['linkNewTab'] : false;

		$inner = '';
		if ( 'text' === $type ) {
			$text  = trim( wp_strip_all_tags( (string) ( $item['text'] ?? '' ) ) );
			$inner = '<span class="bb-mq-badge">' . esc_html( $text ) . '</span>';
		} else {
			$imageUrl = (string) ( $item['imageUrl'] ?? '' );
			$imageId  = isset( $item['imageId'] ) ? absint( $item['imageId'] ) : 0;
			$imageAlt = isset( $item['imageAlt'] ) ? trim( wp_strip_all_tags( (string) $item['imageAlt'] ) ) : '';

			if ( '' === $imageAlt && $imageId > 0 ) {
				$metaAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
				if ( is_string( $metaAlt ) ) {
					$imageAlt = trim( wp_strip_all_tags( $metaAlt ) );
				}
			}

			$inner = '<img class="bb-mq-img" src="' . esc_url( $imageUrl ) . '" alt="' . esc_attr( $imageAlt ) . '" loading="lazy" decoding="async" />';
		}

		if ( '' !== $linkUrl ) {
			$attrs = ' class="bb-mq-link" href="' . esc_url( $linkUrl ) . '"';
			if ( $linkNewTab ) {
				$attrs .= ' target="_blank" rel="noopener noreferrer"';
			}
			$inner = '<a' . $attrs . '>' . $inner
				. ( $linkNewTab ? '<span class="screen-reader-text">' . esc_html__( '(opens in a new tab)', 'b-blocks' ) . '</span>' : '' )
				. '</a>';
		}

		$out .= '<div class="bb-mq-item">' . $inner;

		if ( '' !== $separatorIcon && $index < $count - 1 ) {
			$out .= '<i class="bb-mq-sep ' . esc_attr( $separatorIcon ) . '" aria-hidden="true"></i>';
		}

		$out .= '</div>';
	}
	return $out;
};

$singleSet = $renderSet( $validItems, $itemType, $separatorIcon, $sanitizeColor );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-mq-inner'>
		<?php if ( $hasLabel ) : ?>
			<span class='bb-mq-label' id='<?php echo esc_attr( $labelId ); ?>'><?php echo esc_html( $labelText ); ?></span>
		<?php endif; ?>

		<div
			class='bb-mq-viewport'
			role='marquee'
			<?php if ( $hasLabel ) : ?>
				aria-labelledby='<?php echo esc_attr( $labelId ); ?>'
			<?php else : ?>
				aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
			<?php endif; ?>
			aria-live='off'
		>
			<div
				class='bb-mq-track'
				data-bb-mq-config='<?php echo esc_attr( wp_json_encode( $config ) ); ?>'
			>
				<?php
				for ( $pass = 0; $pass < $duplicateCount; $pass++ ) {
					$ariaHidden = $pass > 0 ? ' aria-hidden="true"' : '';
					echo '<div class="bb-mq-set"' . $ariaHidden . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string.
					echo $singleSet; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built with per-field escaping in $renderSet.
					echo '</div>';
				}
				?>
			</div>
		</div>
	</div>
</div>
