import Highlight from './Highlight';

// A matching category/tag: its name, taxonomy and post count; it opens the term page.
const TermRow = ( { attributes, item, searched, stay, linkTarget } ) => {
	const { search = {} } = attributes;
	const { highlight = true } = search;

	return <a href={ item.url } onClick={ stay } tabIndex={ -1 } { ...linkTarget }>
		<span className='b-blocks-advanced-search-text'>
			<span className='b-blocks-advanced-search-title'>{ highlight ? <Highlight text={ item.name } query={ searched } /> : item.name }</span>
			<span className='b-blocks-advanced-search-meta'>{ `${ item.taxonomy } · ${ item.count }` }</span>
		</span>
	</a>;
};
export default TermRow;
