import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl } from '@wordpress/components';

// Variables
import { hTags, fontSizes, borderStyles, colors } from '../utils/options';

// Settings Components
import Title from '../../../Components/Title';
import BtnGroup from '../../../Components/BtnGroup';

// Icon
import { noteIcon } from '../utils/icons';

registerBlockType('b-blocks/note', {
	// Build In attributes
	title: __('Note', 'b-blocks'),
	description: __('Create Note', 'b-blocks'),
	icon: noteIcon,
	category: 'bBlocks',
	keywords: [__('Note', 'b-blocks'), __('Note Text', 'b-blocks'), __('Store Text', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'wide' },

		BGColor: { type: 'string', default: '#ffff66' },
		padTB: { type: 'number', default: 15 },
		padLR: { type: 'number', default: 15 },
		borderRadius: { type: 'number', default: 5 },

		toggleHead: { type: 'boolean', default: true },
		head: { type: 'string', source: 'html', selector: '.b_blocks_note_head' },
		headTag: { type: 'string', default: 'h2' },
		headFontSize: { type: 'number', default: 25 },
		headColor: { type: 'string', default: '#4527a4' },
		headPB: { type: 'number', default: 5 },
		headMB: { type: 'number', default: 5 },

		sepThick: { type: 'number', default: 2 },
		sepStyle: { type: 'string', default: 'solid' },
		sepColor: { type: 'string', default: '#8344c5' },

		content: { type: 'string', source: 'html', selector: '.b_blocks_note_content' },
		contentFontSize: { type: 'number', default: 15 },
		contentColor: { type: 'string', default: '#333' },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor }, setAttributes } = props;

		// Styles
		const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px` }

		const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0 ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

		const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0` }

		return <>
			<InspectorControls>
				{/* Note Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Note Settings', 'b-blocks')} initialOpen={true}>
					{/* Background Color */}
					<Title className=''>{__('Background Color:', 'b-blocks')}</Title>
					<ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

					{/* Top Bottom Padding */}
					<Title>{__('Top Bottom Padding:', 'b-blocks')}</Title>
					<RangeControl value={padTB} onChange={cng => setAttributes({ padTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					<Title>{__('Left Right Padding:', 'b-blocks')}</Title>
					<RangeControl value={padLR} onChange={cng => setAttributes({ padLR: cng })} min={0} max={150} step={1} />

					{/* Border Radius */}
					<Title>{__('Border Radius:', 'b-blocks')}</Title>
					<RangeControl value={borderRadius} onChange={cng => setAttributes({ borderRadius: cng })} min={0} max={50} step={1} />
				</PanelBody>


				{/* Heading Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Heading Settings', 'b-blocks')} initialOpen={false}>
					{/* Enable/Disable Heading */}
					<ToggleControl label={toggleHead ? 'Disable Heading' : 'Enable Heading'} checked={toggleHead} onChange={cng => setAttributes({ toggleHead: cng })} />

					{toggleHead && <>
						{/* Heading Tag */}
						<Title>{__('Heading Tag:', 'b-blocks')}</Title>
						<BtnGroup options={hTags} myValue={headTag} setState={(cng, def) => setAttributes({ headTag: cng, headFontSize: def })} />

						{/* Font Size */}
						<Title>{__('Font Size:', 'b-blocks')}</Title>
						<FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headFontSize} onChange={cng => setAttributes({ headFontSize: 'undefined' === typeof cng ? 25 : cng })} />

						{/* Color */}
						<Title>{__('Color:', 'b-blocks')}</Title>
						<ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

						{/* Margin Bottom */}
						<Title>{__('Margin Bottom:', 'b-blocks')}</Title>
						<RangeControl value={headPB} onChange={cng => setAttributes({ headPB: cng })} min={0} max={100} step={1} />
					</>}
				</PanelBody>


				{toggleHead && <>
					{/* Separator Settings */}
					<PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
						{/* Thickness */}
						<Title className=''>{__('Thickness:', 'b-blocks')}</Title>
						<RangeControl value={sepThick} onChange={cng => setAttributes({ sepThick: cng })} min={0} max={50} step={.1} />

						{/* Style */}
						<Title>{__('Style:', 'b-blocks')}</Title>
						<SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyles} />

						{/* Color */}
						<Title>{__('Color:', 'b-blocks')}</Title>
						<ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} colors={colors} />

						{/* Margin Bottom */}
						<Title>{__('Margin Bottom:', 'b-blocks')}</Title>
						<RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={100} step={1} />
					</PanelBody>
				</>}


				{/* Content Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
					{/* Font Size */}
					<Title className=''>{__('Font Size:', 'b-blocks')}</Title>
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={contentFontSize} onChange={cng => setAttributes({ contentFontSize: 'undefined' === typeof cng ? 15 : cng })} />

					{/* Color */}
					<Title>{__('Color:', 'b-blocks')}</Title>
					<ColorPalette value={contentColor} onChange={cng => setAttributes({ contentColor: cng })} colors={colors} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_note'>
				<div style={containerStyle}>
					{toggleHead && <span><RichText className='b_blocks_note_head' key='editable' tagName={headTag} placeholder={__('Write Note Heading', 'b-blocks')} value={head} onChange={cng => { setAttributes({ head: cng }) }} inlineToolbar style={headStyle} /></span>}

					<RichText className='b_blocks_note_content' key='editable' tagName='p' placeholder={__('Write Note Content', 'b-blocks')} value={content} onChange={cng => { setAttributes({ content: cng }) }} inlineToolbar style={contentStyle} />
				</div>
			</div>
		</>
	},

	save: props => {
		const { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor } = props.attributes;

		// Styles
		const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px`, textAlign: 'inherit' }

		const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0 ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

		const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0` }

		return (
			<div className='b_blocks_note'>
				<div style={containerStyle}>
					{toggleHead && <RichText.Content className='b_blocks_note_head' tagName={headTag} value={head} style={headStyle} />}

					<RichText.Content className='b_blocks_note_content' tagName='p' value={content} style={contentStyle} />
				</div>
			</div>
		);
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});
