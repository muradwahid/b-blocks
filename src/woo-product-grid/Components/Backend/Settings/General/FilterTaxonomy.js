import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, Spinner, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { useProductTaxonomies } from '../../hooks/useWooSearch';
import { alignOptions } from '../../../../utils/options';

const FilterTaxonomy = ( { attributes, updateObj } ) => {
	const { filter = {} } = attributes;

	const { taxonomies, isLoading } = useProductTaxonomies();

	return <PanelBody className='bPlPanelBody' title={ __( 'Filter By Taxonomy', 'b-blocks' ) } initialOpen={ false }>
		<ToggleControl
			className='mt10'
			label={ __( 'Show Filter By Taxonomy?', 'b-blocks' ) }
			checked={ !! filter.enable }
			onChange={ ( val ) => updateObj( 'filter', val, 'enable' ) }
		/>

		{ filter.enable && ( isLoading
			? <Spinner />
			: <>
				<SelectControl
					className='mt10'
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Select Taxonomy Type', 'b-blocks' ) }
					value={ filter.taxonomy }
					options={ taxonomies.length
						? taxonomies
						: [ { label: __( 'No product taxonomies found', 'b-blocks' ), value: '' } ] }
					onChange={ ( val ) => updateObj( 'filter', val, 'taxonomy' ) }
				/>

				<TextControl
					className='mt10'
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( '"All" Button Text', 'b-blocks' ) }
					value={ filter.allText }
					onChange={ ( val ) => updateObj( 'filter', val, 'allText' ) }
				/>

				<Flex className='mt20'>
					<Label className='flex2'>{ __( 'Alignment:', 'b-blocks' ) }</Label>
					<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ filter.align || 'left' } onChange={ ( val ) => updateObj( 'filter', val || 'left', 'align' ) }>
						{ alignOptions.map( ( o ) => <ToggleGroupControlOptionIcon key={ o.value } label={ o.label } value={ o.value } icon={ o.icon } /> ) }
					</ToggleGroupControl>
				</Flex>
			</> ) }
	</PanelBody>;
};

export default FilterTaxonomy;
