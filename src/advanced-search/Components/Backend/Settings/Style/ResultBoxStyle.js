import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { footerAlignOptions, stateOptions } from '../../../../utils/options';

const ResultBoxStyle = ({ attributes, updateObj, device, isOff, presetData, toBg, showTotal, showViewAll }) => {
	const { resultBox = {} } = attributes;

	const [boxState, setBoxState] = useState('normal');

	return <PanelBody className='bPlPanelBody' title={__('Search Result Box', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background:', 'b-blocks')} value={toBg(resultBox.bg)} isImage={false} onChange={(val) => updateObj('resultBox', val, 'bg')} />

		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Width', 'b-blocks')} <Device /></Flex>} value={resultBox[device]?.width} labelPosition='edge' onChange={(val) => updateObj('resultBox', val || '', device, 'width')} />
		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Max Height', 'b-blocks')} <Device /></Flex>} help={__('Longer result lists scroll. Empty: no limit.', 'b-blocks')} value={resultBox[device]?.maxHeight || ''} labelPosition='edge' onChange={(val) => updateObj('resultBox', val || '', device, 'maxHeight')} />
		{(showTotal || showViewAll) && <SelectControl className='mt10' label={__('Footer Alignment', 'b-blocks')} labelPosition='edge' value={resultBox.footerAlign || 'space-between'} options={footerAlignOptions} onChange={(val) => updateObj('resultBox', val, 'footerAlign')} __next40pxDefaultSize __nextHasNoMarginBottom />}

		<BoxControl key={`resultBox-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={resultBox[device]?.padding} onChange={(val) => updateObj('resultBox', val, device, 'padding')} />
		<BoxControl key={`resultBox-margin-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} values={resultBox[device]?.margin} onChange={(val) => updateObj('resultBox', val, device, 'margin')} />

		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={boxState} onChange={(val) => setBoxState(val || 'normal')}>
			{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>
		<BorderBoxControl key={`resultBox-border-${boxState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={resultBox[boxState]?.border} onChange={(val) => updateObj('resultBox', val || {}, boxState, 'border')} />
		{!isOff(`resultBox.${boxState}.radius`, resultBox[boxState]?.[device]?.radius, presetData.resultBox?.[boxState]?.[device]?.radius) && <BoxControl key={`resultBox-radius-${boxState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={resultBox[boxState]?.[device]?.radius} onChange={(val) => updateObj('resultBox', val, boxState, device, 'radius')} />}
		{!isOff(`resultBox.${boxState}.shadow`, resultBox[boxState]?.shadow, presetData.resultBox?.[boxState]?.shadow) && <ShadowControl key={`resultBox-shadow-${boxState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={resultBox[boxState]?.shadow} onChange={(val) => updateObj('resultBox', val, boxState, 'shadow')} />}
	</PanelBody>;
};
export default ResultBoxStyle;
