import { registerBlockType } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ButtonGroup, Tooltip, Button, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Icon
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';
import BDevice from '../../GutenComp/BDevice';
import BtnGroup from '../../GutenComp/BtnGroup';
import Typography from '../../GutenComp/Typography';
import SpaceControl from '../../GutenComp/SpaceControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;

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
        const [layout, setLayout] = useState(childAttributes?.layout);
        const [textAlign, setTextAlign] = useState(childAttributes?.textAlign);
        const [padding, setContentPadding] = useState(childAttributes?.padding);
        const [imgPos, setImgPos] = useState(childAttributes?.imgPos);
        const [imgHeight, setImgHeight] = useState(childAttributes?.imgHeight);
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
                <PanelBody className='bBlocksPanelBody' title={__('Layout Settings', 'b-blocks')}>
                    {/* Layout Type */}
                    <PanelRow>
                        <Title mt='0'>{__('Layout Type:', 'b-blocks')}</Title>
                        <ButtonGroup className='bBlocksBtnGroup'>
                            <Tooltip text={__('Vertical', 'b-blocks')} position='top'>
                                <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout || 'vertical' === childAttributes?.layout} aria-pressed={'vertical' === layout || 'vertical' === childAttributes?.layout} onClick={() => { setChildAttributes({ layout: 'vertical', textAlign: 'center', imgHeight: '250px' }); setLayout('vertical'); setTextAlign('center'); setImgHeight('250px'); }}></Button>
                            </Tooltip>

                            <Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
                                <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout || 'horizontal' === childAttributes?.layout} aria-pressed={'horizontal' === layout || 'horizontal' === childAttributes?.layout} onClick={() => { setChildAttributes({ layout: 'horizontal', textAlign: 'left', imgHeight: '200px' }); setLayout('horizontal'); setTextAlign('left'); setImgHeight('200px'); }}></Button>
                            </Tooltip>
                        </ButtonGroup>
                    </PanelRow>

                    {/* Columns */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                        <BDevice device={device} onChange={val => setDevice(val)} />
                    </PanelRow>
                    <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                    <UnitControl className='mt-20p mb-5p' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                    <UnitControl className='mt-20p mb-5p' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
                </PanelBody>

                <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                    {/* Padding */}
                    <SpaceControl label={__('Padding:', 'b-blocks')} space={padding || childAttributes?.padding} onChange={val => { setChildAttributes({ padding: val }); setContentPadding(val); }} defaults={{ vertical: '20px', horizontal: '10px' }} />
                </PanelBody>

                <PanelBody className='bBlocksPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                    {/* Position */}
                    <PanelRow>
                        <Title mt='0'>{__('Position:', 'b-blocks')}</Title>
                        <BtnGroup myValue={imgPos || childAttributes?.imgPos} setState={val => { setChildAttributes({ imgPos: val }); setImgPos(val); }} options={[
                            { label: 'vertical' == layout ? 'Top' : 'Left', value: 'top', icon: 'vertical' == layout ? 'TOP' : 'LEFT' },
                            { label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom', icon: 'vertical' == layout ? 'BOTTOM' : 'RIGHT' }
                        ]} />
                    </PanelRow>

                    {/* Height */}
                    <UnitControl className='mt-20p mb-5p' label={__('Height:', 'b-blocks')} labelPosition='left' value={imgHeight || childAttributes?.imgHeight} onChange={val => { setChildAttributes({ imgHeight: val }); setImgHeight(val); }} units={[pxUnit, perUnit, emUnit]} />
                </PanelBody>

                <PanelBody className='bBlocksPanelBody' title={__('Category Settings', 'b-blocks')} initialOpen={false}>
                    <ToggleControl label={isCat || childAttributes?.isCat ? 'Hide Category' : 'Show Category'} checked={isCat || childAttributes?.isCat} onChange={val => { setChildAttributes({ isCat: val }); setIsCat(val); }} />

                    <Typography className='mt-20p mb-5p' typography={catTypo} onChange={val => { setChildAttributes({ catTypo: val }); setCatTypo(val); }} defaults={{ fontSize: 15 }} />

                    {/* Margin */}
                    <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={catMargin || childAttributes?.catMargin} onChange={val => { setChildAttributes({ catMargin: val }); setCatMargin(val); }} defaults={{ side: 4, bottom: '10px' }} />
                </PanelBody>

                <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
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
                    <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={titleMargin || childAttributes?.titleMargin} onChange={val => { setChildAttributes({ titleMargin: val }); setTitleMargin(val); }} defaults={{ side: 4, bottom: '10px' }} />
                </PanelBody>
            </InspectorControls>


            <BlockControls>
                <AlignmentToolbar value={textAlign || childAttributes?.textAlign} onChange={val => { setChildAttributes({ textAlign: val }); setTextAlign(val); }} />
            </BlockControls>


            <div className={className} id={`bBlocksCards-${clientId}`}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url(${catTypo?.googleFontLink || childAttributes?.catTypo?.googleFontLink});
                    @import url(${titleTypo?.googleFontLink || childAttributes?.titleTypo?.googleFontLink});

                    #bBlocksCards-${clientId} .bBlocksCards .block-editor-inner-blocks .block-editor-block-list__layout{
                        grid-gap: ${rowGap} ${columnGap};
                    }

                    #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardImage img{ height: ${imgHeight || childAttributes?.imgHeight}; }
                    #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails{ padding: ${padding?.styles || childAttributes?.padding?.styles || '20px 10px'}; }
                    #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails .cardCategory{
                        ${catTypo?.styles || childAttributes?.catTypo?.styles || 'font-size: 15px;'}
                        margin: ${catMargin?.styles || childAttributes?.catMargin?.styles || '0 0 10px 0'};
                    }
                    #bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardTitle{
                        ${titleTypo?.styles || childAttributes?.titleTypo?.styles || 'font-size: 22px;'}
                        margin: ${titleMargin?.styles || childAttributes?.titleMargin?.styles || '0 0 10px 0'};
                    }
                `}} />

                <div className={`bBlocksCards columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    <InnerBlocks allowedBlocks={['b-blocks/card']} template={[['b-blocks/card'], ['b-blocks/card'], ['b-blocks/card']]} />
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