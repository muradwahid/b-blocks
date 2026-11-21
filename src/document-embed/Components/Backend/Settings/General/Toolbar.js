import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';
import { SelectControlPro } from '../../../../../../../bpl-tools/ProControls';
import { positionOptions, themeOptions } from '../../../../utils/options';
import { noToolbarLink } from '../../../../utils/common';

const Toolbar = ({ attributes, updateObj, premiumProps, usesPdfJs = false }) => {
	const { document = {}, toolbar = {} } = attributes;
	const { showName = false, showDownload = false, showNewTab = false, showPrint = false, showCopyLink = false, downloadPosition = 'toolbar', theme = 'dark', bg = {}, color = '#ffffff' } = toolbar;

	// Decided by the link, as on the page: a direct file link stays a direct link whatever the Source says.
	const isCloud = noToolbarLink(document.url);
	const hasButtons = showName || showDownload || showNewTab || showPrint || showCopyLink;

	return <PanelBody className='bPlPanelBody' title={__('Toolbar', 'b-blocks')} initialOpen={false}>
		{isCloud ? <p className='mt10'>{__('The toolbar is not available for Google Drive and Dropbox documents.', 'b-blocks')}</p> : <>
			<ToggleControl
				label={__('Display File Name', 'b-blocks')}
				checked={showName}
				onChange={(val) => updateObj('toolbar', val, 'showName')}
			/>

			<ToggleControl
				className='mt10'
				label={__('Download Button', 'b-blocks')}
				checked={showDownload}
				onChange={(val) => updateObj('toolbar', val, 'showDownload')}
			/>

			<ToggleControl
				className='mt10'
				label={__('Open in New Tab Button', 'b-blocks')}
				help={__('Handy on phones, where a document in a page is small.', 'b-blocks')}
				checked={showNewTab}
				onChange={(val) => updateObj('toolbar', val, 'showNewTab')}
			/>

			<ToggleControl
				className='mt10'
				label={__('Print Button', 'b-blocks')}
				help={__('Custom PDF engine only, for PDFs on this site.', 'b-blocks')}
				checked={showPrint}
				onChange={(val) => updateObj('toolbar', val, 'showPrint')}
			/>

			<ToggleControl
				className='mt10'
				label={__('Copy Page Link Button', 'b-blocks')}
				help={__('Copies a link that opens the document at the page being read. Built-in PDF viewer (PDFs on this site), Flipbook and Slider.', 'b-blocks')}
				checked={showCopyLink}
				onChange={(val) => updateObj('toolbar', val, 'showCopyLink')}
			/>

			{/* The theme also colours the toolbar of the built-in PDF viewer, so it shows for that viewer too. */}
			{(hasButtons || usesPdfJs) && <>
				{hasButtons && <SelectControl
					className='mt10'
					label={__('Toolbar Position', 'b-blocks')}
					value={downloadPosition}
					options={positionOptions}
					labelPosition='edge'
					onChange={(val) => updateObj('toolbar', val, 'downloadPosition')}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>}

				<SelectControlPro
					className='mt10'
					label={__('Toolbar Theme', 'b-blocks')}
					value={theme}
					options={themeOptions}
					labelPosition='edge'
					proValues={['custom']}
					help={usesPdfJs ? __('Also colours the toolbar of the PDF viewer.', 'b-blocks') : undefined}
					onChange={(val) => updateObj('toolbar', val, 'theme')}
					{...premiumProps}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				{'custom' === theme && <>
					{/* A colour saved before this was a Background (a plain string) is read as a solid colour; only the keys a
						Background uses are saved, so an older value is never spread into the object letter by letter. */}
					<Background className='mt10' label={__('Background:', 'b-blocks')} value={'string' === typeof bg ? { type: 'solid', color: bg } : bg} defaults={{ color: '#343434' }} isImage={false} onChange={(val) => updateObj('toolbar', { type: val.type, color: val.color, gradient: val.gradient }, 'bg')} />

					{usesPdfJs && 'gradient' === bg?.type && <p className='b-blocks-document-embed-warning'>{__('The toolbar of the PDF viewer takes one colour, so it uses the solid colour.', 'b-blocks')}</p>}

					<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={color} defaultColor='#ffffff' onChange={(val) => updateObj('toolbar', val, 'color')} />
				</>}
			</>}
		</>}
	</PanelBody>;
};
export default Toolbar;
