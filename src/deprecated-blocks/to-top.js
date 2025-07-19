import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker } from '@wordpress/components';

import { Label, BtnGroup } from '../../../bpl-tools/Components';
import { primaryColor } from '../../../bpl-tools/utils/data';

import { toTopIcon } from '../utils/icons';
import { fontSizes, aligns, colors } from '../utils/options';

registerBlockType('b-blocks/to-top', {
	// Build In attributes
	title: __('Go To Top', 'b-blocks'),
	description: __('Back to top of your page', 'b-blocks'),
	icon: toTopIcon,
	category: 'bBlocks',
	keywords: [__('To Top', 'b-blocks'), __('Back to Top', 'b-blocks'), __('Return to Top', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },

		label: { type: 'string', default: 'Go to top', source: 'html', selector: '.b_blocks_to_top_link' },
		contentAlign: { type: 'string', default: 'right' },
		fontSize: { type: 'number', default: 15 },
		color: { type: 'string', default: primaryColor },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { contentAlign, label, fontSize, color }, setAttributes } = props;

		// Styles
		const toTopStyle = { fontSize: `${fontSize}px`, color, textDecoration: 'none' };

		return <>
			<InspectorControls>
				{/* Go To Top Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Go To Top Settings', 'b-blocks')} initialOpen={false}>
					{/* Text Align */}
					<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
					<BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />

					{/* Font Size */}
					<Label>{__('Font Size:', 'b-blocks')}</Label>
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={fontSize} onChange={cng => setAttributes({ fontSize: 'undefined' === typeof cng ? 15 : cng })} />

					{/* Color */}
					<Label>{__('Color:', 'b-blocks')}</Label>
					<ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} colors={colors} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_to_top' style={{ textAlign: contentAlign }}>
				<RichText className='b_blocks_to_top_link' key='editable' tagName='a' href='#' placeholder='Enter Go to top label' value={label} onChange={cng => { setAttributes({ label: cng }) }} inlineToolbar style={toTopStyle} />
			</div>
		</>;
	},

	save: props => {
		const { contentAlign, label, fontSize, color } = props.attributes;

		// Styles
		const toTopStyle = { fontSize: `${fontSize}px`, color, textDecoration: 'none' };

		return (
			<div className='b_blocks_to_top' style={{ textAlign: contentAlign }}>
				<RichText.Content className='b_blocks_to_top_link' tagName='a' href='#' value={label} style={toTopStyle} />
			</div>
		);
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});