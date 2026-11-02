import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, SelectControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { objectFitOptions, pxEmPctUnits, pxEmUnits, stateOptions } from '../../../../utils/options';
import { CENTERED_PRESETS } from '../../../../utils/data';

const Elements = ( { attributes, updateObj, device = 'desktop', has = () => true } ) => {
	const { category = {}, image = {}, title = {}, price = {}, rating = {} } = attributes;

	// Image border, radius and shadow: Normal / Hover.
	const [ imageState, setImageState ] = useState( 'normal' );

	const box = ( group, value, prop, label ) => <BoxControl
		className='mt10'
		label={ <Flex>{ label } <Device /></Flex> }
		values={ value[ device ]?.[ prop ] }
		min={ 'padding' === prop ? 0 : undefined }
		onChange={ ( val ) => updateObj( group, val, device, prop ) }
	/>;

	const color = ( group, value, prop, label, defaultColor, className = '' ) => <ColorControl
		className={ className }
		label={ label }
		value={ value[ prop ] }
		defaultColor={ defaultColor }
		onChange={ ( val ) => updateObj( group, val, prop ) }
	/>;

	return <>
		{ has( 'category' ) && <PanelBody className='bPlPanelBody' title={ __( 'Category', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ category.typo } onChange={ ( val ) => updateObj( 'category', val, 'typo' ) } />
			<ColorControl
				className='mt10'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ category.normal?.color?.text }
				defaultColor='#6b7280'
				onChange={ ( val ) => updateObj( 'category', val, 'normal', 'color', 'text' ) }
			/>
			<ColorControl
				className='mt10'
				label={ __( 'Hover Color:', 'b-blocks' ) }
				value={ category.hover?.color?.text }
				defaultColor='#146EF5'
				onChange={ ( val ) => updateObj( 'category', val, 'hover', 'color', 'text' ) }
			/>
			{ box( 'category', category, 'padding', __( 'Padding', 'b-blocks' ) ) }
		</PanelBody> }

		<PanelBody className='bPlPanelBody' title={ __( 'Image', 'b-blocks' ) } initialOpen={ false }>
			<UnitControl
				__next40pxDefaultSize
				label={ <>{ __( 'Width', 'b-blocks' ) } <Device /></> }
				help={ CENTERED_PRESETS.includes( attributes.preset ) ? __( 'The slide’s width in this preset.', 'b-blocks' ) : undefined }
				value={ image[ device ]?.width }
				units={ pxEmPctUnits }
				min={ 0 }
				max={ String( image[ device ]?.width ).endsWith( '%' ) ? 100 : 1000 }
				onChange={ ( val ) => updateObj( 'image', val || '', device, 'width' ) }
			/>

			{ ! image.autoHeight && <UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <>{ __( 'Height', 'b-blocks' ) } <Device /></> }
				value={ image[ device ]?.height }
				// No %: the image area's height comes from the card, so a percentage has nothing fixed to measure against.
				units={ pxEmUnits }
				min={ 0 }
				max={ 1000 }
				onChange={ ( val ) => updateObj( 'image', val || '', device, 'height' ) }
			/> }

			<SelectControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Object Fit', 'b-blocks' ) }
				labelPosition='edge'
				value={ image.fit }
				options={ objectFitOptions }
				onChange={ ( val ) => updateObj( 'image', val, 'fit' ) }
			/>

			<ToggleControl
				className='mt10'
				__nextHasNoMarginBottom
				label={ __( 'Auto Height', 'b-blocks' ) }
				help={ __( 'Each image keeps its own aspect ratio; Height is ignored.', 'b-blocks' ) }
				checked={ !! image.autoHeight }
				onChange={ ( val ) => updateObj( 'image', val, 'autoHeight' ) }
			/>

			<Background
				className='mt10'
				label={ __( 'Image Wrapper Background:', 'b-blocks' ) }
				value={ image.normal?.color?.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'image', val, 'normal', 'color', 'bg' ) }
			/>
			{ /* Shown while the card is hovered or has keyboard focus. */ }
			<Background
				className='mt10'
				label={ __( 'Image Overlay Color:', 'b-blocks' ) }
				value={ image.hover?.color?.overlay }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'image', val, 'hover', 'color', 'overlay' ) }
			/>
			<p className='components-base-control__help'>{ __( 'Shown over the image while the card is hovered or focused.', 'b-blocks' ) }</p>

			{ box( 'image', image, 'padding', __( 'Padding', 'b-blocks' ) ) }

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ imageState } onChange={ ( val ) => setImageState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Border', 'b-blocks' ) }
				value={ image[ imageState ]?.border }
				onChange={ ( val ) => updateObj( 'image', val, imageState, 'border' ) }
			/>

			<BoxControl
				className='mt10'
				label={ __( 'Border Radius', 'b-blocks' ) }
				values={ image[ imageState ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'image', val, imageState, 'radius' ) }
			/>

			<ShadowControl
				key={ imageState }
				className='mt10'
				label={ __( 'Box Shadow', 'b-blocks' ) }
				value={ image[ imageState ]?.shadow }
				onChange={ ( val ) => updateObj( 'image', val, imageState, 'shadow' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Product Title', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ title.typo } onChange={ ( val ) => updateObj( 'title', val, 'typo' ) } />
			<ColorControl
				className='mt10'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ title.normal?.color?.text }
				defaultColor='#444ce7'
				onChange={ ( val ) => updateObj( 'title', val, 'normal', 'color', 'text' ) }
			/>
			<ColorControl
				className='mt10'
				label={ __( 'Hover Color:', 'b-blocks' ) }
				value={ title.hover?.color?.text }
				defaultColor='#101728'
				onChange={ ( val ) => updateObj( 'title', val, 'hover', 'color', 'text' ) }
			/>
			{ box( 'title', title, 'margin', __( 'Space', 'b-blocks' ) ) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Product Price', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ price.typo } onChange={ ( val ) => updateObj( 'price', val, 'typo' ) } />
			{ color( 'price', price, 'textColor', __( 'Price Color:', 'b-blocks' ), '#101728', 'mt10' ) }
			{ color( 'price', price, 'saleColor', __( 'Sale Price Color:', 'b-blocks' ), '#c0362a', 'mt10' ) }
			{ box( 'price', price, 'margin', __( 'Space', 'b-blocks' ) ) }
		</PanelBody>

		{ has( 'rating' ) && <PanelBody className='bPlPanelBody' title={ __( 'Product Rating', 'b-blocks' ) } initialOpen={ false }>
			{ color( 'rating', rating, 'iconColor', __( 'Rating Color:', 'b-blocks' ), '#f5a623' ) }

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <>{ __( 'Icon Size', 'b-blocks' ) } <Device /></> }
				value={ rating[ device ]?.size }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'rating', val || '', device, 'size' ) }
			/>

			{ box( 'rating', rating, 'margin', __( 'Space', 'b-blocks' ) ) }
		</PanelBody> }
	</>;
};

export default Elements;
