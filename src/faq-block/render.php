<?php
/**
 * FAQ Block server-side render.
 *
 * Renders a collapsible list of question/answer pairs and, when enabled,
 * appends a JSON-LD `FAQPage` schema block so the page is eligible for
 * Google FAQ rich results.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (the same pattern used in off-canvas and review-box).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksFaqBlock';
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

// --- Inline SVG for the toggle icon ------------------------------------
$renderIcon = static function ( $iconStyle ) {
	if ( 'plus' === $iconStyle ) {
		return "<svg class='bb-faq-icon bb-faq-icon--plus' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' focusable='false'>"
			. "<path class='bb-faq-icon__plus-v' fill='currentColor' d='M11 5h2v14h-2z' />"
			. "<path fill='currentColor' d='M5 11h14v2H5z' />"
			. "</svg>";
	}
	return "<svg class='bb-faq-icon bb-faq-icon--chevron' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' focusable='false'>"
		. "<path fill='currentColor' d='M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z' />"
		. "</svg>";
};

// --- Resolve and sanitize attributes -----------------------------------
$items         = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : [];
$enableSchema  = ! empty( $attributes['enableSchema'] );
$openFirst     = ! empty( $attributes['openFirst'] );
$allowMultiple = ! empty( $attributes['allowMultiple'] );

$iconStyle = isset( $attributes['iconStyle'] ) ? sanitize_key( (string) $attributes['iconStyle'] ) : 'chevron';
$iconStyle = in_array( $iconStyle, [ 'chevron', 'plus' ], true ) ? $iconStyle : 'chevron';

$headingTag = isset( $attributes['headingTag'] ) ? sanitize_key( (string) $attributes['headingTag'] ) : 'h3';
$headingTag = in_array( $headingTag, [ 'h2', 'h3', 'h4' ], true ) ? $headingTag : 'h3';

$itemBorderStyle = isset( $attributes['itemBorderStyle'] ) ? sanitize_key( (string) $attributes['itemBorderStyle'] ) : 'solid';
$itemBorderStyle = in_array( $itemBorderStyle, [ 'solid', 'dashed', 'none' ], true ) ? $itemBorderStyle : 'solid';

$gap              = isset( $attributes['gap'] ) ? max( 0, min( 96, (int) $attributes['gap'] ) ) : 8;
$itemBorderWidth  = isset( $attributes['itemBorderWidth'] ) ? max( 0, min( 12, (int) $attributes['itemBorderWidth'] ) ) : 1;
$itemBorderRadius = isset( $attributes['itemBorderRadius'] ) ? max( 0, min( 48, (int) $attributes['itemBorderRadius'] ) ) : 6;
$questionFontSize = isset( $attributes['questionFontSize'] ) ? max( 10, min( 48, (int) $attributes['questionFontSize'] ) ) : 17;
$answerFontSize   = isset( $attributes['answerFontSize'] ) ? max( 10, min( 40, (int) $attributes['answerFontSize'] ) ) : 15;

$itemBorderColor = $sanitizeColor( $attributes['itemBorderColor'] ?? '', '#dee2e6' );
$questionBg      = $sanitizeColor( $attributes['questionBg'] ?? '', '#f8f9fa' );
$questionColor   = $sanitizeColor( $attributes['questionColor'] ?? '', '#212529' );
$answerBg        = $sanitizeColor( $attributes['answerBg'] ?? '', '#ffffff' );
$answerColor     = $sanitizeColor( $attributes['answerColor'] ?? '', '#495057' );
$iconColorRaw    = isset( $attributes['iconColor'] ) ? (string) $attributes['iconColor'] : '';
$iconColor       = '' === trim( $iconColorRaw ) ? $questionColor : $sanitizeColor( $iconColorRaw, $questionColor );

// --- Padding -----------------------------------------------------------
$qPadAttr = isset( $attributes['questionPadding'] ) && is_array( $attributes['questionPadding'] ) ? $attributes['questionPadding'] : [];
$aPadAttr = isset( $attributes['answerPadding'] ) && is_array( $attributes['answerPadding'] ) ? $attributes['answerPadding'] : [];

$qPad = [
	'top'    => isset( $qPadAttr['top'] ) ? max( 0, min( 96, (int) $qPadAttr['top'] ) ) : 14,
	'right'  => isset( $qPadAttr['right'] ) ? max( 0, min( 96, (int) $qPadAttr['right'] ) ) : 16,
	'bottom' => isset( $qPadAttr['bottom'] ) ? max( 0, min( 96, (int) $qPadAttr['bottom'] ) ) : 14,
	'left'   => isset( $qPadAttr['left'] ) ? max( 0, min( 96, (int) $qPadAttr['left'] ) ) : 16,
];
$aPad = [
	'top'    => isset( $aPadAttr['top'] ) ? max( 0, min( 96, (int) $aPadAttr['top'] ) ) : 12,
	'right'  => isset( $aPadAttr['right'] ) ? max( 0, min( 96, (int) $aPadAttr['right'] ) ) : 16,
	'bottom' => isset( $aPadAttr['bottom'] ) ? max( 0, min( 96, (int) $aPadAttr['bottom'] ) ) : 12,
	'left'   => isset( $aPadAttr['left'] ) ? max( 0, min( 96, (int) $aPadAttr['left'] ) ) : 16,
];

$wrapperStyleParts = [
	'--bb-faq-gap:' . $gap . 'px',
	'--bb-faq-item-border-style:' . $itemBorderStyle,
	'--bb-faq-item-border-width:' . $itemBorderWidth . 'px',
	'--bb-faq-item-border-radius:' . $itemBorderRadius . 'px',
	'--bb-faq-item-border-color:' . $itemBorderColor,
	'--bb-faq-question-bg:' . $questionBg,
	'--bb-faq-question-color:' . $questionColor,
	'--bb-faq-question-font-size:' . $questionFontSize . 'px',
	'--bb-faq-answer-bg:' . $answerBg,
	'--bb-faq-answer-color:' . $answerColor,
	'--bb-faq-answer-font-size:' . $answerFontSize . 'px',
	'--bb-faq-icon-color:' . $iconColor,
	'--bb-faq-question-padding:' . $qPad['top'] . 'px ' . $qPad['right'] . 'px ' . $qPad['bottom'] . 'px ' . $qPad['left'] . 'px',
	'--bb-faq-answer-padding:' . $aPad['top'] . 'px ' . $aPad['right'] . 'px ' . $aPad['bottom'] . 'px ' . $aPad['left'] . 'px',
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

$wrapperClasses = trim( $planClass . ' bb-faq-block' );

// --- Build sanitized item list (skip rows with both fields empty) ------
$cleanItems = [];
foreach ( $items as $item ) {
	$q = isset( $item['question'] ) ? trim( (string) $item['question'] ) : '';
	$a = isset( $item['answer'] ) ? trim( (string) $item['answer'] ) : '';
	if ( '' === $q && '' === $a ) {
		continue;
	}
	$cleanItems[] = [
		'question' => $q,
		'answer'   => $a,
	];
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-allow-multiple='<?php echo esc_attr( $allowMultiple ? '1' : '0' ); ?>'
	data-icon-style='<?php echo esc_attr( $iconStyle ); ?>'
>
	<div class='<?php echo esc_attr( $prefix ); ?>'>
		<?php if ( empty( $cleanItems ) ) : ?>
			<p class='bb-faq-empty'><?php esc_html_e( 'No FAQ items to display.', 'b-blocks' ); ?></p>
		<?php else : ?>
			<div class='bb-faq-list' role='list'>
				<?php foreach ( $cleanItems as $idx => $item ) :
					$isOpen   = ( $openFirst && 0 === $idx );
					$itemCls  = 'bb-faq-item' . ( $isOpen ? ' is-open' : '' );
					$answerId = $id . '-answer-' . $idx;
					$question = $item['question'];
					$answer   = $item['answer'];
					?>
					<div class='<?php echo esc_attr( $itemCls ); ?>' role='listitem'>
						<<?php echo esc_attr( $headingTag ); ?> class='bb-faq-question-heading'>
							<button
								type='button'
								class='bb-faq-question'
								aria-expanded='<?php echo esc_attr( $isOpen ? 'true' : 'false' ); ?>'
								aria-controls='<?php echo esc_attr( $answerId ); ?>'
							>
								<span class='bb-faq-question__text'><?php echo esc_html( $question ); ?></span>
								<span class='bb-faq-question__icon' aria-hidden='true'>
									<?php echo $renderIcon( $iconStyle ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderIcon ?>
								</span>
							</button>
						</<?php echo esc_attr( $headingTag ); ?>>
						<div
							id='<?php echo esc_attr( $answerId ); ?>'
							class='bb-faq-answer'
							role='region'
							aria-hidden='<?php echo esc_attr( $isOpen ? 'false' : 'true' ); ?>'
						>
							<div class='bb-faq-answer__inner'>
								<?php
								$paragraphs = preg_split( "/\n+/", $answer );
								foreach ( $paragraphs as $paragraph ) :
									$paragraph = trim( $paragraph );
									if ( '' === $paragraph ) {
										continue;
									}
									?>
									<p><?php echo esc_html( $paragraph ); ?></p>
								<?php endforeach; ?>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>

	<?php
	// ---------------------------------------------------------------
	// JSON-LD FAQPage schema output. Only emit when enableSchema is
	// true AND at least one row has BOTH a question and an answer.
	// Strip HTML so the JSON-LD payload validates cleanly. Use
	// JSON_HEX_TAG so a stray "</script>" inside user content cannot
	// break out of the <script type="application/ld+json"> block.
	// JSON_UNESCAPED_SLASHES is intentionally omitted for the same reason.
	// ---------------------------------------------------------------
	$schemaItems = [];
	if ( $enableSchema ) {
		foreach ( $cleanItems as $item ) {
			$q = wp_strip_all_tags( $item['question'] );
			$a = wp_strip_all_tags( $item['answer'] );
			$q = trim( $q );
			$a = trim( $a );
			if ( '' === $q || '' === $a ) {
				continue;
			}
			$schemaItems[] = [
				'@type'          => 'Question',
				'name'           => $q,
				'acceptedAnswer' => [
					'@type' => 'Answer',
					'text'  => $a,
				],
			];
		}
	}

	if ( $enableSchema && ! empty( $schemaItems ) ) :
		$schema = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $schemaItems,
		];
		$jsonLd = wp_json_encode( $schema, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE );
		if ( false !== $jsonLd ) :
			?>
			<script type='application/ld+json'><?php echo $jsonLd; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode output is safe within a JSON-LD script tag ?></script>
			<?php
		endif;
	endif;
	?>
</div>
