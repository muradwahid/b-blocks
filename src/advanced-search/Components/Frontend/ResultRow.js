import Highlight from './Highlight';

// A post: image, title, the date · author · category · type line, and the excerpt.
const ResultRow = ( { attributes, item, searched, stay, linkTarget } ) => {
	const { search = {}, thumb = {} } = attributes;
	const { showImage = false, showExcerpt = true, highlight = true, showDate = false, showType = false, showAuthor = false, showCategory = false } = search;

	return <a href={ item.url } onClick={ stay } tabIndex={ -1 } { ...linkTarget }>
		{ showImage && item.image && <img className='b-blocks-advanced-search-thumb' src={ item.image } srcSet={ item.srcset || undefined } sizes={ item.srcset ? ( /^\d+(\.\d+)?px$/.test( thumb.desktop?.size || '' ) ? thumb.desktop.size : '64px' ) : undefined } alt={ item.alt || '' } loading='lazy' /> }

		<span className='b-blocks-advanced-search-text'>
			<span className='b-blocks-advanced-search-title'>{ highlight ? <Highlight text={ item.title } query={ searched } /> : item.title }</span>
			{ [ showDate && item.date, showAuthor && item.author, showCategory && item.category, showType && item.type ].some( Boolean ) && <span className='b-blocks-advanced-search-meta'>{ [ showDate && item.date, showAuthor && item.author, showCategory && item.category, showType && item.type ].filter( Boolean ).join( ' · ' ) }</span> }
			{ showExcerpt && item.excerpt && <span className='b-blocks-advanced-search-excerpt'>{ highlight ? <Highlight text={ item.excerpt } query={ searched } /> : item.excerpt }</span> }
		</span>
	</a>;
};
export default ResultRow;
