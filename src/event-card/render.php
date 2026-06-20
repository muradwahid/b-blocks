<?php
/**
 * Event Card block server-side render.
 *
 * Renders a single event announcement card (title, date/time, location,
 * description, organizer, ticket CTA). When `showSchema` is true and the
 * data is minimally valid, appends a JSON-LD `Event` schema block so the
 * page is eligible for Google rich results.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as faq-block, howto-schema, review-box).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksEventCard';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, var(), or named) ---
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

// --- Sanitize a length-style value (e.g. "8px", "24px", "1rem", "100%") ---
$sanitizeLength = static function ( $value, $fallback = '0px' ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( preg_match( '/^-?\d+(\.\d+)?(px|em|rem|%|vh|vw)?$/', $value ) ) {
		return $value;
	}
	return $fallback;
};

// --- Validate ISO 8601 date (YYYY-MM-DD), confirm a real calendar date -----
$validDate = static function ( $value ) {
	$value = trim( (string) $value );
	if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $value, $m ) ) {
		return '';
	}
	if ( ! checkdate( (int) $m[2], (int) $m[3], (int) $m[1] ) ) {
		return '';
	}
	return $value;
};

// --- Validate a 24-hour time (HH:MM), normalize to zero-padded -------------
$validTime = static function ( $value ) {
	$value = trim( (string) $value );
	if ( ! preg_match( '/^(\d{1,2}):(\d{2})$/', $value, $m ) ) {
		return '';
	}
	$h = (int) $m[1];
	$min = (int) $m[2];
	if ( $h > 23 || $min > 59 ) {
		return '';
	}
	return sprintf( '%02d:%02d', $h, $min );
};

// --- Build an ISO 8601 datetime string with timezone offset ----------------
$buildIso = static function ( $date, $time, $tz ) {
	if ( '' === $date ) {
		return '';
	}
	$timePart = '' !== $time ? $time . ':00' : '00:00:00';
	$offset   = '';
	try {
		$tzObj    = new DateTimeZone( $tz );
		$dtString = $date . 'T' . $timePart;
		$dt       = new DateTime( $dtString, $tzObj );
		$offset   = $dt->format( 'P' );
	} catch ( Exception $e ) {
		$offset = '';
	}
	return $date . 'T' . $timePart . $offset;
};

// --- List of valid schema.org eventStatus values ---------------------------
$validStatuses = [ 'EventScheduled', 'EventCancelled', 'EventPostponed', 'EventMovedOnline' ];

// --- Resolve and sanitize attributes ---------------------------------------
$eventName        = isset( $attributes['eventName'] ) ? sanitize_text_field( (string) $attributes['eventName'] ) : '';
$eventDescription = isset( $attributes['eventDescription'] ) ? (string) $attributes['eventDescription'] : '';
$startDate        = $validDate( $attributes['startDate'] ?? '' );
$startTime        = $validTime( $attributes['startTime'] ?? '' );
$endDate          = $validDate( $attributes['endDate'] ?? '' );
$endTime          = $validTime( $attributes['endTime'] ?? '' );

$timezone = isset( $attributes['timezone'] ) ? trim( (string) $attributes['timezone'] ) : 'UTC';
if ( ! in_array( $timezone, timezone_identifiers_list(), true ) && 'UTC' !== $timezone ) {
	$timezone = 'UTC';
}

$venueName    = isset( $attributes['venueName'] ) ? sanitize_text_field( (string) $attributes['venueName'] ) : '';
$venueAddress = isset( $attributes['venueAddress'] ) ? sanitize_text_field( (string) $attributes['venueAddress'] ) : '';
$venueCity    = isset( $attributes['venueCity'] ) ? sanitize_text_field( (string) $attributes['venueCity'] ) : '';
$venueCountry = isset( $attributes['venueCountry'] ) ? sanitize_text_field( (string) $attributes['venueCountry'] ) : '';

$isVirtual  = ! empty( $attributes['isVirtual'] );
$virtualUrl = isset( $attributes['virtualUrl'] ) ? esc_url_raw( (string) $attributes['virtualUrl'] ) : '';

$organizerName = isset( $attributes['organizerName'] ) ? sanitize_text_field( (string) $attributes['organizerName'] ) : '';
$organizerUrl  = isset( $attributes['organizerUrl'] ) ? esc_url_raw( (string) $attributes['organizerUrl'] ) : '';

$eventStatus = isset( $attributes['eventStatus'] ) ? (string) $attributes['eventStatus'] : 'EventScheduled';
$eventStatus = in_array( $eventStatus, $validStatuses, true ) ? $eventStatus : 'EventScheduled';

$ctaLabel  = isset( $attributes['ctaLabel'] ) ? sanitize_text_field( (string) $attributes['ctaLabel'] ) : '';
$ctaUrl    = isset( $attributes['ctaUrl'] ) ? esc_url_raw( (string) $attributes['ctaUrl'] ) : '';
$ctaNewTab = ! empty( $attributes['ctaNewTab'] );

$showSchema    = ! empty( $attributes['showSchema'] );
$showDateBadge = ! empty( $attributes['showDateBadge'] );
$showOrganizer = ! empty( $attributes['showOrganizer'] );

$cardStyle = isset( $attributes['cardStyle'] ) ? sanitize_key( (string) $attributes['cardStyle'] ) : 'default';
$cardStyle = in_array( $cardStyle, [ 'default', 'outlined', 'flat' ], true ) ? $cardStyle : 'default';

$titleTag = isset( $attributes['titleTag'] ) ? sanitize_key( (string) $attributes['titleTag'] ) : 'h3';
$titleTag = in_array( $titleTag, [ 'h2', 'h3', 'h4' ], true ) ? $titleTag : 'h3';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'left';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'left';

$titleFontWeight = isset( $attributes['titleFontWeight'] ) ? (string) $attributes['titleFontWeight'] : '700';
$titleFontWeight = in_array( $titleFontWeight, [ '400', '500', '600', '700', '800' ], true ) ? $titleFontWeight : '700';

// Colors.
$accentColor  = $sanitizeColor( $attributes['accentColor'] ?? '', '#146EF5' );
$cardBg       = $sanitizeColor( $attributes['cardBg'] ?? '', '#ffffff' );
$textColor    = $sanitizeColor( $attributes['textColor'] ?? '', '#1a1a1a' );
$mutedColor   = $sanitizeColor( $attributes['mutedColor'] ?? '', '#6b7280' );
$ctaBg        = $sanitizeColor( $attributes['ctaBg'] ?? '', '#146EF5' );
$ctaTextColor = $sanitizeColor( $attributes['ctaTextColor'] ?? '', '#ffffff' );
$ctaHoverBg   = $sanitizeColor( $attributes['ctaHoverBg'] ?? '', '#0040E3' );

// Numeric values (clamped).
$borderRadius    = isset( $attributes['borderRadius'] ) ? max( 0, min( 48, (int) $attributes['borderRadius'] ) ) : 8;
$ctaBorderRadius = isset( $attributes['ctaBorderRadius'] ) ? max( 0, min( 48, (int) $attributes['ctaBorderRadius'] ) ) : 6;

// Font sizes (length strings).
$titleFontSize = $sanitizeLength( $attributes['titleFontSize'] ?? '', '22px' );
$metaFontSize  = $sanitizeLength( $attributes['metaFontSize'] ?? '', '14px' );
$descFontSize  = $sanitizeLength( $attributes['descFontSize'] ?? '', '15px' );
$ctaFontSize   = $sanitizeLength( $attributes['ctaFontSize'] ?? '', '15px' );
$maxWidth      = $sanitizeLength( $attributes['maxWidth'] ?? '', '640px' );

// Padding object.
$padAttr = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : [];
$pad     = [
	'top'    => $sanitizeLength( $padAttr['top'] ?? '', '24px' ),
	'right'  => $sanitizeLength( $padAttr['right'] ?? '', '28px' ),
	'bottom' => $sanitizeLength( $padAttr['bottom'] ?? '', '24px' ),
	'left'   => $sanitizeLength( $padAttr['left'] ?? '', '28px' ),
];

// --- Build ISO datetimes for display + schema ------------------------------
$startIso = $buildIso( $startDate, $startTime, $timezone );
$endIso   = $buildIso( $endDate, $endTime, $timezone );

// --- Human-readable date/time labels ---------------------------------------
$dateFormat = get_option( 'date_format', 'F j, Y' );
$timeFormat = get_option( 'time_format', 'g:i a' );

$badgeMonth = '';
$badgeDay   = '';
$startLabel = '';
$endLabel   = '';

if ( '' !== $startDate ) {
	$startTs = strtotime( $startDate . ( '' !== $startTime ? ' ' . $startTime : ' 00:00' ) );
	if ( false !== $startTs ) {
		$badgeMonth = wp_date( 'M', $startTs );
		$badgeDay   = wp_date( 'j', $startTs );
		$startLabel = wp_date( $dateFormat, $startTs );
		if ( '' !== $startTime ) {
			$startLabel .= ' · ' . wp_date( $timeFormat, $startTs );
		}
	}
}
if ( '' !== $endDate ) {
	$endTs = strtotime( $endDate . ( '' !== $endTime ? ' ' . $endTime : ' 00:00' ) );
	if ( false !== $endTs ) {
		$endLabel = wp_date( $dateFormat, $endTs );
		if ( '' !== $endTime ) {
			$endLabel .= ' · ' . wp_date( $timeFormat, $endTs );
		}
	}
}

// --- Location label --------------------------------------------------------
$locationParts = [];
if ( $isVirtual ) {
	$locationLabel = __( 'Online / Virtual', 'b-blocks' );
} else {
	if ( '' !== $venueName ) {
		$locationParts[] = $venueName;
	}
	if ( '' !== $venueAddress ) {
		$locationParts[] = $venueAddress;
	}
	if ( '' !== $venueCity ) {
		$locationParts[] = $venueCity;
	}
	$locationLabel = implode( ', ', $locationParts );
}

// --- Status badge label ----------------------------------------------------
$statusLabel = '';
$statusClass = '';
if ( 'EventCancelled' === $eventStatus ) {
	$statusLabel = __( 'Cancelled', 'b-blocks' );
	$statusClass = 'is-cancelled';
} elseif ( 'EventPostponed' === $eventStatus ) {
	$statusLabel = __( 'Postponed', 'b-blocks' );
	$statusClass = 'is-postponed';
} elseif ( 'EventMovedOnline' === $eventStatus ) {
	$statusLabel = __( 'Moved Online', 'b-blocks' );
	$statusClass = 'is-moved-online';
}

// --- Wrapper classes & CSS variables ---------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-event-card'
	. ' bb-event-card--' . $cardStyle
	. ' bb-event-card--align-' . $alignment
	. ( $isVirtual ? ' is-virtual' : '' )
	. ( '' !== $statusClass ? ' ' . $statusClass : '' )
);

$wrapperStyleParts = [
	'--bb-ec-accent:' . $accentColor,
	'--bb-ec-bg:' . $cardBg,
	'--bb-ec-text:' . $textColor,
	'--bb-ec-muted:' . $mutedColor,
	'--bb-ec-cta-bg:' . $ctaBg,
	'--bb-ec-cta-text:' . $ctaTextColor,
	'--bb-ec-cta-hover-bg:' . $ctaHoverBg,
	'--bb-ec-radius:' . $borderRadius . 'px',
	'--bb-ec-cta-radius:' . $ctaBorderRadius . 'px',
	'--bb-ec-padding:' . $pad['top'] . ' ' . $pad['right'] . ' ' . $pad['bottom'] . ' ' . $pad['left'],
	'--bb-ec-max-width:' . ( '0px' === $maxWidth ? '100%' : $maxWidth ),
	'--bb-ec-title-size:' . $titleFontSize,
	'--bb-ec-title-weight:' . $titleFontWeight,
	'--bb-ec-meta-size:' . $metaFontSize,
	'--bb-ec-desc-size:' . $descFontSize,
	'--bb-ec-cta-size:' . $ctaFontSize,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

// --- CTA rel attribute -----------------------------------------------------
$relAttr = $ctaNewTab ? 'noopener noreferrer' : '';

$headingId = $id . '-title';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<article class='<?php echo esc_attr( $prefix ); ?> bb-event-card__inner' aria-labelledby='<?php echo esc_attr( $headingId ); ?>'>
		<div class='bb-event-card__header'>
			<?php if ( $showDateBadge && '' !== $badgeDay ) : ?>
				<div class='bb-event-card__badge' aria-hidden='true'>
					<span class='bb-event-card__badge-month'><?php echo esc_html( $badgeMonth ); ?></span>
					<span class='bb-event-card__badge-day'><?php echo esc_html( $badgeDay ); ?></span>
				</div>
			<?php endif; ?>

			<div class='bb-event-card__heading'>
				<<?php echo tag_escape( $titleTag ); ?> id='<?php echo esc_attr( $headingId ); ?>' class='bb-event-card__title'>
					<?php echo esc_html( '' !== $eventName ? $eventName : __( 'Event Name', 'b-blocks' ) ); ?>
					<?php if ( '' !== $statusLabel ) : ?>
						<span
							class='bb-event-card__status'
							aria-label='<?php
								/* translators: %s: event status, e.g. Cancelled */
								echo esc_attr( sprintf( __( 'Event status: %s', 'b-blocks' ), $statusLabel ) );
							?>'
						><?php echo esc_html( $statusLabel ); ?></span>
					<?php endif; ?>
				</<?php echo tag_escape( $titleTag ); ?>>

				<?php if ( '' !== $startIso ) : ?>
					<p class='bb-event-card__meta bb-event-card__meta--date'>
						<svg class='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7v10H5V9h14Z'/></svg>
						<time datetime='<?php echo esc_attr( $startIso ); ?>'><?php echo esc_html( $startLabel ); ?></time>
						<?php if ( '' !== $endIso && '' !== $endLabel ) : ?>
							<span class='bb-event-card__dash' aria-hidden='true'> – </span>
							<time datetime='<?php echo esc_attr( $endIso ); ?>'><?php echo esc_html( $endLabel ); ?></time>
						<?php endif; ?>
					</p>
				<?php endif; ?>
			</div>
		</div>

		<?php if ( '' !== $locationLabel ) : ?>
			<address class='bb-event-card__meta bb-event-card__meta--location'>
				<svg class='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z'/></svg>
				<?php if ( $isVirtual && '' !== $virtualUrl ) : ?>
					<a href='<?php echo esc_url( $virtualUrl ); ?>' rel='noopener noreferrer' target='_blank'>
						<?php echo esc_html( $locationLabel ); ?>
						<span class='screen-reader-text'> <?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
					</a>
				<?php else : ?>
					<?php echo esc_html( $locationLabel ); ?>
				<?php endif; ?>
				<?php if ( ! $isVirtual && '' !== $venueCountry ) : ?>
					<span class='bb-event-card__country'><?php echo esc_html( $venueCountry ); ?></span>
				<?php endif; ?>
			</address>
		<?php endif; ?>

		<?php if ( $showOrganizer && '' !== $organizerName ) : ?>
			<p class='bb-event-card__meta bb-event-card__meta--organizer'>
				<svg class='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z'/></svg>
				<span class='bb-event-card__organizer-label'><?php esc_html_e( 'By', 'b-blocks' ); ?></span>
				<?php if ( '' !== $organizerUrl ) : ?>
					<a href='<?php echo esc_url( $organizerUrl ); ?>' rel='noopener'><?php echo esc_html( $organizerName ); ?></a>
				<?php else : ?>
					<?php echo esc_html( $organizerName ); ?>
				<?php endif; ?>
			</p>
		<?php endif; ?>

		<?php if ( '' !== trim( wp_strip_all_tags( $eventDescription ) ) ) : ?>
			<div class='bb-event-card__description'>
				<?php echo wp_kses_post( $eventDescription ); ?>
			</div>
		<?php endif; ?>

		<?php if ( '' !== $ctaLabel && '' !== $ctaUrl ) : ?>
			<div class='bb-event-card__cta'>
				<a
					class='bb-event-card__btn'
					href='<?php echo esc_url( $ctaUrl ); ?>'
					<?php if ( $ctaNewTab ) : ?>target='_blank'<?php endif; ?>
					<?php if ( '' !== $relAttr ) : ?>rel='<?php echo esc_attr( $relAttr ); ?>'<?php endif; ?>
				>
					<?php echo esc_html( $ctaLabel ); ?>
					<?php if ( $ctaNewTab ) : ?>
						<span class='screen-reader-text'> <?php esc_html_e( '(opens in a new tab)', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
	</article>

	<?php
	// ---------------------------------------------------------------
	// JSON-LD Event schema output. Only emit when:
	//   - showSchema is true
	//   - eventName is non-empty (Google requires `name`)
	//   - startDate resolves to a valid ISO 8601 string (required)
	//   - A physical location OR a virtual URL is available
	// Every value is sanitized before encoding. JSON_HEX_TAG ensures a
	// stray "</script>" inside user content cannot break out of the
	// <script type="application/ld+json"> block.
	// ---------------------------------------------------------------
	$schemaName = wp_strip_all_tags( $eventName );

	$hasLocation = $isVirtual ? ( '' !== $virtualUrl ) : ( '' !== $venueName || '' !== $venueCity || '' !== $venueAddress );

	$canEmitSchema = ( $showSchema && '' !== trim( $schemaName ) && '' !== $startIso && $hasLocation );

	if ( $canEmitSchema ) :
		$schema = [
			'@context'  => 'https://schema.org',
			'@type'     => 'Event',
			'name'      => $schemaName,
			'startDate' => $startIso,
		];

		if ( '' !== $endIso ) {
			$schema['endDate'] = $endIso;
		}

		$schema['eventStatus'] = 'https://schema.org/' . $eventStatus;

		$schema['eventAttendanceMode'] = $isVirtual
			? 'https://schema.org/OnlineEventAttendanceMode'
			: 'https://schema.org/OfflineEventAttendanceMode';

		$descClean = wp_strip_all_tags( $eventDescription );
		$descClean = trim( $descClean );
		if ( '' !== $descClean ) {
			$schema['description'] = $descClean;
		}

		if ( $isVirtual ) {
			$schema['location'] = [
				'@type' => 'VirtualLocation',
				'url'   => $virtualUrl,
			];
		} else {
			$placeNode = [ '@type' => 'Place' ];
			if ( '' !== $venueName ) {
				$placeNode['name'] = $venueName;
			}
			$addressNode = [ '@type' => 'PostalAddress' ];
			if ( '' !== $venueAddress ) {
				$addressNode['streetAddress'] = $venueAddress;
			}
			if ( '' !== $venueCity ) {
				$addressNode['addressLocality'] = $venueCity;
			}
			if ( '' !== $venueCountry ) {
				$addressNode['addressCountry'] = $venueCountry;
			}
			if ( count( $addressNode ) > 1 ) {
				$placeNode['address'] = $addressNode;
			}
			$schema['location'] = $placeNode;
		}

		if ( '' !== $organizerName ) {
			$organizerNode = [
				'@type' => 'Organization',
				'name'  => $organizerName,
			];
			if ( '' !== $organizerUrl ) {
				$organizerNode['url'] = $organizerUrl;
			}
			$schema['organizer'] = $organizerNode;
		}

		if ( '' !== $ctaUrl ) {
			$schema['offers'] = [
				'@type' => 'Offer',
				'url'   => $ctaUrl,
			];
		}

		// JSON_HEX_TAG encodes < and > so user content containing
		// "</script>" cannot break out of the script block. The spec asks
		// for UNESCAPED_SLASHES + UNESCAPED_UNICODE for clean URLs/unicode.
		$jsonLd = wp_json_encode( $schema, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

		if ( false !== $jsonLd ) :
			?>
			<script type='application/ld+json'><?php echo $jsonLd; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output is safe within a JSON-LD script tag ?></script>
			<?php
		endif;
	endif;
	?>
</div>
