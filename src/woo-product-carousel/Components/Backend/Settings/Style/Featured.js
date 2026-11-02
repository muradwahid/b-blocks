import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { pxEmPctUnits, pxUnits, stateOptions } from '../../../../utils/options';

// Featured presets only: the carousel's heading and the large first product.
const Featured = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { heading = {}, featured = {} } = attributes;

	// The button's text color, background, padding, border and radius: Normal / Hover.
	const [ buttonState, setButtonState ] = useState( 'normal' );
	const isHover = 'hover' === buttonState;

	const color = ( group, value, prop, label, defaultColor ) => <ColorControl
		className='mt10'
		label={ label }
		value={ value[ prop ] }
		defaultColor={ defaultColor }
		onChange={ ( val ) => updateObj( group, val, prop ) }
	/>;

	return <>
		<PanelBody className='bPlPanelBody' title={ __( 'Heading', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ heading.typo } onChange={ ( val ) => updateObj( 'heading', val, 'typo' ) } />
			{ color( 'heading', heading, 'textColor', __( 'Color:', 'b-blocks' ), '#1c2839' ) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Featured Product', 'b-blocks' ) } initialOpen={ false }>
			<UnitControl
				__next40pxDefaultSize
				label={<>{__('Width', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ featured[ device ]?.width }
				units={ pxEmPctUnits }
				min={ 0 }
				max={ String( featured[ device ]?.width ).endsWith( '%' ) ? 100 : 1000 }
				onChange={ ( val ) => updateObj( 'featured', val || '', device, 'width' ) }
			/>
			<p className='components-base-control__help'>{ __( 'Phones show it full width above the carousel.', 'b-blocks' ) }</p>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Height', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ featured[ device ]?.height }
				units={ pxUnits }
				min={ 0 }
				max={ 1500 }
				onChange={ ( val ) => updateObj( 'featured', val || '', device, 'height' ) }
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <>{ __( 'Column Gap', 'b-blocks' ) } <Device /></> }
				labelPosition='edge'
				help={ __( 'Between the large product and the carousel; above it on phones.', 'b-blocks' ) }
				value={ featured[ device ]?.gap }
				units={ pxUnits }
				min={ 0 }
				max={ 200 }
				onChange={ ( val ) => updateObj( 'featured', val || '', device, 'gap' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ featured[ device ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'featured', val, device, 'radius' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Content Padding', 'b-blocks' ) } <Device /></Flex> }
				values={ featured[ device ]?.padding }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'featured', val, device, 'padding' ) }
			/>

			<Background
				className='mt10'
				label={ __( 'Image Overlay:', 'b-blocks' ) }
				value={ featured.overlay }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'featured', val, 'overlay' ) }
			/>

			{ color( 'featured', featured, 'textColor', __( 'Text Color:', 'b-blocks' ), '#ffffff' ) }
			<Typography className='mt10' label={ __( 'Title Typography', 'b-blocks' ) } value={ featured.titleTypo } onChange={ ( val ) => updateObj( 'featured', val, 'titleTypo' ) } />
			<Typography className='mt10' label={ __( 'Price Typography', 'b-blocks' ) } value={ featured.priceTypo } onChange={ ( val ) => updateObj( 'featured', val, 'priceTypo' ) } />
			<Typography className='mt10' label={ __( 'Button Typography', 'b-blocks' ) } value={ featured.buttonTypo } onChange={ ( val ) => updateObj( 'featured', val, 'buttonTypo' ) } />

			{ /* The button: Normal / Hover. Keyed per state so each control reloads the other state's value. */ }
			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ buttonState } onChange={ ( val ) => setButtonState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<ColorControl
				key={ `button-color-${ buttonState }` }
				className='mt10'
				label={ __( 'Button Text Color:', 'b-blocks' ) }
				value={ featured.button?.[ buttonState ]?.color?.text }
				defaultColor={ isHover ? '' : '#252525' }
				onChange={ ( val ) => updateObj( 'featured', val, 'button', buttonState, 'color', 'text' ) }
			/>

			<Background
				key={ `button-bg-${ buttonState }` }
				className='mt10'
				label={ __( 'Button Background:', 'b-blocks' ) }
				value={ featured.button?.[ buttonState ]?.color?.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'featured', val, 'button', buttonState, 'color', 'bg' ) }
			/>

			<BoxControl
				key={ `button-padding-${ buttonState }` }
				className='mt10'
				label={ <Flex>{ __( 'Button Padding', 'b-blocks' ) } <Device /></Flex> }
				values={ featured.button?.[ buttonState ]?.[ device ]?.padding }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'featured', val, 'button', buttonState, device, 'padding' ) }
			/>

			<BorderBoxControl
				key={ `button-border-${ buttonState }` }
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Button Border', 'b-blocks' ) }
				value={ featured.button?.[ buttonState ]?.border }
				onChange={ ( val ) => updateObj( 'featured', val, 'button', buttonState, 'border' ) }
			/>

			<BoxControl
				key={ `button-radius-${ buttonState }` }
				className='mt10'
				label={ <Flex>{ __( 'Button Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ featured.button?.[ buttonState ]?.[ device ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'featured', val, 'button', buttonState, device, 'radius' ) }
			/>
		</PanelBody>
	</>;
};

export default Featured;
