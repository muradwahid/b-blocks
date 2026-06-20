<?php
/**
 * Woo Mini Cart block server-side render.
 *
 * Renders a self-contained WooCommerce mini cart: a trigger (cart icon, optional
 * count badge and total) that, in dropdown mode, opens a flyout listing the
 * current cart items with per-item remove links plus a subtotal and view-cart /
 * checkout actions. The inner markup (`.bb-wmc-inner`) is registered as a
 * per-instance fragment on `woocommerce_add_to_cart_fragments` (via
 * WooMiniCart::registerInstance) so WooCommerce's cart-fragments script and the
 * block's view.js can swap the cart state live after any add/remove.
 *
 * Structure: `.bb-wmc-inner` is the swappable fragment node placed directly in
 * the wrapper. A `<button>` (or `<a>` in link mode) overlays the trigger visuals
 * for interaction so no interactive content is nested inside the button and the
 * dropdown body stays a valid sibling. Per-instance CSS custom properties are
 * emitted under a `wp_unique_id()` wrapper id with a `bb-wmc-` prefix. All
 * dynamic output is escaped.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use BBlocks\Inc\Blocks\WooMiniCart;

if ( ! class_exists( WooMiniCart::class ) ) {
	return;
}

$planClass = class_exists( '\BBlocks\Inc\Utils' ) && \BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

$prefix = 'bBlocksWooMiniCart';
$id     = wp_unique_id( "$prefix-" );

// WooCommerce missing — show an accessible fallback notice instead of fataling.
if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'WC' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wmc" ] ); ?>
		role="alert"
	>
		<p class="bb-wmc-notice"><?php echo esc_html__( 'WooCommerce is required to display the mini cart.', 'b-blocks' ); ?></p>
	</div>
	<?php
	return;
}

// Resolve & sanitize attributes.
$triggerMode      = in_array( $attributes['triggerMode'] ?? 'dropdown', [ 'dropdown', 'link' ], true ) ? $attributes['triggerMode'] : 'dropdown';
$iconClass        = WooMiniCart::sanitizeIconClass( $attributes['iconClass'] ?? '', 'fa-solid fa-cart-shopping' );
$showCount        = ! empty( $attributes['showCount'] );
$showTotal        = ! empty( $attributes['showTotal'] );
$showEmptyCart    = ! empty( $attributes['showEmptyCart'] );
$emptyMessage     = isset( $attributes['emptyMessage'] ) ? wp_strip_all_tags( (string) $attributes['emptyMessage'] ) : '';
$emptyMessage     = '' !== trim( $emptyMessage ) ? $emptyMessage : __( 'Your cart is empty.', 'b-blocks' );
$showItemList     = ! empty( $attributes['showItemList'] );
$showItemPrice    = ! empty( $attributes['showItemPrice'] );
$showSubtotal     = ! empty( $attributes['showSubtotal'] );
$showViewCartBtn  = ! empty( $attributes['showViewCartBtn'] );
$viewCartLabel    = isset( $attributes['viewCartLabel'] ) ? wp_strip_all_tags( (string) $attributes['viewCartLabel'] ) : '';
$viewCartLabel    = '' !== trim( $viewCartLabel ) ? $viewCartLabel : __( 'View Cart', 'b-blocks' );
$showCheckoutBtn  = ! empty( $attributes['showCheckoutBtn'] );
$checkoutLabel    = isset( $attributes['checkoutLabel'] ) ? wp_strip_all_tags( (string) $attributes['checkoutLabel'] ) : '';
$checkoutLabel    = '' !== trim( $checkoutLabel ) ? $checkoutLabel : __( 'Checkout', 'b-blocks' );
$dropdownPosition = in_array( $attributes['dropdownPosition'] ?? 'right', [ 'left', 'right' ], true ) ? $attributes['dropdownPosition'] : 'right';
$alignment        = in_array( $attributes['alignment'] ?? 'left', [ 'left', 'center', 'right' ], true ) ? $attributes['alignment'] : 'left';

$iconSize        = WooMiniCart::clampInt( $attributes['iconSize'] ?? 22, 14, 48, 22 );
$badgeFontSize   = WooMiniCart::clampInt( $attributes['badgeFontSize'] ?? 11, 8, 16, 11 );
$totalFontSize   = WooMiniCart::clampInt( $attributes['totalFontSize'] ?? 14, 10, 24, 14 );
$dropdownWidth   = WooMiniCart::clampInt( $attributes['dropdownWidth'] ?? 320, 240, 480, 320 );
$dropdownRadius  = WooMiniCart::clampInt( $attributes['dropdownBorderRadius'] ?? 8, 0, 24, 8 );
$btnBorderRadius = WooMiniCart::clampInt( $attributes['btnBorderRadius'] ?? 6, 0, 50, 6 );
$btnFontSize     = WooMiniCart::clampInt( $attributes['btnFontSize'] ?? 14, 11, 20, 14 );
$btnFontWeight   = WooMiniCart::clampInt( $attributes['btnFontWeight'] ?? 600, 100, 900, 600 );

$dropdownShadowKey = in_array( $attributes['dropdownShadow'] ?? 'medium', [ 'none', 'small', 'medium', 'large' ], true ) ? $attributes['dropdownShadow'] : 'medium';
$dropdownShadow    = WooMiniCart::shadowValue( $dropdownShadowKey );

$iconColor          = WooMiniCart::sanitizeColor( $attributes['iconColor'] ?? '', 'inherit' );
$iconHoverColor     = WooMiniCart::sanitizeColor( $attributes['iconHoverColor'] ?? '', $iconColor );
$badgeBG            = WooMiniCart::sanitizeColor( $attributes['badgeBG'] ?? '', '#c0392b' );
$badgeTextColor     = WooMiniCart::sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' );
$totalColor         = WooMiniCart::sanitizeColor( $attributes['totalColor'] ?? '', 'inherit' );
$dropdownBG         = WooMiniCart::sanitizeColor( $attributes['dropdownBG'] ?? '', '#ffffff' );
$itemNameColor      = WooMiniCart::sanitizeColor( $attributes['itemNameColor'] ?? '', 'inherit' );
$itemPriceColor     = WooMiniCart::sanitizeColor( $attributes['itemPriceColor'] ?? '', 'inherit' );
$subtotalLabelColor = WooMiniCart::sanitizeColor( $attributes['subtotalLabelColor'] ?? '', 'inherit' );
$subtotalValueColor = WooMiniCart::sanitizeColor( $attributes['subtotalValueColor'] ?? '', 'inherit' );
$primaryBtnColor    = WooMiniCart::sanitizeColor( $attributes['primaryBtnColor'] ?? '', '#ffffff' );
$primaryBtnBG       = WooMiniCart::sanitizeColor( $attributes['primaryBtnBG'] ?? '', '#146EF5' );
$primaryBtnHovColor = WooMiniCart::sanitizeColor( $attributes['primaryBtnHovColor'] ?? '', '#ffffff' );
$primaryBtnHovBG    = WooMiniCart::sanitizeColor( $attributes['primaryBtnHovBG'] ?? '', '#070127' );
$secondaryBtnColor  = WooMiniCart::sanitizeColor( $attributes['secondaryBtnColor'] ?? '', '#333333' );
$secondaryBtnBG     = WooMiniCart::sanitizeColor( $attributes['secondaryBtnBG'] ?? '', '#f0f0f0' );
$secondaryBtnHovColor = WooMiniCart::sanitizeColor( $attributes['secondaryBtnHovColor'] ?? '', '#333333' );
$secondaryBtnHovBG    = WooMiniCart::sanitizeColor( $attributes['secondaryBtnHovBG'] ?? '', '#dddddd' );

// Per-instance fragment selector matching the inner element class.
$selector = '.' . $id;

// Configuration shared between the initial render and the fragment callback.
$config = [
	'selector'        => $selector,
	'triggerMode'     => $triggerMode,
	'iconClass'       => $iconClass,
	'showCount'       => $showCount,
	'showTotal'       => $showTotal,
	'emptyMessage'    => $emptyMessage,
	'showItemList'    => $showItemList,
	'showItemPrice'   => $showItemPrice,
	'showSubtotal'    => $showSubtotal,
	'showViewCartBtn' => $showViewCartBtn,
	'viewCartLabel'   => $viewCartLabel,
	'showCheckoutBtn' => $showCheckoutBtn,
	'checkoutLabel'   => $checkoutLabel,
];

// Register the fragment so WooCommerce can swap this instance on cart updates.
WooMiniCart::registerInstance( $selector, $config );

$cart    = WC()->cart;
$count   = $cart ? (int) $cart->get_cart_contents_count() : 0;
$isEmpty = $count < 1;
$cartUrl = function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '';

// Optionally hide the block entirely when the cart is empty.
if ( $isEmpty && ! $showEmptyCart ) {
	return;
}

// Per-instance CSS variables.
$css  = "#$id.bb-wmc{";
$css .= '--bb-wmc-icon-size:' . $iconSize . 'px;';
$css .= '--bb-wmc-icon-color:' . $iconColor . ';';
$css .= '--bb-wmc-icon-hov-color:' . $iconHoverColor . ';';
$css .= '--bb-wmc-badge-bg:' . $badgeBG . ';';
$css .= '--bb-wmc-badge-color:' . $badgeTextColor . ';';
$css .= '--bb-wmc-badge-fs:' . $badgeFontSize . 'px;';
$css .= '--bb-wmc-total-color:' . $totalColor . ';';
$css .= '--bb-wmc-total-fs:' . $totalFontSize . 'px;';
$css .= '--bb-wmc-dropdown-bg:' . $dropdownBG . ';';
$css .= '--bb-wmc-dropdown-width:' . $dropdownWidth . 'px;';
$css .= '--bb-wmc-dropdown-radius:' . $dropdownRadius . 'px;';
$css .= '--bb-wmc-dropdown-shadow:' . $dropdownShadow . ';';
$css .= '--bb-wmc-item-name-color:' . $itemNameColor . ';';
$css .= '--bb-wmc-item-price-color:' . $itemPriceColor . ';';
$css .= '--bb-wmc-subtotal-label-color:' . $subtotalLabelColor . ';';
$css .= '--bb-wmc-subtotal-value-color:' . $subtotalValueColor . ';';
$css .= '--bb-wmc-primary-color:' . $primaryBtnColor . ';';
$css .= '--bb-wmc-primary-bg:' . $primaryBtnBG . ';';
$css .= '--bb-wmc-primary-hov-color:' . $primaryBtnHovColor . ';';
$css .= '--bb-wmc-primary-hov-bg:' . $primaryBtnHovBG . ';';
$css .= '--bb-wmc-secondary-color:' . $secondaryBtnColor . ';';
$css .= '--bb-wmc-secondary-bg:' . $secondaryBtnBG . ';';
$css .= '--bb-wmc-secondary-hov-color:' . $secondaryBtnHovColor . ';';
$css .= '--bb-wmc-secondary-hov-bg:' . $secondaryBtnHovBG . ';';
$css .= '--bb-wmc-btn-radius:' . $btnBorderRadius . 'px;';
$css .= '--bb-wmc-btn-fs:' . $btnFontSize . 'px;';
$css .= '--bb-wmc-btn-fw:' . $btnFontWeight . ';';
$css .= '}';

$wrapperClasses = trim(
	$planClass . ' bb-wmc'
	. ' bb-wmc--mode-' . $triggerMode
	. ' bb-wmc--align-' . $alignment
	. ' bb-wmc--pos-' . $dropdownPosition
	. ( $isEmpty ? ' bb-wmc--empty' : '' )
);

$ariaLabel = sprintf(
	/* translators: %d: number of items in the cart. */
	_n( 'Shopping cart, %d item', 'Shopping cart, %d items', $count, 'b-blocks' ),
	$count
);

$dropdownId = $id . '-dropdown';
$innerHtml  = WooMiniCart::renderInner( $config );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	data-ajax-url="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>"
	data-refresh-url="<?php echo esc_url( add_query_arg( 'wc-ajax', 'get_refreshed_fragments', home_url( '/' ) ) ); ?>"
	data-remove-nonce="<?php echo esc_attr( wp_create_nonce( 'bb_wmc_remove_item' ) ); ?>"
	data-selector="<?php echo esc_attr( $selector ); ?>"
	data-trigger-mode="<?php echo esc_attr( $triggerMode ); ?>"
	data-dropdown-position="<?php echo esc_attr( $dropdownPosition ); ?>"
	data-dropdown-id="<?php echo esc_attr( $dropdownId ); ?>"
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class="bb-wmc-shell">
		<?php if ( 'link' === $triggerMode ) : ?>
			<a
				class="bb-wmc-trigger"
				href="<?php echo esc_url( $cartUrl ); ?>"
				aria-label="<?php echo esc_attr( $ariaLabel ); ?>"
			></a>
		<?php else : ?>
			<button
				type="button"
				class="bb-wmc-trigger"
				aria-haspopup="true"
				aria-expanded="false"
				aria-controls="<?php echo esc_attr( $dropdownId ); ?>"
				aria-label="<?php echo esc_attr( $ariaLabel ); ?>"
			></button>
		<?php endif; ?>

		<?php
		// The fragment node. Its `.bb-wmc-trigger-inner` is shown beneath the
		// overlay trigger; its `.bb-wmc-dropdown-body` (dropdown mode) is moved
		// into the flyout below by CSS / surfaced by view.js after a swap.
		echo $innerHtml; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped within WooMiniCart::renderInner().
		?>

		<?php if ( 'dropdown' === $triggerMode ) : ?>
			<div
				class="bb-wmc-dropdown"
				id="<?php echo esc_attr( $dropdownId ); ?>"
				role="dialog"
				aria-modal="false"
				aria-label="<?php echo esc_attr__( 'Mini cart', 'b-blocks' ); ?>"
				hidden
			>
				<span class="bb-wmc-spinner" aria-hidden="true"></span>
			</div>
		<?php endif; ?>
	</div>
</div>
