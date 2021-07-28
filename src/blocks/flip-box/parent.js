import { registerBlockType } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';
import BDevice from '../../GutenComp/BDevice';
import Typography from '../../GutenComp/Typography';
import SpaceControl from '../../GutenComp/SpaceControl';
import options from '../../Const/options';
const { pxEmUnits } = options;

registerBlockType('b-blocks/flip-boxes', {
    // Build In attributes
    title: __('Flip Boxes', 'b-blocks'),
    description: __('Display Flip boxes section', 'b-blocks'),
    icon: icons.flipBox,
    category: 'bBlocks',
    keywords: [__('flip', 'b-blocks'), __('flip boxes', 'b-blocks'), __('flip boxes section', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    edit: props => {
        const { className, attributes: { columns, columnGap, rowGap }, setAttributes, clientId } = props;

        // useEffect
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);

        const [device, setDevice] = useState('desktop');

        // Play with child data
        const innerBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks;
        const childAttributes = innerBlocks && innerBlocks[0]?.attributes;
        const [boxHeight, setBoxHeight] = useState(childAttributes?.boxHeight);
        const [contentAlign, setContentAlign] = useState(childAttributes?.contentAlign);
        const [padding, setPadding] = useState(childAttributes?.padding);
        const [imgWidth, setImgWidth] = useState(childAttributes?.imgWidth);
        const [imgMargin, setImgMargin] = useState(childAttributes?.imgMargin);
        const [titleTypo, setTitleTypo] = useState(childAttributes?.titleTypo);
        const [titleMargin, setTitleMargin] = useState(childAttributes?.titleMargin);
        const [descTypo, setDescTypo] = useState(childAttributes?.descTypo);
        const [btnTypo, setBtnTypo] = useState(childAttributes?.btnTypo);
        const [btnPadding, setBtnPadding] = useState(childAttributes?.btnPadding);

        const setChildAttributes = args => innerBlocks.forEach(block => {
            dispatch('core/block-editor').updateBlockAttributes(block.clientId, args);
        });

        return <>
            <InspectorControls>
                <PanelBody title={__('Layout', 'b-blocks')}>
                    {/* Columns */}
                    <PanelRow>
                        <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                        <BDevice device={device} onChange={val => setDevice(val)} />
                    </PanelRow>
                    <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                    <UnitControl className='mt-20p mb-5p' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={pxEmUnits} />

                    <UnitControl className='mt-20p mb-5p' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={pxEmUnits} />
                </PanelBody>

                <PanelBody title={__('Box Settings', 'b-blocks')} initialOpen={false}>
                    {/* Height */}
                    <UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight || childAttributes?.boxHeight} onChange={val => { setChildAttributes({ boxHeight: val }); setBoxHeight(val) }} units={pxEmUnits} />

                    {/* Padding */}
                    <SpaceControl className='mt-20p mb-5p' label={__('Padding:', 'b-blocks')} space={padding || childAttributes?.padding} onChange={val => { setChildAttributes({ padding: val }); setPadding(val) }} defaults={{ vertical: '30px', horizontal: '25px' }} />
                </PanelBody>

                <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                    {/* Width */}
                    <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={imgWidth || childAttributes?.imgWidth} onChange={val => { setChildAttributes({ imgWidth: val }); setImgWidth(val) }} units={pxEmUnits} />

                    {/* Margin */}
                    <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={imgMargin || childAttributes?.imgMargin} onChange={val => { setChildAttributes({ imgMargin: val }); setImgMargin(val) }} defaults={{ side: 4, bottom: '20px' }} />
                </PanelBody>

                <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                    {/* Typography */}
                    <Typography typography={titleTypo || childAttributes?.titleTypo} onChange={val => { setChildAttributes({ titleTypo: val }); setTitleTypo(val) }} defaults={{ fontSize: 25 }} />

                    {/* Margin */}
                    <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={titleMargin || childAttributes?.titleMargin} onChange={val => { setChildAttributes({ titleMargin: val }); setTitleMargin(val) }} defaults={{ side: 4, bottom: '20px' }} />
                </PanelBody>

                <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                    {/* Typography */}
                    <Typography typography={descTypo || childAttributes?.descTypo} onChange={val => { setChildAttributes({ descTypo: val }); setDescTypo(val) }} defaults={{ fontSize: 16 }} />
                </PanelBody>

                <PanelBody title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                    {/* Typography */}
                    <Typography typography={btnTypo || childAttributes?.btnTypo} onChange={val => { setChildAttributes({ btnTypo: val }); setBtnTypo(val) }} defaults={{ fontSize: 20 }} />

                    {/* Padding */}
                    <SpaceControl className='mt-20p mb-5p' label={__('Padding:', 'b-blocks')} space={btnPadding || childAttributes?.btnPadding} onChange={val => { setChildAttributes({ btnPadding: val }); setBtnPadding(val) }} defaults={{ vertical: '15px', horizontal: '25px' }} />
                </PanelBody>
            </InspectorControls>


            <BlockControls>
                <AlignmentToolbar value={contentAlign || childAttributes?.contentAlign} onChange={val => { setChildAttributes({ contentAlign: val }); setContentAlign(val) }} />
            </BlockControls>


            <div id={`bBlocksFlipBoxes-${clientId}`} className={className}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url(${titleTypo?.googleFontLink || childAttributes?.titleTypo?.googleFontLink});
                    @import url(${descTypo?.googleFontLink || childAttributes?.descTypo?.googleFontLink});
                    @import url(${btnTypo?.googleFontLink || childAttributes?.btnTypo?.googleFontLink});

                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBoxes .block-editor-inner-blocks .block-editor-block-list__layout{
                        grid-gap: ${rowGap} ${columnGap};
                    }

                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox{
                        height: ${boxHeight || childAttributes?.boxHeight};
                    }
                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .box{
                        padding: ${padding?.styles || childAttributes?.padding?.styles || '30px 25px'};
                    }
                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox img{
                        width: ${imgWidth || childAttributes?.imgWidth};
                        margin: ${imgMargin?.styles || childAttributes?.imgMargin?.styles || '0 0 20px 0'};
                    }
                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipTitle{
                        ${titleTypo?.styles || childAttributes?.titleTypo?.styles || 'font-size: 25px;'}
                        margin: ${titleMargin?.styles || childAttributes?.titleMargin?.styles || '0 0 20px 0'};
                    }
                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipDescription{
                        ${descTypo?.styles || childAttributes?.descTypo?.styles || 'font-size: 16px;'}
                    }
                    #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipBtn{
                        ${btnTypo?.styles || childAttributes?.btnTypo?.styles || 'font-size: 16px;'}
                        padding: ${btnPadding?.styles || childAttributes?.btnPadding?.styles || '15px 25px'};
                    }
                `}} />

                <div className={`bBlocksFlipBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    <InnerBlocks allowedBlocks={['b-blocks/flip-box']} template={[['b-blocks/flip-box'], ['b-blocks/flip-box'], ['b-blocks/flip-box']]} />
                </div>
            </div>
        </>
    },

    save: () => <InnerBlocks.Content />,

    example: {
        attributes: {
            'preview': true,
            columns: {
                desktop: 1,
                tablet: 1,
                mobile: 1
            },
        },
    }
});