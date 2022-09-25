import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, ColorPalette, InnerBlocks, RichText, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker, RangeControl, TabPanel, SelectControl } from '@wordpress/components';

// Variables
import options from '../utils/options';
const { normalHoverTabs, fontSizes, colors, aligns, fontWeights, textTransforms } = options;

// Components
import BtnGroup from '../Components/BtnGroup';

// Functions
import { firstTitle, otherTitle } from '../utils/functions';

// Icons
import icons from '../utils/icons';

registerBlockType('b-blocks/collapse', {
	// Build In attributes
	title: __('Collapse', 'b-blocks'),
	description: __('Show hide content by clicking a button', 'b-blocks'),
	icon: icons.collapse,
	category: 'bBlocks',
	keywords: [__('Collapse', 'b-blocks'), __('Downfall', 'b-blocks'), __('Closing', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },
		cId: { type: 'string' },

		collBtnLabel: { type: 'string', source: 'html', selector: '.b_blocks_collapse_btn_label' },
		collBtnAlign: { type: 'string', default: 'left' },
		collBtnFontSize: { type: 'number', default: 15 },
		collBtnTransform: { type: 'string', default: 'uppercase' },
		collBtnFontWeight: { type: 'string', default: '600' },
		collBtnPTB: { type: 'number', default: 12 },
		collBtnPLR: { type: 'number', default: 30 },
		collBtnRadius: { type: 'number', default: 3 },
		collBtnColor: { type: 'string', default: '#fff' },
		collBtnBGColor: { type: 'string', default: '#4527a4' },
		collBtnHovColor: { type: 'string', default: '#fff' },
		collBtnHovBGColor: { type: 'string', default: '#8344c5' },

		contentPTB: { type: 'number', default: 10 },
		contentPLR: { type: 'number', default: 15 },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnColor, collBtnBGColor, collBtnHovColor, collBtnHovBGColor, contentPTB, contentPLR }, setAttributes, clientId } = props;

		// Styles
		const collBtnStyle = { fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px 0`, borderRadius: `${collBtnRadius}px`, color: collBtnColor, backgroundColor: collBtnBGColor };

		const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

		// Functions
		useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]);

		const collBtnHov = e => {
			e.target.style.color = collBtnHovColor;
			e.target.style.backgroundColor = collBtnHovBGColor;
		}
		const collBtnHovLeave = e => {
			e.target.style.color = collBtnColor;
			e.target.style.backgroundColor = collBtnBGColor;
		}

		return <>
			<InspectorControls>
				<PanelBody className='bBlocksPanelBody' title={__('Collapse Button Settings', 'b-blocks')} initialOpen={true}>
					{/* Button Align */}
					{firstTitle('Button Align:')}
					<BtnGroup options={aligns} myValue={collBtnAlign} setState={cng => setAttributes({ collBtnAlign: cng })} icon={true} />

					{/* Font Size */}
					{otherTitle('Font Size:')}
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={collBtnFontSize} onChange={cng => setAttributes({ collBtnFontSize: 'undefined' === typeof cng ? 15 : cng })} />

					{/* Text Transform */}
					{otherTitle('Text Transform:')}
					<BtnGroup options={textTransforms} myValue={collBtnTransform} setState={cng => setAttributes({ collBtnTransform: cng })} />

					{/* Font Weight */}
					{otherTitle('Font Weight:')}
					<SelectControl value={collBtnFontWeight} onChange={cng => setAttributes({ collBtnFontWeight: cng })} options={fontWeights} />

					{/* Top Bottom Padding */}
					{otherTitle('Top Bottom Padding:')}
					<RangeControl value={collBtnPTB} onChange={cng => setAttributes({ collBtnPTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					{otherTitle('Left Right Padding:')}
					<RangeControl value={collBtnPLR} onChange={cng => setAttributes({ collBtnPLR: cng })} min={0} max={150} step={1} />

					{/* Border Radius */}
					{otherTitle('Border Radius:')}
					<RangeControl value={collBtnRadius} onChange={cng => setAttributes({ collBtnRadius: cng })} min={0} max={50} step={1} />

					{/* Colors */}
					{otherTitle('Colors:')}
					<TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={normalHoverTabs}>{tab => <>
						{'normal' == tab.name && <>
							{/* Color */}
							{otherTitle('Color:')}
							<ColorPalette value={collBtnColor} onChange={cng => setAttributes({ collBtnColor: cng })} colors={colors} />

							{/* Background Color */}
							{otherTitle('Background Color:')}
							<ColorPalette value={collBtnBGColor} onChange={cng => setAttributes({ collBtnBGColor: cng })} colors={colors} />
						</>}

						{'hover' == tab.name && <>
							{/* Hover Color */}
							{otherTitle('Hover Color:')}
							<ColorPalette value={collBtnHovColor} onChange={cng => setAttributes({ collBtnHovColor: cng })} colors={colors} />

							{/* Hover Background Color */}
							{otherTitle('Hover Background Color:')}
							<ColorPalette value={collBtnHovBGColor} onChange={cng => setAttributes({ collBtnHovBGColor: cng })} colors={colors} />
						</>}
					</>}</TabPanel>
				</PanelBody>


				<PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
					{/* Top Bottom Padding */}
					{firstTitle('Top Bottom Padding:')}
					<RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					{otherTitle('Left Right Padding:')}
					<RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
				</PanelBody>
			</InspectorControls>,


			<div className='b_blocks_collapse'>
				<BlockControls>
					<AlignmentToolbar value={collBtnAlign} onChange={cng => setAttributes({ collBtnAlign: cng })} />
				</BlockControls>

				<div style={{ textAlign: collBtnAlign }}>
					<button className='b_blocks_btn' type='button' data-toggle='collapse' data-target={`#bBlocksCollapse-${clientId}`} aria-expanded='false' aria-controls={`bBlocksCollapse-${clientId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>
						<RichText className='b_blocks_collapse_btn_label' key='editable' tagName='span' placeholder={__('Enter Collapse Button Text', 'b-blocks')} value={collBtnLabel} onChange={cng => { setAttributes({ collBtnLabel: cng }) }} inlineToolbar style={{ padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px` }} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave} />
					</button>
				</div>


				{/* Collapse */}
				<div className='collapse' id={`bBlocksCollapse-${clientId}`}>
					<div className='collapse_content bBlocksInnerContent' style={contentStyle}>
						<InnerBlocks />
					</div>
				</div>
			</div>
		</>
	},

	save: props => {
		const { cId, collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnColor, collBtnBGColor, collBtnHovColor, collBtnHovBGColor, contentPTB, contentPLR } = props.attributes;

		// Styles
		const collBtnStyle = { fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px`, color: collBtnColor, backgroundColor: collBtnBGColor };

		const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

		// Functions
		const collBtnHov = e => {
			e.target.style.color = collBtnHovColor;
			e.target.style.backgroundColor = collBtnHovBGColor;
		}
		const collBtnHovLeave = e => {
			e.target.style.color = collBtnColor;
			e.target.style.backgroundColor = collBtnBGColor;
		}

		return (
			<div className='b_blocks_collapse' style={{ textAlign: 'inherit' }}>
				{/* Button Trigger Collapse */}
				<div style={{ textAlign: collBtnAlign }}>
					<button type='button' className='b_blocks_collapse_btn_label b_blocks_btn' data-toggle='collapse' data-target={`#bBlocksCollapse-${cId}`} aria-expanded='false' aria-controls={`bBlocksCollapse-${cId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>{collBtnLabel}</button>
				</div>


				{/* Collapse */}
				<div className='collapse' id={`bBlocksCollapse-${cId}`}>
					<div className='collapse_content bBlocksInnerContent' style={contentStyle}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		)
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});