<?php
/**
 * Post Navigation block server-side render.
 *
 * Renders styled previous/next post navigation for single-post views using
 * get_previous_post() / get_next_post(). The wrapper is a <nav> landmark with
 * an aria-label; each adjacent post is a full-card <a> with rel="prev" / "next"
 * and a visually-hidden accessible name. The block only renders meaningfully on
 * singular views — on archives, the front page, or 404s it outputs nothing
 * (an editor placeholder is shown by ServerSideRender instead).
 *
 * Per-instance CSS custom properties are emitted inline, scoped under a
 * wp_unique_id() wrapper id, so multiple instances never collide. All helpers
 * are inlined as static closures to avoid the "Cannot redeclare function" fatal
 * Gutenberg can trigger by including this file more than once per request.
 *
 * @package bBlocks
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

$prefix = 'bBlocksPostNavigation';
$id     = wp_unique_id( "$prefix-" );

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
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
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

// This block only makes sense on a single post / singular view.
if ( ! is_singular() ) {
	return;
}

// --- Resolve attributes. ---
$layout = $pickFrom( $attributes['layout'] ?? 'arrow', [ 'arrow', 'card' ], 'arrow' );

$showPrev = isset( $attributes['showPrev'] ) ? (bool) $attributes['showPrev'] : true;
$showNext = isset( $attributes['showNext'] ) ? (bool) $attributes['showNext'] : true;

$showThumbnail   = isset( $attributes['showThumbnail'] ) ? (bool) $attributes['showThumbnail'] : true;
$thumbnailSize   = $pickFrom( $attributes['thumbnailSize'] ?? 'medium', [ 'thumbnail', 'medium', 'large' ], 'medium' );
$thumbnailHeight = $clampInt( $attributes['thumbnailHeight'] ?? 160, 40, 400, 160 );

$showLabel = isset( $attributes['showLabel'] ) ? (bool) $attributes['showLabel'] : true;
$prevLabel = isset( $attributes['prevLabel'] ) ? wp_strip_all_tags( (string) $attributes['prevLabel'] ) : '';
$prevLabel = '' !== trim( $prevLabel ) ? $prevLabel : __( 'Previous Post', 'b-blocks' );
$nextLabel = isset( $attributes['nextLabel'] ) ? wp_strip_all_tags( (string) $attributes['nextLabel'] ) : '';
$nextLabel = '' !== trim( $nextLabel ) ? $nextLabel : __( 'Next Post', 'b-blocks' );

$showCategory  = isset( $attributes['showCategory'] ) ? (bool) $attributes['showCategory'] : false;
$showDate      = isset( $attributes['showDate'] ) ? (bool) $attributes['showDate'] : false;
$showArrowIcon = isset( $attributes['showArrowIcon'] ) ? (bool) $attributes['showArrowIcon'] : true;
$arrowIcon     = $pickFrom( $attributes['arrowIcon'] ?? 'chevron', [ 'chevron', 'arrow', 'angle' ], 'chevron' );

$sameCategory = isset( $attributes['sameCategory'] ) ? (bool) $attributes['sameCategory'] : false;

$titleTag   = $pickFrom( $attributes['titleTag'] ?? 'p', [ 'p', 'h2', 'h3', 'h4' ], 'p' );
$titleLines = $clampInt( $attributes['titleLines'] ?? 2, 0, 4, 2 );

$alignment  = $pickFrom( $attributes['alignment'] ?? 'stretch', [ 'stretch', 'top' ], 'stretch' );
$gap        = $clampInt( $attributes['gap'] ?? 24, 0, 80, 24 );
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1400, 0 );
$blockAlign = $pickFrom( $attributes['blockAlign'] ?? 'center', [ 'left', 'center', 'right' ], 'center' );

$cardBg          = $sanitizeColor( $attributes['cardBg'] ?? '', 'transparent' );
$cardBorderColor = $sanitizeColor( $attributes['cardBorderColor'] ?? '', '#e2e8f0' );
$cardBorderWidth = $clampInt( $attributes['cardBorderWidth'] ?? 1, 0, 8, 1 );
$cardRadius      = $clampInt( $attributes['cardRadius'] ?? 8, 0, 48, 8 );
$cardPaddingV    = $clampInt( $attributes['cardPaddingV'] ?? 20, 0, 64, 20 );
$cardPaddingH    = $clampInt( $attributes['cardPaddingH'] ?? 20, 0, 80, 20 );
$cardShadow      = $pickFrom( $attributes['cardShadow'] ?? 'none', [ 'none', 'sm', 'md', 'lg' ], 'none' );

$overlayColor   = $sanitizeColor( $attributes['overlayColor'] ?? '', '' );
$overlayOpacity = $clampInt( $attributes['overlayOpacity'] ?? 30, 0, 100, 30 );

$labelColor  = $sanitizeColor( $attributes['labelColor'] ?? '', 'inherit' );
$labelSize   = $clampInt( $attributes['labelSize'] ?? 12, 10, 24, 12 );
$labelWeight = $pickFrom( $attributes['labelWeight'] ?? '500', [ '400', '500', '600', '700' ], '500' );

$titleColor  = $sanitizeColor( $attributes['titleColor'] ?? '', 'inherit' );
$titleSize   = $clampInt( $attributes['titleSize'] ?? 18, 12, 36, 18 );
$titleWeight = $pickFrom( $attributes['titleWeight'] ?? '600', [ '400', '500', '600', '700' ], '600' );

$metaColor = $sanitizeColor( $attributes['metaColor'] ?? '', 'inherit' );
$metaSize  = $clampInt( $attributes['metaSize'] ?? 12, 10, 20, 12 );

$accentColor        = $sanitizeColor( $attributes['accentColor'] ?? '', '#0073aa' );
$hoverBg            = $sanitizeColor( $attributes['hoverBg'] ?? '', '' );
$hoverTitleColor    = $sanitizeColor( $attributes['hoverTitleColor'] ?? '', '' );
$transitionDuration = $clampInt( $attributes['transitionDuration'] ?? 200, 0, 600, 200 );

$noPostsText = isset( $attributes['noPostsText'] ) ? wp_strip_all_tags( (string) $attributes['noPostsText'] ) : '';
$noPostsText = trim( $noPostsText );

// --- Resolve adjacent posts. ---
$prevPost = $showPrev ? get_previous_post( $sameCategory ) : null;
$nextPost = $showNext ? get_next_post( $sameCategory ) : null;

$prevPost = ( $prevPost instanceof WP_Post ) ? $prevPost : null;
$nextPost = ( $nextPost instanceof WP_Post ) ? $nextPost : null;

// Nothing to show and no placeholder requested — render nothing.
$hasAnyTile = ( $showPrev && ( $prevPost || '' !== $noPostsText ) )
	|| ( $showNext && ( $nextPost || '' !== $noPostsText ) );
if ( ! $hasAnyTile ) {
	return;
}

// Map shadow preset to a value.
$shadowMap = [
	'none' => 'none',
	'sm'   => '0 1px 3px rgba(15, 23, 42, 0.10)',
	'md'   => '0 4px 12px rgba(15, 23, 42, 0.10)',
	'lg'   => '0 10px 28px rgba(15, 23, 42, 0.14)',
];
$shadowValue = $shadowMap[ $cardShadow ];

$hoverBgValue    = '' !== $hoverBg ? $hoverBg : $cardBg;
$hoverTitleValue = '' !== $hoverTitleColor ? $hoverTitleColor : $titleColor;

// Arrow glyph per style and direction (decorative, aria-hidden).
$arrowGlyphs = [
	'chevron' => [ 'prev' => '‹', 'next' => '›' ],
	'arrow'   => [ 'prev' => '←', 'next' => '→' ],
	'angle'   => [ 'prev' => '«', 'next' => '»' ],
];

// --- Per-instance CSS variables. ---
$alignMap = [ 'left' => 'flex-start', 'center' => 'center', 'right' => 'flex-end' ];

$css  = "#$id.bb-pn{";
$css .= "--bb-pn-gap:{$gap}px;";
$css .= '--bb-pn-max-width:' . ( $maxWidth > 0 ? "{$maxWidth}px" : 'none' ) . ';';
$css .= '--bb-pn-justify:' . $alignMap[ $blockAlign ] . ';';
$css .= "--bb-pn-thumb-height:{$thumbnailHeight}px;";
$css .= "--bb-pn-card-bg:$cardBg;";
$css .= "--bb-pn-card-border-color:$cardBorderColor;";
$css .= "--bb-pn-card-border-width:{$cardBorderWidth}px;";
$css .= "--bb-pn-card-radius:{$cardRadius}px;";
$css .= "--bb-pn-card-padding-v:{$cardPaddingV}px;";
$css .= "--bb-pn-card-padding-h:{$cardPaddingH}px;";
$css .= "--bb-pn-card-shadow:$shadowValue;";
$css .= "--bb-pn-overlay-color:" . ( '' !== $overlayColor ? $overlayColor : 'transparent' ) . ';';
$css .= '--bb-pn-overlay-opacity:' . ( $overlayOpacity / 100 ) . ';';
$css .= "--bb-pn-label-color:$labelColor;";
$css .= "--bb-pn-label-size:{$labelSize}px;";
$css .= "--bb-pn-label-weight:$labelWeight;";
$css .= "--bb-pn-title-color:$titleColor;";
$css .= "--bb-pn-title-size:{$titleSize}px;";
$css .= "--bb-pn-title-weight:$titleWeight;";
$css .= '--bb-pn-title-lines:' . ( $titleLines > 0 ? $titleLines : 'none' ) . ';';
$css .= "--bb-pn-meta-color:$metaColor;";
$css .= "--bb-pn-meta-size:{$metaSize}px;";
$css .= "--bb-pn-accent:$accentColor;";
$css .= "--bb-pn-hover-bg:$hoverBgValue;";
$css .= "--bb-pn-hover-title:$hoverTitleValue;";
$css .= "--bb-pn-transition:{$transitionDuration}ms;";
$css .= '}';

$wrapperClasses = trim(
	'bb-pn'
	. ' bb-pn--layout-' . $layout
	. ' bb-pn--align-' . $alignment
	. ( $maxWidth > 0 ? ' bb-pn--has-max-width' : '' )
);

/**
 * Build the inner markup for one tile.
 *
 * @param WP_Post|null $post Adjacent post (null = placeholder tile).
 * @return string HTML.
 */
$renderTile = static function ( $post, $direction ) use (
	$layout, $showThumbnail, $thumbnailSize, $showLabel, $showCategory, $showDate,
	$showArrowIcon, $arrowGlyphs, $arrowIcon, $titleTag, $prevLabel, $nextLabel,
	$noPostsText, $overlayColor
) {
	$isPrev = 'prev' === $direction;
	$label  = $isPrev ? $prevLabel : $nextLabel;
	$rel    = $isPrev ? 'prev' : 'next';
	$glyph  = $arrowGlyphs[ $arrowIcon ][ $direction ];

	// Placeholder (no adjacent post).
	if ( ! ( $post instanceof WP_Post ) ) {
		if ( '' === $noPostsText ) {
			return '';
		}
		ob_start();
		?>
		<div class="bb-pn-tile bb-pn-tile--<?php echo esc_attr( $direction ); ?> bb-pn-tile--empty">
			<div class="bb-pn-tile-inner">
				<?php if ( $showArrowIcon ) : ?>
					<span class="bb-pn-arrow" aria-hidden="true"><?php echo esc_html( $glyph ); ?></span>
				<?php endif; ?>
				<div class="bb-pn-body">
					<?php if ( $showLabel ) : ?>
						<span class="bb-pn-label" aria-hidden="true"><?php echo esc_html( $label ); ?></span>
					<?php endif; ?>
					<span class="bb-pn-placeholder"><?php echo esc_html( $noPostsText ); ?></span>
				</div>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	$postId    = $post->ID;
	$permalink = get_permalink( $postId );
	$titleText = get_the_title( $postId );

	// Accessible name: "Previous post: <title>" / "Next post: <title>".
	$ariaName = $isPrev
		/* translators: %s: post title. */
		? sprintf( __( 'Previous post: %s', 'b-blocks' ), $titleText )
		/* translators: %s: post title. */
		: sprintf( __( 'Next post: %s', 'b-blocks' ), $titleText );

	// Thumbnail (card layout only).
	$thumbHtml = '';
	if ( 'card' === $layout && $showThumbnail && has_post_thumbnail( $postId ) ) {
		$thumbHtml = get_the_post_thumbnail(
			$postId,
			$thumbnailSize,
			[
				'alt'      => '',
				'loading'  => 'lazy',
				'decoding' => 'async',
				'class'    => 'bb-pn-thumb-img',
			]
		);
	}

	// Primary category.
	$categoryName = '';
	if ( $showCategory ) {
		$terms = get_the_terms( $postId, 'category' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$categoryName = $terms[0]->name;
		}
	}

	ob_start();
	?>
	<a
		class="bb-pn-tile bb-pn-tile--<?php echo esc_attr( $direction ); ?>"
		href="<?php echo esc_url( $permalink ); ?>"
		rel="<?php echo esc_attr( $rel ); ?>"
		aria-label="<?php echo esc_attr( $ariaName ); ?>"
	>
		<?php if ( '' !== $thumbHtml ) : ?>
			<span class="bb-pn-thumb" aria-hidden="true">
				<?php echo wp_kses_post( $thumbHtml ); ?>
				<?php if ( '' !== $overlayColor ) : ?>
					<span class="bb-pn-thumb-overlay"></span>
				<?php endif; ?>
			</span>
		<?php endif; ?>

		<span class="bb-pn-tile-inner">
			<?php if ( $showArrowIcon ) : ?>
				<span class="bb-pn-arrow" aria-hidden="true"><?php echo esc_html( $glyph ); ?></span>
			<?php endif; ?>

			<span class="bb-pn-body">
				<?php if ( $showLabel ) : ?>
					<span class="bb-pn-label" aria-hidden="true"><?php echo esc_html( $label ); ?></span>
				<?php endif; ?>

				<?php if ( $showCategory && '' !== $categoryName ) : ?>
					<span class="bb-pn-category"><?php echo esc_html( $categoryName ); ?></span>
				<?php endif; ?>

				<?php
				printf(
					'<%1$s class="bb-pn-title">%2$s</%1$s>',
					tag_escape( $titleTag ),
					esc_html( $titleText )
				);
				?>

				<?php if ( $showDate ) : ?>
					<time class="bb-pn-date" datetime="<?php echo esc_attr( get_the_date( 'c', $postId ) ); ?>">
						<?php echo esc_html( get_the_date( '', $postId ) ); ?>
					</time>
				<?php endif; ?>
			</span>
		</span>
	</a>
	<?php
	return (string) ob_get_clean();
};

$prevTile = $showPrev ? $renderTile( $prevPost, 'prev' ) : '';
$nextTile = $showNext ? $renderTile( $nextPost, 'next' ) : '';

if ( '' === $prevTile && '' === $nextTile ) {
	return;
}
?>
<nav
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	aria-label="<?php echo esc_attr__( 'Post navigation', 'b-blocks' ); ?>"
	data-bb-pn-init="1"
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class="bb-pn-row">
		<?php
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- tiles built from escaped pieces above.
		echo $prevTile;
		echo $nextTile;
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>
</nav>
