import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, RangeControl, TextControl } from '@wordpress/components';

import { Label, ColorControl } from '../../../../Components';

const Settings = ({ attributes, setAttributes }) => {
	const { qrAlign, url, dimension, color, bgColor } = attributes;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/qr-code-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('QR Code Settings', 'b-blocks')}>
				<Label className='mb5'>{__('Website URL:', 'b-blocks')}</Label>
				<TextControl value={url} onChange={val => setAttributes({ url: val })} placeholder={__('Website URL:', 'b-blocks')} />

				<Label>{__('Dimension:', 'b-blocks')}</Label>
				<RangeControl value={dimension} onChange={val => setAttributes({ dimension: val })} min={50} max={1000} step={1} />

				<ColorControl label={__('Color:', 'b-blocks')} value={color} onChange={val => setAttributes({ color: val })} defaultColor='#000' disableAlpha={true} />

				<ColorControl label={__('Background Color:', 'b-blocks')} value={bgColor} onChange={val => setAttributes({ bgColor: val })} defaultColor='#fff' disableAlpha={true} />
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