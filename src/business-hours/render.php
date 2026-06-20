<?php
/**
 * Business Hours block server-side render.
 *
 * Renders a weekly opening-hours schedule as a semantic <dl>/<dt>/<dd>
 * list. Optionally renders a live "Open Now" / "Closed" badge that is
 * pre-computed server-side (so the correct state appears before view.js
 * runs) and refreshed client-side every 60s by view.js.
 *
 * The IANA timezone is allowlist-validated against PHP's
 * DateTimeZone::listIdentifiers(). The day rows are sanitized one by one
 * — invalid time strings become empty, the day name is escaped.
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as google-map, howto-schema).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksBusinessHours';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitizers --------------------------------------------------------

$sanitizeColor = static function ( $color, $fallback ) {
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

// Validate an IANA timezone string against PHP's known list.
$sanitizeTimezone = static function ( $value, $fallback = 'UTC' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( in_array( $value, timezone_identifiers_list(), true ) ) {
		return $value;
	}
	return $fallback;
};

// Parse and validate a 24-hour HH:MM string; return empty string when
// invalid so the row can be flagged accordingly.
$sanitizeHhmm = static function ( $value ) {
	$value = trim( (string) $value );
	if ( ! preg_match( '/^(\d{1,2}):(\d{2})$/', $value, $m ) ) {
		return '';
	}
	$h = (int) $m[1];
	$mi = (int) $m[2];
	if ( $h < 0 || $h > 23 || $mi < 0 || $mi > 59 ) {
		return '';
	}
	return sprintf( '%02d:%02d', $h, $mi );
};

// Format an HH:MM string per the 12h/24h preference.
$formatTime = static function ( $hhmm, $format ) {
	if ( '' === $hhmm ) {
		return '';
	}
	$parts = explode( ':', $hhmm );
	$h = (int) $parts[0];
	$m = (int) $parts[1];
	if ( '24h' === $format ) {
		return sprintf( '%02d:%02d', $h, $m );
	}
	$suffix = $h >= 12 ? 'PM' : 'AM';
	$h12 = $h % 12;
	if ( 0 === $h12 ) {
		$h12 = 12;
	}
	return sprintf( '%d:%02d %s', $h12, $m, $suffix );
};

// --- Pull and clamp attributes ----------------------------------------

$titleRaw       = isset( $attributes['title'] ) ? (string) $attributes['title'] : '';
$titleText      = sanitize_text_field( $titleRaw );
$titleTag       = isset( $attributes['titleTag'] ) ? sanitize_key( $attributes['titleTag'] ) : 'h3';
$titleTag       = in_array( $titleTag, [ 'h2', 'h3', 'h4', 'h5', 'h6' ], true ) ? $titleTag : 'h3';

$timezone       = $sanitizeTimezone( $attributes['timezone'] ?? 'UTC', 'UTC' );
$timeFormat     = isset( $attributes['timeFormat'] ) ? (string) $attributes['timeFormat'] : '12h';
$timeFormat     = in_array( $timeFormat, [ '12h', '24h' ], true ) ? $timeFormat : '12h';

$showBadge      = isset( $attributes['showBadge'] ) ? (bool) $attributes['showBadge'] : true;
$openLabel      = sanitize_text_field( $attributes['openLabel'] ?? __( 'Open Now', 'b-blocks' ) );
$closedLabel    = sanitize_text_field( $attributes['closedLabel'] ?? __( 'Closed', 'b-blocks' ) );
$closedText     = sanitize_text_field( $attributes['closedText'] ?? __( 'Closed', 'b-blocks' ) );

$highlightToday = isset( $attributes['highlightToday'] ) ? (bool) $attributes['highlightToday'] : true;
$showClosedDays = isset( $attributes['showClosedDays'] ) ? (bool) $attributes['showClosedDays'] : true;
$separatorShow  = isset( $attributes['separatorShow'] ) ? (bool) $attributes['separatorShow'] : true;

$badgeOpenBg    = $sanitizeColor( $attributes['badgeOpenBg'] ?? '', '#22c55e' );
$badgeClosedBg  = $sanitizeColor( $attributes['badgeClosedBg'] ?? '', '#ef4444' );
$badgeTextColor = $sanitizeColor( $attributes['badgeTextColor'] ?? '', '#ffffff' );
$titleColor     = $sanitizeColor( $attributes['titleColor'] ?? '', '#111827' );
$headerBg       = $sanitizeColor( $attributes['headerBg'] ?? '', '' );
$rowBg          = $sanitizeColor( $attributes['rowBg'] ?? '', '' );
$rowBgAlt       = $sanitizeColor( $attributes['rowBgAlt'] ?? '', '' );
$todayBg        = $sanitizeColor( $attributes['todayBg'] ?? '', '#eff6ff' );
$dayColor       = $sanitizeColor( $attributes['dayColor'] ?? '', '#111827' );
$timeColor      = $sanitizeColor( $attributes['timeColor'] ?? '', '#374151' );
$separatorColor = $sanitizeColor( $attributes['separatorColor'] ?? '', '#e5e7eb' );

$borderRadius   = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 8;
$borderRadius   = max( 0, min( 64, $borderRadius ) );

$paddingRaw     = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$padTop         = isset( $paddingRaw['top'] ) ? max( 0, min( 96, (int) $paddingRaw['top'] ) ) : 16;
$padRight       = isset( $paddingRaw['right'] ) ? max( 0, min( 96, (int) $paddingRaw['right'] ) ) : 16;
$padBottom      = isset( $paddingRaw['bottom'] ) ? max( 0, min( 96, (int) $paddingRaw['bottom'] ) ) : 16;
$padLeft        = isset( $paddingRaw['left'] ) ? max( 0, min( 96, (int) $paddingRaw['left'] ) ) : 16;

// --- Sanitize the days array ------------------------------------------

$defaultDayNames = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
$daysIn          = isset( $attributes['days'] ) && is_array( $attributes['days'] ) ? $attributes['days'] : [];

$days = [];
for ( $i = 0; $i < 7; $i++ ) {
	$src = isset( $daysIn[ $i ] ) && is_array( $daysIn[ $i ] ) ? $daysIn[ $i ] : [];
	$days[] = [
		'day'      => sanitize_text_field( $src['day'] ?? $defaultDayNames[ $i ] ),
		'open'     => isset( $src['open'] ) ? (bool) $src['open'] : false,
		'timeFrom' => $sanitizeHhmm( $src['timeFrom'] ?? '' ),
		'timeTo'   => $sanitizeHhmm( $src['timeTo'] ?? '' ),
	];
}

// --- Compute current state in the configured timezone -----------------
// Compute today's day-of-week (0=Sunday) and current HH:MM in the
// configured timezone so the server-rendered badge reflects the correct
// state before view.js takes over.

try {
	$tz  = new DateTimeZone( $timezone );
	$now = new DateTimeImmutable( 'now', $tz );
} catch ( Exception $e ) {
	$tz  = new DateTimeZone( 'UTC' );
	$now = new DateTimeImmutable( 'now', $tz );
}

// PHP date('w'): 0 = Sunday … 6 = Saturday.
$currentDow = (int) $now->format( 'w' );
$currentHm  = (int) $now->format( 'H' ) * 60 + (int) $now->format( 'i' );

// Our `days` array is ordered Mon…Sun; map JS-style 0=Sunday index for the wrapper.
$todayIndex = $currentDow; // 0..6, Sunday=0.

// Find the entry in $days matching today (Mon..Sun ordering).
// Mon=0 in our array → JS dow 1; Sun=6 → JS dow 0.
$todayArrayIdx = ( 0 === $currentDow ) ? 6 : $currentDow - 1;

$isOpenNow = false;
if ( $showBadge ) {
	$today = $days[ $todayArrayIdx ];
	if ( $today['open'] && '' !== $today['timeFrom'] && '' !== $today['timeTo'] ) {
		$fromParts = explode( ':', $today['timeFrom'] );
		$toParts   = explode( ':', $today['timeTo'] );
		$fromMin   = (int) $fromParts[0] * 60 + (int) $fromParts[1];
		$toMin     = (int) $toParts[0] * 60 + (int) $toParts[1];
		if ( $toMin > $fromMin ) {
			$isOpenNow = ( $currentHm >= $fromMin && $currentHm < $toMin );
		} elseif ( $toMin < $fromMin ) {
			// Overnight window (e.g. 22:00–02:00).
			$isOpenNow = ( $currentHm >= $fromMin || $currentHm < $toMin );
		}
	}
}

// --- Build per-instance CSS -------------------------------------------

$css  = "#$id { display: block; }";
$css .= "#$id .bb-bh-wrapper { padding: {$padTop}px {$padRight}px {$padBottom}px {$padLeft}px; border-radius: {$borderRadius}px; }";

if ( '' !== $titleColor ) {
	$css .= "#$id .bb-bh-title { color: $titleColor; }";
}
$css .= "#$id .bb-bh-list { margin: 0; padding: 0; }";
$css .= "#$id .bb-bh-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 12px; }";

if ( '' !== $headerBg ) {
	$css .= "#$id .bb-bh-day { background-color: $headerBg; }";
}
if ( '' !== $rowBg ) {
	$css .= "#$id .bb-bh-row { background-color: $rowBg; }";
}
if ( '' !== $rowBgAlt ) {
	$css .= "#$id .bb-bh-row.is-alt { background-color: $rowBgAlt; }";
}
if ( $separatorShow ) {
	$css .= "#$id .bb-bh-row + .bb-bh-row { border-top: 1px solid $separatorColor; }";
}
if ( $highlightToday ) {
	$css .= "#$id .bb-bh-row.is-today { background-color: $todayBg; font-weight: 600; }";
}
$css .= "#$id .bb-bh-day { color: $dayColor; font-weight: 500; margin: 0; }";
$css .= "#$id .bb-bh-time { color: $timeColor; margin: 0; }";
$css .= "#$id .bb-bh-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: $badgeTextColor; line-height: 1.4; }";
$css .= "#$id .bb-bh-badge.is-open { background-color: $badgeOpenBg; }";
$css .= "#$id .bb-bh-badge.is-closed { background-color: $badgeClosedBg; }";
$css .= "#$id .bb-bh-badges { margin: 0 0 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }";
$css .= "#$id .bb-bh-badge[hidden] { display: none; }";
$css .= "#$id .bb-bh-badge .bb-bh-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.85; flex: 0 0 auto; }";

// --- Build a data-attribute payload for view.js -----------------------

$schedulePayload = [];
foreach ( $days as $d ) {
	$schedulePayload[] = [
		'open'     => $d['open'],
		'timeFrom' => $d['timeFrom'],
		'timeTo'   => $d['timeTo'],
	];
}

$wrapperLabel = '' !== $titleText ? $titleText : __( 'Business Hours', 'b-blocks' );

$viewStyleRaw = isset( $attributes['viewStyle'] ) ? strtolower( trim( (string) $attributes['viewStyle'] ) ) : 'default';
$viewStyle    = in_array( $viewStyleRaw, [ 'default', 'minimal', 'card', 'split', 'dark', 'timeline' ], true ) ? $viewStyleRaw : 'default';

$wrapperClasses = trim( $planClass . ' bb-business-hours bb-bh-view--' . $viewStyle );

?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-timezone='<?php echo esc_attr( $timezone ); ?>'
	data-time-format='<?php echo esc_attr( $timeFormat ); ?>'
	data-show-badge='<?php echo $showBadge ? 'true' : 'false'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- boolean literal, not user input. ?>'
	data-highlight-today='<?php echo $highlightToday ? 'true' : 'false'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- boolean literal, not user input. ?>'
	data-open-label='<?php echo esc_attr( $openLabel ); ?>'
	data-closed-label='<?php echo esc_attr( $closedLabel ); ?>'
	data-schedule='<?php echo esc_attr( wp_json_encode( $schedulePayload ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, stripped of any HTML tags. ?>
	</style>

	<section class='bb-bh-wrapper' aria-label='<?php echo esc_attr( $wrapperLabel ); ?>'>
		<?php if ( '' !== $titleText ) : ?>
			<?php
			$titleTagSafe = $titleTag;
			printf(
				'<%1$s class="bb-bh-title">%2$s</%1$s>',
				esc_html( $titleTagSafe ),
				esc_html( $titleText )
			);
			?>
		<?php endif; ?>

		<?php if ( $showBadge ) : ?>
			<div class='bb-bh-badges'>
				<span
					class='bb-bh-badge is-open'
					data-badge='open'
					role='status'
					aria-live='polite'
					<?php echo $isOpenNow ? '' : 'hidden'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded attribute keyword, not user input. ?>
					<?php echo $isOpenNow ? '' : "aria-hidden='true'"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded attribute string, not user input. ?>
				>
					<span class='bb-bh-dot' aria-hidden='true'></span>
					<span class='bb-bh-badge-text'><?php echo esc_html( $openLabel ); ?></span>
				</span>
				<span
					class='bb-bh-badge is-closed'
					data-badge='closed'
					role='status'
					aria-live='polite'
					<?php echo ! $isOpenNow ? '' : 'hidden'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded attribute keyword, not user input. ?>
					<?php echo ! $isOpenNow ? '' : "aria-hidden='true'"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- hardcoded attribute string, not user input. ?>
				>
					<span class='bb-bh-dot' aria-hidden='true'></span>
					<span class='bb-bh-badge-text'><?php echo esc_html( $closedLabel ); ?></span>
				</span>
			</div>
		<?php endif; ?>

		<dl class='bb-bh-list'>
			<?php
			$rowIdx = 0;
			foreach ( $days as $i => $d ) {
				$isClosed = ! $d['open'] || '' === $d['timeFrom'] || '' === $d['timeTo'];
				if ( $isClosed && ! $showClosedDays ) {
					continue;
				}

				// Map our Mon..Sun array index back to JS-style day-of-week (0=Sun..6=Sat).
				$jsDow = ( 6 === $i ) ? 0 : $i + 1;

				$rowClasses = [ 'bb-bh-row' ];
				if ( 1 === $rowIdx % 2 ) {
					$rowClasses[] = 'is-alt';
				}
				$isToday = $highlightToday && ( $jsDow === $todayIndex );
				if ( $isToday ) {
					$rowClasses[] = 'is-today';
				}

				$timeText = $isClosed
					? $closedText
					: trim( $formatTime( $d['timeFrom'], $timeFormat ) . ' – ' . $formatTime( $d['timeTo'], $timeFormat ) );

				$rowAttrs  = ' class="' . esc_attr( implode( ' ', $rowClasses ) ) . '"';
				$rowAttrs .= ' data-day-index="' . esc_attr( (string) $jsDow ) . '"';
				if ( $isToday ) {
					$rowAttrs .= ' data-today="1" aria-current="true"';
				}
				?>
				<div<?php echo $rowAttrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- composed of escaped values above. ?>>
					<dt class='bb-bh-day'><?php echo esc_html( $d['day'] ); ?></dt>
					<dd class='bb-bh-time'><?php echo esc_html( $timeText ); ?></dd>
				</div>
				<?php
				$rowIdx++;
			}
			?>
		</dl>
	</section>
</div>
