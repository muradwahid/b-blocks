// Under the results: the total line and the View All link to the full results page.
const ResultsFooter = ( { attributes, totalLine, showViewAllLink, searchUrl, searched, isBackend, stay, linkTarget } ) => {
	const { totalResults = {}, viewAll = {} } = attributes;
	const { show: showTotal = true } = totalResults;
	const { text: viewAllText = '' } = viewAll;

	return <div className='b-blocks-advanced-search-footer'>
		{ showTotal && <p className='b-blocks-advanced-search-total'>{ totalLine }</p> }

		{ showViewAllLink && <a className='b-blocks-advanced-search-view-all' href={ isBackend ? '#' : searchUrl( searched ) } onClick={ stay } { ...linkTarget }>{ viewAllText }</a> }
	</div>;
};
export default ResultsFooter;
