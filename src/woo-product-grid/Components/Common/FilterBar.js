import { asText } from '../../utils/functions';

const FilterBar = ( { terms = [], activeTerm = 0, attributes, isLoading = false, labels = {}, onChange } ) => {
	const { enable: showTaxonomyFilter, allText: filterAllText } = attributes.filter || {};

	if ( ! showTaxonomyFilter || ! terms.length ) return null;

	const button = ( id, label ) => {
		const isActive = id === activeTerm;

		return <button
			key={ id }
			type='button'
			className={ `b-blocks-woo-product-grid-filter-btn${ isActive ? ' is-active' : '' }` }
			aria-pressed={ isActive }
			disabled={ isLoading }
			onClick={ () => ! isActive && onChange( id ) }
		>{ label }</button>;
	};

	return <div className='b-blocks-woo-product-grid-filter' role='group' aria-label={ labels.filter }>
		{ button( 0, asText( filterAllText ) ) }
		{ terms.map( ( term ) => button( term.id, term.name ) ) }
	</div>;
};

export default FilterBar;
