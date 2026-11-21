import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

const Buttons = ({ attributes, setAttributes }) => {
	const { isZoom, isFullscreen = false, isZoomBtns = false, isScreenshotBtn = false, isDownloadBtn = false } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Buttons', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Fullscreen Button', 'b-blocks')} checked={isFullscreen} onChange={val => setAttributes({ isFullscreen: val })} />

		<ToggleControl className='mt20' label={__('Zoom In/Out Buttons', 'b-blocks')} checked={isZoomBtns} onChange={val => setAttributes({ isZoomBtns: val })} help={!isZoom ? __('Turn on Zoom to show these buttons.', 'b-blocks') : ''} />

		<ToggleControl className='mt20' label={__('Screenshot Button', 'b-blocks')} checked={isScreenshotBtn} onChange={val => setAttributes({ isScreenshotBtn: val })} />

		<ToggleControl className='mt20' label={__('Download Model Button', 'b-blocks')} checked={isDownloadBtn} onChange={val => setAttributes({ isDownloadBtn: val })} />
	</PanelBody>;
};
export default Buttons;
