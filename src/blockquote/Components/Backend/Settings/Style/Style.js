import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, BorderControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';
import { ALIGN_OPTIONS, SHAPE_OPTIONS, UNITS } from '../../../../utils/options';

const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

// Shared Background / Padding / Margin / Border / Border Radius controls for an element attribute.
const BoxStyle = ({ attrKey, value = {}, updateObj }) => {
	const { bg = {}, padding = {}, margin = {}, border = {}, borderRadius = {} } = value;

	return <>
		<Background label={__('Background:', 'b-blocks')} value={bg} onChange={(val) => updateObj(attrKey, val, 'bg')} />

		<BoxControl label={__('Padding', 'b-blocks')} units={UNITS} values={padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'padding')} />

		<BoxControl label={__('Margin', 'b-blocks')} units={UNITS} values={margin} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'margin')} />

		<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={(val) => updateObj(attrKey, val || {}, 'border')} withSlider __next40pxDefaultSize />

		<BoxControl label={__('Border Radius', 'b-blocks')} units={UNITS} values={borderRadius} resetValues={EMPTY_BOX} onChange={(val) => updateObj(attrKey, val, 'borderRadius')} />
	</>;
};

const Style = ({ attributes, updateObj }) => {
	const { quote = {}, authorName = {}, authorRole = {}, avatar = {}, layout = {}, icon = {} } = attributes;

	const {
		color: quoteColor,
		bg: quoteBg = {},
		typography: quoteTypo = {},
		padding: quotePadding = {},
		margin: quoteMargin = {},
		border: quoteBorder = {},
		borderRadius: quoteRadius = {},
	} = quote;
	const { color: nameColor, typography: nameTypo = {} } = authorName;
	const { color: roleColor, typography: roleTypo = {} } = authorRole;
	const { size: avatarSize, shape: avatarShape } = avatar;
	const { color: iconColor, size: iconSize, align: iconAlign } = icon;

	const isQuotationLayout = layout.type === 'quotation';

	return <>
		<PanelBody className='bPlPanelBody' title={__('Quote Text', 'b-blocks')} initialOpen={true}>

			<ColorControl label={__('Text Color:', 'b-blocks')} value={quoteColor || ''} onChange={(val) => updateObj('quote', val || '', 'color')} defaultColor='' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={quoteTypo} onChange={(val) => updateObj('quote', val, 'typography')} />

			<Background label={__('Background:', 'b-blocks')} value={quoteBg} onChange={(val) => updateObj('quote', val, 'bg')} />

			<BoxControl label={__('Padding', 'b-blocks')} units={UNITS} values={quotePadding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('quote', val, 'padding')} />

			<BoxControl label={__('Margin', 'b-blocks')} units={UNITS} values={quoteMargin} resetValues={EMPTY_BOX} onChange={(val) => updateObj('quote', val, 'margin')} />

			<BorderControl label={__('Border', 'b-blocks')} value={quoteBorder} onChange={(val) => updateObj('quote', val || {}, 'border')} withSlider __next40pxDefaultSize />

			<BoxControl label={__('Border Radius', 'b-blocks')} units={UNITS} values={quoteRadius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('quote', val, 'borderRadius')} />

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Author Name', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Name Color', 'b-blocks')} value={nameColor} onChange={(val) => updateObj('authorName', val || '', 'color')} defaultColor='' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={nameTypo} onChange={(val) => updateObj('authorName', val, 'typography')} />

			<BoxStyle attrKey='authorName' value={authorName} updateObj={updateObj} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Role / Company', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Role Color:', 'b-blocks')} value={roleColor} onChange={(val) => updateObj('authorRole', val || '', 'color')} defaultColor='' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={roleTypo} onChange={(val) => updateObj('authorRole', val, 'typography')} />

			<BoxStyle attrKey='authorRole' value={authorRole} updateObj={updateObj} />
		</PanelBody>

		{isQuotationLayout && (
			<PanelBody className='bPlPanelBody' title={__('Quote Icon', 'b-blocks')} initialOpen={false}>
				<SelectControl label={__('Icon Alignment', 'b-blocks')} labelPosition='edge' value={iconAlign} options={ALIGN_OPTIONS} onChange={(val) => updateObj('icon', val, 'align')} __nextHasNoMarginBottom />

				<UnitControl label={__('Icon Size', 'b-blocks')} className='mt10' labelPosition='edge' units={UNITS} isUnitSelectTabbable value={iconSize || '48px'} onChange={(val) => updateObj('icon', val, 'size')} />

				<ColorControl label={__('Icon Color', 'b-blocks')} value={iconColor} onChange={(val) => updateObj('icon', val, 'color')} defaultColor='#6366f1' />

				<BoxStyle attrKey='icon' value={icon} updateObj={updateObj} />
			</PanelBody>
		)}

		<PanelBody className='bPlPanelBody' title={__('Author Photo', 'b-blocks')} initialOpen={false}>

			<UnitControl label={__('Avatar Size', 'b-blocks')} labelPosition='edge' units={UNITS} isUnitSelectTabbable value={avatarSize || '48px'} onChange={(val) => updateObj('avatar', val, 'size')} />

			<SelectControl label={__('Avatar Shape', 'b-blocks')} labelPosition='edge' className='mt10' value={avatarShape} options={SHAPE_OPTIONS} onChange={(val) => updateObj('avatar', val, 'shape')} __nextHasNoMarginBottom />

			<BoxStyle attrKey='avatar' value={avatar} updateObj={updateObj} />

		</PanelBody>
	</>;
};
export default Style;
