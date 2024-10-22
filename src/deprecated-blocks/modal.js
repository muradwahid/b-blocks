import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { RichText, InspectorControls, ColorPalette, InnerBlocks, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker, Button, ToggleControl, RangeControl, TabPanel, TextControl, SelectControl } from '@wordpress/components';

import { Label, BtnGroup } from '../../../bpl-tools/Components';

import { modalIcon } from '../utils/icons';
import { normalHoverTabs, fontSizes, hTags, colors, aligns, fontWeights, textTransforms } from '../utils/options';

const modalSizes = [
	{ label: __('Small', 'b-blocks'), value: 'modal-sm', icon: 'SM' },
	{ label: __('Default', 'b-blocks'), value: '', icon: 'DF' },
	{ label: __('Large', 'b-blocks'), value: 'modal-lg', icon: 'LG' },
	{ label: __('Extra Large', 'b-blocks'), value: 'modal-xl', icon: 'XL' },
];

registerBlockType('b-blocks/modal', {
	// Build In attributes
	title: __('Modal', 'b-blocks'),
	description: __('Popup modal', 'b-blocks'),
	icon: modalIcon,
	category: 'bBlocks',
	keywords: [__('Modal', 'b-blocks'), __('My Modal', 'b-blocks'), __('Popup', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },
		cId: { type: 'string' },

		modalFade: { type: 'boolean', default: true },
		modalStaticBackdrop: { type: 'boolean', default: false },
		modalScrollable: { type: 'boolean', default: true },
		modalVCenter: { type: 'boolean', default: true },
		modalSize: { type: 'string', default: '' },

		modalBtnLabel: { type: 'string' },
		modalBtnAlign: { type: 'string', default: 'left' },
		modalBtnFontSize: { type: 'number', default: 15 },
		modalBtnTransform: { type: 'string', default: 'uppercase' },
		modalBtnFontWeight: { type: 'string', default: '600' },
		modalBtnPTB: { type: 'number', default: 12 },
		modalBtnPLR: { type: 'number', default: 30 },
		modalBtnRadius: { type: 'number', default: 3 },
		modalBtnColor: { type: 'string', default: '#fff' },
		modalBtnBGColor: { type: 'string', default: '#4527a4' },
		modalBtnHovColor: { type: 'string', default: '#fff' },
		modalBtnHovBGColor: { type: 'string', default: '#8344c5' },

		modalHead: { type: 'boolean', default: true },
		modalHeadClose: { type: 'boolean', default: true },
		modalFoot: { type: 'boolean', default: false },
		modalFootClose: { type: 'boolean', default: false },

		headingShow: { type: 'boolean', default: true },
		heading: { type: 'string', source: 'html', selector: '.b_blocks_modal_heading' },
		headingTag: { type: 'string', default: 'h2' },
		headingFontSize: { type: 'number', default: 25 },
		headingColor: { type: 'string', default: '#4527a4' },

		footerTextShow: { type: 'boolean', default: true },
		footerText: { type: 'string', source: 'html', selector: '.b_blocks_modal_footer_text' },
		footerTextFontSize: { type: 'number', default: 15 },
		footerTextColor: { type: 'string', default: '#000' },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor, footerTextShow, footerText, footerTextFontSize, footerTextColor }, setAttributes, clientId, isSelected } = props;

		// Styles
		const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };
		const footerTextStyle = { fontSize: `${footerTextFontSize}px`, color: footerTextColor, margin: 0 };

		const modalBtnStyle = { fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor };

		// Functions
		useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]);

		const modalBtnHov = e => {
			e.target.style.color = modalBtnHovColor;
			e.target.style.backgroundColor = modalBtnHovBGColor;
		}
		const modalBtnHovLeave = e => {
			e.target.style.color = modalBtnColor;
			e.target.style.backgroundColor = modalBtnBGColor;
		}

		return <>
			<InspectorControls>
				{/* Modal Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Modal Settings', 'b-blocks')} initialOpen={true}>
					{/* Fade Effect */}
					<Label className=''>{__('Fade Effect:', 'b-blocks')}</Label>
					<ToggleControl label={modalFade ? 'Disable Fade Effect' : 'Enable Fade Effect'} checked={modalFade} onChange={cng => setAttributes({ modalFade: cng })} />

					{/* Static Backdrop */}
					<Label>{__('Static Backdrop:', 'b-blocks')}</Label>
					<ToggleControl label={modalStaticBackdrop ? 'Disable Static Backdrop' : 'Enable Static Backdrop'} help={modalStaticBackdrop ? 'The modal will not close when clicking outside' : 'The modal will close when clicking outside'} checked={modalStaticBackdrop} onChange={cng => setAttributes({ modalStaticBackdrop: cng })} />

					{/* Scrollable */}
					<Label>{__('Scrollable:', 'b-blocks')}</Label>
					<ToggleControl label={modalScrollable ? 'Disable Modal Dialog Scrollable' : 'Enable Modal Dialog Scrollable'} checked={modalScrollable} onChange={cng => setAttributes({ modalScrollable: cng })} />

					{/* Vertically Center */}
					<Label>{__('Vertically Center:', 'b-blocks')}</Label>
					<ToggleControl label={modalVCenter ? 'Disable Vertically Centered' : 'Enable Vertically Centered'} checked={modalVCenter} onChange={cng => setAttributes({ modalVCenter: cng })} />

					{/* Modal Size */}
					<Label>{__('Modal Size:', 'b-blocks')}</Label>
					<BtnGroup options={modalSizes} myValue={modalSize} setState={cng => setAttributes({ modalSize: cng })} />
				</PanelBody>


				<PanelBody className='bBlocksPanelBody' title={__('Modal Button Settings', 'b-blocks')} initialOpen={false}>
					{/* Button Align */}
					<Label className=''>{__('Button Align:', 'b-blocks')}</Label>
					<BtnGroup options={aligns} myValue={modalBtnAlign} setState={cng => setAttributes({ modalBtnAlign: cng })} icon={true} />

					{/* Font Size */}
					<Label>{__('Font Size:', 'b-blocks')}</Label>
					<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={modalBtnFontSize} onChange={cng => setAttributes({ modalBtnFontSize: 'undefined' === typeof cng ? 15 : cng })} />

					{/* Text Transform */}
					<Label>{__('Text Transform:', 'b-blocks')}</Label>
					<BtnGroup options={textTransforms} myValue={modalBtnTransform} setState={cng => setAttributes({ modalBtnTransform: cng })} />

					{/* Font Weight */}
					<Label>{__('Font Weight:', 'b-blocks')}</Label>
					<SelectControl value={modalBtnFontWeight} onChange={cng => setAttributes({ modalBtnFontWeight: cng })} options={fontWeights} />

					{/* Top Bottom Padding */}
					<Label>{__('Top Bottom Padding:', 'b-blocks')}</Label>
					<RangeControl value={modalBtnPTB} onChange={cng => setAttributes({ modalBtnPTB: cng })} min={0} max={100} step={1} />

					{/* Left Right Padding */}
					<Label>{__('Left Right Padding:', 'b-blocks')}</Label>
					<RangeControl value={modalBtnPLR} onChange={cng => setAttributes({ modalBtnPLR: cng })} min={0} max={150} step={1} />

					{/* Border Radius */}
					<Label>{__('Border Radius:', 'b-blocks')}</Label>
					<RangeControl value={modalBtnRadius} onChange={cng => setAttributes({ modalBtnRadius: cng })} min={0} max={50} step={1} />

					<Label>{__('Colors:', 'b-blocks')}</Label>
					<TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={normalHoverTabs}>{tab => <>
						{'normal' == tab.name && <>
							{/* Color */}
							<Label>{__('Color:', 'b-blocks')}</Label>
							<ColorPalette value={modalBtnColor} onChange={cng => setAttributes({ modalBtnColor: cng })} colors={colors} />

							{/* Background Color */}
							<Label>{__('Background Color:', 'b-blocks')}</Label>
							<ColorPalette value={modalBtnBGColor} onChange={cng => setAttributes({ modalBtnBGColor: cng })} colors={colors} />
						</>}

						{'hover' == tab.name && <>
							{/* Hover Color */}
							<Label>{__('Hover Color:', 'b-blocks')}</Label>
							<ColorPalette value={modalBtnHovColor} onChange={cng => setAttributes({ modalBtnHovColor: cng })} colors={colors} />

							{/* Hover Background Color */}
							<Label>{__('Hover Background Color:', 'b-blocks')}</Label>
							<ColorPalette value={modalBtnHovBGColor} onChange={cng => setAttributes({ modalBtnHovBGColor: cng })} colors={colors} />
						</>}
					</>}</TabPanel>
				</PanelBody>


				<PanelBody className='bBlocksPanelBody' title={__('Header Settings', 'b-blocks')} initialOpen={false}>
					<ToggleControl label={modalHead ? 'Hide Header' : 'Show Header'} checked={modalHead} onChange={cng => setAttributes({ modalHead: cng })} />

					{modalHead && <>
						{/* Close Button in Header */}
						<Label>{__('Close Button in Header:', 'b-blocks')}</Label>
						<ToggleControl label={modalHeadClose ? 'Hide Close Button in Header' : 'Show Close Button in Header'} checked={modalHeadClose} onChange={cng => setAttributes({ modalHeadClose: cng })} />

						{/* Heading */}
						<Label>{__('Heading:', 'b-blocks')}</Label>
						<ToggleControl label={headingShow ? 'Hide Heading' : 'Show Heading'} checked={headingShow} onChange={cng => setAttributes({ headingShow: cng })} />

						{headingShow && <>
							{/* Heading Tag */}
							<Label className=''>{__('Heading Tag:', 'b-blocks')}</Label>
							<BtnGroup options={hTags} myValue={headingTag} setState={(cng, def) => setAttributes({ headingTag: cng, headingFontSize: def })} />

							{/* Heading Font Size */}
							<Label>{__('Heading Font Size:', 'b-blocks')}</Label>
							<FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: 'undefined' === typeof cng ? 25 : cng })} />

							{/* Heading Color */}
							<Label>{__('Heading Color:', 'b-blocks')}</Label>
							<ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />
						</>}
					</>}
				</PanelBody>

				<PanelBody className='bBlocksPanelBody' title={__('Footer Settings', 'b-blocks')} initialOpen={false}>
					<ToggleControl label={modalFoot ? 'Hide Footer' : 'Show Footer'} checked={modalFoot} onChange={cng => setAttributes({ modalFoot: cng })} />

					{modalFoot && <>
						{/* Footer Text Font Size */}
						<Label>{__('Footer Text Font Size:', 'b-blocks')}</Label>
						<FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={footerTextFontSize} onChange={cng => setAttributes({ footerTextFontSize: 'undefined' === typeof cng ? 15 : cng })} />

						{/* Footer Text Color */}
						<Label>{__('Footer Text Color:', 'b-blocks')}</Label>
						<ColorPalette value={footerTextColor} onChange={cng => setAttributes({ footerTextColor: cng })} colors={colors} />

						{/* Close Button in Footer */}
						<Label>{__('Close Button in Footer:', 'b-blocks')}</Label>
						<ToggleControl label={modalFootClose ? 'Hide Close Button in Footer' : 'Show Close Button in Footer'} checked={modalFootClose} onChange={cng => setAttributes({ modalFootClose: cng })} />
					</>}
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_modal'>
				<BlockControls>
					<AlignmentToolbar value={modalBtnAlign} onChange={cng => setAttributes({ modalBtnAlign: cng })} />
				</BlockControls>

				{/* Button trigger modal */}
				<div style={{ textAlign: modalBtnAlign, position: 'relative' }}>
					<button className='b_blocks_btn' type='button' data-toggle='modal' data-target={`#bBlocksModal-${clientId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>

					{isSelected && <div className='b_blocks_btn_text_control' style={{ left: `${modalBtnAlign === 'left' ? '0%' : modalBtnAlign === 'center' ? '50%' : modalBtnAlign === 'right' && '100%'}`, transform: `${modalBtnAlign === 'left' ? 'translateX(0)' : modalBtnAlign === 'center' ? 'translateX(-50%)' : modalBtnAlign === 'right' && 'translateX(-100%)'}` }}>

						<TextControl id='bBlocksModalBtnLabel' value={modalBtnLabel} onChange={cng => setAttributes({ modalBtnLabel: cng })} placeholder={__('Modal Button Label', 'b-blocks')} />
					</div>}
				</div>


				{/* Modal */}
				<div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${clientId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabIndex='-1' aria-labelledby='bBlocksModalLabel' aria-hidden='true' style={{ zIndex: 99999 }}>

					<div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
						<div className='modal-content'>
							{modalHead && <div className='modal-header' style={{ display: 'block', position: 'relative' }}>
								{headingShow && <span><RichText className='b_blocks_modal_heading' key='editable' tagName={headingTag} placeholder={__('Write Modal Heading', 'b-blocks')} value={heading} onChange={cng => { setAttributes({ heading: cng }) }} inlineToolbar style={headingStyle} /></span>}

								{modalHeadClose && <Button icon='no-alt' className='b_blocks_close_modal_btn close' title={__('Close the modal', 'b-blocks')} data-dismiss='modal' aria-label={__('Close', 'b-blocks')} style={{ position: 'absolute', top: '12px', right: '12px' }} />}
							</div>}

							<div className='modal-body'>
								<InnerBlocks />
							</div>

							{modalFoot && <div className='modal-footer' style={{ display: 'block' }}>
								{footerTextShow && <span><RichText className='b_blocks_modal_footer_text' key='editable' tagName='p' placeholder={__('Write Modal Footer Text', 'b-blocks')} value={footerText} onChange={cng => { setAttributes({ footerText: cng }) }} inlineToolbar style={footerTextStyle} /></span>}

								{modalFootClose && <div style={{ textAlign: 'right' }}><button type='button' className='b_blocks_btn b_blocks_btn_small' title={__('Close the modal', 'b-blocks')} data-dismiss='modal'>Close</button></div>}
							</div>}
						</div>
					</div>

				</div>
			</div>
		</>
	},

	save: props => {
		const { cId, modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor, footerTextShow, footerText, footerTextFontSize, footerTextColor } = props.attributes;

		// Styles
		const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };
		const footerTextStyle = { fontSize: `${footerTextFontSize}px`, color: footerTextColor, margin: 0 };

		const modalBtnStyle = { fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor };

		// Functions
		const modalBtnHov = e => {
			e.target.style.color = modalBtnHovColor;
			e.target.style.backgroundColor = modalBtnHovBGColor;
		}
		const modalBtnHovLeave = e => {
			e.target.style.color = modalBtnColor;
			e.target.style.backgroundColor = modalBtnBGColor;
		}

		return (
			<div className='b_blocks_modal' style={{ textAlign: 'inherit' }}>
				{/* Button trigger modal */}
				<div style={{ textAlign: modalBtnAlign }}>
					<button className='b_blocks_btn' type='button' data-toggle='modal' data-target={`#bBlocksModal-${cId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>
				</div>


				{/* Modal */}
				<div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${cId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabIndex='-1' aria-labelledby='bBlocksModalLabel' aria-hidden='true' style={{ zIndex: 99999 }}>

					<div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
						<div className='modal-content'>
							{modalHead && <div className='modal-header' style={{ display: 'block', position: 'relative' }}>
								{headingShow && <RichText.Content className='b_blocks_modal_heading' tagName={headingTag} value={heading} style={headingStyle} />}

								{modalHeadClose && <Button icon='no-alt' className='b_blocks_close_modal_btn close' title={__('Close the modal', 'b-blocks')} data-dismiss='modal' aria-label={__('Close', 'b-blocks')} style={{ position: 'absolute', top: '12px', right: '12px' }} />}
							</div>}

							<div className='modal-body'>
								<InnerBlocks.Content />
							</div>

							{modalFoot && <div className='modal-footer' style={{ display: 'block' }}>
								{footerTextShow && <RichText.Content className='b_blocks_modal_footer_text' tagName='p' value={footerText} style={footerTextStyle} />}

								{modalFootClose && <div style={{ textAlign: 'right' }}><button type='button' className='b_blocks_btn b_blocks_btn_small' title={__('Close the modal', 'b-blocks')} data-dismiss='modal'>Close</button></div>}
							</div>}
						</div>
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