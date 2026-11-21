<?php
if ( ! class_exists( 'BBlocksAdvancedSearch' ) ) {
	return;
}

$id = wp_unique_id( 'bBlocksAdvancedSearch-' );
// Texts are shown as text by the page script (React escapes them), so they are kept as written; the button icon is
// markup and goes through the filter.
$attributes = BBlocks\Inc\Sanitize::attributes( $attributes, [ 'placeholder', 'text', 'textOne', 'notFoundText' ] );

// Only a public, searchable post type, several of them ('multiple' + postTypes), or All; 1–20 live results.
$allowedTypes = BBlocksAdvancedSearch::postTypes();
// Names only: a hand-edited nested list would print "Array to string" warnings in array_intersect().
$postTypes    = array_values( array_intersect( array_filter( (array) ( $attributes['search']['postTypes'] ?? [] ), 'is_string' ), $allowedTypes ) );
$postType     = $attributes['search']['postType'] ?? 'all';
$postType     = in_array( $postType, $allowedTypes, true ) || ( 'multiple' === $postType && $postTypes ) ? $postType : 'all';
$attributes['search']['postType']      = $postType;
$attributes['search']['postTypes']     = $postTypes;
$attributes['search']['initialResult'] = min( BBlocksAdvancedSearch::MAX_PER_PAGE, max( 1, absint( $attributes['search']['initialResult'] ?? 5 ) ) );
// Saved before these options existed: today's behaviour. Numbers kept in their ranges, filters to real public terms.
$attributes['search']['minChars']      = min( 5, max( 2, absint( $attributes['search']['minChars'] ?? 2 ) ) );
$attributes['search']['delay']         = min( 2000, max( 0, (int) ( $attributes['search']['delay'] ?? 300 ) ) );
$attributes['search']['excerptLength'] = min( 55, max( 5, absint( $attributes['search']['excerptLength'] ?? 22 ) ) );
$attributes['search']['orderBy']       = in_array( $attributes['search']['orderBy'] ?? '', [ 'date', 'title' ], true ) ? $attributes['search']['orderBy'] : 'relevance';
$attributes['search']['includeTerms']  = BBlocksAdvancedSearch::termIds( (array) ( $attributes['search']['includeTerms'] ?? [] ) );
$attributes['search']['excludeTerms']  = BBlocksAdvancedSearch::termIds( (array) ( $attributes['search']['excludeTerms'] ?? [] ) );
$searchTypes = 'multiple' === $postType ? $postTypes : ( 'all' === $postType ? [] : [ $postType ] );

// View All goes to the WordPress search page, which can only filter categories (cat=2,-5); other terms are left out.
$cat = [];
foreach ( [ 'includeTerms' => '', 'excludeTerms' => '-' ] as $key => $sign ) {
	foreach ( $attributes['search'][ $key ] as $termId ) {
		if ( 'category' === get_term( $termId )->taxonomy ) {
			$cat[] = $sign . $termId;
		}
	}
}

// What the page script needs from the server. The key is not an attribute name, so no setting is overwritten.
$attributes['context'] = [
	'api'    => esc_url_raw( rest_url( 'b-blocks/v1/search' ) ),
	'home'   => esc_url_raw( home_url( '/' ) ),
	'cat'    => implode( ',', $cat ),
	'labels' => [
		'search'       => 'Search',
		'clear'        => 'Clear search',
		'loading'      => 'Searching…',
		'results'      => 'Search results',
		'error'        => 'Search is not available right now. Please try again.',
		'resultsFound' => [ 'one' => '%d result found', 'other' => '%d results found' ],
	],
];
// Text only: a hand-edited non-text value counts as empty instead of printing "Array to string" warnings.
$placeholder    = is_scalar( $attributes['searchField']['placeholder'] ?? '' ) ? (string) ( $attributes['searchField']['placeholder'] ?? '' ) : '';
$buttonText     = is_scalar( $attributes['button']['text'] ?? '' ) && '' !== (string) ( $attributes['button']['text'] ?? '' ) ? (string) $attributes['button']['text'] : 'Search';
$buttonPosition = is_scalar( $attributes['button']['position'] ?? 'separate' ) ? (string) ( $attributes['button']['position'] ?? 'separate' ) : 'separate';
$isSeparate     = 'separate' === $buttonPosition;
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-attributes='<?php echo esc_attr( wp_json_encode( $attributes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) ); ?>'
>
	<?php // Without JavaScript this plain form goes to the WordPress search page; the page script replaces it. ?>
	<div class='b-blocks-advanced-search'>
		<form class='b-blocks-advanced-search-form <?php echo $isSeparate ? 'is-separate' : 'is-nested'; ?>' role='search' action='<?php echo esc_url( home_url( '/' ) ); ?>' method='get'>
			<div class='b-blocks-advanced-search-field'>
				<?php if ( $attributes['searchField']['showIcon'] ?? true ) : ?>
					<span class='b-blocks-advanced-search-icon' aria-hidden='true'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true' focusable='false'><circle cx='11' cy='11' r='7' /><path d='m20 20-3.5-3.5' /></svg></span>
				<?php endif; ?>
				<input class='b-blocks-advanced-search-input' type='search' name='s' maxlength='<?php echo esc_attr( BBlocksAdvancedSearch::MAX_QUERY ); ?>' placeholder='<?php echo esc_attr( $placeholder ); ?>' aria-label='<?php echo esc_attr( '' !== $placeholder ? $placeholder : 'Search' ); ?>' />
				<?php if ( ! $isSeparate && ( $attributes['button']['show'] ?? true ) ) : ?>
					<button type='submit' class='b-blocks-advanced-search-button'><?php echo esc_html( $buttonText ); ?></button>
				<?php endif; ?>
			</div>
			<?php foreach ( $searchTypes as $searchType ) : ?>
				<input type='hidden' name='<?php echo 1 < count( $searchTypes ) ? 'post_type[]' : 'post_type'; ?>' value='<?php echo esc_attr( $searchType ); ?>' />
			<?php endforeach; ?>
			<?php if ( $cat ) : ?>
				<input type='hidden' name='cat' value='<?php echo esc_attr( implode( ',', $cat ) ); ?>' />
			<?php endif; ?>
			<?php if ( $isSeparate && ( $attributes['button']['show'] ?? true ) ) : ?>
				<button type='submit' class='b-blocks-advanced-search-button'><?php echo esc_html( $buttonText ); ?></button>
			<?php endif; ?>
		</form>
	</div>
</div>