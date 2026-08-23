import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, PanelRow, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { ColorControl, IconLibrary, Label } from '../../../../../../../bpl-tools/Components';
import { itemOrientationOptions, trendDirectionOptions } from '../../../../utils/options';

const ItemSettings = ( props ) => {
	const { attributes, updateObj, index } = props;
	const item = attributes.items[ index ] || {};

	const set = ( key, val ) => updateObj( 'items', val, index, key );

	return <>
		<IconLibrary label={ __( 'Icon', 'b-blocks' ) } value={ item.icon } onChange={ ( val ) => set( 'icon', val ) } />

		<PanelRow className='mt10'>
			<Label className=''>{ __( 'Orientation:', 'b-blocks' ) }</Label>
			<SelectControl value={ item.orientation || '' } options={ itemOrientationOptions } onChange={ ( val ) => set( 'orientation', val ) } />
		</PanelRow>

		<Flex className='mt10'>
			<FlexItem><TextControl label={ __( 'Prefix', 'b-blocks' ) } value={ item.prefix || '' } onChange={ ( val ) => set( 'prefix', val ) } placeholder='$' __nextHasNoMarginBottom /></FlexItem>
			<FlexItem><TextControl label={ __( 'Number', 'b-blocks' ) } value={ item.number || '' } onChange={ ( val ) => set( 'number', val ) } placeholder='500' __nextHasNoMarginBottom /></FlexItem>
			<FlexItem><TextControl label={ __( 'Suffix', 'b-blocks' ) } value={ item.suffix || '' } onChange={ ( val ) => set( 'suffix', val ) } placeholder='+' __nextHasNoMarginBottom /></FlexItem>
		</Flex>

		<TextControl className='mt10' label={ __( 'Label', 'b-blocks' ) } value={ item.label || '' } onChange={ ( val ) => set( 'label', val ) } placeholder={ __( 'e.g. Customers', 'b-blocks' ) } __nextHasNoMarginBottom />

		<TextControl className='mt10' label={ __( 'Description', 'b-blocks' ) } value={ item.description || '' } onChange={ ( val ) => set( 'description', val ) } help={ __( 'Optional one-line supporting text.', 'b-blocks' ) } __nextHasNoMarginBottom />

		<TextControl className='mt10' label={ __( 'Trend value', 'b-blocks' ) } value={ item.trendValue || '' } onChange={ ( val ) => set( 'trendValue', val ) } placeholder={ __( 'e.g. 34%', 'b-blocks' ) } help={ __( 'Leave blank to hide the trend badge.', 'b-blocks' ) } __nextHasNoMarginBottom />

		<PanelRow className='mt10'>
			<Label className=''>{ __( 'Trend direction:', 'b-blocks' ) }</Label>
			<SelectControl value={ item.trendDirection || 'up' } options={ trendDirectionOptions } onChange={ ( val ) => set( 'trendDirection', val ) } />
		</PanelRow>

		<ColorControl className='mt10' label={ __( 'Trend color override:', 'b-blocks' ) } value={ item.trendColor || '' } onChange={ ( val ) => set( 'trendColor', val ) } />

		<TextControl className='mt10' label={ __( 'Link URL', 'b-blocks' ) } type='url' value={ item.linkUrl || '' } onChange={ ( val ) => set( 'linkUrl', val ) } placeholder='https://' __nextHasNoMarginBottom />

		{ item.linkUrl && (
			<ToggleControl label={ __( 'Open link in new tab', 'b-blocks' ) } checked={ !! item.linkTarget } onChange={ ( val ) => set( 'linkTarget', val ) } />
		) }
	</>;
};

export default ItemSettings;
