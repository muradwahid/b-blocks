<?php
/**
 * HowTo Schema Block server-side render.
 *
 * Renders an ordered list of steps with optional badge numbering and a
 * connector line. When `enableSchema` is true and the data is minimally
 * valid, appends a JSON-LD `HowTo` schema block so the page is eligible
 * for Google rich results.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as faq-block, off-canvas, review-box).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksHowtoSchema';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named) -----
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

// --- Validate an ISO 8601 duration string (P[n]DT[n]H[n]M[n]S) ---------
$isValidIsoDuration = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return false;
	}
	return (bool) preg_match( '/^P(?!$)(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/', $value );
};

// --- Convert an ISO 8601 duration to a human-readable label ------------
$humanizeIsoDuration = static function ( $value ) use ( $isValidIsoDuration ) {
	if ( ! $isValidIsoDuration( $value ) ) {
		return '';
	}
	$days    = 0;
	$hours   = 0;
	$minutes = 0;
	$seconds = 0;
	if ( preg_match( '/(\d+)D/', $value, $m ) ) {
		$days = (int) $m[1];
	}
	if ( preg_match( '/T.*?(\d+)H/', $value, $m ) ) {
		$hours = (int) $m[1];
	}
	if ( preg_match( '/T.*?(?:\d+H)?(\d+)M/', $value, $m ) ) {
		$minutes = (int) $m[1];
	}
	if ( preg_match( '/T.*?(?:\d+H)?(?:\d+M)?(\d+)S/', $value, $m ) ) {
		$seconds = (int) $m[1];
	}
	$parts = [];
	if ( $days > 0 ) {
		/* translators: %d: number of days */
		$parts[] = sprintf( _n( '%d day', '%d days', $days, 'b-blocks' ), $days );
	}
	if ( $hours > 0 ) {
		/* translators: %d: number of hours */
		$parts[] = sprintf( _n( '%d hr', '%d hrs', $hours, 'b-blocks' ), $hours );
	}
	if ( $minutes > 0 ) {
		/* translators: %d: number of minutes */
		$parts[] = sprintf( _n( '%d min', '%d min', $minutes, 'b-blocks' ), $minutes );
	}
	if ( $seconds > 0 ) {
		/* translators: %d: number of seconds */
		$parts[] = sprintf( _n( '%d sec', '%d sec', $seconds, 'b-blocks' ), $seconds );
	}
	return implode( ' ', $parts );
};

// --- Resolve and sanitize attributes -----------------------------------
$steps         = ( isset( $attributes['steps'] ) && is_array( $attributes['steps'] ) ) ? $attributes['steps'] : [];
$supplyAttr    = ( isset( $attributes['supply'] ) && is_array( $attributes['supply'] ) ) ? $attributes['supply'] : [];
$toolAttr      = ( isset( $attributes['tool'] ) && is_array( $attributes['tool'] ) ) ? $attributes['tool'] : [];
$enableSchema  = ! empty( $attributes['enableSchema'] );
$showNumbers   = ! empty( $attributes['showStepNumbers'] );
$showConnector = ! empty( $attributes['showConnector'] );

$howtoName       = isset( $attributes['howtoName'] ) ? trim( (string) $attributes['howtoName'] ) : '';
$descriptionRaw  = isset( $attributes['description'] ) ? trim( (string) $attributes['description'] ) : '';
$totalTimeRaw    = isset( $attributes['totalTime'] ) ? trim( (string) $attributes['totalTime'] ) : '';
$totalTimeValid  = $isValidIsoDuration( $totalTimeRaw );
$totalTimeHuman  = $totalTimeValid ? $humanizeIsoDuration( $totalTimeRaw ) : '';

$headingTag = isset( $attributes['headingTag'] ) ? sanitize_key( (string) $attributes['headingTag'] ) : 'h3';
$headingTag = in_array( $headingTag, [ 'h2', 'h3', 'h4' ], true ) ? $headingTag : 'h3';

$numberStyle = isset( $attributes['numberStyle'] ) ? sanitize_key( (string) $attributes['numberStyle'] ) : 'circle';
$numberStyle = in_array( $numberStyle, [ 'circle', 'square' ], true ) ? $numberStyle : 'circle';

$stepSpacing       = isset( $attributes['stepSpacing'] ) ? max( 0, min( 120, (int) $attributes['stepSpacing'] ) ) : 24;
$numberSize        = isset( $attributes['numberSize'] ) ? max( 16, min( 96, (int) $attributes['numberSize'] ) ) : 36;
$stepTitleFontSize = isset( $attributes['stepTitleFontSize'] ) ? max( 10, min( 48, (int) $attributes['stepTitleFontSize'] ) ) : 17;
$stepTextFontSize  = isset( $attributes['stepTextFontSize'] ) ? max( 10, min( 40, (int) $attributes['stepTextFontSize'] ) ) : 15;
$stepBorderRadius  = isset( $attributes['stepBorderRadius'] ) ? max( 0, min( 48, (int) $attributes['stepBorderRadius'] ) ) : 6;
$metaFontSize      = isset( $attributes['metaFontSize'] ) ? max( 10, min( 28, (int) $attributes['metaFontSize'] ) ) : 14;

$numberBg       = $sanitizeColor( $attributes['numberBg'] ?? '', '#2563eb' );
$numberColor    = $sanitizeColor( $attributes['numberColor'] ?? '', '#ffffff' );
$connectorColor = $sanitizeColor( $attributes['connectorColor'] ?? '', '#dee2e6' );
$stepTitleColor = $sanitizeColor( $attributes['stepTitleColor'] ?? '', '#212529' );
$stepTextColor  = $sanitizeColor( $attributes['stepTextColor'] ?? '', '#495057' );
$stepBg         = $sanitizeColor( $attributes['stepBg'] ?? '', '' );
$metaColor      = $sanitizeColor( $attributes['metaColor'] ?? '', '#6c757d' );

// --- Padding -----------------------------------------------------------
$padAttr = isset( $attributes['stepPadding'] ) && is_array( $attributes['stepPadding'] ) ? $attributes['stepPadding'] : [];
$pad = [
	'top'    => isset( $padAttr['top'] ) ? max( 0, min( 96, (int) $padAttr['top'] ) ) : 12,
	'right'  => isset( $padAttr['right'] ) ? max( 0, min( 96, (int) $padAttr['right'] ) ) : 16,
	'bottom' => isset( $padAttr['bottom'] ) ? max( 0, min( 96, (int) $padAttr['bottom'] ) ) : 12,
	'left'   => isset( $padAttr['left'] ) ? max( 0, min( 96, (int) $padAttr['left'] ) ) : 16,
];

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-howto-step-spacing:' . $stepSpacing . 'px',
	'--bb-howto-number-bg:' . $numberBg,
	'--bb-howto-number-color:' . $numberColor,
	'--bb-howto-number-size:' . $numberSize . 'px',
	'--bb-howto-connector-color:' . $connectorColor,
	'--bb-howto-step-title-color:' . $stepTitleColor,
	'--bb-howto-step-title-font-size:' . $stepTitleFontSize . 'px',
	'--bb-howto-step-text-color:' . $stepTextColor,
	'--bb-howto-step-text-font-size:' . $stepTextFontSize . 'px',
	'--bb-howto-step-bg:' . ( '' === $stepBg ? 'transparent' : $stepBg ),
	'--bb-howto-step-border-radius:' . $stepBorderRadius . 'px',
	'--bb-howto-step-padding:' . $pad['top'] . 'px ' . $pad['right'] . 'px ' . $pad['bottom'] . 'px ' . $pad['left'] . 'px',
	'--bb-howto-meta-color:' . $metaColor,
	'--bb-howto-meta-font-size:' . $metaFontSize . 'px',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-howto-block'
	. ' bb-howto-number--' . $numberStyle
	. ( $showNumbers ? ' has-numbers' : ' no-numbers' )
	. ( $showConnector ? ' has-connector' : ' no-connector' )
);

// --- Build clean step list (skip rows that are entirely empty) ---------
$cleanSteps = [];
foreach ( $steps as $step ) {
	$name = isset( $step['name'] ) ? trim( (string) $step['name'] ) : '';
	$text = isset( $step['text'] ) ? trim( (string) $step['text'] ) : '';
	$img  = isset( $step['imageUrl'] ) ? esc_url_raw( (string) $step['imageUrl'] ) : '';
	$alt  = isset( $step['imageAlt'] ) ? trim( (string) $step['imageAlt'] ) : '';
	if ( '' === $name && '' === $text ) {
		continue;
	}
	$cleanSteps[] = [
		'name'     => $name,
		'text'     => $text,
		'imageUrl' => $img,
		'imageAlt' => $alt,
	];
}

// --- Build clean supply / tool lists -----------------------------------
$cleanSupply = [];
foreach ( $supplyAttr as $row ) {
	$val = is_array( $row ) && isset( $row['text'] ) ? trim( (string) $row['text'] ) : trim( (string) $row );
	if ( '' !== $val ) {
		$cleanSupply[] = $val;
	}
}
$cleanTools = [];
foreach ( $toolAttr as $row ) {
	$val = is_array( $row ) && isset( $row['text'] ) ? trim( (string) $row['text'] ) : trim( (string) $row );
	if ( '' !== $val ) {
		$cleanTools[] = $val;
	}
}

$ariaLabel = '' !== $howtoName ? $howtoName : __( 'How-to guide', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<section class='<?php echo esc_attr( $prefix ); ?> bb-howto' aria-label='<?php echo esc_attr( $ariaLabel ); ?>'>
		<?php if ( '' !== $howtoName ) : ?>
			<h2 class='bb-howto__title'><?php echo esc_html( $howtoName ); ?></h2>
		<?php endif; ?>

		<?php if ( '' !== $descriptionRaw ) : ?>
			<div class='bb-howto__description'>
				<?php
				$paragraphs = preg_split( "/\n+/", $descriptionRaw );
				foreach ( $paragraphs as $paragraph ) :
					$paragraph = trim( $paragraph );
					if ( '' === $paragraph ) {
						continue;
					}
					?>
					<p><?php echo esc_html( $paragraph ); ?></p>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( '' !== $totalTimeHuman || ! empty( $cleanSupply ) || ! empty( $cleanTools ) ) : ?>
			<div class='bb-howto__meta'>
				<?php if ( '' !== $totalTimeHuman ) : ?>
					<div class='bb-howto__meta-group bb-howto__meta-group--time'>
						<strong><?php esc_html_e( 'Total time:', 'b-blocks' ); ?></strong>
						<span><?php echo esc_html( $totalTimeHuman ); ?></span>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $cleanSupply ) ) : ?>
					<div class='bb-howto__meta-group bb-howto__meta-group--supply'>
						<strong><?php esc_html_e( 'Supplies:', 'b-blocks' ); ?></strong>
						<ul class='bb-howto__meta-list'>
							<?php foreach ( $cleanSupply as $s ) : ?>
								<li><?php echo esc_html( $s ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $cleanTools ) ) : ?>
					<div class='bb-howto__meta-group bb-howto__meta-group--tools'>
						<strong><?php esc_html_e( 'Tools:', 'b-blocks' ); ?></strong>
						<ul class='bb-howto__meta-list'>
							<?php foreach ( $cleanTools as $t ) : ?>
								<li><?php echo esc_html( $t ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( empty( $cleanSteps ) ) : ?>
			<p class='bb-howto__empty'><?php esc_html_e( 'No steps to display.', 'b-blocks' ); ?></p>
		<?php else : ?>
			<ol class='bb-howto__steps'>
				<?php foreach ( $cleanSteps as $idx => $step ) :
					$stepNumber = $idx + 1;
					$stepName   = $step['name'];
					$stepText   = $step['text'];
					$stepImg    = $step['imageUrl'];
					$stepAlt    = '' !== $step['imageAlt'] ? $step['imageAlt'] : $stepName;
					?>
					<li class='bb-howto-step'>
						<?php if ( $showNumbers ) : ?>
							<span class='bb-howto-step__number' aria-hidden='true'><?php echo esc_html( (string) $stepNumber ); ?></span>
						<?php endif; ?>

						<div class='bb-howto-step__body'>
							<?php if ( '' !== $stepName ) : ?>
								<<?php echo tag_escape( $headingTag ); ?> class='bb-howto-step__title'>
									<?php echo esc_html( $stepName ); ?>
								</<?php echo tag_escape( $headingTag ); ?>>
							<?php endif; ?>

							<?php if ( '' !== $stepImg ) : ?>
								<div class='bb-howto-step__image'>
									<img src='<?php echo esc_url( $stepImg ); ?>' alt='<?php echo esc_attr( $stepAlt ); ?>' loading='lazy' />
								</div>
							<?php endif; ?>

							<?php if ( '' !== $stepText ) : ?>
								<div class='bb-howto-step__text'>
									<?php
									$lines = preg_split( "/\n+/", $stepText );
									foreach ( $lines as $line ) :
										$line = trim( $line );
										if ( '' === $line ) {
											continue;
										}
										?>
										<p><?php echo esc_html( $line ); ?></p>
									<?php endforeach; ?>
								</div>
							<?php endif; ?>
						</div>
					</li>
				<?php endforeach; ?>
			</ol>
		<?php endif; ?>
	</section>

	<?php
	// ---------------------------------------------------------------
	// JSON-LD HowTo schema output. Only emit when:
	//   - enableSchema is true
	//   - howtoName is non-empty (Google requires `name`)
	//   - At least one step has BOTH a name and text (Google requires
	//     a non-empty `step[]` with `HowToStep.name` + `HowToStep.text`)
	// Strip HTML so the JSON-LD payload validates cleanly. Use
	// JSON_HEX_TAG so a stray "</script>" inside user content cannot
	// break out of the <script type="application/ld+json"> block.
	// JSON_UNESCAPED_SLASHES is intentionally omitted for the same reason.
	// ---------------------------------------------------------------
	$schemaSteps = [];
	if ( $enableSchema ) {
		foreach ( $cleanSteps as $step ) {
			$n = wp_strip_all_tags( $step['name'] );
			$t = wp_strip_all_tags( $step['text'] );
			$n = trim( $n );
			$t = trim( $t );
			if ( '' === $n || '' === $t ) {
				continue;
			}
			$stepNode = [
				'@type' => 'HowToStep',
				'name'  => $n,
				'text'  => $t,
			];
			if ( '' !== $step['imageUrl'] ) {
				$stepNode['image'] = esc_url_raw( $step['imageUrl'] );
			}
			$schemaSteps[] = $stepNode;
		}
	}

	$canEmitSchema = ( $enableSchema && '' !== wp_strip_all_tags( $howtoName ) && ! empty( $schemaSteps ) );

	if ( $canEmitSchema ) :
		$schema = [
			'@context' => 'https://schema.org',
			'@type'    => 'HowTo',
			'name'     => wp_strip_all_tags( $howtoName ),
		];

		$descriptionClean = wp_strip_all_tags( $descriptionRaw );
		if ( '' !== $descriptionClean ) {
			$schema['description'] = $descriptionClean;
		}

		if ( $totalTimeValid ) {
			$schema['totalTime'] = $totalTimeRaw;
		}

		if ( ! empty( $cleanSupply ) ) {
			$schema['supply'] = array_map(
				static function ( $s ) {
					return [
						'@type' => 'HowToSupply',
						'name'  => wp_strip_all_tags( $s ),
					];
				},
				$cleanSupply
			);
		}

		if ( ! empty( $cleanTools ) ) {
			$schema['tool'] = array_map(
				static function ( $t ) {
					return [
						'@type' => 'HowToTool',
						'name'  => wp_strip_all_tags( $t ),
					];
				},
				$cleanTools
			);
		}

		$schema['step'] = $schemaSteps;

		$jsonLd = wp_json_encode( $schema, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE );
		if ( false !== $jsonLd ) :
			?>
			<script type='application/ld+json'><?php echo $jsonLd; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output is safe within a JSON-LD script tag ?></script>
			<?php
		endif;
	endif;
	?>
</div>
