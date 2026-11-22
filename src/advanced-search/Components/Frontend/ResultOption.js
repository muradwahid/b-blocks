import TermRow from './TermRow';
import ResultRow from './ResultRow';

// One option of the list: its id (for the arrow keys), the active state and the mouse hover; a term or a post inside.
const ResultOption = ( { attributes, item, i, listId, active, onRowHover, searched, stay, linkTarget } ) => <li
	id={ `${ listId }-${ i }` }
	className={ `b-blocks-advanced-search-item${ item.isTerm ? ' is-term' : '' }${ i === active ? ' is-active' : '' }` }
	role='option'
	aria-selected={ i === active }
	onMouseEnter={ () => onRowHover( i ) }
>
	{ item.isTerm ? <TermRow attributes={ attributes } item={ item } searched={ searched } stay={ stay } linkTarget={ linkTarget } /> : <ResultRow attributes={ attributes } item={ item } searched={ searched } stay={ stay } linkTarget={ linkTarget } /> }
</li>;
export default ResultOption;
