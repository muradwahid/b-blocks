import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

const Content = ({ attributes, updateObj }) => {
	const { content = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false} >
		<TextControl
			label={__('Accessible caption', 'b-blocks')}
			value={content.caption || ''}
			onChange={(val) => updateObj('content', val, 'caption')}
			help={__('Visually hidden but read by screen readers. Describe what is being compared.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		<TextControl
			label={__('Featured badge text', 'b-blocks')}
			value={content.featuredLabel || ''}
			onChange={(val) => updateObj('content', val, 'featuredLabel')}
			placeholder={__('e.g. Most Popular', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};
export default Content;
