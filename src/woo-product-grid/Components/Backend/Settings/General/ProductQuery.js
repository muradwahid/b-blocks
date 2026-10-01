import { __ } from '@wordpress/i18n';
import { Flex, Notice, PanelBody, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import AsyncTokenField from '../../Controls/AsyncTokenField';
import { orderByOptions, orderOptions, queryTypeOptions, taxModeOptions } from '../../../../utils/options';

const MAX_PER_PAGE = 48;

const ProductQuery = ( { attributes, updateObj } ) => {
	const { query = {} } = attributes;

	const isRelated = 'related' === query.type;

	const clamp = ( val, min, max, fallback ) => {
		const num = parseInt( val, 10 );
		if ( Number.isNaN( num ) ) return fallback;
		return Math.min( max, Math.max( min, num ) );
	};

	const set = ( key ) => ( val ) => updateObj( 'query', val, key );

	return <PanelBody className='bPlPanelBody' title={ __( 'Product Query', 'b-blocks' ) } initialOpen={ false }>
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Query Type', 'b-blocks' ) }
			value={ query.type }
			options={ queryTypeOptions }
			onChange={ set( 'type' ) }
		/>

		{ isRelated && <Notice className='mt10' status='info' isDismissible={ false }>
			{ __( 'Related Products only resolves on a single product page. Anywhere else the grid falls back to the newest products.', 'b-blocks' ) }
		</Notice> }

		{ ! isRelated && <>
			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Order By', 'b-blocks' ) }
				value={ query.orderBy }
				options={ orderByOptions }
				onChange={ set( 'orderBy' ) }
			/>

			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Order', 'b-blocks' ) }
				value={ query.order }
				options={ orderOptions }
				onChange={ set( 'order' ) }
			/>
		</> }

		<NumberControl
			className='mt10'
			__next40pxDefaultSize
			label={ __( 'Products Per Page', 'b-blocks' ) }
			value={ query.perPage }
			onChange={ ( val ) => updateObj( 'query', clamp( val, 1, MAX_PER_PAGE, 4 ), 'perPage' ) }
			min={ 1 }
			max={ MAX_PER_PAGE }
			step={ 1 }
		/>

		{ ! isRelated && <>
			<NumberControl
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Offset', 'b-blocks' ) }
				value={ query.offset }
				onChange={ ( val ) => updateObj( 'query', clamp( val, 0, 1000, 0 ), 'offset' ) }
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

			<AsyncTokenField
				label={ __( 'Exclude Products', 'b-blocks' ) }
				placeholder={ __( 'Search Products', 'b-blocks' ) }
				type='product'
				value={ query.exclude }
				onChange={ set( 'exclude' ) }
			/>

			<Flex className='mt20'>
				<Label className='flex2'>{ __( 'Product Categories:', 'b-blocks' ) }</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ query.categoryMode } onChange={ ( val ) => updateObj( 'query', val || 'include', 'categoryMode' ) }>
					{ taxModeOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
				</ToggleGroupControl>
			</Flex>

			<AsyncTokenField
				label={ 'exclude' === query.categoryMode ? __( 'Exclude Categories', 'b-blocks' ) : __( 'Include Categories', 'b-blocks' ) }
				placeholder={ __( 'Search Product Categories', 'b-blocks' ) }
				type='term'
				taxonomy='product_cat'
				value={ query.categories }
				onChange={ set( 'categories' ) }
			/>

			<Flex className='mt20'>
				<Label className='flex2'>{ __( 'Product Tags:', 'b-blocks' ) }</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ query.tagMode } onChange={ ( val ) => updateObj( 'query', val || 'include', 'tagMode' ) }>
					{ taxModeOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
				</ToggleGroupControl>
			</Flex>

			<AsyncTokenField
				label={ 'exclude' === query.tagMode ? __( 'Exclude Tags', 'b-blocks' ) : __( 'Include Tags', 'b-blocks' ) }
				placeholder={ __( 'Search Product Tags', 'b-blocks' ) }
				type='term'
				taxonomy='product_tag'
				value={ query.tags }
				onChange={ set( 'tags' ) }
			/>

			<ToggleControl
				className='mt10'
				label={ __( 'On Sale Only', 'b-blocks' ) }
				checked={ !! query.onSaleOnly }
				onChange={ set( 'onSaleOnly' ) }
			/>

			<ToggleControl
				className='mt10'
				label={ __( 'Featured Only', 'b-blocks' ) }
				checked={ !! query.featuredOnly }
				onChange={ set( 'featuredOnly' ) }
			/>
		</> }

		<TextControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'No Products Message', 'b-blocks' ) }
			help={ __( 'Shown when the query returns nothing.', 'b-blocks' ) }
			value={ query.noProductsMessage }
			onChange={ set( 'noProductsMessage' ) }
		/>
	</PanelBody>;
};

export default ProductQuery;
