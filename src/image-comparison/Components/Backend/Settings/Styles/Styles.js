import { PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { pxUnit, perUnit, emUnit, vwUnit } from '../../../../../../../bpl-tools/utils/options';
import { Background, ColorControl, ColorsControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';
import { Flex } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

const Styles = ({ attributes, isPremium, setIsProModalOpen, updateObj, device }) => {
	const { styles, width, isLabel, labelTypo, labelColors, labelPadding, isCap, capTypo, capColors, capPadding } = attributes;
	const { container, dragg } = styles;
	return (
		<>
			<PanelBody title={__("Container", "image-compare")} className='bPlPanelBody'>

				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => updateObj("width", val)} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

				<UnitControl className='mt10' label={<Flex>{__('Height:', 'b-blocks')}<Device /></Flex>} value={container.height[device]} onChange={val => updateObj("styles", val, "container", "height", device)} units={[pxUnit(), emUnit(), vwUnit()]} />

			</PanelBody>

			{isLabel && <>
				<PanelBody className='bPlPanelBody' title={__('Labels', 'b-blocks')} initialOpen={false}>

					<Typography value={labelTypo} onChange={val => updateObj('labelTypo', val)} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

					<ColorsControl value={labelColors} onChange={val => updateObj('labelColors', val)} defaults={{ color: '#fff', bg: '#00000080' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={labelPadding} onChange={val => updateObj('labelPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</PanelBody>
			</>}


			{isCap && <>
				<PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>

					<Typography value={capTypo} onChange={val => updateObj('capTypo', val)} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} />

					<ColorsControl value={capColors} onChange={val => updateObj('capColors', val)} defaults={{ color: '#333', bg: '#f4f4f4' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={capPadding} onChange={val => updateObj('capPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</PanelBody>
			</>}
			<PanelBody className='bPlPanelBody' title={__('Slider', 'b-blocks')} initialOpen={false}>

				<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Size', 'b-blocks')} min={1} max={10} step={1} value={dragg.line.size} onChange={val => updateObj('styles', val, 'dragg', 'line', 'size')} Component={RangeControl} />

				<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Color', 'b-blocks')} value={dragg.line.bg} onChange={val => updateObj('styles', val, 'dragg', 'line', 'bg')} isImage={false} Component={Background} />

				<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Handler Color', 'b-blocks')} value={dragg.handler.color} onChange={val => updateObj('styles', val, 'dragg', 'handler', 'color')} Component={ColorControl} />

				<BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Icon Color', 'b-blocks')} value={dragg.icon.color} onChange={val => updateObj('styles', val, 'dragg', 'icon', 'color')} isImage={false} Component={ColorControl} />
			</PanelBody>
		</>
	);
};

export default compose(
	withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
	}),
)(Styles);