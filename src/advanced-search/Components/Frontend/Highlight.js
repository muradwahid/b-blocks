// The words of the query, each escaped for a regular expression (".*+?" and the like are plain text here).
const wordsOf = ( query ) => String( query ).trim().split( /\s+/ ).filter( Boolean ).map( ( word ) => word.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) );

// Text with every word of the query wrapped in <mark>. Built from text nodes: nothing from the server or the visitor
// ever becomes markup. Case-insensitive and Unicode-aware (Bangla, Arabic…).
const Highlight = ( { text = '', query = '' } ) => {
	const words = wordsOf( query );
	if ( ! words.length || ! text ) {
		return text;
	}
	const pattern = new RegExp( `(${ words.join( '|' ) })`, 'giu' );
	return String( text ).split( pattern ).map( ( part, i ) => ( 1 === i % 2 ? <mark key={ i }>{ part }</mark> : part ) );
};
export default Highlight;
