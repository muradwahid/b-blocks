import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, IconLibrary } from '../../../../../../../bpl-tools/Components';
import { ShadowControl } from '../../../../../../../bpl-tools/Components/Deprecated';

const General = (props) => {
	const { attributes, setAttributes } = props;
	const { icon, wrapper } = attributes;
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
	</>
}
export default General;