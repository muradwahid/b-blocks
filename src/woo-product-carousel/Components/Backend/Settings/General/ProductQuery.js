import { __ } from '@wordpress/i18n';
import { Flex, Notice, PanelBody, SelectControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import AsyncTokenField from '../../Controls/AsyncTokenField';
import { orderByOptions, orderOptions, queryTypeOptions, taxModeOptions } from '../../../../utils/options';

const MAX_PRODUCTS = 48;

const clamp = ( val, min, max, fallback ) => {
	const num = parseInt( val, 10 );
	if ( Number.isNaN( num ) ) return fallback;
	return Math.min( max, Math.max( min, num ) );
};

const ProductQuery = ( { attributes, updateObj, hasBrands } ) => {
	const { query = {} } = attributes;

	const isRelated = 'related' === query.type;

	const set = ( key ) => ( val ) => updateObj( 'query', val, key );

	// Include / Exclude switch and its search; the labels follow the mode.
	const taxonomy = ( { title, modeKey, valueKey, slug, include, exclude, placeholder } ) => <>
		<Flex className='mt20'>
			<Label className='flex2'>{ title }</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ query[ modeKey ] } onChange={ ( val ) => updateObj( 'query', val || 'include', modeKey ) }>
				{ taxModeOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>
		</Flex>

		<AsyncTokenField
			label={ 'exclude' === query[ modeKey ] ? exclude : include }
			placeholder={ placeholder }
			type='term'
			taxonomy={ slug }
			value={ query[ valueKey ] }
			onChange={ set( valueKey ) }
		/>
	</>;

	return <PanelBody className='bPlPanelBody' title={ __( 'Product Query', 'b-blocks' ) } initialOpen={ false }>
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Query Type', 'b-blocks')}
			labelPosition='edge'
			value={ query.type }
			options={ queryTypeOptions }
			onChange={ set( 'type' ) }
		/>

		{ isRelated && <Notice className='mt10' status='info' isDismissible={ false }>
			{ __( 'Related Products uses WooCommerce’s related products on a single product page. Anywhere else the carousel shows the newest products.', 'b-blocks' ) }
		</Notice> }

		{ ! isRelated && <>
			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Order By', 'b-blocks')}
				labelPosition='edge'
				help={ 'rand' === query.orderBy ? __( 'A new pick on every page load, and a different one here. Page caching keeps one pick until the cache clears.', 'b-blocks' ) : undefined }
				value={ query.orderBy }
				options={ orderByOptions }
				onChange={ set( 'orderBy' ) }
			/>

			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Order', 'b-blocks')}
				labelPosition='edge'
				value={ query.order }
				options={ orderOptions }
				onChange={ set( 'order' ) }
			/>
		</> }

		<NumberControl
			className='mt10'
			__next40pxDefaultSize
			label={__('Products Per Page', 'b-blocks')}
			labelPosition='edge'
			help={ __( 'How many products the carousel loads in total (up to 48).', 'b-blocks' ) }
			value={ query.perPage }
			onChange={ ( val ) => updateObj( 'query', clamp( val, 1, MAX_PRODUCTS, 4 ), 'perPage' ) }
			min={ 1 }
			max={ MAX_PRODUCTS }
			step={ 1 }
		/>

		{ ! isRelated && <>
			<NumberControl
				className='mt10'
				__next40pxDefaultSize
				label={__('Offset', 'b-blocks')}
				labelPosition='edge'
				value={ query.offset }
				onChange={ ( val ) => updateObj( 'query', clamp( val, 0, 10000, 0 ), 'offset' ) }
				min={ 0 }
				step={ 1 }
			/>

			<AsyncTokenField
				label={ __( 'Include Products', 'b-blocks' ) }
				placeholder={ __( 'Search Products', 'b-blocks' ) }
				type='product'
				value={ query.include }
				onChange={ set( 'include' ) }
			/>
		</> }

		<AsyncTokenField
			label={ __( 'Exclude Products', 'b-blocks' ) }
			placeholder={ __( 'Search Products', 'b-blocks' ) }
			type='product'
			value={ query.exclude }
			onChange={ set( 'exclude' ) }
		/>

		{ ! isRelated && <>
			{ taxonomy( {
				title: __( 'Product Categories:', 'b-blocks' ),
				modeKey: 'categoryMode',
				valueKey: 'categories',
				slug: 'product_cat',
				include: __( 'Include Categories', 'b-blocks' ),
				exclude: __( 'Exclude Categories', 'b-blocks' ),
				placeholder: __( 'Search Product Categories', 'b-blocks' )
			} ) }

			{ taxonomy( {
				title: __( 'Product Tags:', 'b-blocks' ),
				modeKey: 'tagMode',
				valueKey: 'tags',
				slug: 'product_tag',
				include: __( 'Include Tags', 'b-blocks' ),
				exclude: __( 'Exclude Tags', 'b-blocks' ),
				placeholder: __( 'Search Product Tags', 'b-blocks' )
			} ) }

			{ hasBrands
				? taxonomy( {
					title: __( 'Product Brands:', 'b-blocks' ),
					modeKey: 'brandMode',
					valueKey: 'brands',
					slug: 'product_brand',
					include: __( 'Include Brands', 'b-blocks' ),
					exclude: __( 'Exclude Brands', 'b-blocks' ),
					placeholder: __( 'Search Product Brands', 'b-blocks' )
				} )
				: <p className='mt20 components-base-control__help'>
					{ __( 'Product Brands needs WooCommerce Brands (WooCommerce 9.6 or later).', 'b-blocks' ) }
				</p> }
		</> }
	</PanelBody>;
};

export default ProductQuery;