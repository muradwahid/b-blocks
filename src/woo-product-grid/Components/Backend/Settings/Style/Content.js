import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { at } from '../../../../utils/functions';

const Content = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { title = {}, price = {}, rating = {}, category = {}, sold = {} } = attributes;

	const progress = sold.progress || {};

	return <>
		<PanelBody className='bPlPanelBody' title={ __( 'Title', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography:', 'b-blocks' ) }
				value={ title.typo }
				onChange={ ( val ) => updateObj( 'title', val, 'typo' ) }
			/>

			<ColorControl
				className='mt20'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ title.normal?.color }
				defaultColor='#070127'
				onChange={ ( val ) => updateObj( 'title', val, 'normal', 'color' ) }
			/>

			<ColorControl
				label={ __( 'Hover Color:', 'b-blocks' ) }
				value={ title.hover?.color }
				defaultColor='#146EF5'
				onChange={ ( val ) => updateObj( 'title', val, 'hover', 'color' ) }
			/>

			<RangeControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Transition (s)', 'b-blocks' ) }
				help={ __( 'How long the change to the hover colour takes.', 'b-blocks' ) }
				value={ title.transition }
				onChange={ ( val ) => updateObj( 'title', val ?? 0, 'transition' ) }
				min={ 0 }
				max={ 2 }
				step={ 0.05 }
				allowReset
				resetFallbackValue={ 0.2 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Price', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography:', 'b-blocks' ) }
				value={ price.typo }
				onChange={ ( val ) => updateObj( 'price', val, 'typo' ) }
			/>

			<ColorControl
				className='mt20'
				label={ __( 'Price Color:', 'b-blocks' ) }
				value={ price.color }
				defaultColor='#e44d3a'
				onChange={ ( val ) => updateObj( 'price', val, 'color' ) }
			/>

			<ColorControl
				label={ __( 'Strikethrough Regular Price:', 'b-blocks' ) }
				value={ price.regularColor }
				defaultColor='#999999'
				onChange={ ( val ) => updateObj( 'price', val, 'regularColor' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Rating', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Star Color:', 'b-blocks' ) }
				value={ rating.color }
				defaultColor='#f5a623'
				onChange={ ( val ) => updateObj( 'rating', val, 'color' ) }
			/>

			<ColorControl
				className='mt10'
				label={ __( 'Empty Star Color:', 'b-blocks' ) }
				value={ rating.emptyColor }
				defaultColor='#d1d5db'
				onChange={ ( val ) => updateObj( 'rating', val, 'emptyColor' ) }
			/>

			<ColorControl
				className='mt10'
				label={ __( 'Review Count Color:', 'b-blocks' ) }
				value={ rating.countColor }
				defaultColor='#64748b'
				onChange={ ( val ) => updateObj( 'rating', val, 'countColor' ) }
			/>

			<RangeControl
				className='mt10'
				label={ __( 'Star Size (px)', 'b-blocks' ) }
				value={ rating.size }
				onChange={ ( val ) => updateObj( 'rating', val ?? 14, 'size' ) }
				min={ 8 }
				max={ 40 }
				allowReset
				resetFallbackValue={ 14 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Category', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography:', 'b-blocks' ) }
				value={ category.typo }
				onChange={ ( val ) => updateObj( 'category', val, 'typo' ) }
			/>

			<ColorControl
				className='mt20'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ category.normal?.color }
				defaultColor='#6b7280'
				onChange={ ( val ) => updateObj( 'category', val, 'normal', 'color' ) }
			/>

			<ColorControl
				label={ __( 'Hover Color:', 'b-blocks' ) }
				value={ category.hover?.color }
				defaultColor='#146EF5'
				onChange={ ( val ) => updateObj( 'category', val, 'hover', 'color' ) }
			/>

			<RangeControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Transition (s)', 'b-blocks' ) }
				help={ __( 'How long the change to the hover colour takes.', 'b-blocks' ) }
				value={ category.transition }
				onChange={ ( val ) => updateObj( 'category', val ?? 0, 'transition' ) }
				min={ 0 }
				max={ 2 }
				step={ 0.05 }
				allowReset
				resetFallbackValue={ 0.2 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Sold Count', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography:', 'b-blocks' ) }
				value={ sold.typo }
				onChange={ ( val ) => updateObj( 'sold', val, 'typo' ) }
			/>

			<ColorControl
				className='mt20'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ sold.color }
				defaultColor='#6b7280'
				onChange={ ( val ) => updateObj( 'sold', val, 'color' ) }
			/>

			<Background
				label={ __( 'Background:', 'b-blocks' ) }
				value={ sold.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'sold', val, 'bg' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Progress Bar', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Track Color:', 'b-blocks' ) }
				value={ progress.trackColor }
				defaultColor='#e2e8f0'
				onChange={ ( val ) => updateObj( 'sold', val, 'progress', 'trackColor' ) }
			/>

			<ColorControl
				label={ __( 'Fill Color:', 'b-blocks' ) }
				value={ progress.fillColor }
				defaultColor='#146EF5'
				onChange={ ( val ) => updateObj( 'sold', val, 'progress', 'fillColor' ) }
			/>

			<RangeControl
				className='mt10'
				label={ __( 'Height (px)', 'b-blocks' ) }
				value={ progress.height }
				onChange={ ( val ) => updateObj( 'sold', val ?? 6, 'progress', 'height' ) }
				min={ 2 }
				max={ 24 }
				allowReset
				resetFallbackValue={ 6 }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ at( progress, device, 'radius' ) }
				onChange={(val) => updateObj('sold', val, 'progress', device, 'radius')}
			/>
		</PanelBody>
	</>;
};

export default Content;
