<?php
/**
 * Comparison Table Block server-side render.
 *
 * Renders a semantic <table> with a feature-name column followed by one
 * column per plan. Each cell value is interpreted server-side:
 *   - "yes" / "true" / "1" / "✓"  → green check SVG
 *   - "no"  / "false" / "0" / "✗" → red X SVG
 *   - anything else → plain text (esc_html'd)
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as howto-schema, process-steps, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksComparisonTable';
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

// --- Classify a cell string as yes / no / text -------------------------
$classifyCellString = static function ( $raw ) {
	$v = strtolower( trim( (string) $raw ) );
	if ( '' === $v ) {
		return 'text';
	}
	$yes = [ 'yes', 'true', '1', '✓', 'y', 'tick' ];
	$no  = [ 'no', 'false', '0', '✗', 'x', 'cross', 'n' ];
	if ( in_array( $v, $yes, true ) ) {
		return 'yes';
	}
	if ( in_array( $v, $no, true ) ) {
		return 'no';
	}
	return 'text';
};

// --- Render a yes / no SVG ---------------------------------------------
$renderIconSvg = static function ( $kind, $iconStyle, $iconSize, $accessibleLabel ) {
	$size = max( 10, min( 64, (int) $iconSize ) );
	if ( 'yes' === $kind ) {
		if ( 'check-circle' === $iconStyle ) {
			$path = '<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm141.6 192.2L235.7 360.6c-3.1 3.1-8.2 3.1-11.3 0L150.4 287c-3.1-3.1-3.1-8.2 0-11.3l24.5-24.5c3.1-3.1 8.2-3.1 11.3 0l43.5 43.5 132.2-131.3c3.1-3.1 8.2-3.1 11.3 0l24.5 24.5c3 3.1 3 8.2-.1 11.3z"/>';
			$viewBox = '0 0 512 512';
		} else {
			$path = '<path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>';
			$viewBox = '0 0 512 512';
		}
	} else {
		if ( 'times-circle' === $iconStyle ) {
			$path = '<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/>';
			$viewBox = '0 0 512 512';
		} else {
			$path = '<path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/>';
			$viewBox = '0 0 352 512';
		}
	}

	$titleId = 'bb-ct-i-' . wp_unique_id();
	return sprintf(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="%1$s" role="img" aria-labelledby="%2$s" focusable="false" width="%3$d" height="%3$d"><title id="%2$s">%4$s</title>%5$s</svg>',
		esc_attr( $viewBox ),
		esc_attr( $titleId ),
		$size,
		esc_html( $accessibleLabel ),
		$path
	);
};

// --- Resolve and sanitize attributes -----------------------------------
$rawColumns = ( isset( $attributes['columns'] ) && is_array( $attributes['columns'] ) ) ? $attributes['columns'] : [];
$rawRows    = ( isset( $attributes['rows'] ) && is_array( $attributes['rows'] ) ) ? $attributes['rows'] : [];

$theme = isset( $attributes['theme'] ) ? sanitize_key( (string) $attributes['theme'] ) : 'default';
$theme = in_array( $theme, [ 'default', 'striped', 'bordered', 'dark' ], true ) ? $theme : 'default';

$checkIcon = isset( $attributes['checkIcon'] ) ? sanitize_key( (string) $attributes['checkIcon'] ) : 'check';
$checkIcon = in_array( $checkIcon, [ 'check', 'check-circle' ], true ) ? $checkIcon : 'check';

$crossIcon = isset( $attributes['crossIcon'] ) ? sanitize_key( (string) $attributes['crossIcon'] ) : 'times';
$crossIcon = in_array( $crossIcon, [ 'times', 'times-circle' ], true ) ? $crossIcon : 'times';

$tableAlignment = isset( $attributes['tableAlignment'] ) ? sanitize_key( (string) $attributes['tableAlignment'] ) : 'center';
$tableAlignment = in_array( $tableAlignment, [ 'left', 'center', 'right' ], true ) ? $tableAlignment : 'center';

$showRowStripes    = ! empty( $attributes['showRowStripes'] );
$stickyHeader      = ! empty( $attributes['stickyHeader'] );
$stickyFirstColumn = ! isset( $attributes['stickyFirstColumn'] ) ? true : ! empty( $attributes['stickyFirstColumn'] );

$captionRaw      = isset( $attributes['caption'] ) ? trim( (string) $attributes['caption'] ) : '';
$featuredLabel   = isset( $attributes['featuredLabel'] ) ? trim( (string) $attributes['featuredLabel'] ) : '';

$borderWidth   = isset( $attributes['borderWidth'] ) ? max( 0, min( 6, (int) $attributes['borderWidth'] ) ) : 1;
$borderRadius  = isset( $attributes['borderRadius'] ) ? max( 0, min( 32, (int) $attributes['borderRadius'] ) ) : 8;
$fontSize      = isset( $attributes['fontSize'] ) ? max( 10, min( 28, (int) $attributes['fontSize'] ) ) : 15;
$headerFontSize = isset( $attributes['headerFontSize'] ) ? max( 10, min( 32, (int) $attributes['headerFontSize'] ) ) : 16;
$cellPaddingV  = isset( $attributes['cellPaddingV'] ) ? max( 0, min( 48, (int) $attributes['cellPaddingV'] ) ) : 12;
$cellPaddingH  = isset( $attributes['cellPaddingH'] ) ? max( 0, min( 48, (int) $attributes['cellPaddingH'] ) ) : 16;
$iconSize      = isset( $attributes['iconSize'] ) ? max( 10, min( 48, (int) $attributes['iconSize'] ) ) : 18;
$tableMaxWidth = isset( $attributes['tableMaxWidth'] ) ? max( 320, min( 2400, (int) $attributes['tableMaxWidth'] ) ) : 900;

$headerBg           = $sanitizeColor( $attributes['headerBg'] ?? '', '#1e293b' );
$headerTextColor    = $sanitizeColor( $attributes['headerTextColor'] ?? '', '#ffffff' );
$featuredBg         = $sanitizeColor( $attributes['featuredBg'] ?? '', '#2563eb' );
$featuredTextColor  = $sanitizeColor( $attributes['featuredTextColor'] ?? '', '#ffffff' );
$featuredColBg      = $sanitizeColor( $attributes['featuredColBg'] ?? '', '#eff6ff' );
$featuredLabelBg    = $sanitizeColor( $attributes['featuredLabelBg'] ?? '', '#f59e0b' );
$featuredLabelColor = $sanitizeColor( $attributes['featuredLabelColor'] ?? '', '#ffffff' );
$rowLabelBg         = $sanitizeColor( $attributes['rowLabelBg'] ?? '', '' );
$rowLabelColor      = $sanitizeColor( $attributes['rowLabelColor'] ?? '', '' );
$rowStripeBg        = $sanitizeColor( $attributes['rowStripeBg'] ?? '', '#f8fafc' );
$bodyBg             = $sanitizeColor( $attributes['bodyBg'] ?? '', '#ffffff' );
$bodyTextColor      = $sanitizeColor( $attributes['bodyTextColor'] ?? '', '#1f2937' );
$checkColor         = $sanitizeColor( $attributes['checkColor'] ?? '', '#16a34a' );
$crossColor         = $sanitizeColor( $attributes['crossColor'] ?? '', '#dc2626' );
$borderColor        = $sanitizeColor( $attributes['borderColor'] ?? '', '#e2e8f0' );

// --- Clean columns -----------------------------------------------------
$columns = [];
$featuredIndex = -1;
foreach ( $rawColumns as $col ) {
	if ( ! is_array( $col ) ) {
		continue;
	}
	$label      = isset( $col['label'] ) ? trim( (string) $col['label'] ) : '';
	$subtitle   = isset( $col['subtitle'] ) ? trim( (string) $col['subtitle'] ) : '';
	$badge      = isset( $col['badge'] ) ? trim( (string) $col['badge'] ) : '';
	$isFeatured = ! empty( $col['isFeatured'] );
	$ctaUrl     = isset( $col['ctaUrl'] ) ? esc_url_raw( (string) $col['ctaUrl'] ) : '';
	$ctaLabel   = isset( $col['ctaLabel'] ) ? trim( (string) $col['ctaLabel'] ) : '';

	$columns[] = [
		'label'      => $label,
		'subtitle'   => $subtitle,
		'badge'      => $badge,
		'isFeatured' => $isFeatured,
		'ctaUrl'     => $ctaUrl,
		'ctaLabel'   => $ctaLabel,
	];
}
// Cap to 6 columns; minimum 1.
if ( count( $columns ) > 6 ) {
	$columns = array_slice( $columns, 0, 6 );
}
// Enforce at most one featured column.
foreach ( $columns as $i => $c ) {
	if ( ! empty( $c['isFeatured'] ) ) {
		if ( -1 === $featuredIndex ) {
			$featuredIndex = $i;
		} else {
			$columns[ $i ]['isFeatured'] = false;
		}
	}
}
$columnCount = count( $columns );

// --- Clean rows --------------------------------------------------------
$rows = [];
foreach ( $rawRows as $row ) {
	if ( ! is_array( $row ) ) {
		continue;
	}
	$label   = isset( $row['label'] ) ? trim( (string) $row['label'] ) : '';
	$tooltip = isset( $row['tooltip'] ) ? trim( (string) $row['tooltip'] ) : '';
	$rawCells = isset( $row['cells'] ) && is_array( $row['cells'] ) ? $row['cells'] : [];

	// Normalize cells to columnCount entries.
	$cells = [];
	for ( $i = 0; $i < $columnCount; $i++ ) {
		$cell = isset( $rawCells[ $i ] ) ? $rawCells[ $i ] : null;
		// Support legacy / spec'd cell objects {value, type, text} OR plain strings.
		if ( is_array( $cell ) ) {
			$type  = isset( $cell['type'] ) ? sanitize_key( (string) $cell['type'] ) : 'icon';
			$value = isset( $cell['value'] ) ? (bool) $cell['value'] : false;
			$text  = isset( $cell['text'] ) ? trim( (string) $cell['text'] ) : '';
			$cells[] = [
				'type'  => in_array( $type, [ 'icon', 'text' ], true ) ? $type : 'icon',
				'value' => $value,
				'text'  => $text,
			];
		} else {
			$str  = is_string( $cell ) ? trim( $cell ) : '';
			$kind = $classifyCellString( $str );
			if ( 'yes' === $kind ) {
				$cells[] = [ 'type' => 'icon', 'value' => true, 'text' => '' ];
			} elseif ( 'no' === $kind ) {
				$cells[] = [ 'type' => 'icon', 'value' => false, 'text' => '' ];
			} else {
				$cells[] = [ 'type' => 'text', 'value' => false, 'text' => $str ];
			}
		}
	}

	if ( '' === $label && '' === $tooltip ) {
		// Still keep the row if any cell has content; skip if completely blank.
		$hasContent = false;
		foreach ( $cells as $c ) {
			if ( ( 'text' === $c['type'] && '' !== $c['text'] ) || 'icon' === $c['type'] ) {
				$hasContent = true;
				break;
			}
		}
		if ( ! $hasContent ) {
			continue;
		}
	}

	$rows[] = [
		'label'   => $label,
		'tooltip' => $tooltip,
		'cells'   => $cells,
	];
}

// --- Wrapper CSS variables --------------------------------------------
$wrapperStyleParts = [
	'--bb-ct-header-bg:' . $headerBg,
	'--bb-ct-header-text:' . $headerTextColor,
	'--bb-ct-featured-bg:' . $featuredBg,
	'--bb-ct-featured-text:' . $featuredTextColor,
	'--bb-ct-featured-col-bg:' . $featuredColBg,
	'--bb-ct-featured-label-bg:' . $featuredLabelBg,
	'--bb-ct-featured-label-color:' . $featuredLabelColor,
	'--bb-ct-row-label-bg:' . ( '' === $rowLabelBg ? 'transparent' : $rowLabelBg ),
	'--bb-ct-row-label-color:' . ( '' === $rowLabelColor ? 'inherit' : $rowLabelColor ),
	'--bb-ct-row-stripe-bg:' . $rowStripeBg,
	'--bb-ct-body-bg:' . $bodyBg,
	'--bb-ct-body-text:' . $bodyTextColor,
	'--bb-ct-check-color:' . $checkColor,
	'--bb-ct-cross-color:' . $crossColor,
	'--bb-ct-border-color:' . $borderColor,
	'--bb-ct-border-width:' . $borderWidth . 'px',
	'--bb-ct-border-radius:' . $borderRadius . 'px',
	'--bb-ct-font-size:' . $fontSize . 'px',
	'--bb-ct-header-font-size:' . $headerFontSize . 'px',
	'--bb-ct-cell-padding-v:' . $cellPaddingV . 'px',
	'--bb-ct-cell-padding-h:' . $cellPaddingH . 'px',
	'--bb-ct-icon-size:' . $iconSize . 'px',
	'--bb-ct-max-width:' . $tableMaxWidth . 'px',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim(
	$planClass
	. ' bb-ct-block'
	. ' bb-ct-theme--' . $theme
	. ' bb-ct-align--' . $tableAlignment
	. ( $showRowStripes ? ' has-row-stripes' : '' )
	. ( $stickyHeader ? ' has-sticky-header' : '' )
	. ( $stickyFirstColumn ? ' has-sticky-first-col' : '' )
);

$captionText = '' !== $captionRaw ? $captionRaw : __( 'Feature comparison across plans', 'b-blocks' );
$scrollLabel = sprintf(
	/* translators: %s: caption text */
	__( '%s. Scroll horizontally to see all columns.', 'b-blocks' ),
	$captionText
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( empty( $columns ) || empty( $rows ) ) : ?>
		<p class='bb-ct-empty'><?php esc_html_e( 'No comparison data to display. Add columns and rows in the block sidebar.', 'b-blocks' ); ?></p>
	<?php else : ?>
		<div
			class='bb-ct-scroll'
			role='region'
			aria-label='<?php echo esc_attr( $scrollLabel ); ?>'
			tabindex='0'
		>
			<table class='bb-ct-table'>
				<caption class='bb-ct-caption screen-reader-text'><?php echo esc_html( $captionText ); ?></caption>

				<thead>
					<tr>
						<th scope='col'><span class='screen-reader-text'><?php esc_html_e( 'Feature', 'b-blocks' ); ?></span></th>
						<?php foreach ( $columns as $idx => $col ) :
							$colClasses = 'bb-ct-col';
							if ( ! empty( $col['isFeatured'] ) ) {
								$colClasses .= ' is-featured';
							}
							?>
							<th scope='col' class='<?php echo esc_attr( $colClasses ); ?>'>
								<?php if ( ! empty( $col['isFeatured'] ) && '' !== $featuredLabel ) : ?>
									<span class='bb-ct-col__featured-badge' aria-hidden='true'><?php echo esc_html( $featuredLabel ); ?></span>
								<?php endif; ?>
								<?php if ( '' !== $col['label'] ) : ?>
									<span class='bb-ct-col__label'><?php echo esc_html( $col['label'] ); ?></span>
								<?php endif; ?>
								<?php if ( '' !== $col['subtitle'] ) : ?>
									<span class='bb-ct-col__subtitle'><?php echo esc_html( $col['subtitle'] ); ?></span>
								<?php endif; ?>
								<?php if ( '' !== $col['ctaUrl'] && '' !== $col['ctaLabel'] ) : ?>
									<a
										class='bb-ct-col__cta'
										href='<?php echo esc_url( $col['ctaUrl'] ); ?>'
										rel='noopener'
									>
										<?php echo esc_html( $col['ctaLabel'] ); ?>
									</a>
								<?php endif; ?>
							</th>
						<?php endforeach; ?>
					</tr>
				</thead>

				<tbody>
					<?php foreach ( $rows as $row ) : ?>
						<tr>
							<th scope='row' class='bb-ct-row-label'>
								<?php if ( '' !== $row['tooltip'] && '' !== $row['label'] ) : ?>
									<abbr class='bb-ct-tooltip' title='<?php echo esc_attr( $row['tooltip'] ); ?>'><?php echo esc_html( $row['label'] ); ?></abbr>
								<?php elseif ( '' !== $row['label'] ) : ?>
									<?php echo esc_html( $row['label'] ); ?>
								<?php else : ?>
									<span class='screen-reader-text'><?php esc_html_e( 'Feature', 'b-blocks' ); ?></span>
								<?php endif; ?>
							</th>
							<?php foreach ( $row['cells'] as $cIdx => $cell ) :
								$tdClasses = 'bb-ct-cell';
								if ( $cIdx === $featuredIndex ) {
									$tdClasses .= ' is-featured';
								}
								?>
								<td class='<?php echo esc_attr( $tdClasses ); ?>'>
									<?php
									if ( 'icon' === $cell['type'] ) {
										if ( ! empty( $cell['value'] ) ) {
											$svg   = $renderIconSvg( 'yes', $checkIcon, $iconSize, __( 'Yes', 'b-blocks' ) );
											$class = 'bb-ct-cell-icon is-yes';
										} else {
											$svg   = $renderIconSvg( 'no', $crossIcon, $iconSize, __( 'No', 'b-blocks' ) );
											$class = 'bb-ct-cell-icon is-no';
										}
										?>
										<span class='<?php echo esc_attr( $class ); ?>'>
											<?php echo $svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- markup built from sanitized inputs in $renderIconSvg ?>
										</span>
										<?php
									} else {
										$text = (string) $cell['text'];
										if ( '' === $text ) {
											echo '<span aria-hidden="true">&mdash;</span><span class="screen-reader-text">' . esc_html__( 'Not specified', 'b-blocks' ) . '</span>';
										} else {
											echo esc_html( $text );
										}
									}
									?>
								</td>
							<?php endforeach; ?>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	<?php endif; ?>
</div>
