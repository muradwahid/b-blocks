import { __ } from '@wordpress/i18n';
import { PanelBody, TextareaControl, TextControl, ToggleControl } from '@wordpress/components';

const SearchField = ({ attributes, updateObj }) => {
	const { searchField = {} } = attributes;
	const { placeholder = '', showIcon: showSearchIcon = true, shortcut = false, autofocus = false, placeholders = '', shortcutHint = false } = searchField;

	return <PanelBody className='bPlPanelBody' title={__('Search Field', 'b-blocks')} initialOpen={false}>
		<TextControl label={__('Placeholder Text', 'b-blocks')} value={placeholder} onChange={(val) => updateObj('searchField', val, 'placeholder')} __next40pxDefaultSize __nextHasNoMarginBottom />
		<TextareaControl className='mt10' label={__('More Placeholder Texts', 'b-blocks')} help={__('One per line. They take turns with the Placeholder Text every 3 seconds (not for visitors who prefer reduced motion).', 'b-blocks')} value={placeholders} onChange={(val) => updateObj('searchField', val, 'placeholders')} rows={3} __nextHasNoMarginBottom />

		<ToggleControl
			className='mt10'
			label={__('Show Search Icon', 'b-blocks')}
			checked={showSearchIcon}
			onChange={(val) => updateObj('searchField', val, 'showIcon')}
		/>

		<ToggleControl
			className='mt10'
			label={__('"/" Key Focuses The Field', 'b-blocks')}
			help={__('On the page, pressing / outside a text field jumps to this search.', 'b-blocks')}
			checked={shortcut}
			onChange={(val) => updateObj('searchField', val, 'shortcut')}
		/>
		{shortcut && <ToggleControl className='mt10' label={__('Show "/" Hint In The Field', 'b-blocks')} checked={shortcutHint} onChange={(val) => updateObj('searchField', val, 'shortcutHint')} />}
		<ToggleControl
			className='mt10'
			label={__('Autofocus On Page Load', 'b-blocks')}
			help={__('Puts the cursor in the field when the page opens (not in the editor).', 'b-blocks')}
			checked={autofocus}
			onChange={(val) => updateObj('searchField', val, 'autofocus')}
		/>
	</PanelBody>;
};
export default SearchField;
