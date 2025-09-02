import { PanelBody, RangeControl, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ColorControl, IconLibrary } from '../../../../../../../bpl-tools/Components';
import { ShadowControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { animationOptions, hAnimationOptions, iterationOptions } from '../../../../utils/options';
import { normalHoverTabs } from '../../../../../utils/options';

const General = (props) => {
	const { attributes, setAttributes, updateObj } = props;
	const { icon, wrapper, animation } = attributes;
	const { svg, size, color, shadow, hover } = icon;
	const { width, height } = wrapper;
	return <>
		<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={true}>
			<IconLibrary value={svg} onChange={val => setAttributes({ icon: { ...icon, svg: val } })} />

			<UnitControl className='mt20' label={__('Size', 'b-blocks')} labelPosition='left' value={size} onChange={val => setAttributes({ icon: { ...icon, size: val } })} />

			<TabPanel className='bPlTabPanel mini mt20' activeClass='activeTab' tabs={normalHoverTabs}>
				{
					tab => <>
						{tab.name === 'normal' && <>
							<ColorControl className='mt20' label={__('Color', 'b-blocks')} value={color} onChange={val => setAttributes({ icon: { ...icon, color: val } })} />

							<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ icon: { ...icon, shadow: val } })} type='text' />
						</>}
						{tab.name === 'hover' && <>
							<ColorControl className='mt20' label={__('Color', 'b-blocks')} value={hover?.color} onChange={val => updateObj('icon', val, 'hover', 'color')} />

							<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={hover?.shadow} onChange={val => updateObj('icon', val, 'hover', 'shadow')} type='text' />
						</>}
					</>
				}
			</TabPanel>

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Wrapper / Box', 'b-blocks')} initialOpen={false}>
			<small>{__(`Minimum width and height must be greater then ${size}`, 'b-blocks')}</small>

			<UnitControl className='mt15' label={__('Width', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ wrapper: { ...wrapper, width: val } })} />

			<UnitControl className='mt20' label={__('Height', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ wrapper: { ...wrapper, height: val } })} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>

			<TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={normalHoverTabs}>
				{
					tab => <>
						{tab.name === 'normal' && <>
							<SelectControl className='mt10' labelPosition='edge' label={__('Animation', 'b-blocks')} options={animationOptions} value={animation.type} onChange={val => updateObj('animation', val, 'type')} />

							<SelectControl className='mt10' labelPosition='edge' label={__('Animation Iteration', 'b-blocks')} options={iterationOptions} value={animation.iteration} onChange={val => updateObj('animation', val, 'iteration')} />

							{animation.iteration == 'number' && <RangeControl className='mt10' label={__('Iteration Count', 'b-blocks')} min={0} max={10} step={1} value={animation.iterationCount} onChange={val => updateObj('animation', val, 'iterationCount')} />}

							<RangeControl className='mt10' label={__('Duration (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.duration} onChange={val => updateObj('animation', val, 'duration')} />

							<RangeControl className='mt10' label={__('Delay (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.delay} onChange={val => updateObj('animation', val, 'delay')} />
						</>}
						{tab.name === 'hover' && <>
							<SelectControl className='mt10' labelPosition='edge' label={__('Animation', 'b-blocks')} options={hAnimationOptions} value={animation.hover.type} onChange={val => updateObj('animation', val, 'hover', 'type')} />

							<SelectControl className='mt10' labelPosition='edge' label={__('Animation Iteration', 'b-blocks')} options={iterationOptions} value={animation.hover.iteration} onChange={val => updateObj('animation', val, 'hover', 'iteration')} />

							{animation.hover.iteration === 'number' && <RangeControl className='mt10' label={__('Iteration Count', 'b-blocks')} min={0} max={10} step={1} value={animation.hover.iterationCount} onChange={val => updateObj('animation', val, 'hover', 'iterationCount')} />}

							<RangeControl className='mt10' label={__('Duration (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.hover.duration} onChange={val => updateObj('animation', val, 'hover', 'duration')} />

							<RangeControl className='mt10' label={__('Delay (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.hover.delay} onChange={val => updateObj('animation', val, 'hover', 'delay')} />
						</>}
					</>
				}
			</TabPanel>

		</PanelBody>

	</>
}
export default General;