import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, ColorPalette, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker } from '@wordpress/components';

import { Label } from '../../../bpl-tools/Components';

import { paintIcon } from '../utils/icons';
import { fontSizes, colors } from '../utils/options';

registerBlockType('b-blocks/highlight-text', {
	// Build In attributes
	title: __('Highlight Text', 'b-blocks'),
	description: __('Highlight text with custom color', 'b-blocks'),
	icon: paintIcon,
	category: 'bBlocks',
	keywords: [__('Highlight', 'b-blocks'), __('Highlight Text', 'b-blocks'), __('Color Text', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },

		contentAlign: { type: 'string', default: 'left' },
		text: { type: 'string', source: 'html', selector: '.b_blocks_highlighter' },
		fontS: { type: 'number', default: 15 },
		color: { type: 'string', default: '#333' },
		BGColor: { type: 'string', default: '#beff14' }
	},

	// Build In Functions
	edit: props => {
		const { attributes: { contentAlign, text, fontS, color, BGColor }, setAttributes } = props;

		// Styles
		const textStyle = { padding: '3px 5px', fontSize: `${fontS}px`, color, backgroundColor: BGColor }

		return <>
			<InspectorControls>
				{/* Highlight Text Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Highlight Text Settings', 'b-blocks')} initialOpen={true}>
					{/* Font Size */}
					<Label className=''>{__('Font Size:', 'b-blocks')}</Label>
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={fontS} onChange={cng => setAttributes({ fontS: 'undefined' === typeof cng ? 15 : cng })} />

					{/* Color */}
					<Label>{('Color:', 'b-blocks')}</Label>
					<ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} colors={colors} />

					{/* Background Color */}
					<Label>{('Background Color:', 'b-blocks')}</Label>
					<ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_highlight_text' style={{ textAlign: contentAlign }}>
				<BlockControls>
					<AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
				</BlockControls>

				<RichText className='b_blocks_highlighter' key='editable' tagName='mark' placeholder='Write Your Highlight Text' value={text} onChange={cng => { setAttributes({ text: cng }) }} inlineToolbar style={textStyle} />
			</div>
		</>
	},

	save: props => {
		const { contentAlign, text, fontS, color, BGColor } = props.attributes;

		// Styles
		const textStyle = { padding: '3px 5px', fontSize: `${fontS}px`, color, backgroundColor: BGColor, textAlign: 'inherit' }

		return (
			<div className='b_blocks_highlight_text' style={{ textAlign: contentAlign }}>
				<RichText.Content className='b_blocks_highlighter' tagName='mark' value={text} style={textStyle} />
			</div>
		)
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});