<?php
/**
 * Progress Bar block server-side render.
 *
 * Outputs a single horizontal progress bar with an optional label,
 * percentage display, animated fill, and full color customization.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All logic is inlined or uses
 * WordPress core escapers/sanitizers.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksProgressBar';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named).
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
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

$title              = isset( $attributes['title'] ) ? (string) $attributes['title'] : '';
$showTitle          = ! empty( $attributes['showTitle'] );
$percentageRaw      = isset( $attributes['percentage'] ) ? (int) $attributes['percentage'] : 70;
$percentage         = max( 0, min( 100, $percentageRaw ) );
$showPercentage     = ! empty( $attributes['showPercentage'] );
$percentagePosition = isset( $attributes['percentagePosition'] ) ? (string) $attributes['percentagePosition'] : 'end';
$percentagePosition = in_array( $percentagePosition, [ 'inside', 'end' ], true ) ? $percentagePosition : 'end';
$titlePosition      = isset( $attributes['titlePosition'] ) ? (string) $attributes['titlePosition'] : 'above';
$titlePosition      = in_array( $titlePosition, [ 'above', 'inline' ], true ) ? $titlePosition : 'above';
$height             = isset( $attributes['height'] ) ? (int) $attributes['height'] : 20;
$height             = max( 8, min( 60, $height ) );
$borderRadius       = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 4;
$borderRadius       = max( 0, min( 40, $borderRadius ) );
$fillColor          = $sanitizeColor( $attributes['fillColor'] ?? '', '#4f46e5' );
$trackColor         = $sanitizeColor( $attributes['trackColor'] ?? '', '#e5e7eb' );
$titleColor         = $attributes['titleColor'] ?? '';
$titleColor         = '' === $titleColor ? '' : $sanitizeColor( $titleColor, '' );
$percentageColor    = $sanitizeColor( $attributes['percentageColor'] ?? '', '#ffffff' );
$titleFontSize      = isset( $attributes['titleFontSize'] ) ? (int) $attributes['titleFontSize'] : 16;
$titleFontSize      = max( 10, min( 40, $titleFontSize ) );
$animate            = ! empty( $attributes['animate'] );
$animationDuration  = isset( $attributes['animationDuration'] ) ? (int) $attributes['animationDuration'] : 1200;
$animationDuration  = max( 300, min( 3000, $animationDuration ) );
$striped            = ! empty( $attributes['striped'] );

$titleId   = $id . '-label';
$hasTitle  = $showTitle && '' !== trim( $title );
$ariaLabel = '' !== trim( $title ) ? trim( $title ) : __( 'Progress', 'b-blocks' );

$wrapperClasses  = $planClass;
$wrapperClasses .= ' pb-title-' . $titlePosition;
$wrapperClasses .= ' pb-percentage-' . $percentagePosition;
if ( $striped ) {
	$wrapperClasses .= ' pb-striped';
}
if ( $animate ) {
	$wrapperClasses .= ' pb-animate';
}

$trackStyle  = 'height:' . (int) $height . 'px;';
$trackStyle .= 'background-color:' . $trackColor . ';';
$trackStyle .= 'border-radius:' . (int) $borderRadius . 'px;';

$fillInitialWidth = $animate ? '0%' : ( $percentage . '%' );
$fillStyle        = 'width:' . $fillInitialWidth . ';';
$fillStyle       .= 'background-color:' . $fillColor . ';';
$fillStyle       .= 'border-radius:' . (int) $borderRadius . 'px;';
$fillStyle       .= 'transition-duration:' . (int) $animationDuration . 'ms;';
$fillStyle       .= 'color:' . $percentageColor . ';';

$titleStyle = 'font-size:' . (int) $titleFontSize . 'px;';
if ( '' !== $titleColor ) {
	$titleStyle .= 'color:' . $titleColor . ';';
}

$percentageText = $percentage . '%';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<div class='<?php echo esc_attr( $prefix ); ?>'>
		<div class='pbHeader'>
			<?php if ( $hasTitle ) : ?>
				<span class='pbTitle' id='<?php echo esc_attr( $titleId ); ?>' style='<?php echo esc_attr( $titleStyle ); ?>'><?php echo esc_html( $title ); ?></span>
			<?php endif; ?>

			<?php if ( $showPercentage && 'end' === $percentagePosition ) : ?>
				<span class='pbPercentageEnd' style='<?php echo esc_attr( '' !== $titleColor ? 'color:' . $titleColor . ';' : '' ); ?>'><?php echo esc_html( $percentageText ); ?></span>
			<?php endif; ?>
		</div>

		<div
			class='pbTrack'
			style='<?php echo esc_attr( $trackStyle ); ?>'
		>
			<div
				class='pbFill'
				role='progressbar'
				aria-valuenow='<?php echo esc_attr( (string) $percentage ); ?>'
				aria-valuemin='0'
				aria-valuemax='100'
				<?php if ( $hasTitle ) : ?>
					aria-labelledby='<?php echo esc_attr( $titleId ); ?>'
				<?php else : ?>
					aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
				<?php endif; ?>
				data-target='<?php echo esc_attr( (string) $percentage ); ?>'
				data-animate='<?php echo esc_attr( $animate ? '1' : '0' ); ?>'
				data-duration='<?php echo esc_attr( (string) $animationDuration ); ?>'
				style='<?php echo esc_attr( $fillStyle ); ?>'
			>
				<?php if ( $showPercentage && 'inside' === $percentagePosition ) : ?>
					<span class='pbPercentageInside'><?php echo esc_html( $percentageText ); ?></span>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
