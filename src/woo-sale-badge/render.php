<?php
/**
 * Woo Sale Badge block server-side render.
 *
 * Renders a single hand-picked WooCommerce product's live price (regular +
 * sale) and a configurable discount badge — a plain "Sale!" label, a computed
 * percentage off, or the amount saved. All discount math is done here from
 * $product->get_regular_price() / get_sale_price(); there is no AJAX, no nonce,
 * and no custom query. Per-instance CSS custom properties are emitted inline,
 * scoped under a wp_unique_id() wrapper id, so multiple instances never collide.
 * All dynamic output is escaped.
 *
 * Color-contrast note (WCAG 2.1 AA): the chosen badgeBG / badgeTextColor pair
 * and salePriceColor must meet 4.5:1 against their background; enforcement is up
 * to the user's color choice.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Inline attribute sanitizers (block has no shared PHP class).
// ---------------------------------------------------------------------------
$bb_wsb_color = static function ( $color, $fallback ) {
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

$bb_wsb_clamp = static function ( $value, $min, $max, $fallback ) {
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

$bb_wsb_pick = static function ( $value, array $allowed, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allowed, true ) ? $value : $fallback;
};

$bb_wsb_size = static function ( $value, $min, $max, $fallback ) use ( $bb_wsb_clamp ) {
	$num = preg_replace( '/[^0-9]/', '', (string) $value );
	return $bb_wsb_clamp( '' === $num ? $fallback : $num, $min, $max, $fallback );
};

$priceFont = (array) ( $attributes['priceFontSize'] ?? [] );

$saleLabelText = isset( $attributes['saleLabelText'] ) ? wp_strip_all_tags( (string) $attributes['saleLabelText'] ) : '';
$saleLabelText = '' !== trim( $saleLabelText ) ? $saleLabelText : __( 'Sale!', 'b-blocks' );

$noProductMessage = isset( $attributes['noProductMessage'] ) ? wp_strip_all_tags( (string) $attributes['noProductMessage'] ) : '';
$noProductMessage = '' !== trim( $noProductMessage ) ? $noProductMessage : __( 'Please select a product.', 'b-blocks' );

$a = [
	'productId'              => $bb_wsb_clamp( $attributes['productId'] ?? 0, 0, PHP_INT_MAX, 0 ),
	'showPrice'              => ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'],
	'showBadge'              => ! isset( $attributes['showBadge'] ) || (bool) $attributes['showBadge'],
	'badgeMode'              => $bb_wsb_pick( $attributes['badgeMode'] ?? 'sale_label', [ 'sale_label', 'percentage', 'amount_saved' ], 'sale_label' ),
	'saleLabelText'          => $saleLabelText,
	'badgeShape'             => $bb_wsb_pick( $attributes['badgeShape'] ?? 'pill', [ 'pill', 'square', 'circle' ], 'pill' ),
	'badgePosition'          => $bb_wsb_pick( $attributes['badgePosition'] ?? 'inline', [ 'inline', 'above', 'below' ], 'inline' ),
	'badgeBG'                => $bb_wsb_color( $attributes['badgeBG'] ?? '', '#e44d3a' ),
	'badgeTextColor'         => $bb_wsb_color( $attributes['badgeTextColor'] ?? '', '#ffffff' ),
	'badgeFontSize'          => $bb_wsb_clamp( $attributes['badgeFontSize'] ?? 13, 10, 32, 13 ),
	'badgeFontWeight'        => $bb_wsb_clamp( $attributes['badgeFontWeight'] ?? 700, 400, 900, 700 ),
	'badgePaddingVertical'   => $bb_wsb_clamp( $attributes['badgePaddingVertical'] ?? 4, 0, 24, 4 ),
	'badgePaddingHorizontal' => $bb_wsb_clamp( $attributes['badgePaddingHorizontal'] ?? 10, 0, 32, 10 ),
	'salePriceColor'         => $bb_wsb_color( $attributes['salePriceColor'] ?? '', '#e44d3a' ),
	'regularPriceColor'      => $bb_wsb_color( $attributes['regularPriceColor'] ?? '', '#999999' ),
	'priceSizeDesktop'       => $bb_wsb_size( $priceFont['desktop'] ?? '20', 10, 64, 20 ),
	'priceSizeTablet'        => $bb_wsb_size( $priceFont['tablet'] ?? '18', 10, 64, 18 ),
	'priceSizeMobile'        => $bb_wsb_size( $priceFont['mobile'] ?? '16', 10, 64, 16 ),
	'priceFontWeight'        => $bb_wsb_clamp( $attributes['priceFontWeight'] ?? 700, 400, 900, 700 ),
	'priceGap'               => $bb_wsb_clamp( $attributes['priceGap'] ?? 8, 0, 32, 8 ),
	'badgePriceGap'          => $bb_wsb_clamp( $attributes['badgePriceGap'] ?? 10, 0, 32, 10 ),
	'alignment'              => $bb_wsb_pick( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], 'left' ),
	'maxWidth'               => $bb_wsb_clamp( $attributes['maxWidth'] ?? 0, 0, 1200, 0 ),
	'noProductMessage'       => $noProductMessage,
	'hideBadgeWhenNotOnSale' => ! isset( $attributes['hideBadgeWhenNotOnSale'] ) || (bool) $attributes['hideBadgeWhenNotOnSale'],
	'hidePriceWhenNotOnSale' => ! empty( $attributes['hidePriceWhenNotOnSale'] ),
];

$id = wp_unique_id( 'bb-wsb-' );

/**
 * Build per-instance CSS variables + wrapper classes once we know the alignment.
 */
$alignMap   = [ 'left' => 'flex-start', 'center' => 'center', 'right' => 'flex-end' ];
$blockAlign = $alignMap[ $a['alignment'] ] ?? 'flex-start';

$css  = "#$id.bb-wsb{";
$css .= '--bb-wsb-align:' . $blockAlign . ';';
$css .= '--bb-wsb-max-width:' . ( $a['maxWidth'] > 0 ? $a['maxWidth'] . 'px' : 'none' ) . ';';
$css .= '--bb-wsb-badge-bg:' . $a['badgeBG'] . ';';
$css .= '--bb-wsb-badge-text:' . $a['badgeTextColor'] . ';';
$css .= '--bb-wsb-badge-size:' . $a['badgeFontSize'] . 'px;';
$css .= '--bb-wsb-badge-weight:' . $a['badgeFontWeight'] . ';';
$css .= '--bb-wsb-badge-pad-v:' . $a['badgePaddingVertical'] . 'px;';
$css .= '--bb-wsb-badge-pad-h:' . $a['badgePaddingHorizontal'] . 'px;';
$css .= '--bb-wsb-sale-color:' . $a['salePriceColor'] . ';';
$css .= '--bb-wsb-regular-color:' . $a['regularPriceColor'] . ';';
$css .= '--bb-wsb-price-size:' . $a['priceSizeMobile'] . 'px;';
$css .= '--bb-wsb-price-weight:' . $a['priceFontWeight'] . ';';
$css .= '--bb-wsb-price-gap:' . $a['priceGap'] . 'px;';
$css .= '--bb-wsb-badge-price-gap:' . $a['badgePriceGap'] . 'px;';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-wsb{--bb-wsb-price-size:" . $a['priceSizeTablet'] . 'px;}}';
$css .= "@media (min-width:1024px){#$id.bb-wsb{--bb-wsb-price-size:" . $a['priceSizeDesktop'] . 'px;}}';

$wrapperClasses  = 'bb-wsb';
$wrapperClasses .= ' bb-wsb--align-' . $a['alignment'];
$wrapperClasses .= ' bb-wsb--badge-' . $a['badgePosition'];

// ---------------------------------------------------------------------------
// WooCommerce missing — friendly notice instead of fataling.
// ---------------------------------------------------------------------------
if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wsb' ] ); ?>
	>
		<p class='bb-wsb-empty' role='alert'><?php echo esc_html__( 'WooCommerce is required to display the sale badge.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

$product = $a['productId'] > 0 ? wc_get_product( $a['productId'] ) : false;

// No valid / published product selected.
if ( ! $product || ! is_a( $product, 'WC_Product' ) || 'publish' !== $product->get_status() ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-wsb' ] ); ?>
	>
		<p class='bb-wsb-empty' role='status'><?php echo esc_html( $a['noProductMessage'] ); ?></p>
	</div>
	<?php
	return;
}

$isOnSale  = $product->is_on_sale();
$priceHtml = $product->get_price_html();

// ---------------------------------------------------------------------------
// Compute the badge text + accessible label.
// Percentage / amount need numeric regular & sale prices; for variable products
// (where get_sale_price() can be empty) we fall back to the sale label so we
// never show a misleading or divide-by-zero figure.
// ---------------------------------------------------------------------------
$regularPrice = (float) $product->get_regular_price();
$salePrice    = (float) $product->get_sale_price();

$badgeText  = '';
$badgeAria  = '';
$renderBadge = $a['showBadge'];

if ( $renderBadge && ! $isOnSale && $a['hideBadgeWhenNotOnSale'] ) {
	$renderBadge = false;
}

if ( $renderBadge ) {
	$haveNumbers = $isOnSale && $regularPrice > 0 && $salePrice > 0 && $salePrice < $regularPrice;

	if ( 'percentage' === $a['badgeMode'] && $haveNumbers ) {
		$percent   = (int) round( ( ( $regularPrice - $salePrice ) / $regularPrice ) * 100 );
		$badgeText = '-' . $percent . '%';
		$badgeAria = sprintf(
			/* translators: %d: discount percentage. */
			__( 'On sale – %d%% off', 'b-blocks' ),
			$percent
		);
	} elseif ( 'amount_saved' === $a['badgeMode'] && $haveNumbers ) {
		$savedAmount = wp_strip_all_tags( wc_price( $regularPrice - $salePrice ) );
		$badgeText   = sprintf(
			/* translators: %s: formatted saved amount, e.g. $15.00. */
			__( 'Save %s', 'b-blocks' ),
			$savedAmount
		);
		$badgeAria = sprintf(
			/* translators: %s: formatted saved amount, e.g. $15.00. */
			__( 'On sale – save %s', 'b-blocks' ),
			$savedAmount
		);
	} else {
		// sale_label mode, OR a numeric mode on a product without usable numbers.
		$badgeText = $a['saleLabelText'];
		$badgeAria = __( 'On sale', 'b-blocks' );
	}
}

// Decide whether the price row should appear at all.
$renderPrice = $a['showPrice'];
if ( $renderPrice && ! $isOnSale && $a['hidePriceWhenNotOnSale'] ) {
	$renderPrice = false;
}

// If there is genuinely nothing to show, still emit an empty (but valid) wrapper.
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wsb-instance='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-wsb-inner'>
		<?php if ( $renderBadge && '' !== $badgeText ) : ?>
			<span class='bb-wsb-badge bb-wsb-badge--<?php echo esc_attr( $a['badgeShape'] ); ?>' role='img' aria-label='<?php echo esc_attr( $badgeAria ); ?>'>
				<?php echo esc_html( $badgeText ); ?>
			</span>
		<?php endif; ?>

		<?php if ( $renderPrice ) : ?>
			<span class='bb-wsb-price'>
				<?php echo wp_kses_post( $priceHtml ); ?>
			</span>
		<?php endif; ?>
	</div>
</div>
