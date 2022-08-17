import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';

import './remove';
import icons from '../../utils/icons';
const { highlight, uppercase, underline, overline } = icons;

const allFormats = [
	{ type: 'b-blocks/text-highlight', icon: highlight, title: __('B Text Highlight', 'b-blocks'), tagName: 'mark', className: 'bBlocksTextHighlight' },
	{ type: 'b-blocks/text-uppercase', icon: uppercase, title: __('B Text Uppercase', 'b-blocks'), tagName: 'span', className: 'bBlocksTextUppercase' },
	{ type: 'b-blocks/text-underline', icon: underline, title: __('B Text Underline', 'b-blocks'), tagName: 'span', className: 'bBlocksTextUnderline' },
	{ type: 'b-blocks/text-overline', icon: overline, title: __('B Text Overline', 'b-blocks'), tagName: 'span', className: 'bBlocksTextOverline' },
];

allFormats.forEach(format => {
	const { type, icon, title, tagName, className } = format;

	registerFormatType(type, {
		title,
		tagName,
		className,

		edit: ({ isActive, value, onChange }) => {
			return <RichTextToolbarButton title={title} onClick={() => {
				onChange(
					toggleFormat(value, { type })
				);
			}} isActive={isActive} icon={icon(`bBlocksInlineIcon ${isActive ? 'bBlocksInlineIconActive' : ''}`)} />
		}
	});
});