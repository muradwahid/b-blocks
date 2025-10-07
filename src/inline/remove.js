import { registerFormatType } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';

const type = 'b-blocks/remove-inline-formats';
const icon = 'editor-removeformatting';
const title = __('B Remove All Formats', 'b-blocks');
const tagName = 'none';
const className = null;

registerFormatType(type, {
	title,
	tagName,
	className,
	edit({ value, onChange }) { // There is another props call isActive
		return <RichTextToolbarButton icon={icon} title={title} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })} />
	}
});