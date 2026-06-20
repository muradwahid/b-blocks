<?php
/**
 * Blockquote Block — server-side render.
 *
 * Renders a styled blockquote with two layouts (left accent bar OR a
 * large decorative ❝ SVG) and an optional author block (avatar + name +
 * role). Output is semantic HTML:
 *
 *   <figure>                  – the block-level wrapper
 *     <span class="bb-bq__icon" aria-hidden> … </span>   (quotation layout)
 *     <blockquote>            – the quote container
 *       <p> … </p>            – the quote text (RichText, wp_kses_post)
 *     </blockquote>
 *     <figcaption>            – the attribution block
 *       <img class="bb-bq__avatar" …>
 *       <cite>
 *         <span class="bb-bq__author">…</span>
 *         <span class="bb-bq__role">…</span>
 *       </cite>
 *     </figcaption>
 *   </figure>
 *
 * Helpers are intentionally inlined as static closures — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal if helpers were declared at file
 * scope. Same pattern as click-to-share / author-box / process-steps.
 *
 * Accessibility:
 *   - Decorative ❝ SVG carries aria-hidden="true".
 *   - Avatar <img> always has an alt (author name fallback when blank).
 *   - The figure as a whole carries an aria-label that includes the
 *     author name when present so screen readers announce it as a
 *     distinct landmark.
 *   - Color contrast for quote text vs. background is the editor's
 *     responsibility — defaults inherit the active theme's body color
 *     against transparent so they pass WCAG 2.1 AA out of the box.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksBlockquote';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, var(), or named) ---
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

// --- Sanitize a CSS length token ("16px", "1rem", "0", etc.) -----------
$sanitizeCssLength = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(?:\.\d+)?(px|em|rem|%)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Clamp an int to a [min, max] range with a fallback ----------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( null === $value || '' === $value ) {
		return $fallback;
	}
	$n = (int) $value;
	if ( $n < $min ) {
		return $min;
	}
	if ( $n > $max ) {
		return $max;
	}
	return $n;
};

// --- Resolve attributes ------------------------------------------------
$attributes = is_array( $attributes ) ? $attributes : [];

$quoteText = isset( $attributes['quoteText'] ) ? (string) $attributes['quoteText'] : '';

$authorName = isset( $attributes['authorName'] ) ? trim( (string) $attributes['authorName'] ) : '';
$authorRole = isset( $attributes['authorRole'] ) ? trim( (string) $attributes['authorRole'] ) : '';

$authorAvatarUrl = isset( $attributes['authorAvatarUrl'] ) ? esc_url_raw( (string) $attributes['authorAvatarUrl'] ) : '';
$authorAvatarAlt = isset( $attributes['authorAvatarAlt'] ) ? trim( (string) $attributes['authorAvatarAlt'] ) : '';

$layoutRaw = isset( $attributes['layout'] ) ? strtolower( trim( (string) $attributes['layout'] ) ) : 'border';
$layout    = in_array( $layoutRaw, [ 'border', 'quotation' ], true ) ? $layoutRaw : 'border';

$alignmentRaw = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'left';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center', 'right' ], true ) ? $alignmentRaw : 'left';

$showAvatar     = isset( $attributes['showAvatar'] ) ? (bool) $attributes['showAvatar'] : true;
$showAuthorRole = isset( $attributes['showAuthorRole'] ) ? (bool) $attributes['showAuthorRole'] : true;

$avatarSize = $clampInt( $attributes['avatarSize'] ?? 48, 24, 128, 48 );

$avatarShapeRaw = isset( $attributes['avatarShape'] ) ? strtolower( trim( (string) $attributes['avatarShape'] ) ) : 'circle';
$avatarShape    = in_array( $avatarShapeRaw, [ 'circle', 'rounded', 'square' ], true ) ? $avatarShapeRaw : 'circle';

$quoteIconSize  = $clampInt( $attributes['quoteIconSize'] ?? 48, 24, 120, 48 );
$quoteIconColor = $sanitizeColor( $attributes['quoteIconColor'] ?? '#6366f1', '#6366f1' );

$accentColor = $sanitizeColor( $attributes['accentColor'] ?? '#6366f1', '#6366f1' );
$accentWidth = $clampInt( $attributes['accentWidth'] ?? 4, 1, 12, 4 );

$quoteTextColor  = $sanitizeColor( $attributes['quoteTextColor'] ?? '', '' );
$authorNameColor = $sanitizeColor( $attributes['authorNameColor'] ?? '', '' );
$authorRoleColor = $sanitizeColor( $attributes['authorRoleColor'] ?? '', '' );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '' );

$quoteFontSize = isset( $attributes['quoteFontSize'] ) && is_array( $attributes['quoteFontSize'] ) ? $attributes['quoteFontSize'] : [];
$qfsDesktop    = $sanitizeCssLength( $quoteFontSize['desktop'] ?? '20px', '20px' );
$qfsTablet     = $sanitizeCssLength( $quoteFontSize['tablet']  ?? '18px', '18px' );
$qfsMobile     = $sanitizeCssLength( $quoteFontSize['mobile']  ?? '16px', '16px' );

$quoteFontWeight = isset( $attributes['quoteFontWeight'] ) ? trim( (string) $attributes['quoteFontWeight'] ) : '400';
if ( ! in_array( $quoteFontWeight, [ '300', '400', '500', '600', '700' ], true ) ) {
	$quoteFontWeight = '400';
}

$quoteLineHeight = isset( $attributes['quoteLineHeight'] ) ? trim( (string) $attributes['quoteLineHeight'] ) : '1.6';
if ( ! preg_match( '/^-?\d+(?:\.\d+)?$/', $quoteLineHeight ) ) {
	$quoteLineHeight = '1.6';
}

$authorFontSize = $clampInt( $attributes['authorFontSize'] ?? 14, 10, 28, 14 );

$padding   = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop    = $sanitizeCssLength( $padding['top']    ?? '24px', '24px' );
$padRight  = $sanitizeCssLength( $padding['right']  ?? '24px', '24px' );
$padBottom = $sanitizeCssLength( $padding['bottom'] ?? '24px', '24px' );
$padLeft   = $sanitizeCssLength( $padding['left']   ?? '24px', '24px' );

$borderRadius = $clampInt( $attributes['borderRadius'] ?? 8, 0, 32, 8 );

// --- Derived display data ----------------------------------------------

// Avatar border-radius: circle = 50%, rounded = 12px, square = 0.
$avatarRadius = 'circle' === $avatarShape ? '50%' : ( 'rounded' === $avatarShape ? '12px' : '0' );

$hasAvatar = $showAvatar && '' !== $authorAvatarUrl;
$hasName   = '' !== $authorName;
$hasRole   = $showAuthorRole && '' !== $authorRole;
$hasCite   = $hasAvatar || $hasName || $hasRole;

// Avatar alt: explicit alt → author name → empty (decorative).
$avatarAlt = '';
if ( '' !== $authorAvatarAlt ) {
	$avatarAlt = $authorAvatarAlt;
} elseif ( $hasName ) {
	/* translators: %s: the quoted person's name */
	$avatarAlt = sprintf( __( 'Photo of %s', 'b-blocks' ), $authorName );
}

// Figure aria-label so screen readers announce this as a labelled landmark.
$figureAriaLabel = $hasName
	/* translators: %s: the quoted person's name */
	? sprintf( __( 'Quote by %s', 'b-blocks' ), $authorName )
	: __( 'Pull quote', 'b-blocks' );

// --- Wrapper classes ---------------------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-blockquote'
	. ' bb-bq-layout--' . $layout
	. ' bb-bq-align--' . $alignment
);

// --- CSS variable block (per-instance styling) -------------------------
$cssVars = [
	'--bb-bq-accent: '            . $accentColor,
	'--bb-bq-accent-width: '      . $accentWidth . 'px',
	'--bb-bq-radius: '            . $borderRadius . 'px',
	'--bb-bq-pad-top: '           . $padTop,
	'--bb-bq-pad-right: '         . $padRight,
	'--bb-bq-pad-bottom: '        . $padBottom,
	'--bb-bq-pad-left: '          . $padLeft,
	'--bb-bq-quote-size-desktop: '. $qfsDesktop,
	'--bb-bq-quote-size-tablet: ' . $qfsTablet,
	'--bb-bq-quote-size-mobile: ' . $qfsMobile,
	'--bb-bq-quote-weight: '      . $quoteFontWeight,
	'--bb-bq-quote-line-height: ' . $quoteLineHeight,
	'--bb-bq-author-size: '       . $authorFontSize . 'px',
	'--bb-bq-avatar-size: '       . $avatarSize . 'px',
	'--bb-bq-avatar-radius: '     . $avatarRadius,
	'--bb-bq-quote-icon-size: '   . $quoteIconSize . 'px',
	'--bb-bq-quote-icon-color: '  . $quoteIconColor,
];
if ( '' !== $backgroundColor ) {
	$cssVars[] = '--bb-bq-bg: ' . $backgroundColor;
}
if ( '' !== $quoteTextColor ) {
	$cssVars[] = '--bb-bq-text: ' . $quoteTextColor;
}
if ( '' !== $authorNameColor ) {
	$cssVars[] = '--bb-bq-name: ' . $authorNameColor;
}
if ( '' !== $authorRoleColor ) {
	$cssVars[] = '--bb-bq-role: ' . $authorRoleColor;
}
$wrapperStyle = implode( '; ', $cssVars ) . ';';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<figure class='bb-bq' role='figure' aria-label='<?php echo esc_attr( $figureAriaLabel ); ?>'>
		<?php if ( 'quotation' === $layout ) : ?>
			<span class='bb-bq__icon' aria-hidden='true'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' focusable='false'>
					<path d='M9.17 6.5H4.5C3.4 6.5 2.5 7.4 2.5 8.5v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2zm12 0H16.5c-1.1 0-2 .9-2 2v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2z' />
				</svg>
			</span>
		<?php endif; ?>

		<blockquote class='bb-bq__quote'>
			<?php
			// Quote body — RichText output, sanitized through wp_kses_post().
			// Wrap in <p> only when the saved string has no block-level tags.
			$kses = wp_kses_post( $quoteText );
			if ( '' === trim( wp_strip_all_tags( $kses ) ) ) {
				printf(
					'<p class="bb-bq__quote-text"><em>%s</em></p>',
					esc_html__( 'Type a quote…', 'b-blocks' )
				);
			} else {
				printf(
					'<p class="bb-bq__quote-text">%s</p>',
					$kses // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already sanitized via wp_kses_post.
				);
			}
			?>
		</blockquote>

		<?php if ( $hasCite ) : ?>
			<figcaption class='bb-bq__caption'>
				<?php if ( $hasAvatar ) : ?>
					<img
						class='bb-bq__avatar'
						src='<?php echo esc_url( $authorAvatarUrl ); ?>'
						alt='<?php echo esc_attr( $avatarAlt ); ?>'
						width='<?php echo esc_attr( (string) $avatarSize ); ?>'
						height='<?php echo esc_attr( (string) $avatarSize ); ?>'
						loading='lazy'
						decoding='async'
					/>
				<?php endif; ?>

				<?php if ( $hasName || $hasRole ) : ?>
					<cite class='bb-bq__cite'>
						<?php if ( $hasName ) : ?>
							<span class='bb-bq__author'><?php echo esc_html( $authorName ); ?></span>
						<?php endif; ?>
						<?php if ( $hasRole ) : ?>
							<span class='bb-bq__role'><?php echo esc_html( $authorRole ); ?></span>
						<?php endif; ?>
					</cite>
				<?php endif; ?>
			</figcaption>
		<?php endif; ?>
	</figure>
</div>
