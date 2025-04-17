import { PanelBody, RangeControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ColorControl, IconLibrary } from '../../../../../../../bpl-tools/Components';
import { ShadowControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { animationOptions } from '../../../../utils/options';

const General = (props) => {
	const { attributes, setAttributes, updateObj } = props;
	const { icon, wrapper, animation } = attributes;
	const { svg, size, color, shadow } = icon;
	const { width, height } = wrapper;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={true}>
			<IconLibrary value={svg} onChange={val => setAttributes({ icon: { ...icon, svg: val } })} />

			<UnitControl className='mt20' label={__('Size', 'b-blocks')} labelPosition='left' value={size} onChange={val => setAttributes({ icon: { ...icon, size: val } })} />

			<ColorControl className='mt20' label={__('Color', 'b-blocks')} value={color} onChange={val => setAttributes({ icon: { ...icon, color: val } })} />

			<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ icon: { ...icon, shadow: val } })} type='text' />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Wrapper / Box', 'b-blocks')} initialOpen={false}>
			<small>{__(`Minimum width and height must be greater then ${size}`, 'b-blocks')}</small>

			<UnitControl className='mt15' label={__('Width', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ wrapper: { ...wrapper, width: val } })} />

			<UnitControl className='mt20' label={__('Height', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ wrapper: { ...wrapper, height: val } })} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>

			<SelectControl labelPosition='edge' label={__('Animation', 'b-blocks')} options={animationOptions} value={animation.type} onChange={val => updateObj('animation', val, 'type')} />

			<RangeControl className='mt10' label={__('Duration (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.duration} onChange={val => updateObj('animation', val, 'duration')} />

			<RangeControl className='mt10' label={__('Delay (ms)', 'b-blocks')} min={0} max={20000} step={50} value={animation.delay} onChange={val => updateObj('animation', val, 'delay')} />

		</PanelBody>

	</>
}
export default General;