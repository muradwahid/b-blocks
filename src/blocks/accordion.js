import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker, Button, RangeControl, TabPanel } from '@wordpress/components';

// Settings Components
import { Label, BtnGroup } from '../../../Components';

import { accordionIcon } from '../utils/icons';
import { normalHoverTabs, fontSizes, colors, aligns, textTransforms } from '../utils/options';

registerBlockType('b-blocks/accordion', {
	// Build In attributes
	title: __('Accordion', 'b-blocks'),
	description: __('Place collapsible text contents', 'b-blocks'),
	icon: accordionIcon,
	category: 'bBlocks',
	keywords: [__('Accordion', 'b-blocks'), __('Collapse', 'b-blocks'), __('Closing', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },
		cId: { type: 'string' },

		accordions: { type: 'array' },

		headingAlign: { type: 'string', default: 'left' },
		headingFontSize: { type: 'number', default: 20 },
		headingTransform: { type: 'string', default: 'uppercase' },
		headingPTB: { type: 'number', default: 12 },
		headingPLR: { type: 'number', default: 30 },
		headingColor: { type: 'string', default: '#4527a4' },
		headingBGColor: { type: 'string', default: '#f1f1f1' },
		headingHovColor: { type: 'string', default: '#fff' },
		headingHovBGColor: { type: 'string', default: '#4527a4' },

		contentAlign: { type: 'string', default: 'left' },
		contentPTB: { type: 'number', default: 15 },
		contentPLR: { type: 'number', default: 20 },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { accordions = [], headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingHovBGColor, contentAlign, contentPTB, contentPLR }, setAttributes, clientId, isSelected } = props;

		// Functions
		useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]);

		// Styles
		const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, position: 'relative', display: 'block', textDecoration: 'none' };

		const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

		const accRemoveStyle = { position: 'absolute', right: '1px', top: '1px', padding: 0, minWidth: '20px', height: '20px', backgroundColor: '#fff', color: '#4527a4' };

		const contentStyle = { textAlign: contentAlign, border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

		const headingHov = e => {
			e.target.style.color = headingHovColor;
			e.target.style.backgroundColor = headingHovBGColor;
		}
		const headingHovLeave = e => {
			e.target.style.color = headingColor;
			e.target.style.backgroundColor = headingBGColor;
		}

		const accordionItem = value => {
			return (
				value && 0 !== value.length && value.sort((a, b) => a.index - b.index).map(acc => {
					const { index, title, description } = acc;
					const active = index == 0 ? true : false;

					return (
						<div key={acc.index} className='b_blocks_acc_item'>
							<a data-toggle='collapse' href={`#accCollapse-${clientId}-${index}`} aria-expanded='true' aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>

								<Button icon='no-alt' className='b_blocks_remove_acc_btn' onClick={() => {
									const newAcc = accordions.filter(item => item.index != index).map(i => {
										if (i.index > index) i.index -= 1;
										return i;
									});
									setAttributes({ accordions: newAcc });
								}} style={accRemoveStyle} />

								<RichText tagName='h3' placeholder={__('Enter the Title', 'b-blocks')} value={title} onChange={cng => {
									const newObj = Object.assign({}, acc, { title: cng });
									setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
								}} inlineToolbar style={titleStyle} />
							</a>

							<div id={`accCollapse-${clientId}-${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${clientId}`} style={contentStyle}>
								<RichText tagName='p' placeholder={__('Enter the description', 'b-blocks')} value={description} onChange={cng => {
									const newObj = Object.assign({}, acc, { description: cng });
									setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
								}} inlineToolbar style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
							</div>
						</div>
					);
				})
			);
		}

		return <>
			<InspectorControls>
				<PanelBody className='bBlocksPanelBody' title={__('Heading Settings', 'b-blocks')} initialOpen={true}>
					{/* Text Align */}
					<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
					<BtnGroup options={aligns} myValue={headingAlign} setState={cng => setAttributes({ headingAlign: cng })} icon={true} />

					{/* Font Size */}
					<Label>{__('Font Size:', 'b-blocks')}</Label>
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={20} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: 'undefined' === typeof cng ? 20 : cng })} />

					{/* Text Transform */}
					<Label>{__('Text Transform:', 'b-blocks')}</Label>
					<BtnGroup options={textTransforms} myValue={headingTransform} setState={cng => setAttributes({ headingTransform: cng })} />

					{/* Top Bottom Padding */}
					<Label>{__('Top Bottom Padding:', 'b-blocks')}</Label>
					<RangeControl value={headingPTB} onChange={cng => setAttributes({ headingPTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					<Label>{__('Left Right Padding:', 'b-blocks')}</Label>
					<RangeControl value={headingPLR} onChange={cng => setAttributes({ headingPLR: cng })} min={0} max={150} step={1} />

					<Label>{__('Colors:', 'b-blocks')}</Label>
					<TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={normalHoverTabs}>{tab => <>
						{'normal' == tab.name && <>
							{/* Color */}
							<Label className=''>{__('Color:', 'b-blocks')}</Label>
							<ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />

							{/* Background Color */}
							<Label>{__('Background Color:', 'b-blocks')}</Label>
							<ColorPalette value={headingBGColor} onChange={cng => setAttributes({ headingBGColor: cng })} colors={colors} />
						</>}

						{'hover' == tab.name && <>
							{/* Hover Color */}
							<Label className=''>{__('Hover Color:', 'b-blocks')}</Label>
							<ColorPalette value={headingHovColor} onChange={cng => setAttributes({ headingHovColor: cng })} colors={colors} />

							{/* Hover Background Color */}
							<Label>{__('Hover Background Color:', 'b-blocks')}</Label>
							<ColorPalette value={headingHovBGColor} onChange={cng => setAttributes({ headingHovBGColor: cng })} colors={colors} />
						</>}
					</>}</TabPanel>
				</PanelBody>


				{/* Content Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
					{/* Text Align */}
					<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
					<BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />

					{/* Top Bottom Padding */}
					<Label>{__('Top Bottom Padding:', 'b-blocks')}</Label>
					<RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					<Label>{__('Left Right Padding:', 'b-blocks')}</Label>
					<RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_accordion'>
				<div className='accordion' id={`bBlocksAccordion-${clientId}`}>
					{accordionItem(accordions)}
				</div>

				{!accordions.length || isSelected ? <div className='b_blocks_add_item'><Button icon='plus-alt' onClick={() => { setAttributes({ accordions: [...accordions, { index: accordions.length }] }) }}>{__('Add New Accordion', 'b-blocks')}</Button></div> : null}
			</div>
		</>
	},

	save: props => {
		const { cId, accordions, headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingHovBGColor, contentAlign, contentPTB, contentPLR } = props.attributes;

		// Styles
		const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, display: 'block', textDecoration: 'none' };

		const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

		const contentStyle = { textAlign: contentAlign, border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

		// Functions
		const headingHov = e => {
			e.target.style.color = headingHovColor;
			e.target.style.backgroundColor = headingHovBGColor;
		}
		const headingHovLeave = e => {
			e.target.style.color = headingColor;
			e.target.style.backgroundColor = headingBGColor;
		}

		const accordionItem = value => {
			return (
				value && 0 !== value.length && value.sort((a, b) => a.index - b.index).map(acc => {
					const { index, title, description } = acc;
					const active = index == 0 ? true : false;

					return (
						<div key={acc.index} className='b_blocks_acc_item'>
							<a data-toggle='collapse' href={`#accCollapse-${cId}${index}`} aria-expanded='true' aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>
								<RichText.Content tagName='h3' value={title} style={titleStyle} />
							</a>

							<div id={`accCollapse-${cId}${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${cId}`} style={contentStyle}>
								<RichText.Content tagName='p' value={description} style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
							</div>
						</div>
					);
				})
			);
		}

		return (
			<div className='b_blocks_accordion' style={{ textAlign: 'inherit' }}>
				<div className='accordion' id={`bBlocksAccordion-${cId}`}>
					{accordionItem(accordions)}
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