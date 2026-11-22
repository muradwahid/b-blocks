import ResultOption from './ResultOption';
import ResultsFooter from './ResultsFooter';

// The open results: the not-found text (with the fallback heading), the list of rows and the footer.
const ResultsBox = ( { attributes, labels = {}, isBackend, showList, nothing, emptyText, rows, listId, active, onRowHover, searched, stay, linkTarget, total, totalLine, showViewAllLink, searchUrl, groups = [] } ) => {
	const { search = {}, totalResults = {} } = attributes;
	const { fallbackTitle = '' } = search;
	const { show: showTotal = true } = totalResults;
	const optionProps = { attributes, listId, active, onRowHover, searched, stay, linkTarget };

	return <div className='b-blocks-advanced-search-results' hidden={ ! showList }>
		{ nothing && '' !== emptyText && <p className='b-blocks-advanced-search-not-found'>{ emptyText }</p> }

		{ nothing && 0 < rows.length && '' !== fallbackTitle && <p className='b-blocks-advanced-search-fallback-title'>{ fallbackTitle }</p> }

		<ul id={ listId } className='b-blocks-advanced-search-list' role='listbox' aria-label={ labels.results }>
			{ 0 < groups.length && 0 < total ? <>
				{ /* Grouped (Pro): the matching terms first, then each post type under its heading ("Posts (8)"). */ }
				{ rows.map( ( item, i ) => item.isTerm && <ResultOption key={ `term-${ item.id }` } item={ item } i={ i } { ...optionProps } /> ) }

				{ groups.map( ( group ) => <li key={ group.type } className='b-blocks-advanced-search-group' role='group' aria-labelledby={ `${ listId }-group-${ group.type }` }>
					<span id={ `${ listId }-group-${ group.type }` } className='b-blocks-advanced-search-group-title'>{ `${ group.label } (${ group.total })` }</span>

					<ul className='b-blocks-advanced-search-group-items' role='none'>
						{ rows.map( ( item, i ) => ! item.isTerm && group.type === item.group && <ResultOption key={ item.id || i } item={ item } i={ i } { ...optionProps } /> ) }
					</ul>
				</li> ) }
			</> : rows.map( ( item, i ) => <ResultOption key={ item.isTerm ? `term-${ item.id }` : item.id || i } item={ item } i={ i } { ...optionProps } /> ) }
		</ul>

		{ 0 < total && ( showTotal || showViewAllLink ) && <ResultsFooter attributes={ attributes } totalLine={ totalLine } showViewAllLink={ showViewAllLink } searchUrl={ searchUrl } searched={ searched } isBackend={ isBackend } stay={ stay } linkTarget={ linkTarget } /> }
	</div>;
};
export default ResultsBox;
