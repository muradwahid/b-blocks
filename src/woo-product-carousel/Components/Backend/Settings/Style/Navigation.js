import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { pxEmPctUnits, pxEmUnits, stateOptions } from '../../../../utils/options';
import { FEATURED_PRESETS } from '../../../../utils/data';

const Navigation = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { arrow = {}, dot = {}, options = {}, pause = {} } = attributes;

	const [ state, setState ] = useState( 'normal' );
	const [ pauseState, setPauseState ] = useState( 'normal' );
	// Featured presets: plain chevrons by the heading, and no dots.
	const featured = FEATURED_PRESETS.includes( attributes.preset );
	const isPauseHover = 'hover' === pauseState;

	return <>
		{ options.arrows && <PanelBody className='bPlPanelBody' title={ __( 'Arrow', 'b-blocks' ) } initialOpen={ false }>
			<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ state } onChange={ ( val ) => setState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<ColorControl
				className='mt10'
				label={ __( 'Color:', 'b-blocks' ) }
				value={ arrow[ state ]?.color?.icon }
				defaultColor='#ffffff'
				onChange={ ( val ) => updateObj( 'arrow', val, state, 'color', 'icon' ) }
			/>

			{ ! featured && <Background
				key={ state }
				className='mt10'
				label={ __( 'Background:', 'b-blocks' ) }
				value={ arrow[ state ]?.color?.bg }
				isImage={ false }
				onChange={ ( val ) => updateObj( 'arrow', val, state, 'color', 'bg' ) }
			/> }

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Arrow Size', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ arrow[ device ]?.size }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'arrow', val || '', device, 'size' ) }
			/>

			{ ! featured && <UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Background Size', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				help={ __( 'The size of the round button behind the arrow.', 'b-blocks' ) }
				value={ arrow[ device ]?.bgSize }
				units={ pxEmUnits }
				min={ 0 }
				max={ 200 }
				onChange={ ( val ) => updateObj( 'arrow', val || '', device, 'bgSize' ) }
			/> }

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Arrow Position', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				help={ featured
					? __( 'Distance of the chevrons beside the heading, on desktop. On tablets and phones they sit at the heading’s end.', 'b-blocks' )
					: __( 'Distance from the slider’s edges; negative places the arrows outside. On tablets and phones they always stay inside.', 'b-blocks' ) }
				value={ arrow[ device ]?.position }
				units={ pxEmPctUnits }
				min={ -200 }
				max={ 200 }
				onChange={ ( val ) => updateObj( 'arrow', val || '', device, 'position' ) }
			/>
		</PanelBody> }

		{ options.dots && ! featured && <PanelBody className='bPlPanelBody' title={ __( 'Dot', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Color:', 'b-blocks' ) }
				value={ dot.normal?.color?.bg }
				defaultColor='#475467'
				onChange={ ( val ) => updateObj( 'dot', val, 'normal', 'color', 'bg' ) }
			/>

			<ColorControl
				className='mt10'
				label={ __( 'Active Color:', 'b-blocks' ) }
				value={ dot.active?.color?.bg }
				defaultColor='#101728'
				onChange={ ( val ) => updateObj( 'dot', val, 'active', 'color', 'bg' ) }
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Dots Size', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ dot[ device ]?.size }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'dot', val || '', device, 'size' ) }
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Dots Gap', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ dot[ device ]?.gap }
				units={ pxEmUnits }
				min={ 0 }
				max={ 100 }
				onChange={ ( val ) => updateObj( 'dot', val || '', device, 'gap' ) }
			/>

			<UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Space Above Dots', 'b-blocks')} <Device position='vertical' /></>}
				labelPosition='edge'
				value={ dot[ device ]?.space }
				units={ pxEmUnits }
				min={ 0 }
				max={ 200 }
				onChange={ ( val ) => updateObj( 'dot', val || '', device, 'space' ) }
			/>
		</PanelBody> }

		{ /* The autoplay pause / play button, beside the dots. */ }
		{ options.autoplay && <PanelBody className='bPlPanelBody' title={ __( 'Pause Button', 'b-blocks' ) } initialOpen={ false }>
			<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ pauseState } onChange={ ( val ) => setPauseState( val || 'normal' ) }>
				{ stateOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>

			<ColorControl
				className='mt10'
				label={ __( 'Icon Color:', 'b-blocks' ) }
				value={ pause[ pauseState ]?.color?.icon }
				defaultColor='#101728'
				onChange={ ( val ) => updateObj( 'pause', val, pauseState, 'color', 'icon' ) }
			/>

			<ColorControl
				className='mt10'
				label={ __( 'Background:', 'b-blocks' ) }
				value={ pause[ pauseState ]?.color?.bg }
				defaultColor={ isPauseHover ? '#f1f5f9' : '#ffffff' }
				onChange={ ( val ) => updateObj( 'pause', val, pauseState, 'color', 'bg' ) }
			/>

			<ColorControl
				className='mt10'
				label={ __( 'Border Color:', 'b-blocks' ) }
				value={ pause[ pauseState ]?.color?.border }
				defaultColor={ isPauseHover ? '#94a3b8' : '#cbd5e1' }
				onChange={ ( val ) => updateObj( 'pause', val, pauseState, 'color', 'border' ) }
			/>

			{ /* The row's space above, Space Above Dots' own value: here while the Dot panel is hidden. */ }
			{ ! ( options.dots && ! featured ) && <UnitControl
				className='mt10'
				__next40pxDefaultSize
				label={<>{__('Space Above', 'b-blocks')} <Device /></>}
				labelPosition='edge'
				value={ dot[ device ]?.space }
				units={ pxEmUnits }
				min={ 0 }
				max={ 200 }
				onChange={ ( val ) => updateObj( 'dot', val || '', device, 'space' ) }
			/> }
		</PanelBody> }
	</>;
};

export default Navigation;