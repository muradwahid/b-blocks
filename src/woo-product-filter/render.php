<?php
/**
 * Woo Product Filter block server-side render.
 *
 * Renders a native `<form method="GET">` that appends WooCommerce-native query
 * parameters to the current page URL on submit (`product_cat`, `min_price`,
 * `max_price`, `rating_filter`, `on_sale`, `orderby`). Because WooCommerce's
 * own `WC_Query` reads these from `$_GET`, the bBlocks `woo-product-grid` block
 * and the WooCommerce shop archive naturally pick up the selection on page
 * reload — no AJAX endpoint, custom DB query, or nonce is needed (this is
 * plain GET-based navigation, idempotent and bookmark-friendly).
 *
 * The form works with zero JavaScript. The optional `view.js` only
 * progressively enhances it (debounced auto-submit when the Apply button is
 * hidden, a live price-range `<output>` label, and an instant client-side
 * field reset on the Clear All link).
 *
 * All current values are read from `$_GET` and sanitized
 * (`sanitize_text_field` / `absint`) before being echoed back into the form
 * fields, and every dynamic value is escaped on output (`esc_attr` /
 * `esc_html` / `esc_url`). Per-instance CSS custom properties are emitted
 * inline, scoped under a `wp_unique_id()` wrapper id (block-specific
 * `bb-wpf-` prefix), so multiple panels on one page never collide. Helpers are
 * inlined as static closures to avoid the "Cannot redeclare function" fatal
 * Gutenberg can trigger by including this file more than once per request.
 *
 * If WooCommerce is not active, a friendly `role="alert"` notice is shown
 * instead of fataling.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix    = 'bBlocksWooProductFilter';
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

// --- Sanitize a CSS font-size string ("14px", "1.2rem", "16"). ---
$sanitizeFontSize = static function ( $value, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^\d{1,3}(\.\d{1,2})?(px|rem|em|%)?$/', $value ) ) {
		return preg_match( '/(px|rem|em|%)$/', $value ) ? $value : $value . 'px';
	}
	return $fallback;
};

// --- WooCommerce-missing notice. ---
$noWooMessage = isset( $attributes['noWooMessage'] ) ? sanitize_text_field( (string) $attributes['noWooMessage'] ) : '';
if ( '' === $noWooMessage ) {
	$noWooMessage = __( 'WooCommerce is required for this block.', 'b-blocks' );
}

if ( ! class_exists( 'WooCommerce' ) || ! taxonomy_exists( 'product_cat' ) ) {
	?>
	<div
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
		<?php echo get_block_wrapper_attributes( [ 'class' => "$planClass bb-wpf" ] ); ?>
	>
		<div class='bb-wpf-notice' role='alert'>
			<p><?php echo esc_html( $noWooMessage ); ?></p>
		</div>
	</div>
	<?php
	return;
}

// --- Resolve toggles / layout attributes. ---
$showCategoryFilter = isset( $attributes['showCategoryFilter'] ) ? (bool) $attributes['showCategoryFilter'] : true;
$categoryDepth      = $clampInt( $attributes['categoryDepth'] ?? 0, 0, 1, 0 );
$showPriceFilter    = isset( $attributes['showPriceFilter'] ) ? (bool) $attributes['showPriceFilter'] : true;
$priceMin           = $clampInt( $attributes['priceMin'] ?? 0, 0, 100000, 0 );
$priceMax           = $clampInt( $attributes['priceMax'] ?? 500, 1, 100000, 500 );
$showRatingFilter   = isset( $attributes['showRatingFilter'] ) ? (bool) $attributes['showRatingFilter'] : true;
$showOnSaleFilter   = isset( $attributes['showOnSaleFilter'] ) ? (bool) $attributes['showOnSaleFilter'] : true;
$showSortControl    = isset( $attributes['showSortControl'] ) ? (bool) $attributes['showSortControl'] : true;

if ( $priceMax <= $priceMin ) {
	$priceMax = $priceMin + 1;
}

$filterLayout    = $pickFrom( $attributes['filterLayout'] ?? 'vertical', [ 'vertical', 'horizontal' ], 'vertical' );
$showApplyButton = isset( $attributes['showApplyButton'] ) ? (bool) $attributes['showApplyButton'] : true;
$filterHeadingTag = $pickFrom( $attributes['filterHeadingTag'] ?? 'h3', [ 'h2', 'h3', 'h4' ], 'h3' );

$applyButtonLabel = isset( $attributes['applyButtonLabel'] ) ? sanitize_text_field( (string) $attributes['applyButtonLabel'] ) : '';
$clearButtonLabel = isset( $attributes['clearButtonLabel'] ) ? sanitize_text_field( (string) $attributes['clearButtonLabel'] ) : '';
if ( '' === $applyButtonLabel ) {
	$applyButtonLabel = __( 'Apply Filters', 'b-blocks' );
}
if ( '' === $clearButtonLabel ) {
	$clearButtonLabel = __( 'Clear All', 'b-blocks' );
}

// --- Style attributes. ---
$accentColor     = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#ffffff' );
$borderColor     = $sanitizeColor( $attributes['borderColor'] ?? '', '#e2e8f0' );
$borderWidth     = $clampInt( $attributes['borderWidth'] ?? 1, 0, 8, 1 );
$borderRadius    = $clampInt( $attributes['borderRadius'] ?? 8, 0, 32, 8 );
$padding         = $clampInt( $attributes['padding'] ?? 20, 0, 60, 20 );
$textColor       = $sanitizeColor( $attributes['textColor'] ?? '', '' );
$headingColor    = $sanitizeColor( $attributes['headingColor'] ?? '', '' );
$headingFontSize = $sanitizeFontSize( $attributes['headingFontSize'] ?? '14px', '14px' );
$labelFontSize   = $sanitizeFontSize( $attributes['labelFontSize'] ?? '14px', '14px' );
$applyBtnColor   = $sanitizeColor( $attributes['applyBtnColor'] ?? '', '#ffffff' );
$applyBtnBG      = $sanitizeColor( $attributes['applyBtnBG'] ?? '', '#146EF5' );
$applyBtnRadius  = $clampInt( $attributes['applyBtnRadius'] ?? 4, 0, 32, 4 );

// --- Read current selections from $_GET (sanitized; escaped again on output). ---
// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Read-only GET navigation, no state change; no nonce required.
$curCat       = isset( $_GET['product_cat'] ) ? sanitize_text_field( wp_unslash( $_GET['product_cat'] ) ) : '';
$curMinPrice  = isset( $_GET['min_price'] ) ? sanitize_text_field( wp_unslash( $_GET['min_price'] ) ) : '';
$curMaxPrice  = isset( $_GET['max_price'] ) ? sanitize_text_field( wp_unslash( $_GET['max_price'] ) ) : '';
$curRating    = isset( $_GET['rating_filter'] ) ? absint( wp_unslash( $_GET['rating_filter'] ) ) : 0;
$curOnSale    = isset( $_GET['on_sale'] ) && '1' === sanitize_text_field( wp_unslash( $_GET['on_sale'] ) );
$curOrderby   = isset( $_GET['orderby'] ) ? sanitize_text_field( wp_unslash( $_GET['orderby'] ) ) : '';
// phpcs:enable WordPress.Security.NonceVerification.Recommended

// Numeric prices: keep only if numeric, else blank.
$curMinPrice = is_numeric( $curMinPrice ) ? (string) abs( (float) $curMinPrice ) : '';
$curMaxPrice = is_numeric( $curMaxPrice ) ? (string) abs( (float) $curMaxPrice ) : '';
$curRating   = $curRating >= 1 && $curRating <= 5 ? $curRating : 0;

$orderbyOptions = [
	'menu_order' => __( 'Default', 'b-blocks' ),
	'popularity' => __( 'Popularity', 'b-blocks' ),
	'rating'     => __( 'Average rating', 'b-blocks' ),
	'date'       => __( 'Latest', 'b-blocks' ),
	'price'      => __( 'Price: low to high', 'b-blocks' ),
	'price-desc' => __( 'Price: high to low', 'b-blocks' ),
];
if ( ! array_key_exists( $curOrderby, $orderbyOptions ) ) {
	$curOrderby = 'menu_order';
}

// --- Build the form action URL (current page, params stripped). ---
$actionUrl = home_url( add_query_arg( [] ) );
$actionUrl = remove_query_arg(
	[ 'product_cat', 'min_price', 'max_price', 'rating_filter', 'on_sale', 'orderby', 'paged' ],
	$actionUrl
);

// --- Currency symbol for the price label. ---
$currencySymbol = function_exists( 'get_woocommerce_currency_symbol' )
	? html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' )
	: '';

// --- Category terms (only if the section is shown). ---
$catTerms = [];
if ( $showCategoryFilter ) {
	$termArgs = [
		'taxonomy'   => 'product_cat',
		'orderby'    => 'name',
		'order'      => 'ASC',
		'hide_empty' => true,
	];
	if ( 0 === $categoryDepth ) {
		$termArgs['parent'] = 0;
	}
	$queriedTerms = get_terms( $termArgs );
	if ( ! is_wp_error( $queriedTerms ) ) {
		$catTerms = $queriedTerms;
	}
}

// --- Per-instance CSS variables. ---
$resolvedText    = '' !== $textColor ? $textColor : 'inherit';
$resolvedHeading = '' !== $headingColor ? $headingColor : 'inherit';

$css  = "#$id.bb-wpf{";
$css .= "--bb-wpf-accent:$accentColor;";
$css .= "--bb-wpf-bg:$backgroundColor;";
$css .= "--bb-wpf-border-color:$borderColor;";
$css .= "--bb-wpf-border-width:{$borderWidth}px;";
$css .= "--bb-wpf-radius:{$borderRadius}px;";
$css .= "--bb-wpf-pad:{$padding}px;";
$css .= "--bb-wpf-text:$resolvedText;";
$css .= "--bb-wpf-heading:$resolvedHeading;";
$css .= "--bb-wpf-heading-size:$headingFontSize;";
$css .= "--bb-wpf-label-size:$labelFontSize;";
$css .= "--bb-wpf-btn-color:$applyBtnColor;";
$css .= "--bb-wpf-btn-bg:$applyBtnBG;";
$css .= "--bb-wpf-btn-radius:{$applyBtnRadius}px;";
$css .= '}';

$wrapperClasses = trim(
	$planClass
	. ' bb-wpf'
	. ' bb-wpf--' . $filterLayout
	. ( $borderWidth > 0 ? ' bb-wpf--has-border' : '' )
);

$Heading = tag_escape( $filterHeadingTag );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-wpf='true'
	data-auto-submit='<?php echo esc_attr( $showApplyButton ? '0' : '1' ); ?>'
	data-currency-symbol='<?php echo esc_attr( $currencySymbol ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<form
		class='bb-wpf-form'
		method='get'
		action='<?php echo esc_url( $actionUrl ); ?>'
		aria-label='<?php echo esc_attr__( 'Product filters', 'b-blocks' ); ?>'
	>
		<?php if ( $showCategoryFilter && ! empty( $catTerms ) ) : ?>
			<fieldset class='bb-wpf-section bb-wpf-section--category'>
				<legend class='bb-wpf-legend'>
					<<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?> class='bb-wpf-heading'>
						<?php esc_html_e( 'Category', 'b-blocks' ); ?>
					</<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?>>
				</legend>

				<ul class='bb-wpf-options bb-wpf-options--category' role='list'>
					<?php
					$allId = wp_unique_id( 'bb-wpf-cat-' );
					?>
					<li class='bb-wpf-option'>
						<input
							type='radio'
							class='bb-wpf-radio'
							name='product_cat'
							id='<?php echo esc_attr( $allId ); ?>'
							value=''
							<?php checked( '', $curCat ); ?>
						/>
						<label for='<?php echo esc_attr( $allId ); ?>'><?php esc_html_e( 'All categories', 'b-blocks' ); ?></label>
					</li>
					<?php
					foreach ( $catTerms as $term ) :
						if ( ! ( $term instanceof WP_Term ) ) {
							continue;
						}
						$optId  = wp_unique_id( 'bb-wpf-cat-' );
						$isChild = (int) $term->parent !== 0;
						?>
						<li class='bb-wpf-option<?php echo esc_attr( $isChild ? ' bb-wpf-option--child' : '' ); ?>'>
							<input
								type='radio'
								class='bb-wpf-radio'
								name='product_cat'
								id='<?php echo esc_attr( $optId ); ?>'
								value='<?php echo esc_attr( $term->slug ); ?>'
								<?php checked( $term->slug, $curCat ); ?>
							/>
							<label for='<?php echo esc_attr( $optId ); ?>'>
								<?php echo esc_html( $term->name ); ?>
								<span class='bb-wpf-count' aria-hidden='true'>(<?php echo esc_html( (string) (int) $term->count ); ?>)</span>
							</label>
						</li>
					<?php endforeach; ?>
				</ul>
			</fieldset>
		<?php endif; ?>

		<?php if ( $showPriceFilter ) : ?>
			<?php
			$minSliderId = wp_unique_id( 'bb-wpf-min-' );
			$maxSliderId = wp_unique_id( 'bb-wpf-max-' );
			$minVal      = '' !== $curMinPrice ? $curMinPrice : (string) $priceMin;
			$maxVal      = '' !== $curMaxPrice ? $curMaxPrice : (string) $priceMax;
			?>
			<fieldset class='bb-wpf-section bb-wpf-section--price'>
				<legend class='bb-wpf-legend'>
					<<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?> class='bb-wpf-heading'>
						<?php esc_html_e( 'Price', 'b-blocks' ); ?>
					</<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?>>
				</legend>

				<div class='bb-wpf-price'>
					<output class='bb-wpf-price-label' aria-hidden='true'>
						<?php echo esc_html( $currencySymbol . $minVal . ' – ' . $currencySymbol . $maxVal ); ?>
					</output>

					<div class='bb-wpf-range'>
						<input
							type='range'
							class='bb-wpf-slider bb-wpf-slider--min'
							id='<?php echo esc_attr( $minSliderId ); ?>'
							name='min_price'
							min='<?php echo esc_attr( (string) $priceMin ); ?>'
							max='<?php echo esc_attr( (string) $priceMax ); ?>'
							step='1'
							value='<?php echo esc_attr( $minVal ); ?>'
							aria-label='<?php echo esc_attr__( 'Minimum price', 'b-blocks' ); ?>'
						/>
						<input
							type='range'
							class='bb-wpf-slider bb-wpf-slider--max'
							id='<?php echo esc_attr( $maxSliderId ); ?>'
							name='max_price'
							min='<?php echo esc_attr( (string) $priceMin ); ?>'
							max='<?php echo esc_attr( (string) $priceMax ); ?>'
							step='1'
							value='<?php echo esc_attr( $maxVal ); ?>'
							aria-label='<?php echo esc_attr__( 'Maximum price', 'b-blocks' ); ?>'
						/>
					</div>

					<div class='bb-wpf-price-inputs'>
						<label class='bb-wpf-price-num'>
							<span class='screen-reader-text'><?php esc_html_e( 'Minimum price', 'b-blocks' ); ?></span>
							<span class='bb-wpf-currency' aria-hidden='true'><?php echo esc_html( $currencySymbol ); ?></span>
							<input
								type='number'
								class='bb-wpf-num bb-wpf-num--min'
								inputmode='numeric'
								min='0'
								step='1'
								value='<?php echo esc_attr( $curMinPrice ); ?>'
								placeholder='<?php echo esc_attr( (string) $priceMin ); ?>'
								aria-label='<?php echo esc_attr__( 'Minimum price', 'b-blocks' ); ?>'
								data-sync='min'
							/>
						</label>
						<span class='bb-wpf-price-dash' aria-hidden='true'>–</span>
						<label class='bb-wpf-price-num'>
							<span class='screen-reader-text'><?php esc_html_e( 'Maximum price', 'b-blocks' ); ?></span>
							<span class='bb-wpf-currency' aria-hidden='true'><?php echo esc_html( $currencySymbol ); ?></span>
							<input
								type='number'
								class='bb-wpf-num bb-wpf-num--max'
								inputmode='numeric'
								min='0'
								step='1'
								value='<?php echo esc_attr( $curMaxPrice ); ?>'
								placeholder='<?php echo esc_attr( (string) $priceMax ); ?>'
								aria-label='<?php echo esc_attr__( 'Maximum price', 'b-blocks' ); ?>'
								data-sync='max'
							/>
						</label>
					</div>
				</div>
			</fieldset>
		<?php endif; ?>

		<?php if ( $showRatingFilter ) : ?>
			<fieldset class='bb-wpf-section bb-wpf-section--rating'>
				<legend class='bb-wpf-legend'>
					<<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?> class='bb-wpf-heading'>
						<?php esc_html_e( 'Rating', 'b-blocks' ); ?>
					</<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?>>
				</legend>

				<ul class='bb-wpf-options bb-wpf-options--rating' role='list'>
					<?php
					$anyRatingId = wp_unique_id( 'bb-wpf-rate-' );
					?>
					<li class='bb-wpf-option'>
						<input
							type='radio'
							class='bb-wpf-radio'
							name='rating_filter'
							id='<?php echo esc_attr( $anyRatingId ); ?>'
							value=''
							<?php checked( 0, $curRating ); ?>
						/>
						<label for='<?php echo esc_attr( $anyRatingId ); ?>'><?php esc_html_e( 'Any rating', 'b-blocks' ); ?></label>
					</li>
					<?php for ( $stars = 5; $stars >= 1; $stars-- ) : ?>
						<?php
						$rateId = wp_unique_id( 'bb-wpf-rate-' );
						/* translators: %d: minimum number of stars. */
						$rateLabel = sprintf( _n( '%d star & up', '%d stars & up', $stars, 'b-blocks' ), $stars );
						?>
						<li class='bb-wpf-option'>
							<input
								type='radio'
								class='bb-wpf-radio'
								name='rating_filter'
								id='<?php echo esc_attr( $rateId ); ?>'
								value='<?php echo esc_attr( (string) $stars ); ?>'
								<?php checked( $stars, $curRating ); ?>
							/>
							<label for='<?php echo esc_attr( $rateId ); ?>'>
								<span class='bb-wpf-stars' aria-hidden='true'>
									<?php
									for ( $i = 1; $i <= 5; $i++ ) {
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded class string and Unicode literal; $i and $stars are bounded integers (1-5).
										echo '<span class="bb-wpf-star' . ( $i <= $stars ? ' is-filled' : '' ) . '">&#9733;</span>';
									}
									?>
								</span>
								<span class='bb-wpf-stars-text'><?php echo esc_html( $rateLabel ); ?></span>
							</label>
						</li>
					<?php endfor; ?>
				</ul>
			</fieldset>
		<?php endif; ?>

		<?php if ( $showOnSaleFilter ) : ?>
			<?php $onSaleId = wp_unique_id( 'bb-wpf-sale-' ); ?>
			<fieldset class='bb-wpf-section bb-wpf-section--sale'>
				<div class='bb-wpf-option bb-wpf-option--inline'>
					<input
						type='checkbox'
						class='bb-wpf-checkbox'
						name='on_sale'
						id='<?php echo esc_attr( $onSaleId ); ?>'
						value='1'
						<?php checked( true, $curOnSale ); ?>
					/>
					<label for='<?php echo esc_attr( $onSaleId ); ?>'><?php esc_html_e( 'On sale only', 'b-blocks' ); ?></label>
				</div>
			</fieldset>
		<?php endif; ?>

		<?php if ( $showSortControl ) : ?>
			<?php $sortId = wp_unique_id( 'bb-wpf-sort-' ); ?>
			<fieldset class='bb-wpf-section bb-wpf-section--sort'>
				<legend class='bb-wpf-legend'>
					<<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?> class='bb-wpf-heading'>
						<?php esc_html_e( 'Sort by', 'b-blocks' ); ?>
					</<?php echo $Heading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag_escape() output. ?>>
				</legend>
				<label class='screen-reader-text' for='<?php echo esc_attr( $sortId ); ?>'><?php esc_html_e( 'Sort by', 'b-blocks' ); ?></label>
				<select class='bb-wpf-select' name='orderby' id='<?php echo esc_attr( $sortId ); ?>'>
					<?php foreach ( $orderbyOptions as $optValue => $optLabel ) : ?>
						<option value='<?php echo esc_attr( $optValue ); ?>' <?php selected( $optValue, $curOrderby ); ?>>
							<?php echo esc_html( $optLabel ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</fieldset>
		<?php endif; ?>

		<div class='bb-wpf-actions'>
			<?php if ( $showApplyButton ) : ?>
				<button type='submit' class='bb-wpf-apply'>
					<?php echo esc_html( $applyButtonLabel ); ?>
				</button>
			<?php else : ?>
				<noscript>
					<button type='submit' class='bb-wpf-apply'>
						<?php echo esc_html( $applyButtonLabel ); ?>
					</button>
				</noscript>
			<?php endif; ?>

			<a
				class='bb-wpf-clear'
				href='<?php echo esc_url( $actionUrl ); ?>'
				aria-label='<?php echo esc_attr__( 'Clear all filters', 'b-blocks' ); ?>'
			>
				<?php echo esc_html( $clearButtonLabel ); ?>
			</a>
		</div>
	</form>
</div>
