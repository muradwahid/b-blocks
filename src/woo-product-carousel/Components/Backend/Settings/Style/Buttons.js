import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { pxEmUnits, stateOptions } from '../../../../utils/options';
import { HOVER_PRESETS, PRESET_HIDDEN } from '../../../../utils/data';

const Buttons = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { button = {}, viewButton = {}, badge = {} } = attributes;

	// Each button's text color, background, border, radius and shadow: Normal / Hover.
	const [ viewState, setViewState ] = useState( 'normal' );
	const [ buttonState, setButtonState ] = useState( 'normal' );

	const color = ( group, value, prop, label, defaultColor ) => <ColorControl
		className='mt10'
		label={ label }
		value={ value[ prop ] }
		defaultColor={ defaultColor }
		onChange={ ( val ) => updateObj( group, val, prop ) }
	/>;

	const background = ( group, value, prop, label ) => <Background
		className='mt10'
		label={ label }
		value={ value[ prop ] }
		isImage={ false }
		onChange={ ( val ) => updateObj( group, val, prop ) }
	/>;

	return <>
		{ ! PRESET_HIDDEN[ attributes.preset ]?.includes( 'view' ) && <PanelBody className='bPlPanelBody' title={ __( 'View Product Button', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ viewButton.typo } onChange={ ( val ) => updateObj( 'viewButton', val, 'typo' ) } />

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <>{ __( 'Icon Size', 'b-blocks' ) } <Device /></> }
				help={ __( 'Empty: in step with the text size.', 'b-blocks' ) }
				value={ viewButton[ device ]?.iconSize }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'viewButton', val || '', device, 'iconSize' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Padding', 'b-blocks' ) } <Device /></Flex> }
				values={ viewButton[ device ]?.padding }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'viewButton', val, device, 'padding' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Space', 'b-blocks' ) } <Device /></Flex> }
				values={ viewButton[ device ]?.margin }
				onChange={ ( val ) => updateObj( 'viewButton', val, device, 'margin' ) }
			/>

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ viewState } onChange={ ( val ) => setViewState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<ColorControl
				className='mt10'
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ viewButton[ viewState ]?.color?.text }
				defaultColor='#ffffff'
				onChange={ ( val ) => updateObj( 'viewButton', val, viewState, 'color', 'text' ) }
			/>

			{ /* Keyed per state so it reloads the other state's value; each key unique among its siblings. */ }
			<Background
				key={ `view-bg-${ viewState }` }
				className='mt10'
				label={ __( 'Background:', 'b-blocks' ) }
				value={ viewButton[ viewState ]?.color?.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'viewButton', val, viewState, 'color', 'bg' ) }
			/>

			<BorderBoxControl
				key={ `view-border-${ viewState }` }
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Border', 'b-blocks' ) }
				value={ viewButton[ viewState ]?.border }
				onChange={ ( val ) => updateObj( 'viewButton', val, viewState, 'border' ) }
			/>

			<BoxControl
				key={ `view-radius-${ viewState }` }
				className='mt10'
				label={ __( 'Border Radius', 'b-blocks' ) }
				values={ viewButton[ viewState ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'viewButton', val, viewState, 'radius' ) }
			/>

			<ShadowControl
				key={ `view-shadow-${ viewState }` }
				className='mt10'
				label={ __( 'Box Shadow', 'b-blocks' ) }
				value={ viewButton[ viewState ]?.shadow }
				onChange={ ( val ) => updateObj( 'viewButton', val, viewState, 'shadow' ) }
			/>
		</PanelBody> }

		{ attributes.elements?.cart && <PanelBody className='bPlPanelBody' title={ __( 'Cart Button', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ button.typo } onChange={ ( val ) => updateObj( 'button', val, 'typo' ) } />

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={ <>{ __( 'Icon Size', 'b-blocks' ) } <Device /></> }
				help={ __( 'Empty: in step with the text size.', 'b-blocks' ) }
				value={ button[ device ]?.iconSize }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'button', val || '', device, 'iconSize' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Padding', 'b-blocks' ) } <Device /></Flex> }
				values={ button[ device ]?.padding }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'button', val, device, 'padding' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Space', 'b-blocks' ) } <Device /></Flex> }
				values={ button[ device ]?.margin }
				onChange={ ( val ) => updateObj( 'button', val, device, 'margin' ) }
			/>

			{ /* Hover presets: the line between the two buttons of the bar. */ }
			{ HOVER_PRESETS.includes( attributes.preset ) && color( 'button', button, 'dividerColor', __( 'Divider Color:', 'b-blocks' ), 'rgba(255, 255, 255, 0.5)' ) }

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ buttonState } onChange={ ( val ) => setButtonState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<ColorControl
				className='mt10'
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ button[ buttonState ]?.color?.text }
				defaultColor='#ffffff'
				onChange={ ( val ) => updateObj( 'button', val, buttonState, 'color', 'text' ) }
			/>

			{ /* Keyed per state so it reloads the other state's value; each key unique among its siblings. */ }
			<Background
				key={ `cart-bg-${ buttonState }` }
				className='mt10'
				label={ __( 'Background:', 'b-blocks' ) }
				value={ button[ buttonState ]?.color?.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'button', val, buttonState, 'color', 'bg' ) }
			/>

			<BorderBoxControl
				key={ `cart-border-${ buttonState }` }
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Border', 'b-blocks' ) }
				value={ button[ buttonState ]?.border }
				onChange={ ( val ) => updateObj( 'button', val, buttonState, 'border' ) }
			/>

			<BoxControl
				key={ `cart-radius-${ buttonState }` }
				className='mt10'
				label={ __( 'Border Radius', 'b-blocks' ) }
				values={ button[ buttonState ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'button', val, buttonState, 'radius' ) }
			/>

			<ShadowControl
				key={ `cart-shadow-${ buttonState }` }
				className='mt10'
				label={ __( 'Box Shadow', 'b-blocks' ) }
				value={ button[ buttonState ]?.shadow }
				onChange={ ( val ) => updateObj( 'button', val, buttonState, 'shadow' ) }
			/>
		</PanelBody> }

		<PanelBody className='bPlPanelBody' title={ __( 'Sale Badge', 'b-blocks' ) } initialOpen={ false }>
			<Typography label={ __( 'Typography', 'b-blocks' ) } value={ badge.typo } onChange={ ( val ) => updateObj( 'badge', val, 'typo' ) } />
			{ color( 'badge', badge, 'textColor', __( 'Sale Text Color:', 'b-blocks' ), '#ffffff' ) }
			{ background( 'badge', badge, 'bgColor', __( 'Sale Text Background:', 'b-blocks' ) ) }

			<BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Border', 'b-blocks' ) }
				value={ badge.border }
				onChange={ ( val ) => updateObj( 'badge', val, 'border' ) }
			/>

			<BoxControl
				className='mt10'
				label={ <Flex>{ __( 'Border Radius', 'b-blocks' ) } <Device /></Flex> }
				values={ badge[ device ]?.radius }
				min={ 0 }
				onChange={ ( val ) => updateObj( 'badge', val, device, 'radius' ) }
			/>
		</PanelBody>
	</>;
};

export default Buttons;