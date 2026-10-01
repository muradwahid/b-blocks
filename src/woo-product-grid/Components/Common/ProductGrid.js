import Style from './Style';
import FilterBar from './FilterBar';
import DisplayProducts from './DisplayProducts';
import Pager from './Pager';
import { wrapperClass } from '../../utils/data';

const ProductGrid = ( props ) => {
	const {
		attributes, id, isBackend = false, advancedCSS,
		products, terms, activeTerm, page, maxPages, isLoading, status, labels, hasError,
		onTerm, onPage
	} = props;

	const { type: layouts } = attributes.layout || {};
	const { align: badgeAlign } = attributes.badge || {};

	const classes = [
		wrapperClass,
		`${ wrapperClass }--${ layouts }`,
		`${ wrapperClass }--badge-${ badgeAlign }`
	].join( ' ' );

	const grid = <div className={ classes }>
		<FilterBar { ...{ terms, activeTerm, attributes, isLoading, labels, onChange: onTerm } } />

		<div className='b-blocks-woo-product-grid-status' aria-live='polite' aria-atomic='true'>{ status }</div>

		{ hasError && labels.error &&
			<p className='b-blocks-woo-product-grid-error' role='alert'>{ labels.error }</p> }

		<DisplayProducts { ...{ products, attributes, isLoading, isBackend, labels } } />

		<div className='b-blocks-woo-product-grid-pager-wrap'>
			<Pager { ...{ attributes, page, maxPages, isLoading, labels, onPage } } />
		</div>
	</div>;

	return <>
		<Style attributes={ attributes } id={ id } advancedCSS={ advancedCSS } />

		{ isBackend ? <div>{ grid }</div> : grid }
	</>;
};

export default ProductGrid;
