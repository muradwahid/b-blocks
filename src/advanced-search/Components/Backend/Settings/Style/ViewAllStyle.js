import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { stateOptions } from '../../../../utils/options';

const ViewAllStyle = ({ attributes, updateObj, device, isOff, presetData, toBg }) => {
	const { viewAllBtn = {} } = attributes;

	const [viewState, setViewState] = useState('normal');

	return <PanelBody className='bPlPanelBody' title={__('View All Button', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={viewAllBtn.typo} onChange={(val) => updateObj('viewAllBtn', val, 'typo')} />

		<BoxControl key={`viewAllBtn-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={viewAllBtn[device]?.padding} onChange={(val) => updateObj('viewAllBtn', val, device, 'padding')} />

		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={viewState} onChange={(val) => setViewState(val || 'normal')}>
			{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>
		<ColorControl key={`view-color-${viewState}`} className='mt10' label={'hover' === viewState ? __('Hover Text Color:', 'b-blocks') : __('Text Color:', 'b-blocks')} value={viewAllBtn[viewState]?.color} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'color')} />
		{!isOff(`viewAllBtn.${viewState}.bg`, viewAllBtn[viewState]?.bg, presetData.viewAllBtn?.[viewState]?.bg) && <Background key={`view-bg-${viewState}`} className='mt10' label={'hover' === viewState ? __('Hover Background:', 'b-blocks') : __('Background:', 'b-blocks')} value={toBg(viewAllBtn[viewState]?.bg)} isImage={false} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'bg')} />}
		<BorderBoxControl key={`viewAllBtn-border-${viewState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={viewAllBtn[viewState]?.border} onChange={(val) => updateObj('viewAllBtn', val || {}, viewState, 'border')} />
		{!isOff(`viewAllBtn.${viewState}.radius`, viewAllBtn[viewState]?.[device]?.radius, presetData.viewAllBtn?.[viewState]?.[device]?.radius) && <BoxControl key={`viewAllBtn-radius-${viewState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={viewAllBtn[viewState]?.[device]?.radius} onChange={(val) => updateObj('viewAllBtn', val, viewState, device, 'radius')} />}
		<ShadowControl key={`viewAllBtn-shadow-${viewState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={viewAllBtn[viewState]?.shadow} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'shadow')} />
	</PanelBody>;
};
export default ViewAllStyle;
