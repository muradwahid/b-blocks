import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Flex, PanelBody, ToggleControl, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalBorderBoxControl as BorderBoxControl } from '@wordpress/components';

import { ColorControl, BoxControl, Typography, Background, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const getBoxVal = (boxObj, dev = 'desktop') => {
	if (!boxObj) return EMPTY_BOX;
	if (typeof boxObj === 'object' && boxObj[dev]) {
		return boxObj[dev];
	}
	if (typeof boxObj === 'object' && ('top' in boxObj || 'right' in boxObj || 'bottom' in boxObj || 'left' in boxObj)) {
		return dev === 'desktop' ? boxObj : EMPTY_BOX;
	}
	return EMPTY_BOX;
};

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const [ctaTab, setCtaTab] = useState('normal');
	const { card = {}, badge = {}, cta = {}, title = {}, meta = {}, description = {}, location = {}, organizer = {}, status = {}, image = {} } = attributes;

	const { showDateBadge } = card;
	const { color: locationColor, iconColor: locationIconColor, typo: locationTypo = {} } = location;
	const { color: organizerColor, iconColor: organizerIconColor, typo: organizerTypo = {} } = organizer;

	// Per-element style panel (Color, Background, Typography, Border, Border Radius, Padding, Margin).
	const elementPanel = (titleLabel, group, obj, toggleLabel = '') => (
		<PanelBody className='bPlPanelBody' title={titleLabel} initialOpen={false}>
			{toggleLabel && (
				<ToggleControl
					label={toggleLabel}
					checked={obj.show !== false}
					onChange={(val) => updateObj(group, val, 'show')}
				/>
			)}
			<ColorControl label={__('Color', 'b-blocks')} value={obj.color || ''} onChange={(val) => updateObj(group, val, 'color')} defaultColor='' />
			<Background className='mt10' label={__('Background', 'b-blocks')} value={obj.bg} onChange={(val) => updateObj(group, val, 'bg')} />
			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={obj.typo || {}} onChange={(val) => updateObj(group, val, 'typo')} />
			<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={obj.border} onChange={(val) => updateObj(group, val, 'border')} />
			<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(obj.bRadius, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, 'bRadius', device)} />
			<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(obj.padding, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, 'padding', device)} />
			<BoxControl label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(obj.margin, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, 'margin', device)} />
		</PanelBody>
	);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Badge', 'b-blocks')} initialOpen={true}>
			<ToggleControl label={__('Show date badge', 'b-blocks')} checked={!!showDateBadge} onChange={(val) => updateObj('card', val, 'showDateBadge')} />
			<ColorControl label={__('Color', 'b-blocks')} value={badge.color || ''} onChange={(val) => updateObj('badge', val, 'color')} defaultColor='' />
			<Background className='mt10' label={__('Background', 'b-blocks')} value={badge.bg} onChange={(val) => updateObj('badge', val, 'bg')} />
			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={badge.typo || {}} onChange={(val) => updateObj('badge', val, 'typo')} />
			<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={badge.border} onChange={(val) => updateObj('badge', val, 'border')} />
			<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(badge.bRadius, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('badge', val, 'bRadius', device)} />
			<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(badge.padding, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('badge', val, 'padding', device)} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
			<BorderBoxControl label={__('Border', 'b-blocks')} value={image.border} onChange={(val) => updateObj('image', val, 'border')} />
			<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(image.bRadius, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('image', val, 'bRadius', device)} />
			<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(image.padding, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('image', val, 'padding', device)} />
			<BoxControl label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(image.margin, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('image', val, 'margin', device)} />
		</PanelBody>

		{elementPanel(__('Title', 'b-blocks'), 'title', title)}

		{elementPanel(__('Meta', 'b-blocks'), 'meta', meta)}

		{elementPanel(__('Description', 'b-blocks'), 'description', description)}

		{elementPanel(__('Event Status', 'b-blocks'), 'status', status, __('Show event status', 'b-blocks'))}

		<PanelBody className='bPlPanelBody' title={__('Location', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Text Color', 'b-blocks')} value={locationColor || ''} onChange={(val) => updateObj('location', val, 'color')} defaultColor='' />

			<ColorControl label={__('Icon Color', 'b-blocks')} value={locationIconColor || ''} onChange={(val) => updateObj('location', val, 'iconColor')} defaultColor='' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={locationTypo} onChange={(val) => updateObj('location', val, 'typo')} />

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Organizer', 'b-blocks')} initialOpen={false}>

			<ColorControl label={__('Text Color', 'b-blocks')} value={organizerColor || ''} onChange={(val) => updateObj('organizer', val, 'color')} defaultColor='' />

			<ColorControl label={__('Icon Color', 'b-blocks')} value={organizerIconColor || ''} onChange={(val) => updateObj('organizer', val, 'iconColor')} defaultColor='' />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={organizerTypo} onChange={(val) => updateObj('organizer', val, 'typo')} />

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('CTA Button Style', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={cta.typo || {}} onChange={(val) => updateObj('cta', val, 'typo')} />

			<ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ctaTab} onChange={(val) => setCtaTab(val)}>
				<ToggleGroupControlOption label='Normal' value='normal' />
				<ToggleGroupControlOption label='Hover' value='hover' />
			</ToggleGroupControl>

			{ctaTab === 'normal' ? (
				<>
					<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={cta.color || cta.text || ''} onChange={(val) => updateObj('cta', val, 'color')} defaultColor='' />
					<Background className='mt10' label={__('Background', 'b-blocks')} value={cta.bg} onChange={(val) => updateObj('cta', val, 'bg')} />
				</>
			) : (
				<>
					<ColorControl className='mt10' label={__('Hover Color', 'b-blocks')} value={cta.hoverColor || cta.hoverText || ''} onChange={(val) => updateObj('cta', val, 'hoverColor')} defaultColor='' />
					<Background className='mt10' label={__('Hover Background', 'b-blocks')} value={cta.hoverBg} onChange={(val) => updateObj('cta', val, 'hoverBg')} />
					<RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} value={cta.transition ?? 0.3} min={0} max={5} step={0.05} onChange={(val) => updateObj('cta', val, 'transition')} />
				</>
			)}

			<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={cta.border} onChange={(val) => updateObj('cta', val, 'border')} />
			<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(cta.bRadius, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('cta', val, 'bRadius', device)} />
			<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(cta.padding, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('cta', val, 'padding', device)} />
			<BoxControl label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={getBoxVal(cta.margin, device)} resetValues={EMPTY_BOX} onChange={(val) => updateObj('cta', val, 'margin', device)} />
		</PanelBody>
	</>;
};
export default Style;
