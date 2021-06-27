import { registerBlockType } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ButtonGroup, Tooltip, Button, ToggleControl } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';
import BDevice from '../../GutenComp/BDevice';
import BtnGroup from '../../GutenComp/BtnGroup';
import BorderControl from '../../GutenComp/BorderControl';
import Typography from '../../GutenComp/Typography';
import SpaceControl from '../../GutenComp/SpaceControl';
import ColorsControl from '../../GutenComp/ColorsControl';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },

    columns: {
        type: 'object', default: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        }
    },
    columnGap: { type: 'number', default: 20 },
    rowGap: { type: 'number', default: 30 },

    colors: {
        type: 'object', default: {}
    }
}

registerBlockType('b-blocks/cards', {
    // Build In attributes
    title: __('Cards', 'b-blocks'),
    description: __('Display cards section', 'b-blocks'),
    icon: icons.card,
    category: 'bBlocks',
    keywords: [__('card', 'b-blocks'), __('cards', 'b-blocks'), __('cards section', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    attributes,

    edit: props => {
        const { className, attributes: { columns, columnGap, rowGap, colors }, setAttributes, clientId } = props;

        // useEffect
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);

        const [device, setDevice] = useState('desktop');

        // Play with child data
        const innerBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks;
        const childAttributes = innerBlocks && innerBlocks[0]?.attributes;
        const [layout, setLayout] = useState(childAttributes?.layout);
        const [contentAlign, setContentAlign] = useState(childAttributes?.contentAlign);
        const [contentPadding, setContentPadding] = useState(childAttributes?.contentPadding);
        const [imgPos, setImgPos] = useState(childAttributes?.imgPos);
        const [imgHeight, setImgHeight] = useState(childAttributes?.imgHeight);
        const [imgBorder, setImgBorder] = useState(childAttributes?.imgBorder);
        const [isCat, setIsCat] = useState(childAttributes?.isCat);
        const [catTypo, setCatTypo] = useState(childAttributes?.catTypo);
        const [catMargin, setCatMargin] = useState(childAttributes?.catMargin);
        const [isTitle, setIsTitle] = useState(childAttributes?.isTitle);
        const [titlePos, setTitlePos] = useState(childAttributes?.titlePos);
        const [titleTypo, setTitleTypo] = useState(childAttributes?.titleTypo);
        const [titleMargin, setTitleMargin] = useState(childAttributes?.titleMargin);

        const setChildAttributes = args => innerBlocks.forEach(block => {
            dispatch('core/block-editor').updateBlockAttributes(block.clientId, args);
        });

        return <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'b-blocks')}>
                    {/* Layout Type */}
                    <PanelRow>
                        <Title mt='0'>{__('Layout Type:', 'b-blocks')}</Title>
                        <ButtonGroup className='bBlocksBtnGroup'>
                            <Tooltip text={__('Vertical', 'b-blocks')} position='top'>
                                <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout || 'vertical' === childAttributes?.layout} aria-pressed={'vertical' === layout || 'vertical' === childAttributes?.layout} onClick={() => { setChildAttributes({ layout: 'vertical', contentAlign: 'center', imgHeight: 250 }); setLayout('vertical'); setContentAlign('center'); setImgHeight(250); }}></Button>
                            </Tooltip>

                            <Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
                                <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout || 'horizontal' === childAttributes?.layout} aria-pressed={'horizontal' === layout || 'horizontal' === childAttributes?.layout} onClick={() => { setChildAttributes({ layout: 'horizontal', contentAlign: 'left', imgHeight: 200 }); setLayout('horizontal'); setContentAlign('left'); setImgHeight(200); }}></Button>
                            </Tooltip>
                        </ButtonGroup>
                    </PanelRow>

                    {/* Columns */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                        <BDevice device={device} onChange={val => setDevice(val)} />
                    </PanelRow>
                    <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                    {/* Column Gap */}
                    <Title>{__('Column Gap:', 'b-blocks')}</Title>
                    <RangeControl value={columnGap} onChange={cng => setAttributes({ columnGap: cng })} min={0} max={100} step={1} beforeIcon='arrow-right-alt' />

                    {/* Row Gap */}
                    <Title>{__('Row Gap', 'b-blocks')}</Title>
                    <RangeControl value={rowGap} onChange={cng => setAttributes({ rowGap: cng })} min={0} max={100} step={1} beforeIcon='arrow-down-alt' />

                    {/* Colors */}
                    <ColorsControl colors={colors} onChange={val => setAttributes({ colors: val })} />
                </PanelBody>

                <PanelBody title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                    {/* Padding */}
                    <SpaceControl label={__('Padding:', 'b-blocks')} space={contentPadding || childAttributes?.contentPadding} onChange={val => { setChildAttributes({ contentPadding: val }); setContentPadding(val); }} defaults={{ vertical: '20px', horizontal: '10px' }} />
                </PanelBody>

                <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                    {/* Position */}
                    <PanelRow>
                        <Title mt='0'>{__('Position:', 'b-blocks')}</Title>
                        <BtnGroup myValue={imgPos || childAttributes?.imgPos} setState={val => { setChildAttributes({ imgPos: val }); setImgPos(val) }} options={[
                            { label: 'vertical' == layout ? 'Top' : 'Left', value: 'top', icon: 'vertical' == layout ? 'TOP' : 'LEFT' },
                            { label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom', icon: 'vertical' == layout ? 'BOTTOM' : 'RIGHT' }
                        ]} />
                    </PanelRow>

                    {/* Height */}
                    <Title>{__('Height:', 'b-blocks')}</Title>
                    <RangeControl value={imgHeight || childAttributes?.imgHeight} onChange={val => { setChildAttributes({ imgHeight: val }); setImgHeight(val) }} min={0} max={500} step={1} />
                </PanelBody>

                <BorderControl label={__('Image Border', 'b-blocks')} border={imgBorder || childAttributes?.imgBorder} onChange={val => { setChildAttributes({ imgBorder: val }); setImgBorder(val); }} defaults={{ radius: '5px' }} />

                <PanelBody title={__('Category Settings', 'b-blocks')} initialOpen={false}>
                    <ToggleControl label={isCat || childAttributes?.isCat ? 'Hide Category' : 'Show Category'} checked={isCat || childAttributes?.isCat} onChange={val => { setChildAttributes({ isCat: val }); setIsCat(val); }} />

                    <Typography className='mt-20p mb-5p' typography={catTypo} onChange={val => { setChildAttributes({ catTypo: val }); setCatTypo(val); }} defaults={{ fontSize: 15 }} />

                    {/* Margin */}
                    <SpaceControl label={__('Margin:', 'b-blocks')} space={catMargin || childAttributes?.catMargin} onChange={val => { setChildAttributes({ catMargin: val }); setCatMargin(val); }} defaults={{ side: 4, bottom: '10px' }} />
                </PanelBody>

                <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                    <ToggleControl label={isTitle || childAttributes?.isTitle ? 'Hide Title' : 'Show Title'} checked={isTitle || childAttributes?.isTitle} onChange={val => { setChildAttributes({ isTitle: val }); setIsTitle(val); }} />

                    {/* Position */}
                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Position:', 'b-blocks')}</Title>
                        <BtnGroup myValue={titlePos || childAttributes?.titlePos} setState={val => { setChildAttributes({ titlePos: val }); setTitlePos(val); }} options={[
                            { label: 'Image', value: 'image', icon: 'IMAGE' },
                            { label: 'Content', value: 'content', icon: 'CONTENT' }
                        ]} />
                    </PanelRow>

                    <Typography className='mt-20p mb-5p' typography={titleTypo} onChange={val => { setChildAttributes({ titleTypo: val }); setTitleTypo(val); }} defaults={{ fontSize: 22 }} />

                    {/* Margin */}
                    <SpaceControl label={__('Margin:', 'b-blocks')} space={titleMargin || childAttributes?.titleMargin} onChange={val => { setChildAttributes({ titleMargin: val }); setTitleMargin(val); }} defaults={{ side: 4, bottom: '10px' }} />
                </PanelBody>
            </InspectorControls>


            <BlockControls>
                <AlignmentToolbar value={contentAlign || childAttributes?.contentAlign} onChange={val => { setChildAttributes({ contentAlign: val }); setContentAlign(val); }} />
            </BlockControls>


            <div id={`bBlocksCards-${clientId}`} className={`${className}`}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #bBlocksCards-${clientId} .bBlocksCards .block-editor-inner-blocks .block-editor-block-list__layout{
                        grid-gap: ${rowGap}px ${columnGap}px;
                        ${colors?.styles}
                    }
                `}} />

                <div className={`bBlocksCards columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    <InnerBlocks allowedBlocks={['b-blocks/card']} template={[['b-blocks/card'], ['b-blocks/card'], ['b-blocks/card']]} />
                </div>
            </div>
        </>
    },

    save: props => {
        const { cId, columns, columnGap, rowGap } = props.attributes;

        return <div id={`bBlocksCards-${cId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `                    
                    #bBlocksCards-${cId} .bBlocksCards{
                        grid-gap: ${rowGap}px ${columnGap}px;
                    }
                `}} />

            <div className={`bBlocksCards columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                <InnerBlocks.Content />
            </div>
        </div>;
    },

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