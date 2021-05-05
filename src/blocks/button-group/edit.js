import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup, FontSizePicker, PanelBody, PanelRow, RangeControl, SelectControl, TabPanel, TextControl, ToggleControl, Tooltip } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { borderStyles, sizeTypes, fontSizes } = options;
const sepTypes = [
    { label: 'Text', value: 'text', icon: 'Text' },
    { label: 'Image', value: 'image', icon: 'Image' },
];

const Edit = props => {
    const { className, attributes: { cId, btnAlign, btnFontSize, btnWidth, btnPTB, btnPLR, btnOne, btnOneLink, btnOneType, btnOneColor, btnOneBGColor, btnOneHovColor, btnOneHovBGColor, btnTwo, btnTwoLink, btnTwoType, btnTwoColor, btnTwoBGColor, btnTwoHovColor, btnTwoHovBGColor, isSep, sepType, sepText, sepImg, sepWidth, sepSize, sepFontSize, sepColor, sepBGColor, borderWidth, borderStyle, borderOneColor, borderTwoColor, borderRadius, radiusType }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);


    // Button One
    const btnOneStyles = { width: 0 !== btnWidth ? `${btnWidth}px` : null, color: btnOneColor, backgroundColor: btnOneBGColor, border: `${borderWidth}px ${borderStyle} ${borderOneColor}`, borderRadius: `${borderRadius}${radiusType} 0 0 ${borderRadius}${radiusType}` }

    const btnOneHov = e => {
        e.target.style.color = btnOneHovColor;
        e.target.style.backgroundColor = btnOneHovBGColor;
    }
    const btnOneHovLeave = e => {
        e.target.style.color = btnOneColor;
        e.target.style.backgroundColor = btnOneBGColor;
    }

    // Button Two
    const btnTwoStyles = { width: 0 !== btnWidth ? `${btnWidth}px` : null, color: btnTwoColor, backgroundColor: btnTwoBGColor, border: `${borderWidth}px ${borderStyle} ${borderTwoColor}`, borderRadius: `0 ${borderRadius}${radiusType} ${borderRadius}${radiusType} 0` }

    const btnTwoHov = e => {
        e.target.style.color = btnTwoHovColor;
        e.target.style.backgroundColor = btnTwoHovBGColor;
    }
    const btnTwoHovLeave = e => {
        e.target.style.color = btnTwoColor;
        e.target.style.backgroundColor = btnTwoBGColor;
    }

    return <>
        <InspectorControls>
            <PanelBody title={__('Button Settings', 'b-blocks')}>
                {/* Font Size */}
                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={btnFontSize} onChange={val => setAttributes({ btnFontSize: 'undefined' === typeof val ? 16 : val })} />

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={btnWidth} onChange={val => setAttributes({ btnWidth: val })} min={0} max={400} step={1} />

                {/* Button One Link */}
                <Title>{__('Button One Link:', 'b-blocks')}</Title>
                <TextControl value={btnOneLink} onChange={val => setAttributes({ btnOneLink: val })} />

                {/* Button Two Link */}
                <Title>{__('Button Two Link:', 'b-blocks')}</Title>
                <TextControl value={btnTwoLink} onChange={val => setAttributes({ btnTwoLink: val })} />

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={btnPTB} onChange={val => setAttributes({ btnPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={btnPLR} onChange={val => setAttributes({ btnPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Button One Settings', 'b-blocks')} initialOpen={false}>
                {/* Type */}
                <PanelRow>
                    <Title mt='5px'>{__('Type:', 'b-blocks')}</Title>
                    <ButtonGroup className='b_blocks_button_groups'>
                        <Tooltip text={__('Fill', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'fill' === btnOneType} aria-pressed={'fill' === btnOneType} onClick={() => setAttributes({ btnOneType: 'fill', btnOneColor: '#fff', btnOneBGColor: '#4527a4', borderWidth: 1, borderOneColor: '#00000000' })}>{__('Fill', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Outline', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'outline' === btnOneType} aria-pressed={'outline' === btnOneType} onClick={() => setAttributes({ btnOneType: 'outline', btnOneColor: '#4527a4', btnOneBGColor: '#00000000', borderWidth: 3, borderOneColor: '#4527a4' })}>{__('Outline', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Text', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'text' === btnOneType} aria-pressed={'text' === btnOneType} onClick={() => setAttributes({ btnOneType: 'text', btnOneColor: '#4527a4', btnOneBGColor: '#00000000', borderWidth: 1, borderOneColor: '#00000000' })}>{__('Text', 'b-blocks')}</Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Colors */}
                <Title>{__('Colors:', 'b-blocks')}</Title>
                <TabPanel className='b_blocks_tab_panel' activeClass='active-tab' tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <>
                            {/* Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                <BColor value={btnOneColor} onChange={val => setAttributes({ btnOneColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnOneBGColor} onChange={val => setAttributes({ btnOneBGColor: val })} defaultColor='#4527a4' />
                            </PanelRow>
                        </>}

                        {'hover' == tab.name && <>
                            {/* Hover Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Color:', 'b-blocks')}</Title>
                                <BColor value={btnOneHovColor} onChange={val => setAttributes({ btnOneHovColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Hover Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnOneHovBGColor} onChange={val => setAttributes({ btnOneHovBGColor: val })} defaultColor='#8344c5' />
                            </PanelRow>
                        </>}
                    </>}
                </TabPanel>
            </PanelBody>

            <PanelBody title={__('Button Two Settings', 'b-blocks')} initialOpen={false}>
                {/* Type */}
                <PanelRow>
                    <Title mt='5px'>{__('Type:', 'b-blocks')}</Title>
                    <ButtonGroup className='b_blocks_button_groups'>
                        <Tooltip text={__('Fill', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'fill' === btnTwoType} aria-pressed={'fill' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'fill', btnTwoColor: '#fff', btnTwoBGColor: '#8344c5', borderWidth: 1, borderTwoColor: '#00000000' })}>{__('Fill', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Outline', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'outline' === btnTwoType} aria-pressed={'outline' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'outline', btnTwoColor: '#8344c5', btnTwoBGColor: '#00000000', borderWidth: 3, borderTwoColor: '#8344c5' })}>{__('Outline', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Text', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'text' === btnTwoType} aria-pressed={'text' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'text', btnTwoColor: '#8344c5', btnTwoBGColor: '#00000000', borderWidth: 1, borderTwoColor: '#00000000' })}>{__('Text', 'b-blocks')}</Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Colors */}
                <Title>{__('Colors:', 'b-blocks')}</Title>
                <TabPanel className='b_blocks_tab_panel' activeClass='active-tab' tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <>
                            {/* Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                <BColor value={btnTwoColor} onChange={val => setAttributes({ btnTwoColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnTwoBGColor} onChange={val => setAttributes({ btnTwoBGColor: val })} defaultColor='#8344c5' />
                            </PanelRow>
                        </>}

                        {'hover' == tab.name && <>
                            {/* Hover Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Color:', 'b-blocks')}</Title>
                                <BColor value={btnTwoHovColor} onChange={val => setAttributes({ btnTwoHovColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Hover Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnTwoHovBGColor} onChange={val => setAttributes({ btnTwoHovBGColor: val })} defaultColor='#4527a4' />
                            </PanelRow>
                        </>}
                    </>}
                </TabPanel>
            </PanelBody>

            <PanelBody title={__('Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={20} step={.1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* One Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('One Color:', 'b-blocks')}</Title>
                    <BColor value={borderOneColor} onChange={val => setAttributes({ borderOneColor: val })} defaultColor='#00000000' />
                </PanelRow>

                {/* Two Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Two Color:', 'b-blocks')}</Title>
                    <BColor value={borderTwoColor} onChange={val => setAttributes({ borderTwoColor: val })} defaultColor='#00000000' />
                </PanelRow>

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={radiusType} setState={val => setAttributes({ radiusType: val })} classes='b_blocks_size_type' size='small' />
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSep ? 'Hide Separator' : 'Show Separator'} checked={isSep} onChange={val => setAttributes({ isSep: val, sepWidth: val && 0 })} />

                <PanelRow>
                    <Title mt='5px'>{__('Type:', 'b-blocks')}</Title>
                    <BtnGroup options={sepTypes} myValue={sepType} setState={val => setAttributes({ sepType: val })} />
                </PanelRow>

                {/* Separator Text */}
                {'text' === sepType && <>
                    <Title>{__('Separator Text:', 'b-blocks')}</Title>
                    <TextControl value={sepText} onChange={val => setAttributes({ sepText: val })} />
                </>}

                {/* Separator Image */}
                {'image' === sepType && <>
                    <Title>{__('Image:', 'b-blocks')}</Title>
                    <div className='editImageHolder'>
                        <div className='mediaControl'>
                            <MediaUpload allowedTypes={['image']} value={sepImg} onSelect={val => setAttributes({ sepImg: val })} render={({ open }) => sepImg ? <div className='btnControl'>
                                <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                                <Button icon='exit' onClick={() => setAttributes({ sepImg: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                            </div> : <div className='btnControl'>
                                <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                            </div>} />
                        </div>

                        <img src={sepImg && sepImg.url} alt={sepImg && sepImg.title} />
                    </div>
                </>}

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={sepWidth} onChange={val => setAttributes({ sepWidth: val })} min={0} max={100} step={1} />

                {/* Size */}
                <Title>{__('Size:', 'b-blocks')}</Title>
                <RangeControl value={sepSize} onChange={val => setAttributes({ sepSize: val })} min={0} max={100} step={1} />

                {/* Font Size */}
                {'text' === sepType && <>
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={sepFontSize} onChange={val => setAttributes({ sepFontSize: 'undefined' === typeof val ? 15 : val })} />
                </>}

                {/* Color */}
                {'text' === sepType && <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={sepColor} onChange={val => setAttributes({ sepColor: val })} defaultColor='#333' />
                </PanelRow>}

                {/* Background Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                    <BColor value={sepBGColor} onChange={val => setAttributes({ sepBGColor: val })} defaultColor='#fff' />
                </PanelRow>
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${btnAlign}`} id={`bBlocksBtnGroup-${cId}`}>
            <div className='btnHolder'>
                <div className='firstBtn' style={{ marginRight: `${sepWidth / 2}px`, paddingRight: `${sepWidth / 2}px` }}>
                    <RichText className={`btnG btnOne fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} btn-${btnOneType}`} tagName='a' href={btnOneLink} value={btnOne} style={btnOneStyles} onMouseEnter={btnOneHov} onMouseLeave={btnOneHovLeave} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} />

                    {isSep && <div className='btnSeparator' style={{ color: sepColor, backgroundColor: sepBGColor, width: `${sepSize}px`, height: `${sepSize}px` }}>
                        {'text' === sepType ? <span className={`fontSize-${sepFontSize}`}>{sepText}</span> : 'image' === sepType && sepImg ? <img src={sepImg.url} alt={sepImg.title} /> : ''}
                    </div>}
                </div>

                <RichText className={`btnG btnTwo fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} btn-${btnTwoType}`} tagName='a' href={btnTwoLink} value={btnTwo} style={btnTwoStyles} onMouseEnter={btnTwoHov} onMouseLeave={btnTwoHovLeave} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} />
            </div>
        </div>
    </>;
};
export default Edit;