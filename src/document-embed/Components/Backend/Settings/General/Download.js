import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label, MultiSelectControl } from '../../../../../../../bpl-tools/Components';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';
import useUserRoles from '../../../../../hooks/useUserRoles';
import { accessOptions, behaviorOptions } from '../../../../utils/options';
import { noToolbarLink } from '../../../../utils/common';

const Download = ({ attributes, updateObj, premiumProps }) => {
	const { document = {}, toolbar = {}, download = {} } = attributes;
	const { label = '', showIcon = false, iconPosition = 'left', behavior = 'download', filename = '', showCount = false, limitPerIp = 0, access = 'everyone', roles = [], deniedMessage = '' } = download;

	const { roles: roleOptions } = useUserRoles();

	// These settings only act on the Download button: until it shows, say where to turn it on. They stay saved.
	const isCloud = noToolbarLink(document.url);
	if (isCloud || !toolbar.showDownload) {
		return <PanelBody className='bPlPanelBody' title={__('Download', 'b-blocks')} initialOpen={false}>
			<p>{isCloud ? __('Google Drive and Dropbox documents have no download button here: visitors download from the viewer.', 'b-blocks') : __('Turn on Download Button in the Toolbar panel to set up downloads.', 'b-blocks')}</p>
		</PanelBody>;
	}

	return <PanelBody className='bPlPanelBody' title={__('Download', 'b-blocks')} initialOpen={false}>
		<TextControl
			label={__('Button Text', 'b-blocks')}
			value={label}
			onChange={(val) => updateObj('download', val, 'label')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		<ToggleControl className='mt10' label={__('Button Icon', 'b-blocks')} checked={showIcon} onChange={(val) => updateObj('download', val, 'showIcon')} />

		{showIcon && <SelectControl
			className='mt10'
			label={__('Icon Position', 'b-blocks')}
			value={iconPosition}
			options={[{ label: __('Before the text', 'b-blocks'), value: 'left' }, { label: __('After the text', 'b-blocks'), value: 'right' }]}
			onChange={(val) => updateObj('download', val, 'iconPosition')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>}

		<SelectControl
			className='mt10'
			label={__('Download Behavior', 'b-blocks')}
			value={behavior}
			options={behaviorOptions}
			onChange={(val) => updateObj('download', val, 'behavior')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		<TextControl
			className='mt10'
			label={__('Custom Filename', 'b-blocks')}
			value={filename}
			disabled={'newtab' === behavior}
			onChange={(val) => updateObj('download', val, 'filename')}
			help={'newtab' === behavior ? __('Not used when the file opens in a new tab.', 'b-blocks') : __('Optional. The name the file is saved as.', 'b-blocks')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		<BControlPro
			className='mt10'
			label={__('Show Download Count', 'b-blocks')}
			checked={showCount}
			onChange={(val) => updateObj('download', val, 'showCount')}
			{...premiumProps}
			Component={ToggleControl}
		/>

		<BControlPro
			className='mt10'
			label={__('Download Limit per IP', 'b-blocks')}
			help={__('0 means no limit.', 'b-blocks')}
			value={limitPerIp}
			min={0}
			onChange={(val) => updateObj('download', Math.max(0, parseInt(val, 10) || 0), 'limitPerIp')}
			{...premiumProps}
			Component={NumberControl}
		/>

		<BControlPro
			className='mt10'
			label={__('Who Can Download', 'b-blocks')}
			value={access}
			options={accessOptions}
			onChange={(val) => updateObj('download', val, 'access')}
			{...premiumProps}
			Component={SelectControl}
		/>

		{'roles' === access && 0 < roleOptions.length && <>
			<Label>{__('Allowed Roles', 'b-blocks')}</Label>
			<MultiSelectControl value={roles.filter((role) => roleOptions.some((o) => o.value === role))} options={roleOptions} onChange={(val) => updateObj('download', val, 'roles')} />
		</>}

		{'everyone' !== access && <TextControl
			className='mt10'
			label={__('Access Denied Message', 'b-blocks')}
			value={deniedMessage}
			onChange={(val) => updateObj('download', val, 'deniedMessage')}
			help={__('Shown instead of the button, e.g. "Log in to download". Leave empty to show nothing.', 'b-blocks')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>}
	</PanelBody>;
};
export default Download;
