import { closeIcon, searchIcon } from '../../utils/icons';
import SearchButton from './SearchButton';

// The form: field (icon, input, "/" hint, loader, clear button, the button when Inside), the hidden post type and
// category inputs the full results page needs, and the button when Separate.
const SearchForm = ( { attributes, labels = {}, isBackend, home, searchTypes, cat, filter, filterTerm, setFilterTerm, inputRef, query, setQuery, setComposing, placeholderText, isLoading, showList, listId, active, onKeyDown, onSubmit, onFocus, clear } ) => {
	const { searchField = {}, button = {} } = attributes;
	const { placeholder = '', showIcon: showSearchIcon = true, shortcut = false, shortcutHint = false, filterAllText = 'All' } = searchField;
	const { position: buttonPosition = 'separate' } = button;
	const isSeparate = 'separate' === buttonPosition;
	const hasText = '' !== query;

	return <form className={ `b-blocks-advanced-search-form ${ isSeparate ? 'is-separate' : 'is-nested' }` } role='search' action={ home } method='get' onSubmit={ onSubmit }>
		<div className='b-blocks-advanced-search-field'>
			{ showSearchIcon && <span className='b-blocks-advanced-search-icon' aria-hidden='true'>{ searchIcon }</span> }

			{ 0 < ( filter?.terms?.length || 0 ) && <select className='b-blocks-advanced-search-filter' name={ filter.name || undefined } value={ filterTerm } aria-label={ filter.label } onChange={ ( e ) => setFilterTerm( e.target.value ) }>
				<option value=''>{ filterAllText }</option>
				{ filter.terms.map( ( t ) => <option key={ t.id } value={ t.slug }>{ t.name }</option> ) }
			</select> }

			<input
				ref={ inputRef }
				className='b-blocks-advanced-search-input'
				type='search'
				name='s'
				value={ query }
				placeholder={ placeholderText }
				autoComplete='off'
				role='combobox'
				aria-label={ placeholder || labels.search }
				aria-keyshortcuts={ shortcut && ! isBackend ? '/' : undefined }
				aria-expanded={ showList }
				aria-controls={ listId }
				aria-autocomplete='list'
				aria-activedescendant={ showList && 0 <= active ? `${ listId }-${ active }` : undefined }
				maxLength={ 100 }
				onChange={ ( e ) => setQuery( e.target.value ) }
				onCompositionStart={ () => setComposing( true ) }
				onCompositionEnd={ ( e ) => {
					setComposing( false );
					setQuery( e.target.value );
				} }
				onKeyDown={ onKeyDown }
				onFocus={ onFocus }
			/>

			{ shortcut && shortcutHint && ! hasText && <kbd className='b-blocks-advanced-search-hint' aria-hidden='true'>/</kbd> }

			{ isLoading && <span className='b-blocks-advanced-search-loader' role='status' aria-label={ labels.loading } /> }

			{ hasText && ! isLoading && <button type='button' className='b-blocks-advanced-search-clear' aria-label={ labels.clear } onClick={ clear }>{ closeIcon }</button> }

			{ ! isSeparate && <SearchButton attributes={ attributes } labels={ labels } /> }
		</div>

		{ searchTypes.map( ( type ) => <input key={ type } type='hidden' name={ 1 < searchTypes.length ? 'post_type[]' : 'post_type' } value={ type } /> ) }

		{ cat && <input type='hidden' name='cat' value={ cat } /> }

		{ isSeparate && <SearchButton attributes={ attributes } labels={ labels } /> }
	</form>;
};
export default SearchForm;
