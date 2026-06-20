<?php
/**
 * Feature Tabs block server-side render.
 *
 * Renders a vertical tab list (role="tablist") beside a paired image panel.
 * Selecting a tab swaps the visible image via client-side view.js. Below the
 * configured mobile breakpoint the markup reflows into a single-open accordion.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers are inlined as
 * static closures (same pattern as media-text-section / hero-section).
 *
 * @package bBlocks
 */

use BBlocks\Inc\Utils as Utils;

$prefix    = 'bBlocksFeatureTabs';
$id        = wp_unique_id( "$prefix-" );
$planClass = Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

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
	// Hardened var() pattern — fallback restricted to safe chars only.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}
	$i = (int) $value;
	if ( $i < $min ) {
		return $min;
	}
	if ( $i > $max ) {
		return $max;
	}
	return $i;
};

$pickFromList = static function ( $value, array $allow, $fallback ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	return in_array( $value, $allow, true ) ? $value : $fallback;
};

$ratioPercents = static function ( $ratio ) {
	$map = array(
		'30-70' => array( 30, 70 ),
		'40-60' => array( 40, 60 ),
		'50-50' => array( 50, 50 ),
	);
	return isset( $map[ $ratio ] ) ? $map[ $ratio ] : $map['40-60'];
};

// Font Awesome class string: letters, digits, spaces, dashes only.
$sanitizeIcon = static function ( $value ) {
	$value = is_string( $value ) ? trim( $value ) : '';
	if ( '' === $value ) {
		return '';
	}
	if ( preg_match( '/^[a-zA-Z0-9 \-]{1,80}$/', $value ) ) {
		return $value;
	}
	return '';
};

// --- Resolve and validate attributes ---------------------------------

$layout     = $pickFromList( $attributes['layout'] ?? 'tabs-left', array( 'tabs-left', 'tabs-right' ), 'tabs-left' );
$splitRatio = $pickFromList( $attributes['splitRatio'] ?? '40-60', array( '30-70', '40-60', '50-50' ), '40-60' );
list( $tabPct, $imgPct ) = $ratioPercents( $splitRatio );

$accentColor = $sanitizeColor( $attributes['accentColor'] ?? '' );
$tabBg       = $sanitizeColor( $attributes['tabBg'] ?? '' );
$activeBg    = $sanitizeColor( $attributes['activeBg'] ?? '' );
$imageBg     = $sanitizeColor( $attributes['imageBg'] ?? '' );
$titleColor  = $sanitizeColor( $attributes['titleColor'] ?? '' );
$descColor   = $sanitizeColor( $attributes['descColor'] ?? '' );

$tabGap      = $clampInt( $attributes['tabGap'] ?? 8, 0, 32, 8 );
$padV        = $clampInt( $attributes['tabPaddingV'] ?? 16, 8, 48, 16 );
$padH        = $clampInt( $attributes['tabPaddingH'] ?? 20, 8, 64, 20 );
$minHeight   = $clampInt( $attributes['tabMinHeight'] ?? 320, 200, 800, 320 );
$imageRadius = $clampInt( $attributes['imageRadius'] ?? 8, 0, 32, 8 );
$imageFit    = $pickFromList( $attributes['imageFit'] ?? 'contain', array( 'contain', 'cover' ), 'contain' );
$iconSize    = $clampInt( $attributes['iconSize'] ?? 20, 12, 48, 20 );
$titleSize   = $clampInt( $attributes['titleSize'] ?? 16, 12, 32, 16 );
$titleWeight = $pickFromList( (string) ( $attributes['titleWeight'] ?? '600' ), array( '400', '500', '600', '700' ), '600' );
$descSize    = $clampInt( $attributes['descSize'] ?? 13, 10, 24, 13 );
$accentBar   = $clampInt( $attributes['accentBarWidth'] ?? 3, 0, 8, 3 );
$transition  = $clampInt( $attributes['transitionDuration'] ?? 300, 0, 800, 300 );
$breakpoint  = $clampInt( $attributes['mobileBreakpoint'] ?? 640, 320, 900, 640 );

// Normalize tabs.
$rawTabs = isset( $attributes['tabs'] ) && is_array( $attributes['tabs'] ) ? $attributes['tabs'] : array();
$tabs    = array();
foreach ( $rawTabs as $tab ) {
	if ( ! is_array( $tab ) ) {
		continue;
	}
	$imageId  = isset( $tab['imageId'] ) ? absint( $tab['imageId'] ) : 0;
	$imageUrl = isset( $tab['imageUrl'] ) ? esc_url_raw( (string) $tab['imageUrl'] ) : '';
	$imageAlt = isset( $tab['imageAlt'] ) ? sanitize_text_field( (string) $tab['imageAlt'] ) : '';

	if ( $imageId > 0 && '' === $imageUrl ) {
		$resolved = wp_get_attachment_url( $imageId );
		if ( $resolved ) {
			$imageUrl = esc_url_raw( $resolved );
		}
	}
	if ( '' === $imageAlt && $imageId > 0 ) {
		$resolvedAlt = get_post_meta( $imageId, '_wp_attachment_image_alt', true );
		if ( is_string( $resolvedAlt ) ) {
			$imageAlt = sanitize_text_field( $resolvedAlt );
		}
	}

	$tabs[] = array(
		'iconClass'   => $sanitizeIcon( $tab['iconClass'] ?? '' ),
		'title'       => isset( $tab['title'] ) ? sanitize_text_field( (string) $tab['title'] ) : '',
		'description' => isset( $tab['description'] ) ? sanitize_text_field( (string) $tab['description'] ) : '',
		'imageUrl'    => $imageUrl,
		'imageAlt'    => $imageAlt,
	);

	if ( count( $tabs ) >= 10 ) {
		break;
	}
}

if ( empty( $tabs ) ) {
	return;
}

$tabCount  = count( $tabs );
$activeTab = $clampInt( $attributes['activeTab'] ?? 0, 0, $tabCount - 1, 0 );

$isReverse = 'tabs-right' === $layout;

// --- Build per-instance CSS ------------------------------------------

$sel = '#' . $id;
$css = '';

$css .= "$sel .bb-ft-inner{display:flex;flex-direction:row;gap:24px;width:100%;}";
$css .= "$sel .bb-ft-inner.is-reverse{flex-direction:row-reverse;}";

$css .= "$sel .bb-ft-tablist{display:flex;flex-direction:column;gap:{$tabGap}px;flex:0 0 {$tabPct}%;max-width:{$tabPct}%;box-sizing:border-box;";
if ( '' !== $tabBg ) {
	$css .= "background:$tabBg;border-radius:8px;padding:8px;";
}
$css .= '}';

$css .= "$sel .bb-ft-tab{position:relative;display:flex;align-items:flex-start;gap:12px;width:100%;text-align:left;border:0;background:transparent;cursor:pointer;border-radius:6px;padding:{$padV}px {$padH}px;transition:background-color .2s ease;}";
$css .= "$sel .bb-ft-tab:hover{background:rgba(0,0,0,0.04);}";
$css .= "$sel .bb-ft-tab.is-active{";
if ( '' !== $activeBg ) {
	$css .= "background:$activeBg;";
}
$css .= '}';

if ( $accentBar > 0 ) {
	$accentVal = '' !== $accentColor ? $accentColor : '#2563eb';
	$css      .= "$sel .bb-ft-tab.is-active::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:{$accentBar}px;border-radius:{$accentBar}px;background:$accentVal;}";
}

$css .= "$sel .bb-ft-tab-icon{flex:0 0 auto;line-height:1;font-size:{$iconSize}px;";
if ( '' !== $accentColor ) {
	$css .= "color:$accentColor;";
}
$css .= '}';
$css .= "$sel .bb-ft-tab-icon i{font-size:inherit;}";

$css .= "$sel .bb-ft-tab-body{display:flex;flex-direction:column;gap:2px;min-width:0;}";
$css .= "$sel .bb-ft-tab-title{font-size:{$titleSize}px;font-weight:{$titleWeight};line-height:1.3;";
if ( '' !== $titleColor ) {
	$css .= "color:$titleColor;";
}
$css .= '}';
$css .= "$sel .bb-ft-tab-desc{font-size:{$descSize}px;line-height:1.4;opacity:.85;";
if ( '' !== $descColor ) {
	$css .= "color:$descColor;opacity:1;";
}
$css .= '}';

$css .= "$sel .bb-ft-stage{position:relative;flex:0 0 {$imgPct}%;max-width:{$imgPct}%;min-height:{$minHeight}px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;border-radius:{$imageRadius}px;overflow:hidden;";
if ( '' !== $imageBg ) {
	$css .= "background:$imageBg;";
}
$css .= '}';

$css .= "$sel .bb-ft-panel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity {$transition}ms ease;}";
$css .= "$sel .bb-ft-panel.is-active{opacity:1;visibility:visible;position:relative;}";
$css .= "$sel .bb-ft-panel img{display:block;width:100%;height:100%;max-height:{$minHeight}px;object-fit:$imageFit;border-radius:{$imageRadius}px;}";
$css .= "$sel .bb-ft-panel-empty{color:rgba(0,0,0,.4);font-size:14px;padding:24px;text-align:center;}";

// Mobile accordion below the breakpoint.
$css .= "@media (max-width:{$breakpoint}px){";
$css .= "$sel .bb-ft-inner,$sel .bb-ft-inner.is-reverse{flex-direction:column;gap:0;}";
$css .= "$sel .bb-ft-tablist{flex:0 0 100%;max-width:100%;gap:0;padding:0;background:transparent;}";
$css .= "$sel .bb-ft-tab{border-bottom:1px solid rgba(0,0,0,.08);border-radius:0;}";
$css .= "$sel .bb-ft-acc-panel{overflow:hidden;max-height:0;transition:max-height {$transition}ms ease;}";
$css .= "$sel .bb-ft-acc-panel.is-open{max-height:" . ( $minHeight + 40 ) . "px;}";
$css .= "$sel .bb-ft-acc-panel .bb-ft-acc-media{padding:12px 0;}";
$css .= "$sel .bb-ft-acc-panel img{display:block;width:100%;max-height:{$minHeight}px;object-fit:$imageFit;border-radius:{$imageRadius}px;}";
$css .= "$sel .bb-ft-stage{display:none;}";
$css .= '}';
$css .= '@media (min-width:' . ( $breakpoint + 1 ) . "px){{$sel} .bb-ft-acc-panel{display:none;}}";

$css .= "@media (prefers-reduced-motion:reduce){{$sel} .bb-ft-panel,$sel .bb-ft-acc-panel{transition:none;}}";

$css .= "$sel .bb-ft-tab:focus-visible,$sel .bb-ft-panel:focus-visible{outline:2px solid " . ( '' !== $accentColor ? $accentColor : '#2563eb' ) . ";outline-offset:2px;}";

// --- Wrapper -----------------------------------------------------------

$wrapperClasses = trim( $planClass . ' bb-ft' );

$config = wp_json_encode(
	array(
		'activeTab'          => $activeTab,
		'transitionDuration' => $transition,
		'mobileBreakpoint'   => $breakpoint,
	)
);

$innerClasses = 'bb-ft-inner';
if ( $isReverse ) {
	$innerClasses .= ' is-reverse';
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( array( 'class' => $wrapperClasses ) ); ?>
	id="<?php echo esc_attr( $id ); ?>"
	data-bb-ft-config="<?php echo esc_attr( $config ); ?>"
>
	<style><?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS string, HTML stripped ?></style>

	<div class="<?php echo esc_attr( $innerClasses ); ?>">
		<div class="bb-ft-tablist" role="tablist" aria-label="<?php esc_attr_e( 'Feature tabs', 'b-blocks' ); ?>">
			<?php foreach ( $tabs as $index => $tab ) : ?>
				<?php
				$isActive = ( $index === $activeTab );
				$tabId    = $id . '-tab-' . $index;
				$panelId  = $id . '-panel-' . $index;
				?>
				<button
					type="button"
					class="bb-ft-tab<?php echo $isActive ? ' is-active' : ''; ?>"
					id="<?php echo esc_attr( $tabId ); ?>"
					role="tab"
					aria-selected="<?php echo $isActive ? 'true' : 'false'; ?>"
					aria-controls="<?php echo esc_attr( $panelId ); ?>"
					aria-expanded="<?php echo $isActive ? 'true' : 'false'; ?>"
					tabindex="<?php echo $isActive ? '0' : '-1'; ?>"
					data-index="<?php echo esc_attr( (string) $index ); ?>"
				>
					<?php if ( '' !== $tab['iconClass'] ) : ?>
						<span class="bb-ft-tab-icon" aria-hidden="true"><i class="<?php echo esc_attr( $tab['iconClass'] ); ?>"></i></span>
					<?php endif; ?>
					<span class="bb-ft-tab-body">
						<?php if ( '' !== $tab['title'] ) : ?>
							<span class="bb-ft-tab-title"><?php echo esc_html( $tab['title'] ); ?></span>
						<?php endif; ?>
						<?php if ( '' !== $tab['description'] ) : ?>
							<span class="bb-ft-tab-desc"><?php echo esc_html( $tab['description'] ); ?></span>
						<?php endif; ?>
					</span>
				</button>

				<?php // Accordion panel (mobile only — hidden above breakpoint via CSS). ?>
				<?php $accPanelId = $id . '-acc-' . $index; ?>
				<div
					class="bb-ft-acc-panel<?php echo $isActive ? ' is-open' : ''; ?>"
					id="<?php echo esc_attr( $accPanelId ); ?>"
					data-index="<?php echo esc_attr( (string) $index ); ?>"
					aria-labelledby="<?php echo esc_attr( $tabId ); ?>"
					role="region"
				>
					<div class="bb-ft-acc-media">
						<?php if ( '' !== $tab['imageUrl'] ) : ?>
							<img src="<?php echo esc_url( $tab['imageUrl'] ); ?>" alt="<?php echo esc_attr( $tab['imageAlt'] ); ?>" loading="lazy" decoding="async" />
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="bb-ft-stage">
			<?php foreach ( $tabs as $index => $tab ) : ?>
				<?php
				$isActive = ( $index === $activeTab );
				$tabId    = $id . '-tab-' . $index;
				$panelId  = $id . '-panel-' . $index;
				?>
				<div
					class="bb-ft-panel<?php echo $isActive ? ' is-active' : ''; ?>"
					id="<?php echo esc_attr( $panelId ); ?>"
					role="tabpanel"
					aria-labelledby="<?php echo esc_attr( $tabId ); ?>"
					tabindex="0"
					data-index="<?php echo esc_attr( (string) $index ); ?>"
					<?php
					if ( ! $isActive ) {
						echo 'hidden aria-hidden="true"';
					}
					?>
				>
					<?php if ( '' !== $tab['imageUrl'] ) : ?>
						<img src="<?php echo esc_url( $tab['imageUrl'] ); ?>" alt="<?php echo esc_attr( $tab['imageAlt'] ); ?>" loading="lazy" decoding="async" />
					<?php else : ?>
						<span class="bb-ft-panel-empty"><?php esc_html_e( 'No image set for this feature.', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
