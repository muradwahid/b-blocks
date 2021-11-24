import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, ButtonGroup, Tooltip } from '@wordpress/components';

import { IndexContext } from './edit';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import Background from '../../../../Components/Background';
import BorderControl from '../../../../Components/BorderControl';
import { ImageHolderControl, ChangeImageData } from '../../../../Components/ImageControl';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;

// Icons
import icons from '../../Const/icons';

const Settings = ({ settings }) => {
    const { attributes: { cards = [], columns, columnGap, rowGap, layout, textAlign, padding, imgPos, imgHeight, isCat, catTypo, catMargin, isTitle, titlePos, titleTypo, titleMargin, isDesc, descTypo }, setAttributes } = settings;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addCard = () => {
        setAttributes({
            cards: [...cards, {
                background: { color: '#0000' },

                img: { id: null, url: '', alt: '', title: '' },
                imgBorder: { radius: '5px' },

                cat: `Category ${cards.length + 1}`,
                catColor: '#0dcaf0',

                title: `Card Title ${cards.length + 1}`,
                titleColor: '#ff7500',

                desc: `This content area describes card ${cards.length + 1} descriptions/details.`,
                descColor: '#333'
            }]
        });
        setActiveIndex(cards.length);
    }

    const updateCard = (index, type, val) => {
        const newCard = [...cards];
        newCard[index][type] = val;
        setAttributes({ cards: newCard });
        setActiveIndex(index);
    }

    return <>
        <InspectorControls>
            <PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Cards', 'b-blocks')}>
                {cards.map((item, index) => {
                    const { background, img, imgBorder, catColor, titleColor, descColor } = item;

                    return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Card No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                        <Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateCard(index, 'background', val)} />

                        <ImageHolderControl className='mt20' label={__('Image:', 'b-blocks')} img={img} onChange={val => updateCard(index, 'img', val)} />
                        <ChangeImageData className='mt20' img={img} onChange={val => updateCard(index, 'img', val)} />

                        <BorderControl label={__('Image Border:', 'b-blocks')} border={imgBorder} onChange={val => updateCard(index, 'imgBorder', val)} defaults={{ radius: '5px' }} />

                        <BColor label={__('Category Color:', 'b-blocks')} value={catColor} onChange={val => updateCard(index, 'catColor', val)} defaultColor='#0dcaf0' />

                        <BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateCard(index, 'titleColor', val)} defaultColor='#ff7500' />

                        <BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateCard(index, 'descColor', val)} defaultColor='#333' />

                        <PanelRow className='itemAction mt20'>
                            <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
                                e.preventDefault();
                                setAttributes({ cards: [...cards.slice(0, index), ...cards.slice(index + 1)] });
                            }} ><Dashicon icon='no' size={18} />{__('Remove', 'b-blocks')}</Button>

                            <Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
                                e.preventDefault();
                                setAttributes({ cards: [...cards, cards[index]] });
                            }} >{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
                        </PanelRow>
                    </PanelBody>
                })}

                <div className='addItem'>
                    <Button label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' size={23} />{__('Add New Card', 'b-blocks')}</Button>
                </div>
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                {/* Layout */}
                <PanelRow>
                    <Title mt='0'>{__('Layout:', 'b-blocks')}</Title>
                    <ButtonGroup className='bPlBtnGroup'>
                        <Tooltip text={__('Vertical', 'b-blocks')} position='top'>
                            <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => { setAttributes({ layout: 'vertical', columns: { ...columns, ['desktop']: 3 }, textAlign: 'center', imgHeight: '250px' }); }}></Button>
                        </Tooltip>

                        <Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
                            <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => { setAttributes({ layout: 'horizontal', columns: { ...columns, ['desktop']: 2 }, textAlign: 'left', imgHeight: '200px' }); }}></Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Columns */}
                <PanelRow className='mt20'>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                <UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                <UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                {/* Padding */}
                <SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '10px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {/* Position */}
                <PanelRow>
                    <Title mt='0'>{__('Position:', 'b-blocks')}</Title>
                    <BtnGroup myValue={imgPos} setState={val => setAttributes({ imgPos: val })} options={[
                        { label: 'vertical' == layout ? 'Top' : 'Left', value: 'top', icon: 'vertical' == layout ? 'TOP' : 'LEFT' },
                        { label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom', icon: 'vertical' == layout ? 'BOTTOM' : 'RIGHT' }
                    ]} />
                </PanelRow>

                {/* Height */}
                <UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={imgHeight} onChange={val => setAttributes({ imgHeight: val })} units={[pxUnit, perUnit, emUnit]} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Category Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Category', 'b-blocks')} checked={isCat} onChange={val => setAttributes({ isCat: val })} />

                <Typography className='mt20' typography={catTypo} onChange={val => setAttributes({ catTypo: val })} defaults={{ fontSize: 15 }} />

                {/* Margin */}
                <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={catMargin} onChange={val => setAttributes({ catMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                {/* Position */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Position:', 'b-blocks')}</Title>
                    <BtnGroup myValue={titlePos} setState={val => setAttributes({ titlePos: val })} options={[
                        { label: 'Image', value: 'image', icon: 'IMAGE' },
                        { label: 'Content', value: 'content', icon: 'CONTENT' }
                    ]} />
                </PanelRow>

                <Typography className='mt20' typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 22 }} />

                {/* Margin */}
                <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                <Typography className='mt20' typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bPlToolbar'>
                <ToolbarButton label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};
export default Settings;