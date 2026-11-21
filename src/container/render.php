<?php
$prefix = 'bBlocksContainer';
$id = wp_unique_id( "$prefix-" );

use BBlocks\Inc\Utils as Utils;
$planClass = Utils::isPro() ? 'pro' : 'free';

$innerBlocks = $content;

extract( $attributes );
// A container saved by an older version can lack some of these (no `height` before November 2024): they print as
// empty, exactly as before, without a PHP warning on every page view.
$isFullWidth = $width = $height = $verticalAlign = $horizontalAlign = null;
extract( $content );

$mainSl = "#$id .$prefix";
$cSl = "$mainSl .$prefix" . "Content";

$bBlocksContainerCSS = "
	#$id{
		min-height: " . Utils::valForZero( $wrapper['minHeight'] ?? null ) . ";
	}
	$mainSl{
		align-items: $horizontalAlign;
		justify-content: $verticalAlign;
	}
	$cSl{
 		width: " . ( $isFullWidth ? '100%' : Utils::valForZero( $width['desktop'] ?? null, '100%' ) ) . ";
		flex-grow: $height;
	}
	@media only screen and (min-width:641px) and (max-width: 1024px){
		$cSl{
			width: " . ( $isFullWidth ? '100%' : Utils::valForZero( $width['tablet'] ?? null, '100%' ) ) . ";
		}
	}
	@media only screen and (max-width: 640px){
		$cSl{
			width: " . ( $isFullWidth ? '100%' : Utils::valForZero( $width['mobile'] ?? null, '100%' ) ) . ";
		}
	}
";

// Items Layout: direction, justify, align, wrap and gaps of the blocks inside, per device. Every value defaults to
// empty, and nothing is printed for an empty one — a container saved before these options looks exactly as it did.
$itemsLayout = $attributes['itemsLayout'] ?? [];
if ( is_array( $itemsLayout ) && $itemsLayout ) {
	$itemsAllowed = [
		'direction' => [ 'row', 'row-reverse', 'column', 'column-reverse' ],
		'justify'   => [ 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly' ],
		'align'     => [ 'flex-start', 'center', 'flex-end', 'stretch', 'baseline' ],
		'wrap'      => [ 'nowrap', 'wrap', 'wrap-reverse' ],
	];
	// This container's own content box (not that of a container nested in it) and its direct children — written
	// without ">", which esc_html() below and the kses of a parent container turn into "&gt;". The children rule
	// takes off the side margins of the constrained layout and the block gap margin, so the flex gap is the only gap;
	// in a row the children also size to their content (the 100% width of style.scss would leave nothing to justify or wrap).
	$itemsBox      = "#$id .{$prefix}Content:not(#$id .{$prefix}Content .{$prefix}Content)";
	$itemsChildren = ":root .wp-block-b-blocks-container .$prefix .{$prefix}Content:where($itemsBox) *:where(:not(#$id .{$prefix}Content * *))";
	// Separate screen ranges (the same widths as above): a phone never has to undo what the desktop rule did.
	$itemsRanges = [
		'desktop' => '(min-width: 1025px)',
		'tablet'  => '(min-width: 641px) and (max-width: 1024px)',
		'mobile'  => '(max-width: 640px)',
	];
	$itemsValue = [ 'direction' => '', 'justify' => '', 'align' => '', 'wrap' => '', 'columnGap' => '', 'rowGap' => '' ];
	foreach ( $itemsRanges as $itemsDevice => $itemsQuery ) {
		// Empty on tablet or mobile: the larger screen's value stays.
		foreach ( $itemsValue as $itemsKey => $itemsOld ) {
			$itemsNew = $itemsLayout[ $itemsDevice ][ $itemsKey ] ?? '';
			$itemsNew = is_scalar( $itemsNew ) ? (string) $itemsNew : '';
			// A gap is 0 or a positive length (a negative gap is not valid CSS). "0" is a real value: it stops the inheritance.
			if ( isset( $itemsAllowed[ $itemsKey ] ) ? in_array( $itemsNew, $itemsAllowed[ $itemsKey ], true ) : preg_match( '/^(0|\d*\.?\d+(px|em|rem|%|vw|vh))$/', $itemsNew ) ) {
				$itemsValue[ $itemsKey ] = $itemsNew;
			}
		}
		if ( ! array_filter( $itemsValue, 'strlen' ) ) {
			continue;
		}
		$itemsRow = in_array( $itemsValue['direction'], [ 'row', 'row-reverse' ], true );
		$bBlocksContainerCSS .= "
	@media only screen and $itemsQuery{
		$itemsBox{
			" . ( $itemsValue['direction'] ? "flex-direction: {$itemsValue['direction']};" : '' ) . "
			" . ( $itemsValue['justify'] ? "justify-content: {$itemsValue['justify']};" : '' ) . "
			" . ( $itemsValue['align'] ? "align-items: {$itemsValue['align']};" : '' ) . "
			" . ( $itemsValue['wrap'] ? "flex-wrap: {$itemsValue['wrap']};" : '' ) . "
			" . ( '' !== $itemsValue['columnGap'] ? "column-gap: {$itemsValue['columnGap']};" : '' ) . "
			" . ( '' !== $itemsValue['rowGap'] ? "row-gap: {$itemsValue['rowGap']};" : '' ) . "
		}
		$itemsChildren{
			" . ( $itemsRow ? 'width: auto;' : '' ) . "
			" . ( $itemsRow || ( $itemsValue['align'] && 'stretch' !== $itemsValue['align'] ) ? ' margin-left: 0 !important; margin-right: 0 !important;' : '' ) . "
			" . ( $itemsRow || '' !== $itemsValue['rowGap'] ? 'margin-block-start: 0;' : '' ) . "
		}
	}
";
	}
}

?>

<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?> id='<?php echo esc_attr( $id ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>' data-bblocks-advanced='<?php echo esc_attr( wp_json_encode( $attributes['advanced'] ) ); ?>'
>
	<style><?php echo esc_html( $bBlocksContainerCSS ); ?></style>

	<div class='<?php echo esc_attr( $prefix ) ?>'>
		<?php if( ( $shape['top']['uploadSvg']['url'] ?? null ) || 'none' !== ( $shape['top']['type'] ?? null ) ){ ?>
			<div class='shaped topShaped'></div>
		<?php } ?>

		<div class='<?php echo esc_attr( $prefix ) ?>Content is-layout-constrained wp-block-b-blocks-container-is-layout-constrained'>
			<?php echo wp_kses( $innerBlocks, Utils::allowedInnerHTML() ); ?>
		</div>

		<?php if( ( $shape['bottom']['uploadSvg']['url'] ?? null ) || 'none' !== ( $shape['bottom']['type'] ?? null ) ){ ?>
			<div class='shaped bottomShaped'></div>
		<?php } ?>
	</div>
</div>