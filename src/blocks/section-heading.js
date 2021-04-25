import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl } from '@wordpress/components';

// Variables
import options from '../Const/options';
const { hTags, fontSizes, aligns, borderStyles, colors } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/section-heading', {
    // Build In attributes
    title: __('Section Heading', 'b-blocks'),
    description: __('Heading, separator, and a description', 'b-blocks'),
    icon: icons.h,
    category: 'bBlocks',
    keywords: [__('Section', 'b-blocks'), __('Section Head', 'b-blocks'), __('Heading Description', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        contentAlign: { type: 'string', default: 'center' },

        head: { type: 'string', source: 'html', selector: '.b_blocks_section_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number', default: 25 },
        headColor: { type: 'string', default: '#4527a4' },
        headMB: { type: 'number', default: 10 },

        toggleSep: { type: 'boolean', default: true },
        sepWidth: { type: 'number', default: 150 },
        sepThick: { type: 'number', default: 3 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#8344c5' },
        sepMB: { type: 'number', default: 5 },

        toggleDesc: { type: 'boolean', default: true },
        desc: { type: 'string', source: 'html', selector: '.b_blocks_section_description' },
        descFontSize: { type: 'number', default: 15 },
        descColor: { type: 'string', default: '#777' },
        descMB: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { contentAlign, head, headTag, headFontSize, headColor, headMB, toggleSep, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB }, setAttributes } = props;

        // Styles
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return <>
            <InspectorControls>
                {/* Content Settings */}
                <PanelBody title={__('Content Settings', 'b-blocks')} initialOpen={true}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title={__('Heading Settings', 'b-blocks')} initialOpen={false}>
                    {/* Heading Tag */}
                    {firstTitle('Heading Tag:')}
                    <BtnGroup options={hTags} myValue={headTag} setState={(cng, def) => setAttributes({ headTag: cng, headFontSize: def })} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headFontSize} onChange={cng => setAttributes({ headFontSize: 'undefined' === typeof cng ? 25 : cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                    {/* Margin Bottom */}
                    {otherTitle('Margin Bottom:')}
                    <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={100} step={1} />
                </PanelBody>


                {/* Separator Settings */}
                <PanelBody title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                    {/* Enable/Disable Separator */}
                    <ToggleControl label={toggleSep ? 'Disable Separator' : 'Enable Separator'} checked={toggleSep} onChange={cng => setAttributes({ toggleSep: cng })} />

                    {toggleSep && <>
                        {/* Width */}
                        {otherTitle('Width:')}
                        <RangeControl value={sepWidth} onChange={cng => setAttributes({ sepWidth: cng })} min={0} max={1920} step={1} />

                        {/* Thickness */}
                        {firstTitle('Thickness:')}
                        <RangeControl value={sepThick} onChange={cng => setAttributes({ sepThick: cng })} min={0} max={50} step={.1} />

                        {/* Style */}
                        {otherTitle('Style:')}
                        <SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyles} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={sepMB} onChange={cng => setAttributes({ sepMB: cng })} min={0} max={100} step={1} />
                    </>}
                </PanelBody>


                {/* Description Settings */}
                <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                    {/* Enable/Disable Description */}
                    <ToggleControl label={toggleDesc ? 'Disable Description' : 'Enable Description'} checked={toggleDesc} onChange={cng => setAttributes({ toggleDesc: cng })} />

                    {toggleDesc && <>
                        {/* Font Size */}
                        {firstTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={descFontSize} onChange={cng => setAttributes({ descFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={descColor} onChange={cng => setAttributes({ descColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={descMB} onChange={cng => setAttributes({ descMB: cng })} min={0} max={100} step={1} />
                    </>}
                </PanelBody>
            </InspectorControls>


            <div className="b_blocks_section_heading" style={{ textAlign: contentAlign }}>
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>

                <RichText className="b_blocks_section_head" key="editable" tagName={headTag} placeholder={__('Write Section Heading', 'b-blocks')} value={head} onChange={cng => { setAttributes({ head: cng }) }} inlineToolbar style={headStyle} />

                {toggleSep && <div style={separatorStyle}></div>}

                {toggleDesc && <span><RichText className="b_blocks_section_description" key="editable" tagName="p" placeholder={__('Write Section Description', 'b-blocks')} value={desc} onChange={cng => { setAttributes({ desc: cng }) }} inlineToolbar style={descStyle} /></span>}
            </div>
        </>
    },

    save: props => {
        const { contentAlign, head, headTag, headFontSize, headColor, headMB, toggleSep, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB } = props.attributes;

        // Styles
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return (
            <div className="b_blocks_section_heading" style={{ textAlign: contentAlign }}>
                <RichText.Content className="b_blocks_section_head" tagName={headTag} value={head} style={headStyle} />

                {toggleSep && <div style={separatorStyle}></div>}

                {toggleDesc && <RichText.Content className="b_blocks_section_description" tagName="p" value={desc} style={descStyle} />}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});