import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

/** The bar above the code: what it shows. Its colours live in the Style tab. */
const Header = ({ attributes, updateObj }) => {
	const { content = {}, options = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Header', 'b-blocks')} checked={options.header} onChange={(val) => updateObj('options', val, 'header')} __nextHasNoMarginBottom />

		{options.header ? <>
			<TextControl className='mt10' label={__('Filename', 'b-blocks')} value={content.filename || ''} onChange={(val) => updateObj('content', val, 'filename')} placeholder='example.js' __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Language Badge', 'b-blocks')} checked={options.showLanguage} onChange={(val) => updateObj('options', val, 'showLanguage')} help={__('Shows the language name on the right of the bar.', 'b-blocks')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Window Dots', 'b-blocks')} checked={options.windowDots} onChange={(val) => updateObj('options', val, 'windowDots')} help={__('The three traffic-light dots of a desktop window.', 'b-blocks')} __nextHasNoMarginBottom />
		</> : <small>{__('With the header off, the filename, badge and dots have nowhere to sit.', 'b-blocks')}</small>}
	</PanelBody>;
};

export default Header;
