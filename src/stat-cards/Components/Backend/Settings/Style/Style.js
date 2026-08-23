import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, PanelRow, RangeControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { cardStyleOptions, UNITS } from '../../../../utils/options';

const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

// Shared Background / Border / Border Radius / Padding / Margin controls for an element.
const BoxStyle = ({ attrKey, value = {}, updateObj }) => {
	const { bg = {}, border = {}, borderRadius = {}, padding = {}, margin = {} } = value;

	return <>
		<Background className='mt10' label={__('Background:', 'b-blocks')} value={bg} onChange={(val) => updateObj(attrKey, val, 'bg')} />

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={border} onChange={(val) => updateObj(attrKey, val || {}, 'border')} />

		<BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} units={UNITS} values={borderRadius} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'borderRadius')} />

		<BoxControl className='mt10' label={__('Padding', 'b-blocks')} units={UNITS} values={padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'padding')} />

		<BoxControl className='mt10' label={__('Margin', 'b-blocks')} units={UNITS} values={margin} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'margin')} />
	</>;
};

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { card = {}, number = {}, label = {}, description = {}, icon = {} } = attributes;

	const cardStyle = card.style || 'flat';
	const showBorder = 'outlined' === cardStyle || 'accent-top' === cardStyle;

	const radius = card.borderRadius || {};
	const padding = card.padding || {};
	const margin = card.margin || {};

	return <>
		<PanelBody className='bPlPanelBody' title={__('Card', 'b-blocks')} initialOpen={true}>
			<PanelRow>
				<Label className=''>{__('Card style:', 'b-blocks')}</Label>
				<SelectControl value={cardStyle} options={cardStyleOptions} onChange={(val) => updateObj('card', val, 'style')} />
			</PanelRow>

			<Background label={__('Background:', 'b-blocks')} value={card.bg} onChange={(val) => updateObj('card', val, 'bg')} />

			{'accent-top' === cardStyle && (
				<RangeControl label={__('Accent line height (px)', 'b-blocks')} value={card.accentWidth ?? 4} onChange={(val) => updateObj('card', val, 'accentWidth')} min={2} max={12} step={1} />
			)}

			{showBorder && (
				<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={card.border} onChange={(val) => updateObj('card', val || {}, 'border')} />
			)}

			<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={radius[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('card', val, 'borderRadius', device)} />

			<BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={padding[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('card', val, 'padding', device)} />

			<BoxControl className='mt10' label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={margin[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('card', val, 'margin', device)} />

			<ShadowControl className='mt10' label={__('Shadow:', 'b-blocks')} value={card.shadow || []} onChange={(val) => updateObj('card', val, 'shadow')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Number', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={number.color || '#111827'} onChange={(val) => updateObj('number', val, 'color')} defaultColor='#111827' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={number.typography} onChange={(val) => updateObj('number', val, 'typography')} />

			<BoxStyle attrKey='number' value={number} updateObj={updateObj} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Label', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={label.color || '#374151'} onChange={(val) => updateObj('label', val, 'color')} defaultColor='#374151' />
			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={label.typography} onChange={(val) => updateObj('label', val, 'typography')} />

			<BoxStyle attrKey='label' value={label} updateObj={updateObj} />
		</PanelBody>

		{description.show !== false && (
			<PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>

				<ColorControl label={__('Color:', 'b-blocks')} value={description.color || '#6B7280'} onChange={(val) => updateObj('description', val, 'color')} defaultColor='#6B7280' />

				<Typography className='mt10' label={__('Typography', 'b-blocks')} value={description.typography} onChange={(val) => updateObj('description', val, 'typography')} />

				<BoxStyle attrKey='description' value={description} updateObj={updateObj} />
			</PanelBody>
		)}

		{icon.show !== false && (
			<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>

				<ColorControl label={__('Color', 'b-blocks')} value={icon.color || '#146EF5'} onChange={(val) => updateObj('icon', val, 'color')} defaultColor='#146EF5' />

				<Flex className='mt10'>
					<Label className='flex2'>{__('Size', 'b-blocks')}</Label>
					<UnitControl className='flex1' units={UNITS} isUnitSelectTabbable value={icon.size || '32px'} onChange={(val) => updateObj('icon', val, 'size')} />
				</Flex>

				<BoxStyle attrKey='icon' value={icon} updateObj={updateObj} />
			</PanelBody>
		)}
	</>;
};
export default Style;
