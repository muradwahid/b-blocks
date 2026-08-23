import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';
import { Flex } from '@wordpress/components';
import { UNITS } from '../../../../utils/options';

const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

const BoxStyle = ({ attrKey, value = {}, updateObj, device }) => {
	const { bg = {}, border = {} } = value;
	const devKey = device || 'desktop';

	const padding = value[devKey]?.padding || value.padding || {};
	const margin = value[devKey]?.margin || value.margin || {};
	const radius = value[devKey]?.radius || value[devKey]?.borderRadius || value.radius || value.borderRadius || {};

	return <>
		<Background label={__('Background:', 'b-blocks')} value={bg} onChange={(val) => updateObj(attrKey, val, 'bg')} />

		<BoxControl
			label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>}
			units={UNITS}
			values={padding}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj(attrKey, val, devKey, 'padding')}
		/>

		<BoxControl
			label={<Flex>{__('Margin', 'b-blocks')}<Device /></Flex>}
			units={UNITS}
			values={margin}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj(attrKey, val, devKey, 'margin')}
		/>

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={border} onChange={(val) => updateObj(attrKey, val || {}, 'border')} />

		<BoxControl
			label={<Flex>{__('Border Radius', 'b-blocks')}<Device /></Flex>}
			units={UNITS}
			values={radius}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj(attrKey, val, devKey, 'radius')}
		/>
	</>;
};

const Style = ({ attributes, updateObj, device }) => {
	const { heading = {}, list = {}, icon = {}, item = {} } = attributes;

	const showIcon = list.showIcon !== false;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Heading', 'b-blocks')} initialOpen={true}>
			<ColorControl label={__('Text color:', 'b-blocks')} value={heading.color || '#1e293b'} onChange={(val) => updateObj('heading', val, 'color')} defaultColor='#1e293b' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={heading.typography} onChange={(val) => updateObj('heading', val, 'typography')} />

			<BoxStyle attrKey='heading' value={heading} updateObj={updateObj} device={device} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Takeaway Items', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Text color:', 'b-blocks')} value={item.color || '#1e293b'} onChange={(val) => updateObj('item', val, 'color')} defaultColor='#1e293b' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={item.typography} onChange={(val) => updateObj('item', val, 'typography')} />

			<Flex className='mt10'>
				<Label className='flex2'>{__('Items Gap', 'b-blocks')}</Label>
				<UnitControl className='flex1' units={UNITS} isUnitSelectTabbable value={typeof list.gap === 'number' ? `${list.gap}px` : (list.gap || '10px')} onChange={(val) => updateObj('list', val, 'gap')} />
			</Flex>


			<BoxStyle attrKey='item' value={item} updateObj={updateObj} device={device} />
		</PanelBody>

		{showIcon && (
			<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>

				<ColorControl label={__('Icon / number color:', 'b-blocks')} value={icon.color || '#ffffff'} onChange={(val) => updateObj('icon', val, 'color')} defaultColor='#ffffff' />

				<UnitControl className='mt10' label={__('Icon / number size', 'b-blocks')} labelPosition='edge' units={UNITS} isUnitSelectTabbable value={icon.size || '18px'} onChange={(val) => updateObj('icon', val, 'size')} />

				<BoxStyle attrKey='icon' value={icon} updateObj={updateObj} device={device} />
			</PanelBody>
		)}
	</>;
};
export default Style;
