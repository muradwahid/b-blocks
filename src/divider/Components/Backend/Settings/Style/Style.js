import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';
import { LINE_STYLE_OPTIONS, UNITS } from '../../../../utils/options';

const Style = ({ attributes, updateObj }) => {
	const { type = 'line', line = {}, icon = {}, text = {}, spacing = {} } = attributes;

	const isIcon = type === 'icon';
	const isText = type === 'text';

	return <>
		<PanelBody className='bPlPanelBody' title={__('Line', 'b-blocks')} initialOpen={true}>
			<SelectControl label={__('Line Style', 'b-blocks')} labelPosition='edge' value={line.style || 'solid'} options={LINE_STYLE_OPTIONS} onChange={(val) => updateObj('line', val, 'style')} __nextHasNoMarginBottom />

			<ColorControl label={__('Line Color', 'b-blocks')} value={line.color || '#cccccc'} onChange={(val) => updateObj('line', val || '#cccccc', 'color')} defaultColor='#cccccc' />

			<UnitControl label={__('Line Thickness', 'b-blocks')} labelPosition='edge' units={UNITS} isUnitSelectTabbable value={line.width || '2px'} onChange={(val) => updateObj('line', val, 'width')} />
		</PanelBody>

		{isIcon && (
			<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
				<UnitControl label={__('Icon Size', 'b-blocks')} labelPosition='edge' units={UNITS} isUnitSelectTabbable value={icon.size || '16px'} onChange={(val) => updateObj('icon', val, 'size')} />

				<ColorControl label={__('Icon Color:', 'b-blocks')} value={icon.color || ''} onChange={(val) => updateObj('icon', val || '', 'color')} defaultColor={line.color || '#cccccc'} />

				<Background label={__('Icon Background ', 'b-blocks')} value={icon.bg} onChange={(val) => updateObj('icon', val, 'bg')} />

				<BoxControl label={__('Icon Padding', 'b-blocks')} units={UNITS} values={icon.padding} resetValues={{ top: '8px', right: '8px', bottom: '8px', left: '8px' }} onChange={(val) => updateObj('icon', val, 'padding')} />

				<BoxControl className='mt10' label={__('Icon Border Radius', 'b-blocks')} units={UNITS} values={icon.borderRadius} resetValues={{ top: '50px', right: '50px', bottom: '50px', left: '50px' }} onChange={(val) => updateObj('icon', val, 'borderRadius')} />
			</PanelBody>
		)}

		{isText && (
			<PanelBody className='bPlPanelBody' title={__('Text Label', 'b-blocks')} initialOpen={false}>
				<Typography label={__('Typography', 'b-blocks')} value={text.typography} onChange={(val) => updateObj('text', val, 'typography')} />

				<ColorControl label={__('Text Color:', 'b-blocks')} value={text.color || ''} onChange={(val) => updateObj('text', val || '', 'color')} defaultColor={line.color || '#cccccc'} />

				<Background label={__('Text Background', 'b-blocks')} value={text.bg} onChange={(val) => updateObj('text', val, 'bg')} />

				<BoxControl label={__('Padding', 'b-blocks')} units={UNITS} values={text.padding} resetValues={{ top: '4px', right: '12px', bottom: '4px', left: '12px' }} onChange={(val) => updateObj('text', val, 'padding')} />
			</PanelBody>
		)}

		<PanelBody className='bPlPanelBody' title={__('Spacing', 'b-blocks')} initialOpen={false}>
			<BoxControl label={__('Margin', 'b-blocks')} units={UNITS} values={spacing} resetValues={{ top: '24px', right: '', bottom: '24px', left: '' }} onChange={(val) => updateObj('spacing', val)} />
		</PanelBody>
	</>;
};
export default Style;
