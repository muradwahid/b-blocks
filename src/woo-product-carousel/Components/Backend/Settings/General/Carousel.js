import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device } from '../../../../../../../bpl-tools/Components';
import { dotPresetOptions, msUnits, pctUnits, pxUnits } from '../../../../utils/options';
import { CENTERED_PRESETS, FEATURED_PRESETS, slidesFallback } from '../../../../utils/data';

const Carousel = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { options = {} } = attributes;

	const toggle = ( key, label, help ) => <ToggleControl
		className='mt10'
		__nextHasNoMarginBottom
		label={ label }
		help={ help }
		checked={ !! options[ key ] }
		onChange={ ( val ) => updateObj( 'options', val, key ) }
	/>;

	return <PanelBody className='bPlPanelBody' title={ __( 'Carousel', 'b-blocks' ) } initialOpen={ true }>
		{ toggle( 'arrows', __( 'Show Arrows', 'b-blocks' ) ) }
		{ toggle( 'equalHeight', __( 'Equal Height', 'b-blocks' ), __( 'Every card is as tall as the tallest, with the buttons lined up at the bottom.', 'b-blocks' ) ) }
		{ toggle( 'autoplay', __( 'Autoplay', 'b-blocks' ), __( 'Paused in the editor; plays on the page.', 'b-blocks' ) ) }
		{ /* Featured presets may repeat the products to loop, so they have no dots. */ }
		{ ! FEATURED_PRESETS.includes( attributes.preset ) && toggle( 'dots', __( 'Dots', 'b-blocks' ) ) }
		{ toggle( 'infinite', __( 'Infinite', 'b-blocks' ), CENTERED_PRESETS.includes( attributes.preset )
			? __( 'With too few products to fill the width, they repeat so the loop never ends.', 'b-blocks' )
			: __( 'Turns itself off while every product fits in view.', 'b-blocks' ) ) }
		{ options.autoplay && toggle( 'pauseOnHover', __( 'Pause on Hover', 'b-blocks' ) ) }
		{ options.autoplay && toggle( 'pauseButton', __( 'Show Pause Button', 'b-blocks' ), __( 'Lets visitors stop the slides. Off: it appears only when reached with the keyboard.', 'b-blocks' ) ) }

		{ /* Centred presets fit in as many Image Width slides as there is room for. Saved as the slider's number;
		   older blocks saved '4', which the slider reads the same. */ }
		{ ! CENTERED_PRESETS.includes( attributes.preset ) && <RangeControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ <>{ __( 'Slides To Show', 'b-blocks' ) } <Device /></> }
			value={ Number( options[ device ]?.slides ) || slidesFallback[ device ] }
			onChange={ ( val ) => updateObj( 'options', val, device, 'slides' ) }
			min={ 1 }
			max={ 6 }
			step={ 1 }
			allowReset
			resetFallbackValue={ slidesFallback[ device ] }
		/> }

		{ /* Centred presets: the slides beside the active one are shown smaller and blurred. */ }
		{ CENTERED_PRESETS.includes( attributes.preset ) && <>
			<UnitControl
				className='mt20'
				__next40pxDefaultSize
				label={ __( 'Side Slides Size', 'b-blocks' ) }
				labelPosition='edge'
				help={ __( 'Of the active slide; 100% shows them all the same size.', 'b-blocks' ) }
				units={ pctUnits }
				value={ options.sideScale }
				onChange={ ( val ) => updateObj( 'options', val || '', 'sideScale' ) }
				min={ 0 }
				max={ 100 }
			/>

			<UnitControl
				className='mt20'
				__next40pxDefaultSize
				label={ __( 'Side Slides Blur', 'b-blocks' ) }
				labelPosition='edge'
				units={ pxUnits }
				value={ options.sideBlur }
				onChange={ ( val ) => updateObj( 'options', val || '', 'sideBlur' ) }
				min={ 0 }
				max={ 50 }
			/>
		</> }

		{ options.autoplay && <UnitControl
			className='mt20'
			__next40pxDefaultSize
			label={__('Autoplay Speed', 'b-blocks')}
			labelPosition='edge'
			help={ __( 'Time on each slide.', 'b-blocks' ) }
			units={ msUnits }
			value={ options.autoplaySpeed }
			onChange={ ( val ) => updateObj( 'options', val, 'autoplaySpeed' ) }
			min={ 500 }
			max={ 20000 }
			step={ 10 }
		/> }

		<UnitControl
			className='mt20'
			__next40pxDefaultSize
			label={__('Animation Speed', 'b-blocks')}
			labelPosition='edge'
			units={ msUnits }
			value={ options.speed }
			onChange={ ( val ) => updateObj( 'options', val, 'speed' ) }
			min={ 0 }
			max={ 5000 }
			step={ 50 }
		/>

		{ options.dots && ! FEATURED_PRESETS.includes( attributes.preset ) && <SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Dot Preset', 'b-blocks' ) }
			value={ options.dotPreset }
			options={ dotPresetOptions }
			onChange={ ( val ) => updateObj( 'options', val, 'dotPreset' ) }
		/> }
	</PanelBody>;
};

export default Carousel;
