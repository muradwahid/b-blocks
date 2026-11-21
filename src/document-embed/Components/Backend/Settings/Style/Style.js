import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, RangeControl, SelectControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { alignOptions, fitOptions, sizeUnits, stateOptions } from '../../../../utils/options';
import { noToolbarLink } from '../../../../utils/common';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { document = {}, toolbar = {}, lightbox = {}, security = {}, container = {}, toolbarStyle = {}, downloadButton = {}, lightboxButton = {}, lightboxImage = {}, loader = {} } = attributes;

	// Google Drive and Dropbox documents have no toolbar on the page (see the Toolbar panel).
	const isCloud = noToolbarLink(document.url);

	const [downloadState, setDownloadState] = useState('normal');
	const [lightboxState, setLightboxState] = useState('normal');

	// The Download and Lightbox buttons share one shape: { typo, transition, [device]: { padding }, [state]: { color, border, [device]: { radius } } }.
	const button = (group, value, state, setState) => <>
		<Typography label={__('Typography', 'b-blocks')} value={value.typo} onChange={(val) => updateObj(group, val, 'typo')} />

		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			values={value[device]?.padding}
			onChange={(val) => updateObj(group, val, device, 'padding')}
		/>

		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={(val) => setState(val || 'normal')}>
			{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={value[state]?.color?.text} onChange={(val) => updateObj(group, val, state, 'color', 'text')} />

		<Background key={`${group}-bg-${state}`} className='mt10' label={__('Background:', 'b-blocks')} value={value[state]?.color?.bg} isImage={false} onChange={(val) => updateObj(group, val, state, 'color', 'bg')} />

		<BorderBoxControl key={`${group}-border-${state}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={value[state]?.border} onChange={(val) => updateObj(group, val || {}, state, 'border')} />

		<BoxControl key={`${group}-radius-${state}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={value[state]?.[device]?.radius} onChange={(val) => updateObj(group, val, state, device, 'radius')} />

		{'hover' === state && <RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} value={value.transition ?? 0.2} min={0} max={3} step={0.05} onChange={(val) => updateObj(group, val, 'transition')} __nextHasNoMarginBottom />}
	</>;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Container', 'b-blocks')} initialOpen={true}>
			<Background label={__('Background:', 'b-blocks')} value={container.bg} onChange={(val) => updateObj('container', val, 'bg')} />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={container[device]?.padding} onChange={(val) => updateObj('container', val, device, 'padding')} />

			<BorderBoxControl className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={container.border} onChange={(val) => updateObj('container', val || {}, 'border')} />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={container[device]?.radius} onChange={(val) => updateObj('container', val, device, 'radius')} />

			<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={container.shadow} onChange={(val) => updateObj('container', val, 'shadow')} />
		</PanelBody>

		{!isCloud && (toolbar.showName || toolbar.showDownload || toolbar.showNewTab || toolbar.showPrint || toolbar.showCopyLink) && <PanelBody className='bPlPanelBody' title={__('Toolbar', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={<>{__('Hide on This Device', 'b-blocks')} <Device /></>} checked={!!toolbarStyle[device]?.hide} onChange={(val) => updateObj('toolbarStyle', val, device, 'hide')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={toolbarStyle.typo} onChange={(val) => updateObj('toolbarStyle', val, 'typo')} />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={toolbarStyle[device]?.padding} onChange={(val) => updateObj('toolbarStyle', val, device, 'padding')} />

			<UnitControl className='mt10' __next40pxDefaultSize label={<>{__('Minimum Height', 'b-blocks')} <Device /></>} value={toolbarStyle[device]?.height} units={sizeUnits} onChange={(val) => updateObj('toolbarStyle', val || '', device, 'height')} />
		</PanelBody>}

		{!isCloud && toolbar.showDownload && <PanelBody className='bPlPanelBody' title={__('Download Button', 'b-blocks')} initialOpen={false}>
			{button('downloadButton', downloadButton, downloadState, setDownloadState)}
		</PanelBody>}

		{lightbox.enabled && 'button' === lightbox.trigger && <PanelBody className='bPlPanelBody' title={__('Lightbox Button', 'b-blocks')} initialOpen={false}>
			{button('lightboxButton', lightboxButton, lightboxState, setLightboxState)}
		</PanelBody>}

		{lightbox.enabled && 'image' === lightbox.trigger && <PanelBody className='bPlPanelBody' title={__('Lightbox Image', 'b-blocks')} initialOpen={false}>
			<UnitControl __next40pxDefaultSize label={<>{__('Width', 'b-blocks')} <Device /></>} value={lightboxImage[device]?.width} units={sizeUnits} onChange={(val) => updateObj('lightboxImage', val || '', device, 'width')} />

			<UnitControl className='mt10' __next40pxDefaultSize label={<>{__('Height', 'b-blocks')} <Device /></>} value={lightboxImage[device]?.height} units={sizeUnits} onChange={(val) => updateObj('lightboxImage', val || '', device, 'height')} />

			<SelectControl className='mt10' label={__('Object Fit', 'b-blocks')} value={lightboxImage.fit} options={fitOptions} onChange={(val) => updateObj('lightboxImage', val, 'fit')} __next40pxDefaultSize __nextHasNoMarginBottom />

			<SelectControl className='mt10' label={__('Alignment', 'b-blocks')} value={lightboxImage.align} options={alignOptions} onChange={(val) => updateObj('lightboxImage', val, 'align')} __next40pxDefaultSize __nextHasNoMarginBottom />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={lightboxImage[device]?.radius} onChange={(val) => updateObj('lightboxImage', val, device, 'radius')} />
		</PanelBody>}

		{security.customLoader && <PanelBody className='bPlPanelBody' title={__('Loader', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Spinner Color:', 'b-blocks')} value={loader.color} defaultColor='#3498db' onChange={(val) => updateObj('loader', val, 'color')} />

			<ColorControl className='mt10' label={__('Track Color:', 'b-blocks')} value={loader.bg} defaultColor='#f3f3f3' onChange={(val) => updateObj('loader', val, 'bg')} />
		</PanelBody>}
	</>;
};
export default Style;