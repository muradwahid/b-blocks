import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

const Content = ({ attributes, setAttributes }) => {
	const { caption, featuredLabel } = attributes;

	return <PanelBody
		className='bPlPanelBody'
		title={__('Content', 'b-blocks')}
		initialOpen={true}
	>
		<TextControl
			label={__('Accessible caption', 'b-blocks')}
			value={caption}
			onChange={(val) => setAttributes({ caption: val })}
			help={__('Visually hidden but read by screen readers. Describe what is being compared.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		<TextControl
			label={__('Featured badge text', 'b-blocks')}
			value={featuredLabel}
			onChange={(val) => setAttributes({ featuredLabel: val })}
			placeholder={__('e.g. Most Popular', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};
export default Content;
