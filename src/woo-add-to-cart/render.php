<?php
/**
 * Woo Add to Cart block server-side render.
 *
 * Renders a standalone WooCommerce Add to Cart button (plus optional quantity
 * stepper) for a single chosen product. Simple, purchasable, in-stock products
 * add to the cart through the hardened `bb_atc_add_to_cart` AJAX endpoint;
 * other product types fall back to a product-page link. Per-instance CSS
 * custom properties are emitted inline, scoped under a `wp_unique_id()` wrapper
 * id, so multiple buttons on one page never collide. All dynamic output is
 * escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooAddToCart;

if ( ! class_exists( WooAddToCart::class ) ) {
	return;
}

$planClass = class_exists( '\BBlocks\Inc\Utils' ) && \BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// Resolve & sanitize attributes.
$productId      = absint( $attributes['productId'] ?? 0 );
$buttonLabel    = isset( $attributes['buttonLabel'] ) ? wp_strip_all_tags( (string) $attributes['buttonLabel'] ) : '';
$buttonLabel    = '' !== trim( $buttonLabel ) ? $buttonLabel : __( 'Add to Cart', 'b-blocks' );
$addedLabel     = isset( $attributes['addedLabel'] ) ? wp_strip_all_tags( (string) $attributes['addedLabel'] ) : '';
$addedLabel     = '' !== trim( $addedLabel ) ? $addedLabel : __( 'Added!', 'b-blocks' );
$showQuantity   = ! empty( $attributes['showQuantity'] );
$quantityDef    = WooAddToCart::clampInt( $attributes['quantityDefault'] ?? 1, 1, 99, 1 );
$redirectToCart = ! empty( $attributes['redirectToCart'] );
$alignment      = in_array( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], true ) ? $attributes['alignment'] : 'left';
$isFullWidth    = ! empty( $attributes['isFullWidth'] );

$fontSize   = (array) ( $attributes['fontSize'] ?? [] );
$padding    = (array) ( $attributes['padding'] ?? [] );
$fontWeight = WooAddToCart::clampInt( $attributes['fontWeight'] ?? 600, 100, 900, 600 );

$btnColor           = WooAddToCart::sanitizeColor( $attributes['btnColor'] ?? '', '#ffffff' );
$btnBG              = WooAddToCart::sanitizeColor( $attributes['btnBG'] ?? '', '#146EF5' );
$btnHovColor        = WooAddToCart::sanitizeColor( $attributes['btnHovColor'] ?? '', '#ffffff' );
$btnHovBG           = WooAddToCart::sanitizeColor( $attributes['btnHovBG'] ?? '', '#070127' );
$borderColor        = WooAddToCart::sanitizeColor( $attributes['borderColor'] ?? '', '#146EF5' );
$qtyBtnColor        = WooAddToCart::sanitizeColor( $attributes['qtyBtnColor'] ?? '', '#333333' );
$qtyBtnBG           = WooAddToCart::sanitizeColor( $attributes['qtyBtnBG'] ?? '', '#f0f0f0' );
$qtyInputBorder     = WooAddToCart::sanitizeColor( $attributes['qtyInputBorderColor'] ?? '', '#dddddd' );

$fsDesktop      = WooAddToCart::sanitizePx( $fontSize['desktop'] ?? '16px', 10, 40, '16px' );
$fsTablet       = WooAddToCart::sanitizePx( $fontSize['tablet'] ?? '15px', 10, 40, '15px' );
$fsMobile       = WooAddToCart::sanitizePx( $fontSize['mobile'] ?? '14px', 10, 40, '14px' );
$padVertical    = WooAddToCart::sanitizePx( $padding['vertical'] ?? '12px', 0, 60, '12px' );
$padHorizontal  = WooAddToCart::sanitizePx( $padding['horizontal'] ?? '24px', 0, 60, '24px' );
$borderRadius   = WooAddToCart::sanitizePx( $attributes['borderRadius'] ?? '6px', 0, 50, '6px' );
$borderWidth    = WooAddToCart::sanitizePx( $attributes['borderWidth'] ?? '0px', 0, 8, '0px' );
$qtyBorderRadius = WooAddToCart::sanitizePx( $attributes['qtyBorderRadius'] ?? '4px', 0, 50, '4px' );

$prefix = 'bBlocksWooAddToCart';
$id     = wp_unique_id( "$prefix-" );

// WooCommerce missing — show a friendly notice instead of fataling.
if ( ! function_exists( 'wc_get_product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-atc" ] ); ?>
	>
		<p class='bb-atc-notice'><?php echo esc_html__( 'WooCommerce is required to display the Add to Cart button.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

$product = $productId > 0 ? wc_get_product( $productId ) : null;

// No product configured / invalid — show editor-only notice on the frontend too.
if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-atc" ] ); ?>
	>
		<p class='bb-atc-notice'><?php echo esc_html__( 'Select a WooCommerce product for this Add to Cart button.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

$permalink = get_permalink( $product->get_id() );
$isSimple  = $product->is_type( 'simple' );
$canAjax   = $isSimple && $product->is_purchasable() && $product->is_in_stock();
$cartUrl   = function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '';

// For non-simple products WooCommerce supplies its own link label.
$linkLabel = $buttonLabel;
if ( ! $isSimple ) {
	$wcLabel = $product->add_to_cart_text();
	if ( is_string( $wcLabel ) && '' !== trim( $wcLabel ) ) {
		$linkLabel = wp_strip_all_tags( $wcLabel );
	}
}

// Per-instance CSS variables.
$borderRule = ( (int) preg_replace( '/[^0-9]/', '', $borderWidth ) > 0 )
	? ( $borderWidth . ' solid ' . $borderColor )
	: 'none';

$css  = "#$id.bb-atc{";
$css .= '--bb-atc-color:' . $btnColor . ';';
$css .= '--bb-atc-bg:' . $btnBG . ';';
$css .= '--bb-atc-hov-color:' . $btnHovColor . ';';
$css .= '--bb-atc-hov-bg:' . $btnHovBG . ';';
$css .= '--bb-atc-fs:' . $fsMobile . ';';
$css .= '--bb-atc-fw:' . $fontWeight . ';';
$css .= '--bb-atc-pad-v:' . $padVertical . ';';
$css .= '--bb-atc-pad-h:' . $padHorizontal . ';';
$css .= '--bb-atc-radius:' . $borderRadius . ';';
$css .= '--bb-atc-border:' . $borderRule . ';';
$css .= '--bb-atc-qty-color:' . $qtyBtnColor . ';';
$css .= '--bb-atc-qty-bg:' . $qtyBtnBG . ';';
$css .= '--bb-atc-qty-input-border:' . $qtyInputBorder . ';';
$css .= '--bb-atc-qty-radius:' . $qtyBorderRadius . ';';
$css .= '}';
$css .= "@media (min-width:768px){#$id.bb-atc{--bb-atc-fs:" . $fsTablet . ';}}';
$css .= "@media (min-width:1024px){#$id.bb-atc{--bb-atc-fs:" . $fsDesktop . ';}}';

$wrapperClasses = trim(
	$planClass . ' bb-atc'
	. ' bb-atc--align-' . $alignment
	. ( $isFullWidth ? ' bb-atc--full' : '' )
	. ( $showQuantity && $canAjax ? ' bb-atc--has-qty' : '' )
);

$qtyId   = $id . '-qty';
$ariaAdd = sprintf(
	/* translators: %s: product name. */
	__( 'Add %s to cart', 'b-blocks' ),
	$product->get_name()
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-product-id='<?php echo esc_attr( (string) $product->get_id() ); ?>'
	data-ajax-url='<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>'
	data-nonce='<?php echo esc_attr( wp_create_nonce( 'bb_atc_add_to_cart' ) ); ?>'
	data-redirect='<?php echo esc_attr( $redirectToCart ? '1' : '0' ); ?>'
	data-cart-url='<?php echo esc_url( $cartUrl ); ?>'
	data-added-label='<?php echo esc_attr( $addedLabel ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-atc-inner'>
		<?php if ( $showQuantity && $canAjax ) : ?>
			<div class='bb-atc-qty'>
				<label class='screen-reader-text' for='<?php echo esc_attr( $qtyId ); ?>'>
					<?php echo esc_html__( 'Quantity', 'b-blocks' ); ?>
				</label>
				<button type='button' class='bb-atc-qty-btn bb-atc-qty-minus' aria-label='<?php echo esc_attr__( 'Decrease quantity', 'b-blocks' ); ?>'>&minus;</button>
				<input
					type='number'
					class='bb-atc-qty-input'
					id='<?php echo esc_attr( $qtyId ); ?>'
					value='<?php echo esc_attr( (string) $quantityDef ); ?>'
					min='1'
					max='99'
					step='1'
					inputmode='numeric'
				/>
				<button type='button' class='bb-atc-qty-btn bb-atc-qty-plus' aria-label='<?php echo esc_attr__( 'Increase quantity', 'b-blocks' ); ?>'>&plus;</button>
			</div>
		<?php endif; ?>

		<?php if ( $canAjax ) : ?>
			<button
				type='button'
				class='bb-atc-btn'
				aria-label='<?php echo esc_attr( $ariaAdd ); ?>'
			>
				<span class='bb-atc-btn-label'><?php echo esc_html( $buttonLabel ); ?></span>
			</button>
		<?php else : ?>
			<a
				class='bb-atc-btn bb-atc-btn--link'
				href='<?php echo esc_url( $permalink ); ?>'
				aria-label='<?php echo esc_attr( $ariaAdd ); ?>'
			>
				<span class='bb-atc-btn-label'><?php echo esc_html( $linkLabel ); ?></span>
			</a>
		<?php endif; ?>
	</div>

	<span class='bb-atc-status screen-reader-text' aria-live='polite' aria-atomic='true'></span>
</div>
