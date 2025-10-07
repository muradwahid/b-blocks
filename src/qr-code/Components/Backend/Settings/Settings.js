import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

import { Label, HexColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug, qrCodeDocs } from '../../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const { qrAlign, url, dimension, color, bgColor } = attributes;

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} docsLink={qrCodeDocs} />


			<PanelBody className='bPlPanelBody' title={__('QR Code Settings', 'b-blocks')}>
				<Label className='mb5'>{__('Website URL:', 'b-blocks')}</Label>
				<TextControl value={url} onChange={val => setAttributes({ url: val })} placeholder={__('Website URL:', 'b-blocks')} />

				<Label>{__('Dimension:', 'b-blocks')}</Label>
				<RangeControl value={dimension} onChange={val => setAttributes({ dimension: val })} min={50} max={1000} step={1} />

				<HexColorControl label={__('Color:', 'b-blocks')} value={color} onChange={val => setAttributes({ color: val })} defaultColor='#000' disableAlpha={true} />

				<HexColorControl label={__('Background Color:', 'b-blocks')} value={bgColor} onChange={val => setAttributes({ bgColor: val })} defaultColor='#fff' disableAlpha={true} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={qrAlign} onChange={val => setAttributes({ qrAlign: val })} describedBy={__('QR Code Alignment')} alignmentControls={[
				{ title: __('QR Code in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('QR Code in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('QR Code in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;