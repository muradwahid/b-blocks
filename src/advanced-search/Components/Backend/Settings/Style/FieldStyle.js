import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';
import { fieldStateOptions } from '../../../../utils/options';

const FieldStyle = ({ attributes, updateObj, device, isOff, presetData, toBg, showSearchIcon }) => {
	const { field = {}, searchIcon = {}, closeIcon = {}, loader = {} } = attributes;

	const [fieldState, setFieldState] = useState('normal');

	return <PanelBody className='bPlPanelBody' title={__('Search Field', 'b-blocks')} initialOpen={true}>
		{!isOff('field.bg', field.bg, presetData.field?.bg) && <Background label={__('Background:', 'b-blocks')} value={toBg(field.bg)} isImage={false} onChange={(val) => updateObj('field', val, 'bg')} />}

		<Typography className={isOff('field.bg', field.bg, presetData.field?.bg) ? '' : 'mt10'} label={__('Typography', 'b-blocks')} value={field.typo} onChange={(val) => updateObj('field', val, 'typo')} />

		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Height', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={field[device]?.height} units={[pxUnit(), perUnit(100)]} onChange={(val) => updateObj('field', val || '', device, 'height')} />

		<BoxControl key={`field-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={field[device]?.padding} onChange={(val) => updateObj('field', val, device, 'padding')} />

		{ /* Hover also shows while the visitor types in the field, unless Focus has its own value. */}
		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={fieldState} onChange={(val) => setFieldState(val || 'normal')}>
			{fieldStateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>

		<ColorControl key={`field-color-${fieldState}`} className='mt10' label={__('Text Color:', 'b-blocks')} value={field[fieldState]?.color} onChange={(val) => updateObj('field', val, fieldState, 'color')} />
		<ColorControl key={`field-ph-${fieldState}`} className='mt10' label={__('Placeholder Color:', 'b-blocks')} value={field[fieldState]?.placeholder} onChange={(val) => updateObj('field', val, fieldState, 'placeholder')} />

		<BorderBoxControl key={`field-border-${fieldState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={field[fieldState]?.border} onChange={(val) => updateObj('field', val || {}, fieldState, 'border')} />
		{!isOff(`field.${fieldState}.radius`, field[fieldState]?.[device]?.radius, presetData.field?.[fieldState]?.[device]?.radius) && <BoxControl key={`field-radius-${fieldState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={field[fieldState]?.[device]?.radius} onChange={(val) => updateObj('field', val, fieldState, device, 'radius')} />}
		<ShadowControl key={`field-shadow-${fieldState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={field[fieldState]?.shadow} onChange={(val) => updateObj('field', val, fieldState, 'shadow')} />

		{showSearchIcon && <>
			<h3 className='mt20'>{__('Search Icon', 'b-blocks')}</h3>
			<UnitControl __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Icon Size', 'b-blocks')} <Device /></Flex>} value={searchIcon[device]?.size} labelPosition='edge' onChange={(val) => updateObj('searchIcon', val || '', device, 'size')} />
			<ColorControl className='mt10' label={__('Icon Color:', 'b-blocks')} value={searchIcon.color} onChange={(val) => updateObj('searchIcon', val, 'color')} />
		</>}

		<h3 className='mt20'>{__('Search Close Icon', 'b-blocks')}</h3>
		<ColorControl label={__('Icon Color:', 'b-blocks')} value={closeIcon.color} onChange={(val) => updateObj('closeIcon', val, 'color')} />
		{!isOff('closeIcon.bg', closeIcon.bg, presetData.closeIcon?.bg) && <ColorControl className='mt10' label={__('Circle Color:', 'b-blocks')} value={closeIcon.bg} onChange={(val) => updateObj('closeIcon', val, 'bg')} />}

		<h3 className='mt20'>{__('Search Loader', 'b-blocks')}</h3>
		<ColorControl label={__('Loader Color:', 'b-blocks')} value={loader.color} onChange={(val) => updateObj('loader', val, 'color')} />
	</PanelBody>;
};
export default FieldStyle;
