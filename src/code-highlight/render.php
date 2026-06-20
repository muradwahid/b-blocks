<?php
/**
 * Code Highlight Block server-side render.
 *
 * Emits a semantic <pre><code> structure pre-escaped on the server. The
 * actual syntax tokenization is performed client-side in view.js by
 * Prism.js (no server-side highlighter is shipped, which keeps the PHP
 * footprint tiny and avoids version skew with the bundled Prism build).
 *
 * No global helper functions are declared at file scope intentionally —
 * Gutenberg may include this file more than once per request which would
 * cause a "Cannot redeclare function" fatal. All helpers below are
 * inlined as static closures (same pattern as howto-schema, off-canvas).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksCodeHighlight';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Allow-listed Prism language slugs ---------------------------------
$allowedLanguages = [
	'javascript',
	'typescript',
	'jsx',
	'tsx',
	'php',
	'css',
	'markup', // HTML / XML / SVG
	'bash',
	'python',
	'json',
	'sql',
	'yaml',
	'markdown',
	'plaintext',
];

// --- Allow-listed theme slugs ------------------------------------------
$allowedThemes = [ 'dark', 'light' ];

// --- Sanitize a CSS length token ("14px", "1rem", "0", etc.) ----------
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

// --- Resolve and clamp attributes --------------------------------------
$codeRaw       = isset( $attributes['code'] ) ? (string) $attributes['code'] : '';
$languageRaw   = isset( $attributes['language'] ) ? strtolower( trim( (string) $attributes['language'] ) ) : 'javascript';
$language      = in_array( $languageRaw, $allowedLanguages, true ) ? $languageRaw : 'javascript';

$themeRaw      = isset( $attributes['theme'] ) ? strtolower( trim( (string) $attributes['theme'] ) ) : 'dark';
$theme         = in_array( $themeRaw, $allowedThemes, true ) ? $themeRaw : 'dark';

$showLines     = ! empty( $attributes['showLineNumbers'] );
$startLine     = isset( $attributes['startingLineNumber'] ) ? (int) $attributes['startingLineNumber'] : 1;
$startLine     = max( 1, min( 99999, $startLine ) );

$showCopy      = ! empty( $attributes['showCopyButton'] );
$copyLabel     = isset( $attributes['copyButtonLabel'] ) ? trim( (string) $attributes['copyButtonLabel'] ) : '';
$copyLabel     = '' !== $copyLabel ? $copyLabel : __( 'Copy', 'b-blocks' );
$copiedLabel   = isset( $attributes['copiedLabel'] ) ? trim( (string) $attributes['copiedLabel'] ) : '';
$copiedLabel   = '' !== $copiedLabel ? $copiedLabel : __( 'Copied!', 'b-blocks' );

$showHeader    = ! empty( $attributes['showHeader'] );
$filename      = isset( $attributes['filename'] ) ? trim( (string) $attributes['filename'] ) : '';

$maxHeight     = isset( $attributes['maxHeight'] ) ? (int) $attributes['maxHeight'] : 0;
$maxHeight     = max( 0, min( 5000, $maxHeight ) );

$fontSize      = $sanitizeCssLength( $attributes['fontSize'] ?? '', '14px' );
$borderRadius  = $sanitizeCssLength( $attributes['borderRadius'] ?? '', '6px' );

$tabSize       = isset( $attributes['tabSize'] ) ? (int) $attributes['tabSize'] : 2;
$tabSize       = max( 1, min( 12, $tabSize ) );

// --- Human-readable language label for the badge -----------------------
$languageLabels = [
	'javascript' => 'JavaScript',
	'typescript' => 'TypeScript',
	'jsx'        => 'JSX',
	'tsx'        => 'TSX',
	'php'        => 'PHP',
	'css'        => 'CSS',
	'markup'     => 'HTML',
	'bash'       => 'Shell',
	'python'     => 'Python',
	'json'       => 'JSON',
	'sql'        => 'SQL',
	'yaml'       => 'YAML',
	'markdown'   => 'Markdown',
	'plaintext'  => 'Plain Text',
];
$languageLabel = isset( $languageLabels[ $language ] ) ? $languageLabels[ $language ] : ucfirst( $language );

$wrapperClasses = trim(
	$planClass
	. ' bb-code-highlight'
	. ' bb-ch-theme--' . $theme
	. ( $showLines ? ' has-line-numbers' : ' no-line-numbers' )
	. ( $showHeader ? ' has-header' : ' no-header' )
);

$wrapperStyleParts = [
	'--bb-ch-font-size:' . $fontSize,
	'--bb-ch-radius:' . $borderRadius,
	'--bb-ch-tab-size:' . (int) $tabSize,
	'--bb-ch-start-line:' . (int) $startLine,
];
$wrapperStyle = implode( ';', $wrapperStyleParts ) . ';';

// Build the screen-reader-friendly region label.
$ariaLabel = '' !== $filename
	/* translators: 1: programming language label, 2: filename */
	? sprintf( __( '%1$s code block: %2$s', 'b-blocks' ), $languageLabel, $filename )
	/* translators: %s: programming language label */
	: sprintf( __( '%s code block', 'b-blocks' ), $languageLabel );

// Normalize line endings so view.js doesn't have to.
$codeNormalized = str_replace( [ "\r\n", "\r" ], "\n", $codeRaw );

// Wrap each line so:
//   - The line gutter number renders as REAL HTML (not a CSS counter)
//     so the `startingLineNumber` attribute works in every browser.
//   - view.js can re-tokenize only the inner `.bb-ch-text` child via
//     Prism, leaving the gutter span untouched.
// We always wrap if there's any code at all — `.bb-ch-num` is just
// hidden via CSS when line numbers are off, so we don't pay double
// markup when toggling.
$lines    = explode( "\n", $codeNormalized );
$hasLines = '' !== $codeNormalized && count( $lines ) > 0;
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
	data-bb-ch-language='<?php echo esc_attr( $language ); ?>'
	data-bb-ch-theme='<?php echo esc_attr( $theme ); ?>'
	data-bb-ch-max-height='<?php echo esc_attr( (string) $maxHeight ); ?>'
	data-bb-ch-copy-label='<?php echo esc_attr( $copyLabel ); ?>'
	data-bb-ch-copied-label='<?php echo esc_attr( $copiedLabel ); ?>'
>
	<?php if ( $showHeader ) : ?>
		<div class='bb-ch-header'>
			<span class='bb-ch-lang-badge'><?php echo esc_html( $languageLabel ); ?></span>
			<?php if ( '' !== $filename ) : ?>
				<span class='bb-ch-filename'><?php echo esc_html( $filename ); ?></span>
			<?php endif; ?>
			<?php if ( $showCopy ) : ?>
				<button
					type='button'
					class='bb-ch-copy-btn'
					aria-label='<?php echo esc_attr__( 'Copy code to clipboard', 'b-blocks' ); ?>'
					data-default-label='<?php echo esc_attr( $copyLabel ); ?>'
					data-copied-label='<?php echo esc_attr( $copiedLabel ); ?>'
				>
					<span class='bb-ch-copy-icon' aria-hidden='true'>
						<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path></svg>
					</span>
					<span class='bb-ch-copy-text'><?php echo esc_html( $copyLabel ); ?></span>
				</button>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<div class='bb-ch-body'>
		<?php if ( $showCopy && ! $showHeader ) : ?>
			<button
				type='button'
				class='bb-ch-copy-btn bb-ch-copy-btn--floating'
				aria-label='<?php echo esc_attr__( 'Copy code to clipboard', 'b-blocks' ); ?>'
				data-default-label='<?php echo esc_attr( $copyLabel ); ?>'
				data-copied-label='<?php echo esc_attr( $copiedLabel ); ?>'
			>
				<span class='bb-ch-copy-icon' aria-hidden='true'>
					<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path></svg>
				</span>
				<span class='bb-ch-copy-text'><?php echo esc_html( $copyLabel ); ?></span>
			</button>
		<?php endif; ?>

		<pre
			class='bb-ch-pre language-<?php echo esc_attr( $language ); ?>'
			role='region'
			tabindex='0'
			aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
		><code class='bb-ch-code language-<?php echo esc_attr( $language ); ?>'
			><?php
			if ( $hasLines ) {
				$out = '';
				$n   = $startLine;
				foreach ( $lines as $line ) {
					// Number span renders as real HTML so it works without
					// CSS counters and survives Prism re-tokenization
					// (Prism only rewrites the `.bb-ch-text` child).
					// Empty lines still get a non-breaking placeholder so
					// the line height is preserved.
					$lineHtml = '' === $line ? '&#8203;' : esc_html( $line );
					$out     .= '<span class="bb-ch-line">'
						. '<span class="bb-ch-num" aria-hidden="true">' . (int) $n . '</span>'
						. '<span class="bb-ch-text">' . $lineHtml . '</span>'
						. '</span>';
					$n++;
				}
				echo $out; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- per-line content is escaped above
			} else {
				echo esc_html( $codeNormalized );
			}
			?></code></pre>

		<span class='bb-ch-live' aria-live='polite' aria-atomic='true'></span>
	</div>
</div>
