<?php
/**
 * Social Share Bar block server-side render.
 *
 * Renders a position:fixed vertical strip of social share buttons. Each share
 * target is a real <a> with a server-built, rawurlencode()'d href pointing at
 * the canonical permalink so the links work even with JavaScript disabled. The
 * Copy Link control is a real <button>. view.js handles the scroll-reveal
 * threshold, reduced-motion handling, and clipboard copy.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 *
 * @var array $attributes Block attributes.
 */

$prefix    = 'bBlocksSocialShareBar';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, named, or var()). ---
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
	// var(--token) with an optional comma fallback (hardened allowlist).
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
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

// --- Darken a 6-digit hex color by a percentage (closure, no global). ---
$darkenColor = static function ( $hex, $percent ) {
	if ( ! preg_match( '/^#([0-9a-fA-F]{6})$/', trim( (string) $hex ), $m ) ) {
		return $hex;
	}
	$num = hexdec( $m[1] );
	$amt = (int) round( 2.55 * $percent );
	$r   = max( 0, ( $num >> 16 ) - $amt );
	$g   = max( 0, ( ( $num >> 8 ) & 0xff ) - $amt );
	$b   = max( 0, ( $num & 0xff ) - $amt );
	return sprintf( '#%02x%02x%02x', $r, $g, $b );
};

// --- Platform definitions: brand color + 24x24 SVG path. ---
$platformDefs = array(
	'twitter'   => array(
		'label' => __( 'Twitter', 'b-blocks' ),
		'color' => '#000000',
		'path'  => 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
	),
	'facebook'  => array(
		'label' => __( 'Facebook', 'b-blocks' ),
		'color' => '#1877f2',
		'path'  => 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
	),
	'linkedin'  => array(
		'label' => __( 'LinkedIn', 'b-blocks' ),
		'color' => '#0a66c2',
		'path'  => 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
	),
	'whatsapp'  => array(
		'label' => __( 'WhatsApp', 'b-blocks' ),
		'color' => '#25d366',
		'path'  => 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
	),
	'pinterest' => array(
		'label' => __( 'Pinterest', 'b-blocks' ),
		'color' => '#e60023',
		'path'  => 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.764-1.379l-.751 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z',
	),
	'email'     => array(
		'label' => __( 'Email', 'b-blocks' ),
		'color' => '#5f6368',
		'path'  => 'M1.5 4.5h21A1.5 1.5 0 0124 6v12a1.5 1.5 0 01-1.5 1.5h-21A1.5 1.5 0 010 18V6a1.5 1.5 0 011.5-1.5zm.74 1.5L12 12.43 21.76 6H2.24zM22.5 7.4l-9.99 6.58a.9.9 0 01-1.02 0L1.5 7.4V18h21V7.4z',
	),
	'copy'      => array(
		'label' => __( 'Copy Link', 'b-blocks' ),
		'color' => '#374151',
		'path'  => 'M3.9 12a3.1 3.1 0 013.1-3.1h4V7H7a5 5 0 100 10h4v-1.9H7A3.1 3.1 0 013.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 010 6.2h-4V17h4a5 5 0 000-10z',
	),
);

// --- Resolve and sanitize attributes. ---
$side       = isset( $attributes['side'] ) && 'right' === $attributes['side'] ? 'right' : 'left';
$offset     = $clampInt( $attributes['offset'] ?? 120, 0, 800, 120 );
$threshold  = $clampInt( $attributes['scrollThreshold'] ?? 300, 0, 2000, 300 );
$iconSize   = $clampInt( $attributes['iconSize'] ?? 20, 12, 40, 20 );
$buttonSize = $clampInt( $attributes['buttonSize'] ?? 44, 30, 80, 44 );
$radius     = $clampInt( $attributes['buttonRadius'] ?? 8, 0, 9999, 8 );
$gap        = $clampInt( $attributes['gap'] ?? 8, 0, 32, 8 );
$labelSize  = $clampInt( $attributes['labelSize'] ?? 12, 10, 18, 12 );
$animDur    = $clampInt( $attributes['animationDuration'] ?? 300, 100, 800, 300 );
$zIndex     = $clampInt( $attributes['zIndex'] ?? 9999, 1, 99999, 9999 );

$bgColor      = $sanitizeColor( $attributes['backgroundColor'] ?? '', '' );
$iconColor    = $sanitizeColor( $attributes['iconColor'] ?? '#ffffff', '#ffffff' );
$hoverBg      = $sanitizeColor( $attributes['hoverBackgroundColor'] ?? '', '' );
$labelColor   = $sanitizeColor( $attributes['labelColor'] ?? '#ffffff', '#ffffff' );

$showLabels = ! empty( $attributes['showLabels'] );

$animation = isset( $attributes['animation'] ) ? (string) $attributes['animation'] : 'fade';
if ( ! in_array( $animation, array( 'fade', 'slide', 'none' ), true ) ) {
	$animation = 'fade';
}

$copyLabel   = isset( $attributes['copyLabel'] ) && '' !== trim( (string) $attributes['copyLabel'] ) ? (string) $attributes['copyLabel'] : __( 'Copy', 'b-blocks' );
$copiedLabel = isset( $attributes['copiedLabel'] ) && '' !== trim( (string) $attributes['copiedLabel'] ) ? (string) $attributes['copiedLabel'] : __( 'Copied!', 'b-blocks' );

// --- Resolve enabled platforms in submitted order, validated against defs. ---
$default_platforms = array( 'twitter', 'facebook', 'linkedin', 'whatsapp', 'email', 'copy' );
$platforms         = isset( $attributes['platforms'] ) && is_array( $attributes['platforms'] ) ? $attributes['platforms'] : $default_platforms;
$platforms         = array_values(
	array_filter(
		$platforms,
		static function ( $p ) use ( $platformDefs ) {
			return is_string( $p ) && isset( $platformDefs[ $p ] );
		}
	)
);
if ( empty( $platforms ) ) {
	$platforms = $default_platforms;
}

// --- Resolve canonical share URL and title. ---
$post_id   = get_the_ID();
$pageUrl   = isset( $attributes['shareUrl'] ) && '' !== trim( (string) $attributes['shareUrl'] ) ? esc_url_raw( (string) $attributes['shareUrl'] ) : '';
if ( '' === $pageUrl ) {
	$permalink = $post_id ? get_permalink( $post_id ) : '';
	$pageUrl   = $permalink ? $permalink : ( is_ssl() ? 'https://' : 'http://' ) . wp_unslash( $_SERVER['HTTP_HOST'] ?? '' ) . wp_unslash( $_SERVER['REQUEST_URI'] ?? '' );
	$pageUrl   = esc_url_raw( $pageUrl );
}

$pageTitle = isset( $attributes['shareTitle'] ) && '' !== trim( (string) $attributes['shareTitle'] ) ? (string) $attributes['shareTitle'] : ( $post_id ? get_the_title( $post_id ) : wp_get_document_title() );
$pageTitle = wp_strip_all_tags( (string) $pageTitle );

$emailSubject = isset( $attributes['emailSubject'] ) && '' !== trim( (string) $attributes['emailSubject'] ) ? (string) $attributes['emailSubject'] : $pageTitle;
$twitterVia   = isset( $attributes['twitterVia'] ) ? preg_replace( '/[^a-zA-Z0-9_]/', '', (string) $attributes['twitterVia'] ) : '';

// --- Encode share components once. ---
$encUrl     = rawurlencode( $pageUrl );
$encTitle   = rawurlencode( $pageTitle );
$encSubject = rawurlencode( $emailSubject );

// --- Build a share href for a given platform. ---
$buildHref = static function ( $platform ) use ( $encUrl, $encTitle, $encSubject, $twitterVia ) {
	switch ( $platform ) {
		case 'twitter':
			$href = "https://twitter.com/intent/tweet?text={$encTitle}&url={$encUrl}";
			if ( '' !== $twitterVia ) {
				$href .= '&via=' . rawurlencode( $twitterVia );
			}
			return $href;
		case 'facebook':
			return "https://www.facebook.com/sharer/sharer.php?u={$encUrl}";
		case 'linkedin':
			return "https://www.linkedin.com/shareArticle?mini=true&url={$encUrl}&title={$encTitle}";
		case 'whatsapp':
			return 'https://api.whatsapp.com/send?text=' . $encTitle . '%20' . $encUrl;
		case 'pinterest':
			return "https://pinterest.com/pin/create/button/?url={$encUrl}&description={$encTitle}";
		case 'email':
			return "mailto:?subject={$encSubject}&body={$encTitle}%0A{$encUrl}";
		default:
			return '';
	}
};

// --- Per-instance config consumed by view.js. ---
$persistKey = isset( $attributes['persistKey'] ) && '' !== (string) $attributes['persistKey'] ? sanitize_html_class( (string) $attributes['persistKey'] ) : $id;

$config = array(
	'scrollThreshold'   => $threshold,
	'animation'         => $animation,
	'animationDuration' => $animDur,
	'side'              => $side,
	'persistKey'        => $persistKey,
	'copyLabel'         => $copyLabel,
	'copiedLabel'       => $copiedLabel,
	'copyFailedLabel'   => __( 'Copy failed', 'b-blocks' ),
);

// --- Inline scoped CSS. ---
$sel       = '#' . $id;
$justify   = $showLabels ? 'flex-start' : 'center';
$btnWidth  = $showLabels ? 'auto' : ( $buttonSize . 'px' );
$btnPad    = $showLabels ? ( '0 ' . max( 10, $gap + 6 ) . 'px' ) : '0';
$translate = 'right' === $side ? '-2px' : '2px';

$platformCss = '';
foreach ( $platforms as $key ) {
	$base  = '' !== $bgColor ? $bgColor : $platformDefs[ $key ]['color'];
	$hover = '' !== $hoverBg ? $hoverBg : $darkenColor( $base, 12 );
	$platformCss .= "{$sel} .bb-ssb-btn[data-bb-ssb-platform=\"{$key}\"]{background-color:{$base};}";
	$platformCss .= "{$sel} .bb-ssb-btn[data-bb-ssb-platform=\"{$key}\"]:hover,{$sel} .bb-ssb-btn[data-bb-ssb-platform=\"{$key}\"]:focus-visible{background-color:{$hover};}";
}

$css = "
	{$sel}{position:fixed;top:50%;" . ( 'right' === $side ? 'right:0;' : 'left:0;' ) . "transform:translateY(calc(-50% + {$offset}px));z-index:{$zIndex};--bb-ssb-anim-duration:{$animDur}ms;}
	{$sel} .bb-ssb-list{display:flex;flex-direction:column;gap:{$gap}px;margin:0;padding:0;list-style:none;}
	{$sel} .bb-ssb-btn{display:inline-flex;align-items:center;justify-content:{$justify};gap:8px;box-sizing:border-box;min-width:{$buttonSize}px;min-height:{$buttonSize}px;width:{$btnWidth};height:{$buttonSize}px;padding:{$btnPad};border:none;border-radius:{$radius}px;color:{$iconColor};cursor:pointer;text-decoration:none;transition:background-color var(--bb-ssb-anim-duration,300ms) ease,transform .15s ease;}
	{$sel} .bb-ssb-btn:hover{transform:translateX({$translate});}
	{$sel} .bb-ssb-btn svg{width:{$iconSize}px;height:{$iconSize}px;fill:currentColor;flex-shrink:0;}
	{$sel} .bb-ssb-label{font-size:{$labelSize}px;line-height:1;color:{$labelColor};white-space:nowrap;}
	{$platformCss}
";
$css = preg_replace( '/\s+/', ' ', $css );

// --- Visibility classes for the no-JS / initial state. ---
$animClass    = 'bb-ssb-anim-' . $animation;
$visibility   = $threshold <= 0 ? 'bb-ssb--visible' : 'bb-ssb--hidden';
$wrapperClass = trim( "$planClass bb-ssb $animClass bb-ssb-side-$side $visibility" );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClass ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	role="region"
	aria-label="<?php esc_attr_e( 'Share this page', 'b-blocks' ); ?>"
	data-bb-ssb-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<ul class="bb-ssb-list">
		<?php foreach ( $platforms as $key ) : ?>
			<?php
			$def = $platformDefs[ $key ];
			$svg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' . esc_attr( $def['path'] ) . '"></path></svg>';

			if ( 'copy' === $key ) :
				$ariaLabel = __( 'Copy link', 'b-blocks' );
				?>
				<li class="bb-ssb-item">
					<button
						type="button"
						class="bb-ssb-btn"
						data-bb-ssb-platform="copy"
						data-bb-ssb-copy-url="<?php echo esc_attr( $pageUrl ); ?>"
						aria-label="<?php echo esc_attr( $ariaLabel ); ?>"
					>
						<?php echo wp_kses( $svg, array( 'svg' => array( 'viewbox' => true, 'aria-hidden' => true, 'focusable' => true ), 'path' => array( 'd' => true ) ) ); ?>
						<?php if ( $showLabels ) : ?>
							<span class="bb-ssb-label" aria-hidden="true"><?php echo esc_html( $copyLabel ); ?></span>
						<?php endif; ?>
					</button>
				</li>
			<?php else : ?>
				<?php
				$href = $buildHref( $key );
				/* translators: %s: social platform name. */
				$ariaLabel = sprintf( __( 'Share on %s', 'b-blocks' ), $def['label'] );
				$isMailto  = 'email' === $key;
				?>
				<li class="bb-ssb-item">
					<a
						class="bb-ssb-btn"
						data-bb-ssb-platform="<?php echo esc_attr( $key ); ?>"
						data-bb-ssb-href="<?php echo esc_url( $href, array( 'http', 'https', 'mailto' ) ); ?>"
						href="<?php echo esc_url( $href, array( 'http', 'https', 'mailto' ) ); ?>"
						<?php if ( ! $isMailto ) : ?>
							target="_blank" rel="noopener noreferrer"
						<?php endif; ?>
						aria-label="<?php echo esc_attr( $isMailto ? $ariaLabel : $ariaLabel . ' ' . __( '(opens in a new tab)', 'b-blocks' ) ); ?>"
					>
						<?php echo wp_kses( $svg, array( 'svg' => array( 'viewbox' => true, 'aria-hidden' => true, 'focusable' => true ), 'path' => array( 'd' => true ) ) ); ?>
						<?php if ( $showLabels ) : ?>
							<span class="bb-ssb-label" aria-hidden="true"><?php echo esc_html( $def['label'] ); ?></span>
						<?php endif; ?>
					</a>
				</li>
			<?php endif; ?>
		<?php endforeach; ?>
	</ul>

	<span class="bb-ssb-live screen-reader-text" aria-live="polite"></span>
</div>
