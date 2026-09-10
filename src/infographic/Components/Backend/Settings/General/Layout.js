import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

const Elements = ({ attributes, updateObj }) => {
	const { elements = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')} initialOpen={false}>
		<ToggleControl className='mt10' label={__('Enable Title', 'b-blocks')} checked={elements.title} onChange={(val) => updateObj('elements', val, 'title')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Enable Divider', 'b-blocks')} checked={elements.divider} onChange={(val) => updateObj('elements', val, 'divider')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Enable Text', 'b-blocks')} checked={elements.text} onChange={(val) => updateObj('elements', val, 'text')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Enable Image', 'b-blocks')} checked={elements.image} onChange={(val) => updateObj('elements', val, 'image')} __nextHasNoMarginBottom />
	</PanelBody>;
};

export default Elements;
