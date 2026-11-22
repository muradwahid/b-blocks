import { sanitizeHtml } from '../../../utils/sanitizeHtml';
import { searchIcon } from '../../utils/icons';

// The submit button: text, icon (the picked library icon or the magnifier) or both.
const SearchButton = ( { attributes, labels = {} } ) => {
	const { button = {} } = attributes;
	const { show: showButton = true, type: buttonType = 'text', text: buttonText = '', icon: buttonIcon = '' } = button;

	if ( ! showButton ) {
		return null;
	}

	const iconHtml = buttonIcon ? sanitizeHtml( buttonIcon ) : '';
	// An empty button text reads "Search", as the page's form without JavaScript does.
	const buttonLabel = buttonText || labels.search;

	return <button type='submit' className={ `b-blocks-advanced-search-button is-${ buttonType }` } aria-label={ 'icon' === buttonType ? buttonLabel : undefined }>
		{ 'text' !== buttonType && ( iconHtml ? <span className='b-blocks-advanced-search-button-icon is-custom' aria-hidden='true' dangerouslySetInnerHTML={ { __html: iconHtml } } /> : <span className='b-blocks-advanced-search-button-icon' aria-hidden='true'>{ searchIcon }</span> ) }
		{ 'icon' !== buttonType && <span>{ buttonLabel }</span> }
	</button>;
};
export default SearchButton;
