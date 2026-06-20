<?php
/**
 * Woo Mini Cart — shared server logic.
 *
 * Provides attribute-sanitization helpers, a per-instance cart-fragment
 * registration mechanism (hooked onto `woocommerce_add_to_cart_fragments`
 * so WooCommerce's own cart-fragments script and the block's `view.js`
 * fetch can swap the inner cart markup), and a hardened block-specific
 * AJAX remove-item endpoint (`bb_wmc_remove_item`).
 *
 * Security model for `bb_wmc_remove_item`:
 *   - Nonce verified on every request via check_ajax_referer().
 *   - cart item key sanitized with sanitize_text_field() and validated
 *     against the live cart contents before removal.
 *   - All responses use wp_send_json_success / wp_send_json_error.
 *
 * @package bBlocks
 */

namespace BBlocks\Inc\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooMiniCart {

	/**
	 * Render configurations keyed by fragment selector, captured per request
	 * from render.php so the fragment callback can re-render each instance
	 * with the same options the visitor originally configured.
	 *
	 * @var array<string,array>
	 */
	protected static $instances = [];

	/**
	 * Whether the fragment filter has already been registered this request.
	 *
	 * @var bool
	 */
	protected static $fragmentHooked = false;

	/**
	 * Hook the AJAX remove endpoint (public + logged-in).
	 */
	public function __construct() {
		add_action( 'wp_ajax_bb_wmc_remove_item', [ $this, 'ajaxRemoveItem' ] );
		add_action( 'wp_ajax_nopriv_bb_wmc_remove_item', [ $this, 'ajaxRemoveItem' ] );
	}

	/**
	 * Sanitize a CSS color value (hex, rgb/hsl, var(), or a CSS keyword).
	 *
	 * @param mixed  $color    Raw color.
	 * @param string $fallback Fallback when invalid.
	 * @return string
	 */
	public static function sanitizeColor( $color, $fallback = '' ) {
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
	}

	/**
	 * Clamp a value to an integer range.
	 *
	 * @param mixed $value    Raw value.
	 * @param int   $min      Minimum.
	 * @param int   $max      Maximum.
	 * @param int   $fallback Fallback when non-numeric.
	 * @return int
	 */
	public static function clampInt( $value, $min, $max, $fallback ) {
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
	}

	/**
	 * Sanitize a Font Awesome icon class string (allow letters, digits,
	 * spaces and hyphens only). Falls back when empty.
	 *
	 * @param mixed  $value    Raw icon class.
	 * @param string $fallback Fallback class.
	 * @return string
	 */
	public static function sanitizeIconClass( $value, $fallback ) {
		$value = trim( (string) $value );
		$value = preg_replace( '/[^a-zA-Z0-9 _\-]/', '', $value );
		return '' !== $value ? $value : $fallback;
	}

	/**
	 * Map a shadow preset keyword to a box-shadow value.
	 *
	 * @param string $preset Preset keyword.
	 * @return string
	 */
	public static function shadowValue( $preset ) {
		switch ( $preset ) {
			case 'none':
				return 'none';
			case 'small':
				return '0 1px 4px rgba(0,0,0,0.10)';
			case 'large':
				return '0 16px 48px rgba(0,0,0,0.22)';
			case 'medium':
			default:
				return '0 8px 28px rgba(0,0,0,0.16)';
		}
	}

	/**
	 * Register a block instance for fragment re-rendering.
	 *
	 * @param string $selector Fragment CSS selector (e.g. ".bb-wmc-<id>").
	 * @param array  $config   Render configuration for the instance.
	 */
	public static function registerInstance( $selector, array $config ) {
		self::$instances[ $selector ] = $config;

		if ( ! self::$fragmentHooked ) {
			self::$fragmentHooked = true;
			add_filter( 'woocommerce_add_to_cart_fragments', [ __CLASS__, 'cartFragments' ] );
		}
	}

	/**
	 * `woocommerce_add_to_cart_fragments` callback — re-render the inner
	 * markup for every registered instance and merge it into the fragments
	 * array so WooCommerce can swap it in place.
	 *
	 * @param array $fragments Existing fragments.
	 * @return array
	 */
	public static function cartFragments( $fragments ) {
		if ( ! is_array( $fragments ) ) {
			$fragments = [];
		}
		foreach ( self::$instances as $selector => $config ) {
			$fragments[ $selector ] = self::renderInner( $config );
		}
		return $fragments;
	}

	/**
	 * Render the inner cart state HTML for one instance.
	 *
	 * Outputs the trigger inner (icon, count badge, total) plus the dropdown
	 * panel (item list, subtotal, footer buttons). The element is wrapped in a
	 * `<div class="bb-wmc-inner bb-wmc-<id>">` so it matches the fragment
	 * selector and is what gets swapped on cart updates.
	 *
	 * @param array $c Instance configuration.
	 * @return string
	 */
	public static function renderInner( array $c ) {
		$selectorClass = ltrim( (string) ( $c['selector'] ?? '' ), '.' );

		$cart       = ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart : null;
		$count      = $cart ? (int) $cart->get_cart_contents_count() : 0;
		$totalHtml  = $cart ? $cart->get_cart_total() : '';
		$cartItems  = $cart ? $cart->get_cart() : [];
		$isEmpty    = $count < 1;
		$isDropdown = 'dropdown' === ( $c['triggerMode'] ?? 'dropdown' );

		$ariaLabel = sprintf(
			/* translators: %d: number of items in the cart. */
			_n( 'Shopping cart, %d item', 'Shopping cart, %d items', $count, 'b-blocks' ),
			$count
		);

		// The fragment element. WooCommerce / view.js swap this whole node, so it
		// carries the canonical cart state: the visible trigger badge/total plus
		// (in dropdown mode) the dropdown body. The wrapper shell repositions the
		// dropdown body with CSS — it is rendered as a sibling of the trigger
		// content, never nested inside the trigger button.
		ob_start();
		?>
		<div
			class="bb-wmc-inner <?php echo esc_attr( $selectorClass ); ?><?php echo $isEmpty ? ' bb-wmc--empty' : ''; ?>"
			data-count="<?php echo esc_attr( (string) $count ); ?>"
		>
			<span class="bb-wmc-trigger-inner">
				<i class="bb-wmc-icon <?php echo esc_attr( $c['iconClass'] ); ?>" aria-hidden="true"></i>
				<?php if ( ! empty( $c['showCount'] ) ) : ?>
					<span class="bb-wmc-badge" aria-hidden="true"><?php echo esc_html( (string) $count ); ?></span>
				<?php endif; ?>
				<?php if ( ! empty( $c['showTotal'] ) ) : ?>
					<span class="bb-wmc-total-label"><?php echo wp_kses_post( $totalHtml ); ?></span>
				<?php endif; ?>
				<span class="bb-wmc-aria-text screen-reader-text"><?php echo esc_html( $ariaLabel ); ?></span>
			</span>

			<?php if ( $isDropdown ) : ?>
				<?php echo self::renderDropdownBody( $c, $cartItems, $totalHtml, $isEmpty ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped within helper. ?>
			<?php endif; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the dropdown body (item list, subtotal, footer buttons).
	 *
	 * @param array  $c         Instance configuration.
	 * @param array  $cartItems Cart contents.
	 * @param string $totalHtml Cart total HTML.
	 * @param bool   $isEmpty   Whether the cart is empty.
	 * @return string
	 */
	protected static function renderDropdownBody( array $c, array $cartItems, $totalHtml, $isEmpty ) {
		$cartUrl     = function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '';
		$checkoutUrl = function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : '';

		ob_start();
		?>
		<div class="bb-wmc-dropdown-body">
			<?php if ( $isEmpty ) : ?>
				<p class="bb-wmc-empty-message"><?php echo esc_html( $c['emptyMessage'] ); ?></p>
			<?php else : ?>
				<?php if ( ! empty( $c['showItemList'] ) ) : ?>
					<ul class="bb-wmc-items">
						<?php foreach ( $cartItems as $cartItemKey => $cartItem ) :
							$product = isset( $cartItem['data'] ) ? $cartItem['data'] : null;
							if ( ! $product || ! is_a( $product, 'WC_Product' ) || ! apply_filters( 'woocommerce_widget_cart_item_visible', true, $cartItem, $cartItemKey ) ) {
								continue;
							}
							$productName = $product->get_name();
							$quantity    = (int) $cartItem['quantity'];
							$linePrice   = function_exists( 'WC' ) ? WC()->cart->get_product_subtotal( $product, $quantity ) : '';
							$removeUrl   = function_exists( 'wc_get_cart_remove_url' ) ? wc_get_cart_remove_url( $cartItemKey ) : '#';
							$removeLabel = sprintf(
								/* translators: %s: product name. */
								__( 'Remove %s from cart', 'b-blocks' ),
								wp_strip_all_tags( $productName )
							);
							?>
							<li class="bb-wmc-item" data-key="<?php echo esc_attr( $cartItemKey ); ?>">
								<span class="bb-wmc-item-info">
									<span class="bb-wmc-item-name"><?php echo esc_html( $productName ); ?></span>
									<span class="bb-wmc-item-meta">
										<span class="bb-wmc-item-qty"><?php echo esc_html( sprintf( '× %d', $quantity ) ); ?></span>
										<?php if ( ! empty( $c['showItemPrice'] ) ) : ?>
											<span class="bb-wmc-item-price"><?php echo wp_kses_post( $linePrice ); ?></span>
										<?php endif; ?>
									</span>
								</span>
								<a
									class="bb-wmc-remove"
									href="<?php echo esc_url( $removeUrl ); ?>"
									data-key="<?php echo esc_attr( $cartItemKey ); ?>"
									aria-label="<?php echo esc_attr( $removeLabel ); ?>"
								>
									<span aria-hidden="true">&times;</span>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>

				<?php if ( ! empty( $c['showSubtotal'] ) ) : ?>
					<div class="bb-wmc-subtotal">
						<span class="bb-wmc-subtotal-label"><?php echo esc_html__( 'Subtotal', 'b-blocks' ); ?></span>
						<span class="bb-wmc-subtotal-value"><?php echo wp_kses_post( $totalHtml ); ?></span>
					</div>
				<?php endif; ?>
			<?php endif; ?>

			<?php if ( ! $isEmpty && ( ! empty( $c['showViewCartBtn'] ) || ! empty( $c['showCheckoutBtn'] ) ) ) : ?>
				<div class="bb-wmc-footer">
					<?php if ( ! empty( $c['showViewCartBtn'] ) && $cartUrl ) : ?>
						<a class="bb-wmc-btn bb-wmc-btn--secondary" href="<?php echo esc_url( $cartUrl ); ?>">
							<?php echo esc_html( $c['viewCartLabel'] ); ?>
						</a>
					<?php endif; ?>
					<?php if ( ! empty( $c['showCheckoutBtn'] ) && $checkoutUrl ) : ?>
						<a class="bb-wmc-btn bb-wmc-btn--primary" href="<?php echo esc_url( $checkoutUrl ); ?>">
							<?php echo esc_html( $c['checkoutLabel'] ); ?>
						</a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Handle the `bb_wmc_remove_item` AJAX request.
	 *
	 * Removes a single cart item by its key and responds with the refreshed
	 * cart fragments so the caller can swap the inner markup without a reload.
	 */
	public function ajaxRemoveItem() {
		check_ajax_referer( 'bb_wmc_remove_item', 'nonce' );

		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			wp_send_json_error( [ 'message' => __( 'WooCommerce is not available.', 'b-blocks' ) ] );
		}

		$cartItemKey = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_item_key'] ) ) : '';
		// WooCommerce cart item keys are 32-character lowercase MD5 hex strings.
		// Reject anything that does not match that format before touching the cart.
		if ( '' === $cartItemKey || ! preg_match( '/^[0-9a-f]{32}$/', $cartItemKey ) ) {
			wp_send_json_error( [ 'message' => __( 'Invalid cart item.', 'b-blocks' ) ] );
		}

		$cart = WC()->cart;
		if ( ! $cart->get_cart_item( $cartItemKey ) ) {
			wp_send_json_error( [ 'message' => __( 'Cart item not found.', 'b-blocks' ) ] );
		}

		$removed = $cart->remove_cart_item( $cartItemKey );
		if ( ! $removed ) {
			wp_send_json_error( [ 'message' => __( 'Could not remove the item.', 'b-blocks' ) ] );
		}

		$cart->calculate_totals();

		// Re-run WooCommerce's fragment filter so the client receives fresh markup.
		$fragments = apply_filters( 'woocommerce_add_to_cart_fragments', [] );

		wp_send_json_success(
			[
				'removed'    => true,
				'cartCount'  => (int) $cart->get_cart_contents_count(),
				'fragments'  => $fragments,
				'cart_hash'  => $cart->get_cart_hash(),
			]
		);
	}
}

new WooMiniCart();
