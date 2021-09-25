import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, MediaPlaceholder, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck, InspectorControls, URLInput } from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarItem, Button, PanelBody, SelectControl, TextControl, FontSizePicker, RangeControl, PanelRow, ButtonGroup, Tooltip, ToggleControl, Dashicon } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Icons
import icons from '../../Const/icons';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import BtnGroup from '../../Components/BtnGroup';
import options from '../../Const/options';
const { fontSizes, sizeTypes, borderStyles, textTransforms } = options;
const teamStyles = [
    { label: 'Default', value: 'default' },
    { label: 'Style 1', value: 'style1' },
    { label: 'Style 2', value: 'style2' },
    { label: 'Style 3', value: 'style3' },
];

const Edit = props => {
    const { className, attributes: { layout, teamStyle, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgWidth, imgMB, imgBorderWidth, imgBorderStyle, imgBorderColor, imgBorderRadius, imgRadiusType, name, nameFontSize, nameTransform, nameColor, nameMB, isDes, des, desFontSize, desTransform, desColor, desMB, isSep, sepWidth, sepThick, sepStyle, sepColor, sepMB, isBio, bio, bioFontSize, bioColor, bioMB, isSocial, social, iconSize, iconPadding, iconMargin, iconColor, iconBGColor, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed }, setAttributes, isSelected, noticeOperations, noticeUI, image, imageSizes } = props;


    // useEffect
    useEffect(() => {
        if (imgUrl && isBlobURL(imgUrl) && !imgId) {
            setAttributes({ imgUrl: '', imgAlt: '' });
        }
    }, []);

    const [selectedSocial, setSelectedSocial] = useState(null);
    useEffect(() => {
        if (!isSelected) {
            setSelectedSocial(null);
        }
    }, [isSelected]);

    useEffect(() => {
        switch (teamStyle) {
            case 'default':
                setAttributes({ contentAlign: 'center', contentBGColor: '#ffffff00', contentPTB: 50, contentPLR: 20, imgWidth: 170, imgMB: 20, imgBorderWidth: 0, imgBorderStyle: 'solid', imgBorderColor: '#00000000', imgBorderRadius: 50, imgRadiusType: '%', nameFontSize: 20, nameTransform: 'none', nameColor: '#333', nameMB: 10, isDes: true, desFontSize: 16, desTransform: 'none', desColor: '#333', desMB: 10, isSep: true, sepWidth: 20, sepThick: 3, sepStyle: 'solid', sepColor: '#777', sepMB: 15, isBio: true, bioFontSize: 15, bioColor: '#333', bioMB: 15, isSocial: true, iconSize: 22, iconPadding: 8, iconMargin: 10, iconColor: '#fff', iconBGColor: '#4527a4', borderWidth: 1, borderStyle: 'solid', borderColor: '#00000000', borderRadius: 3, radiusType: '%', shadowColor: '#000', shadowHOffset: 0, shadowVOffset: 0, shadowBlur: 0, shadowSpreed: 0 });
                break;

            case 'style1':
                setAttributes({ contentPTB: 50, contentPLR: 20, contentBGColor: '#ffffff00', imgWidth: 190, imgBorderWidth: 10, imgBorderColor: '#e8edfb', imgBorderRadius: 50, nameTransform: 'none', nameColor: '#333', desFontSize: 14, desTransform: 'uppercase', desColor: '#7a7a7a', isSep: true, sepColor: '#4527a4', isBio: true, bioColor: '#7a7a7a', iconPadding: 8, iconColor: '#fff', iconBGColor: '#4527a4', borderRadius: 3, shadowColor: '#e8edfb', shadowBlur: 20 });
                break;

            case 'style2':
                setAttributes({ contentPTB: 50, contentPLR: 20, contentBGColor: '#ffffff00', imgWidth: 190, imgBorderWidth: 0, imgBorderColor: '#00000000', imgBorderRadius: 50, nameTransform: 'none', nameColor: '#333', desFontSize: 14, desTransform: 'uppercase', desColor: '#7a7a7a', isSep: true, sepColor: '#999', isBio: false, iconPadding: 0, iconColor: '#4527a4', iconBGColor: '#00000000', borderRadius: 3, shadowColor: '#000', shadowBlur: 0 });
                break;

            case 'style3':
                setAttributes({ contentPTB: 15, contentPLR: 15, contentBGColor: '#4527a4', imgWidth: 500, imgBorderWidth: 0, imgBorderColor: '#00000000', imgBorderRadius: 0, nameTransform: 'uppercase', nameColor: '#fff', desFontSize: 15, desTransform: 'none', desColor: '#fff', isSep: false, isBio: false, iconPadding: 0, iconColor: '#fff', iconBGColor: '#00000000', borderRadius: 0, shadowColor: '#000', shadowBlur: 0 });
                break;
        }
    }, [teamStyle]);


    // Functions
    const onSelectImage = ({ id, url, alt }) => setAttributes({ imgId: id, imgUrl: url, imgAlt: alt });

    const getImageSizes = () => {
        if (!image) return [];
        let options = [];
        const sizes = image.media_details.sizes;

        for (const key in sizes) {
            const imageSize = imageSizes.find(s => s.slug === key);
            if (imageSize) {
                options.push({ label: imageSize.name, value: sizes[key].source_url });
            }
        }
        return options;
    }

    const updateSocialItem = (type, val) => {
        const newSocial = [...social];
        newSocial[selectedSocial][type] = val;
        setAttributes({ social: newSocial });
    }


    // Styles
    const containerStyles = { backgroundColor: contentBGColor, border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px` };

    const containerClasses = `${className} text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} ${'horizontal' === layout ? 'horizontal' : 'vertical'} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`;

    const imgStyles = { border: `${imgBorderWidth}px ${imgBorderStyle} ${imgBorderColor}` };
    const imgClasses = `memberPhoto w-${imgWidth}-px ${'horizontal' === layout ? `mr-20` : `mb-${imgMB}`} radius-${imgBorderRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`;

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Layouts Settings', 'b-blocks')}>
                <Title mt='0'>{__('Layout Type:', 'b-blocks')}</Title>
                <ButtonGroup className="bBlocksBtnGroup">
                    <Tooltip text={__('Vertical', 'b-blocks')} position="top">
                        <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => setAttributes({ layout: 'vertical', contentAlign: 'center', contentPTB: 50 })}></Button>
                    </Tooltip>

                    <Tooltip text={__('Horizontal', 'b-blocks')} position="top">
                        <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => setAttributes({ layout: 'horizontal', contentAlign: 'left', contentPTB: 30 })}></Button>
                    </Tooltip>
                </ButtonGroup>

                {/* Style */}
                <PanelRow className='mt-20p'>
                    <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                    <SelectControl value={teamStyle} onChange={cng => setAttributes({ teamStyle: cng })} options={teamStyles} />
                </PanelRow>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                {/* Background Color */}
                <BColor label={__('Background Color:', 'b-blocks')} value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor="#ffffff00" />

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={contentPTB} onChange={val => setAttributes({ contentPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={contentPLR} onChange={val => setAttributes({ contentPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            {(imgUrl || imgId) && <PanelBody className='bBlocksPanelBody' title={__('Photo Settings', 'b-blocks')} initialOpen={false}>
                {imgUrl && !isBlobURL(imgUrl) && <>
                    <Title mt="0">{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl label={__('', 'b-blocks')} value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </>}

                {imgId && <>
                    <Title>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </>}

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={imgWidth} onChange={val => setAttributes({ imgWidth: val })} min={0} max={500} step={1} />

                {'vertical' === layout && <>
                    {/* Margin Bottom */}
                    <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />
                </>}

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgRadiusType} setState={val => setAttributes({ imgRadiusType: val })} classes="bBlocksSizeType" size="small" />
                <RangeControl value={imgBorderRadius} onChange={val => setAttributes({ imgBorderRadius: val })} min={0} max={50} step={1} />

                {/* Border Width */}
                <Title mt='0'>{__('Border Width:', 'b-blocks')}</Title>
                <RangeControl value={imgBorderWidth} onChange={val => setAttributes({ imgBorderWidth: val })} min={0} max={20} step={1} />

                {/* Border Style */}
                <Title>{__('Border Style:', 'b-blocks')}</Title>
                <SelectControl value={imgBorderStyle} onChange={val => setAttributes({ imgBorderStyle: val })} options={borderStyles} />

                {/* Border Color */}
                <BColor className='mt-20p' label={__('Border Color:', 'b-blocks')} value={imgBorderColor} onChange={val => setAttributes({ imgBorderColor: val })} defaultColor='#00000000' />

                {/* Border Radius */}
                <Title>{__('Border Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgRadiusType} setState={val => setAttributes({ imgRadiusType: val })} classes='bBlocksSizeType' size='small' />
                <RangeControl value={imgBorderRadius} onChange={val => setAttributes({ imgBorderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>}

            <PanelBody className='bBlocksPanelBody' title={__('Name Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={18} value={nameFontSize} onChange={val => setAttributes({ nameFontSize: 'undefined' === typeof val ? 18 : val })} />

                {/* Text Transform */}
                <PanelRow className='mt-20p'>
                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                    <BtnGroup options={textTransforms} myValue={nameTransform} setState={cng => setAttributes({ nameTransform: cng })} />
                </PanelRow>

                {/* Color */}
                <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={nameColor} onChange={val => setAttributes({ nameColor: val })} defaultColor="#333" />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={nameMB} onChange={val => setAttributes({ nameMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Designation Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDes ? 'Hide Designation' : 'Show Designation'} checked={isDes} onChange={val => setAttributes({ isDes: val })} />

                {isDes && <>
                </>}
                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={desFontSize} onChange={val => setAttributes({ desFontSize: 'undefined' === typeof val ? 15 : val })} />

                {/* Text Transform */}
                <PanelRow className='mt-20p'>
                    <Title mt='5px'>{__('Text Transform:', 'b-blocks')}</Title>
                    <BtnGroup options={textTransforms} myValue={desTransform} setState={cng => setAttributes({ desTransform: cng })} />
                </PanelRow>

                {/* Color */}
                <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={desColor} onChange={val => setAttributes({ desColor: val })} defaultColor="#333" />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={desMB} onChange={val => setAttributes({ desMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSep ? 'Hide Separator' : 'Show Separator'} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {isSep && <>
                    {/* Width */}
                    <Title>{__('Width:', 'b-blocks')}</Title>
                    <RangeControl value={sepWidth} onChange={val => setAttributes({ sepWidth: val })} min={0} max={100} step={1} />

                    {/* Thickness */}
                    <Title>{__('Thickness:', 'b-blocks')}</Title>
                    <RangeControl value={sepThick} onChange={val => setAttributes({ sepThick: val })} min={0} max={20} step={.1} />

                    {/* Style */}
                    <Title>{__('Style:', 'b-blocks')}</Title>
                    <SelectControl value={sepStyle} onChange={val => setAttributes({ sepStyle: val })} options={borderStyles} />

                    {/* Color */}
                    <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={sepColor} onChange={val => setAttributes({ sepColor: val })} defaultColor="#777" />

                    {/* Margin Bottom */}
                    <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={sepMB} onChange={val => setAttributes({ sepMB: val })} min={0} max={100} step={1} />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Biography Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isBio ? 'Hide Biography' : 'Show Biography'} checked={isBio} onChange={val => setAttributes({ isBio: val })} />

                {isBio && <>
                    {/* Font Size */}
                    <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={24} value={bioFontSize} onChange={val => setAttributes({ bioFontSize: 'undefined' === typeof val ? 24 : val })} />

                    {/* Color */}
                    <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={bioColor} onChange={val => setAttributes({ bioColor: val })} defaultColor="#333" />

                    {/* Margin Bottom */}
                    <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={bioMB} onChange={val => setAttributes({ bioMB: val })} min={0} max={100} step={1} />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Social Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSocial ? 'Hide Social' : 'Show Social'} checked={isSocial} onChange={val => setAttributes({ isSocial: val })} />

                {isSocial && <>
                    {/* Icon Size */}
                    <Title mt='0'>{__('Icon Size:', 'b-blocks')}</Title>
                    <RangeControl value={iconSize} onChange={val => setAttributes({ iconSize: val })} min={0} max={60} step={1} />

                    {/* Icon Padding */}
                    <Title>{__('Icon Padding:', 'b-blocks')}</Title>
                    <RangeControl value={iconPadding} onChange={val => setAttributes({ iconPadding: val })} min={0} max={30} step={1} />

                    {/* Icon Margin */}
                    <Title>{__('Icon Margin:', 'b-blocks')}</Title>
                    <RangeControl value={iconMargin} onChange={val => setAttributes({ iconMargin: val })} min={0} max={100} step={1} />

                    {/* Icon Color */}
                    <BColor className='mt-20p' label={__('Icon Color:', 'b-blocks')} value={iconColor} onChange={val => setAttributes({ iconColor: val })} defaultColor="#fff" />

                    {/* Icon Background Color */}
                    <BColor className='mt-20p' label={__('Icon Background Color:', 'b-blocks')} value={iconBGColor} onChange={val => setAttributes({ iconBGColor: val })} defaultColor="#4527a4" />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={30} step={1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* Color */}
                <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#00000000' />

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={radiusType} setState={val => setAttributes({ radiusType: val })} classes='bBlocksSizeType' size='small' />
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Shadow Settings', 'b-blocks')} initialOpen={false}>
                {/* Color */}
                <BColor label={__('Color:', 'b-blocks')} value={shadowColor} onChange={val => setAttributes({ shadowColor: val })} defaultColor='#000' />

                {/* Horizontal Offset */}
                <Title>{__('Horizontal Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowHOffset} onChange={val => setAttributes({ shadowHOffset: val })} min={0} max={100} step={1} />

                {/* Vertical Offset */}
                <Title>{__('Vertical Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowVOffset} onChange={val => setAttributes({ shadowVOffset: val })} min={0} max={100} step={1} />

                {/* Blur */}
                <Title>{__('Blur:', 'b-blocks')}</Title>
                <RangeControl value={shadowBlur} onChange={val => setAttributes({ shadowBlur: val })} min={0} max={50} step={1} />

                {/* Spreed */}
                <Title>{__('Spreed:', 'b-blocks')}</Title>
                <RangeControl value={shadowSpreed} onChange={val => setAttributes({ shadowSpreed: val })} min={0} max={50} step={1} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarItem>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Member Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarItem>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={containerClasses} style={containerStyles}>
            {imgUrl ? <>
                <img className={imgClasses} src={imgUrl} alt={imgAlt} style={imgStyles} />
                {isBlobURL(imgUrl) && <Spinner />}
            </> :
                <MediaPlaceholder labels={{ title: __(' Member Photo', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
            }

            <div className='memberDetails'>
                <RichText className={`memberName fontSize-${nameFontSize} ttr-${nameTransform} mb-${nameMB}`} style={{ color: nameColor }} tagName='h4' value={name} onChange={val => setAttributes({ name: val })} placeholder={__('John Smith', 'b-blocks')} />

                {isDes && <RichText className={`memberDes fontSize-${desFontSize} ttr-${desTransform} mb-${desMB}`} style={{ color: desColor }} tagName='p' value={des} onChange={val => setAttributes({ des: val })} placeholder={__('Full Stack Developer', 'b-blocks')} />}

                {isSep && <span className={`teamSeparator w-${sepWidth}-per mb-${sepMB}`} style={{ borderTop: `${sepThick}px ${sepStyle} ${sepColor}` }}></span>}

                {isBio && <RichText className={`memberBio fontSize-${bioFontSize} mb-${bioMB}`} style={{ color: bioColor }} tagName='span' value={bio} onChange={val => setAttributes({ bio: val })} placeholder={__('I am a self-motivated and self-taught professional who likes to solve problems.', 'b-blocks')} />}

                {isSocial && <>
                    <div className='memberSocial'>
                        <ul style={{ justifyContent: 'center' === contentAlign ? 'center' : 'right' === contentAlign ? 'flex-end' : 'flex-start' }}>
                            {social.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => setSelectedSocial(index)} className={`mx-${iconMargin / 2} ${isSelected && selectedSocial === index ? 'isSelected' : null}`}>
                                        <a href={'#'}><Dashicon icon={item.icon} size={iconSize} className={`fontSize-${iconSize} p-${iconPadding}`} style={{ color: iconColor, backgroundColor: iconBGColor }} /></a>
                                    </li>
                                )
                            })}

                            {isSelected && <li className='memberSocialAdd'>
                                <Button showTooltip={true} tooltipPosition='top enter' label={__('Add Social Link', 'b-blocks')} onClick={() => {
                                    setAttributes({ social: [...social, { link: '', icon: '' }] });
                                    setSelectedSocial(social.length);
                                }}><Dashicon icon='plus' size={iconSize} className={`fontSize-${iconSize}`} /></Button>
                            </li>}
                        </ul>
                    </div>
                    {selectedSocial !== null && <div className='memberSocialForm'>
                        <TextControl label={__('Icon', 'b-blocks')} value={social[selectedSocial].icon} onChange={val => updateSocialItem('icon', val)} placeholder={__('Use only Dashicon', 'b-blocks')} />

                        <URLInput label={__('Link', 'b-blocks')} value={social[selectedSocial].link} onChange={val => updateSocialItem('link', val)} />

                        <a className='memberSocialRemove' onClick={e => {
                            e.preventDefault();
                            setAttributes({ social: [...social.slice(0, selectedSocial), ...social.slice(selectedSocial + 1)] });
                            setSelectedSocial(null);
                        }}>{__('Remove Social', 'b-blocks')}</a>
                    </div>}
                </>}
            </div>
        </div>
    </>
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(withNotices(Edit));