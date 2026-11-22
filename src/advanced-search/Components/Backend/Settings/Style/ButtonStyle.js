import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { stateOptions } from '../../../../utils/options';

const ButtonStyle = ({ attributes, updateObj, device, isOff, presetData, toBg }) => {
	const { searchBtn = {} } = attributes;

	const [btnState, setBtnState] = useState('normal');

	return <PanelBody className='bPlPanelBody' title={__('Search Button', 'b-blocks')} initialOpen={false}>
		{ /* An icon follows the text size and colours. */}
		<Typography label={__('Typography', 'b-blocks')} value={searchBtn.typo} onChange={(val) => updateObj('searchBtn', val, 'typo')} />

		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Width', 'b-blocks')} <Device /></Flex>} value={searchBtn[device]?.width} labelPosition='edge' onChange={(val) => updateObj('searchBtn', val || '', device, 'width')} />
		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Height', 'b-blocks')} <Device /></Flex>} value={searchBtn[device]?.height} labelPosition='edge' onChange={(val) => updateObj('searchBtn', val || '', device, 'height')} />

		<BoxControl key={`searchBtn-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={searchBtn[device]?.padding} onChange={(val) => updateObj('searchBtn', val, device, 'padding')} />

		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={btnState} onChange={(val) => setBtnState(val || 'normal')}>
			{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>
		<ColorControl key={`btn-color-${btnState}`} className='mt10' label={'hover' === btnState ? __('Hover Text Color:', 'b-blocks') : __('Button Text Color:', 'b-blocks')} value={searchBtn[btnState]?.color} onChange={(val) => updateObj('searchBtn', val, btnState, 'color')} />
		{!isOff(`searchBtn.${btnState}.bg`, searchBtn[btnState]?.bg, presetData.searchBtn?.[btnState]?.bg) && <Background key={`btn-bg-${btnState}`} className='mt10' label={'hover' === btnState ? __('Hover Background:', 'b-blocks') : __('Button Background:', 'b-blocks')} value={toBg(searchBtn[btnState]?.bg)} isImage={false} onChange={(val) => updateObj('searchBtn', val, btnState, 'bg')} />}
		<BorderBoxControl key={`searchBtn-border-${btnState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={searchBtn[btnState]?.border} onChange={(val) => updateObj('searchBtn', val || {}, btnState, 'border')} />
		{!isOff(`searchBtn.${btnState}.radius`, searchBtn[btnState]?.[device]?.radius, presetData.searchBtn?.[btnState]?.[device]?.radius) && <BoxControl key={`searchBtn-radius-${btnState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={searchBtn[btnState]?.[device]?.radius} onChange={(val) => updateObj('searchBtn', val, btnState, device, 'radius')} />}
		<ShadowControl key={`searchBtn-shadow-${btnState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={searchBtn[btnState]?.shadow} onChange={(val) => updateObj('searchBtn', val, btnState, 'shadow')} />
	</PanelBody>;
};
export default ButtonStyle;
