<?php
/**
 * Click to Share Block — server-side render.
 *
 * Renders a styled quote card with one-click share buttons. All share intent
 * URLs are built here on the server from sanitized inputs and the current
 * page permalink so the markup is fully usable even before JavaScript hydrates
 * (right-click → "Open in new tab" works, search engines see real links).
 *
 * Helpers are intentionally inlined as static closures — Gutenberg may include
 * this file more than once per request which would cause a "Cannot redeclare
 * function" fatal if helpers were declared at file scope.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksClickToShare';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, or named) -----------
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

// --- Sanitize an X / Twitter handle (no @, no spaces) ------------------
$sanitizeHandle = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	$value = ltrim( $value, '@' );
	if ( preg_match( '/^[A-Za-z0-9_]{1,15}$/', $value ) ) {
		return $value;
	}
	return '';
};

// --- Strip inline HTML for plain-text share payloads -------------------
$plainText = static function ( $value ) {
	$value = (string) $value;
	$value = wp_strip_all_tags( $value );
	$value = html_entity_decode( $value, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$value = preg_replace( '/\s+/u', ' ', $value );
	return trim( $value );
};

// --- Resolve attributes -------------------------------------------------
$attributes = is_array( $attributes ) ? $attributes : [];

$quoteText  = isset( $attributes['quoteText'] ) ? (string) $attributes['quoteText'] : '';
$shareText  = isset( $attributes['shareText'] ) ? trim( (string) $attributes['shareText'] ) : '';
$citeText   = isset( $attributes['citeText'] ) ? trim( (string) $attributes['citeText'] ) : '';

$platforms  = isset( $attributes['platforms'] ) && is_array( $attributes['platforms'] ) ? $attributes['platforms'] : [];
$showTwitter  = ! empty( $platforms['twitter'] );
$showFacebook = ! empty( $platforms['facebook'] );
$showLinkedIn = ! empty( $platforms['linkedin'] );
$showWhatsApp = ! empty( $platforms['whatsapp'] );
$showEmail    = ! empty( $platforms['email'] );
$showCopy     = ! empty( $platforms['copy'] );

$xHandle      = $sanitizeHandle( $attributes['xHandle'] ?? '' );
$emailSubject = isset( $attributes['emailSubject'] ) ? trim( (string) $attributes['emailSubject'] ) : '';
$emailSubject = '' !== $emailSubject ? $emailSubject : __( "Thought you'd like this quote", 'b-blocks' );

$layoutRaw  = isset( $attributes['layout'] ) ? strtolower( trim( (string) $attributes['layout'] ) ) : 'card';
$layout     = in_array( $layoutRaw, [ 'card', 'inline' ], true ) ? $layoutRaw : 'card';

$alignmentRaw = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'left';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center', 'right' ], true ) ? $alignmentRaw : 'left';

$showQuoteIcon    = ! empty( $attributes['showQuoteIcon'] );
$showButtonLabels = ! empty( $attributes['showButtonLabels'] );

$copyButtonLabel = isset( $attributes['copyButtonLabel'] ) ? trim( (string) $attributes['copyButtonLabel'] ) : '';
$copyButtonLabel = '' !== $copyButtonLabel ? $copyButtonLabel : __( 'Copy Link', 'b-blocks' );

$copiedLabel = isset( $attributes['copiedLabel'] ) ? trim( (string) $attributes['copiedLabel'] ) : '';
$copiedLabel = '' !== $copiedLabel ? $copiedLabel : __( 'Copied!', 'b-blocks' );

$buttonStyleRaw = isset( $attributes['buttonStyle'] ) ? strtolower( trim( (string) $attributes['buttonStyle'] ) ) : 'filled';
$buttonStyle    = in_array( $buttonStyleRaw, [ 'filled', 'outline' ], true ) ? $buttonStyleRaw : 'filled';

// --- Visual style preset ------------------------------------------------
$viewStyleRaw = isset( $attributes['viewStyle'] ) ? strtolower( trim( (string) $attributes['viewStyle'] ) ) : 'default';
$viewStyle    = in_array( $viewStyleRaw, [ 'default', 'minimal', 'card', 'highlight', 'quote-marks', 'tweet' ], true ) ? $viewStyleRaw : 'default';

// --- Colors -------------------------------------------------------------
$colors = isset( $attributes['colors'] ) && is_array( $attributes['colors'] ) ? $attributes['colors'] : [];
$bgColor         = $sanitizeColor( $colors['bg']         ?? '#f0f7ff', '#f0f7ff' );
$textColor       = $sanitizeColor( $colors['text']       ?? '#1a1a1a', '#1a1a1a' );
$quoteIconColor  = $sanitizeColor( $colors['quoteIcon']  ?? '#0575e6', '#0575e6' );
$borderColor     = $sanitizeColor( $colors['border']     ?? '#0575e6', '#0575e6' );
$buttonBgColor   = $sanitizeColor( $colors['buttonBg']   ?? '#0575e6', '#0575e6' );
$buttonTextColor = $sanitizeColor( $colors['buttonText'] ?? '#ffffff', '#ffffff' );

// --- Border / padding / typography --------------------------------------
$border        = isset( $attributes['border'] ) && is_array( $attributes['border'] ) ? $attributes['border'] : [];
$borderWidth   = $sanitizeCssLength( $border['width']  ?? '4px', '4px' );
$borderRadius  = $sanitizeCssLength( $border['radius'] ?? '6px', '6px' );

$buttonBorderRadius = $sanitizeCssLength( $attributes['buttonBorderRadius'] ?? '4px', '4px' );

$padding   = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop    = $sanitizeCssLength( $padding['top']    ?? '20px', '20px' );
$padRight  = $sanitizeCssLength( $padding['right']  ?? '24px', '24px' );
$padBottom = $sanitizeCssLength( $padding['bottom'] ?? '20px', '20px' );
$padLeft   = $sanitizeCssLength( $padding['left']   ?? '24px', '24px' );

$fontSize   = $sanitizeCssLength( $attributes['fontSize'] ?? '18px', '18px' );
$fontWeight = isset( $attributes['fontWeight'] ) ? trim( (string) $attributes['fontWeight'] ) : '600';
if ( ! in_array( $fontWeight, [ '400', '500', '600', '700', 'normal', 'bold' ], true ) ) {
	$fontWeight = '600';
}

// --- Compose share payloads --------------------------------------------
$plainQuote = $plainText( $quoteText );
$plainShare = '' !== $shareText ? $plainText( $shareText ) : $plainQuote;

// Trim share text to 240 chars so X intent doesn't get truncated mid-word.
if ( function_exists( 'mb_substr' ) && function_exists( 'mb_strlen' ) ) {
	if ( mb_strlen( $plainShare, 'UTF-8' ) > 240 ) {
		$plainShare = rtrim( mb_substr( $plainShare, 0, 237, 'UTF-8' ) ) . '…';
	}
} elseif ( strlen( $plainShare ) > 240 ) {
	$plainShare = rtrim( substr( $plainShare, 0, 237 ) ) . '…';
}

$pageUrl = '';
if ( function_exists( 'get_permalink' ) ) {
	$maybeUrl = get_permalink();
	if ( is_string( $maybeUrl ) && '' !== $maybeUrl ) {
		$pageUrl = esc_url_raw( $maybeUrl );
	}
}

// Build share intent URLs server-side. JS may reuse data-* attributes to
// open them in a small popup window; the href is always valid for
// no-JS / right-click flows.
$encShare = rawurlencode( $plainShare );
$encUrl   = rawurlencode( $pageUrl );

$twitterUrl = 'https://x.com/intent/tweet?text=' . $encShare;
if ( '' !== $pageUrl ) {
	$twitterUrl .= '&url=' . $encUrl;
}
if ( '' !== $xHandle ) {
	$twitterUrl .= '&via=' . rawurlencode( $xHandle );
}

$facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' . $encUrl;
if ( '' !== $plainShare ) {
	$facebookUrl .= '&quote=' . $encShare;
}

$linkedinUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' . $encUrl;

// WhatsApp accepts a single "text" param — combine quote + page URL.
$whatsappText = '' !== $pageUrl ? trim( $plainShare . ' ' . $pageUrl ) : $plainShare;
$whatsappUrl  = 'https://api.whatsapp.com/send?text=' . rawurlencode( $whatsappText );

// Email — mailto: with subject + body containing the quote + page URL.
$emailBody = '' !== $pageUrl ? $plainShare . "\r\n\r\n" . $pageUrl : $plainShare;
$emailUrl  = 'mailto:?subject=' . rawurlencode( $emailSubject ) . '&body=' . rawurlencode( $emailBody );

// Plain text the JS clipboard handler will copy when the Copy Link button
// is clicked: the quote in smart quotes followed by the page URL.
$copyPayload = $plainShare;
if ( '' !== $pageUrl ) {
	$copyPayload .= "\n" . $pageUrl;
}

// --- Wrapper classes / style -------------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-click-to-share'
	. ' bb-cts-view--' . $viewStyle
	. ' bb-cts-layout--' . $layout
	. ' bb-cts-align--' . $alignment
	. ' bb-cts-btn--' . $buttonStyle
);

$wrapperStyleParts = [
	'--bb-cts-bg:'           . $bgColor,
	'--bb-cts-text:'         . $textColor,
	'--bb-cts-quote-icon:'   . $quoteIconColor,
	'--bb-cts-border:'       . $borderColor,
	'--bb-cts-border-width:' . $borderWidth,
	'--bb-cts-radius:'       . $borderRadius,
	'--bb-cts-btn-bg:'       . $buttonBgColor,
	'--bb-cts-btn-text:'     . $buttonTextColor,
	'--bb-cts-btn-radius:'   . $buttonBorderRadius,
	'--bb-cts-pad-top:'      . $padTop,
	'--bb-cts-pad-right:'    . $padRight,
	'--bb-cts-pad-bottom:'   . $padBottom,
	'--bb-cts-pad-left:'     . $padLeft,
	'--bb-cts-font-size:'    . $fontSize,
	'--bb-cts-font-weight:'  . $fontWeight,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

// --- aria-label for the quote landmark ---------------------------------
$cardAriaLabel = '' !== $plainQuote
	/* translators: %s: the quote text */
	? sprintf( __( 'Shareable quote: %s', 'b-blocks' ), $plainQuote )
	: __( 'Shareable quote', 'b-blocks' );

// --- Build the list of share targets to render -------------------------
$networks = [];
if ( $showTwitter ) {
	$networks[] = [
		'key'   => 'twitter',
		'label' => __( 'Share on X', 'b-blocks' ),
		'url'   => $twitterUrl,
		'icon'  => 'fa-brands fa-x-twitter',
		'text'  => __( 'Share on X', 'b-blocks' ),
	];
}
if ( $showFacebook ) {
	$networks[] = [
		'key'   => 'facebook',
		'label' => __( 'Share on Facebook', 'b-blocks' ),
		'url'   => $facebookUrl,
		'icon'  => 'fa-brands fa-facebook-f',
		'text'  => __( 'Facebook', 'b-blocks' ),
	];
}
if ( $showLinkedIn ) {
	$networks[] = [
		'key'   => 'linkedin',
		'label' => __( 'Share on LinkedIn', 'b-blocks' ),
		'url'   => $linkedinUrl,
		'icon'  => 'fa-brands fa-linkedin-in',
		'text'  => __( 'LinkedIn', 'b-blocks' ),
	];
}
if ( $showWhatsApp ) {
	$networks[] = [
		'key'   => 'whatsapp',
		'label' => __( 'Share on WhatsApp', 'b-blocks' ),
		'url'   => $whatsappUrl,
		'icon'  => 'fa-brands fa-whatsapp',
		'text'  => __( 'WhatsApp', 'b-blocks' ),
	];
}
if ( $showEmail ) {
	$networks[] = [
		'key'   => 'email',
		'label' => __( 'Share by Email', 'b-blocks' ),
		'url'   => $emailUrl,
		'icon'  => 'fa-solid fa-envelope',
		'text'  => __( 'Email', 'b-blocks' ),
	];
}
$openInTabSr = __( '(opens in a new tab)', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<figure class='bb-cts-card' role='figure' aria-label='<?php echo esc_attr( $cardAriaLabel ); ?>'>
		<?php if ( $showQuoteIcon ) : ?>
			<span class='bb-cts-quote-icon' aria-hidden='true'>
				<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='currentColor' focusable='false'>
					<path d='M7.17 6C4.87 6 3 7.87 3 10.17v3.66C3 16.13 4.87 18 7.17 18h.66c.46 0 .83-.37.83-.83V13.5c0-.46-.37-.83-.83-.83H6.5c-.28 0-.5-.22-.5-.5v-1.67c0-1.01.82-1.83 1.83-1.83h.67c.46 0 .83-.37.83-.83V6.83c0-.46-.37-.83-.83-.83h-1.33zm9 0c-2.3 0-4.17 1.87-4.17 4.17v3.66C12 16.13 13.87 18 16.17 18h.66c.46 0 .83-.37.83-.83V13.5c0-.46-.37-.83-.83-.83h-1.33c-.28 0-.5-.22-.5-.5v-1.67c0-1.01.82-1.83 1.83-1.83h.67c.46 0 .83-.37.83-.83V6.83c0-.46-.37-.83-.83-.83h-1.33z'/>
				</svg>
			</span>
		<?php endif; ?>

		<blockquote class='bb-cts-quote'>
			<p class='bb-cts-quote-text'><?php echo wp_kses_post( $quoteText ); ?></p>
			<?php if ( '' !== $citeText ) : ?>
				<footer class='bb-cts-cite'>
					<cite><?php echo esc_html( $citeText ); ?></cite>
				</footer>
			<?php endif; ?>
		</blockquote>

		<?php if ( ! empty( $networks ) || $showCopy ) : ?>
			<div class='bb-cts-actions' role='group' aria-label='<?php esc_attr_e( 'Share this quote', 'b-blocks' ); ?>'>
				<?php foreach ( $networks as $net ) : ?>
					<a
						class='bb-cts-btn bb-cts-btn--<?php echo esc_attr( $net['key'] ); ?>'
						href='<?php echo esc_url( $net['url'] ); ?>'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='<?php echo esc_attr( $net['label'] ); ?>'
						data-platform='<?php echo esc_attr( $net['key'] ); ?>'
						data-popup='<?php echo 'email' === $net['key'] ? '0' : '1'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- literal '0'/'1', no user input. ?>'
					>
						<span class='bb-cts-btn__icon' aria-hidden='true'>
							<i class='<?php echo esc_attr( $net['icon'] ); ?>'></i>
						</span>
						<?php if ( $showButtonLabels ) : ?>
							<span class='bb-cts-btn__text'><?php echo esc_html( $net['text'] ); ?></span>
						<?php endif; ?>
						<span class='screen-reader-text'> <?php echo esc_html( $openInTabSr ); ?></span>
					</a>
				<?php endforeach; ?>

				<?php if ( $showCopy ) : ?>
					<button
						type='button'
						class='bb-cts-btn bb-cts-btn--copy'
						aria-label='<?php echo esc_attr( $copyButtonLabel ); ?>'
						data-platform='copy'
						data-copy-text='<?php echo esc_attr( $copyPayload ); ?>'
						data-copy-label='<?php echo esc_attr( $copyButtonLabel ); ?>'
						data-copied-label='<?php echo esc_attr( $copiedLabel ); ?>'
					>
						<span class='bb-cts-btn__icon' aria-hidden='true'>
							<i class='fa-regular fa-copy'></i>
						</span>
						<?php if ( $showButtonLabels ) : ?>
							<span class='bb-cts-btn__text'><?php echo esc_html( $copyButtonLabel ); ?></span>
						<?php endif; ?>
					</button>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</figure>

	<span class='bb-cts-live' aria-live='polite' aria-atomic='true'></span>
</div>
