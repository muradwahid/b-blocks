import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Label, Typography } from '../../../../../../../bpl-tools/Components';
import { CHECKBOX_STYLE_OPTIONS, UNITS } from '../../../../utils/options';

const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

const Style = ({ attributes, updateObj }) => {
	const { heading = {}, checkbox = {}, item = {}, progress = {} } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Heading', 'b-blocks')} initialOpen={true}>

			<ColorControl label={__('Color:', 'b-blocks')} value={heading.color || '#1a1a1a'} onChange={(val) => updateObj('heading', val, 'color')} defaultColor='#1a1a1a' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={heading.typography || {}} onChange={(val) => updateObj('heading', val, 'typography')} />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={heading.bg} onChange={(val) => updateObj('heading', val, 'bg')} />

			<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={heading.border} onChange={(val) => updateObj('heading', val || {}, 'border')} />

			<BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} units={UNITS} values={heading.borderRadius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('heading', val, 'borderRadius')} />

			<BoxControl className='mt10' label={__('Padding', 'b-blocks')} units={UNITS} values={heading.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('heading', val, 'padding')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Checkbox', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Style:', 'b-blocks')}</Label>
				<SelectControl value={checkbox.style || 'square'} options={CHECKBOX_STYLE_OPTIONS} onChange={(val) => updateObj('checkbox', val, 'style')} />
			</PanelRow>

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Size', 'b-blocks')}</Label>
				<UnitControl className='flex1' labelPosition='edge' units={UNITS} isUnitSelectTabbable value={checkbox.size || '20px'} onChange={(val) => updateObj('checkbox', val, 'size')} />
			</Flex>

			<ColorControl label={__('Accent color:', 'b-blocks')} value={checkbox.accent} onChange={(val) => updateObj('checkbox', val, 'accent')} defaultColor='#4f46e5' />

			<ColorControl label={__('Check mark color:', 'b-blocks')} value={checkbox.checkColor} onChange={(val) => updateObj('checkbox', val, 'checkColor')} defaultColor='#ffffff' />

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Items', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Text color:', 'b-blocks')} value={item.color || '#1a1a1a'} onChange={(val) => updateObj('item', val, 'color')} defaultColor='#1a1a1a' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={item.typography || {}} onChange={(val) => updateObj('item', val, 'typography')} />

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Gap between items', 'b-blocks')}</Label>
				<UnitControl className='flex1' labelPosition='edge' units={UNITS} isUnitSelectTabbable value={item.gap} onChange={(val) => updateObj('item', val, 'gap')} />
			</Flex>

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Progress', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={progress.typography || {}} defaults={{ fontSize: { desktop: '12px' } }} onChange={(val) => updateObj('progress', val, 'typography')} />

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Track Size', 'b-blocks')}</Label>
				<UnitControl className='flex1' labelPosition='edge' units={UNITS} isUnitSelectTabbable value={progress.height || '6px'} onChange={(val) => updateObj('progress', val, 'height')} />
			</Flex>

			<Background className='mt10' label={__('Track Background', 'b-blocks')} value={progress.trackBg} onChange={(val) => updateObj('progress', val, 'trackBg')} />

			<Background className='mt10' label={__('Progress Fill Background', 'b-blocks')} value={progress.fillBg} onChange={(val) => updateObj('progress', val, 'fillBg')} />
		</PanelBody>
	</>;
};
export default Style;
