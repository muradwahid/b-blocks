// import { __ } from '@wordpress/i18n';
// import { MediaUpload } from '@wordpress/block-editor';
// import { Button, ButtonGroup, PanelRow, RangeControl, ToggleControl, Tooltip } from '@wordpress/components';

// // Variables
// import Title from './Title';
// import BColor from './BColor';
// import BtnGroup from './BtnGroup';

// const Background = props => {
//     const { BGType, BGColor, BGImg, isBGOpacity, BGOpacityColor, BGGradType, BGGradRadialType, BGGradFColor, BGGradSColor, BGGradFColorPos, BGGradSColorPos, BGGradAngel, BGGradRadialXPos, BGGradRadialYPos } = props;

//     return <>
//         {/* Background */}
//         <Title>{__('Background Type:', 'b-blocks')}</Title>
//         <ButtonGroup className='b_blocks_button_groups'>
//             <Tooltip text={__('Color', 'b-blocks')} position='top'>
//                 <Button isMedium isPrimary={'color' === BGType} aria-pressed={'color' === BGType} onClick={() => setAttributes({ BGType: 'color' })}>{__('Color', 'b-blocks')}</Button>
//             </Tooltip>

//             <Tooltip text={__('Image', 'b-blocks')} position='top'>
//                 <Button isMedium isPrimary={'image' === BGType} aria-pressed={'image' === BGType} onClick={() => setAttributes({ BGType: 'image' })}>{__('Image', 'b-blocks')}</Button>
//             </Tooltip>

//             <Tooltip text={__('Gradient', 'b-blocks')} position='top'>
//                 <Button isMedium isPrimary={'gradient' === BGType} aria-pressed={'gradient' === BGType} onClick={() => setAttributes({ BGType: 'gradient' })}>{__('Gradient', 'b-blocks')}</Button>
//             </Tooltip>
//         </ButtonGroup>

//         {'color' === BGType && <PanelRow className='mt-20p mb-5p'>
//             <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
//             <BColor value={BGColor} onChange={val => setAttributes({ BGColor: val })} defaultColor='#000000b3' />
//         </PanelRow>}

//         {'image' === BGType && <>
//             <Title>{__('Background Image:', 'b-blocks')}</Title>
//             <div className='editImageHolder'>
//                 <div className='mediaControl'>
//                     <MediaUpload allowedTypes={['image']} value={BGImg} onSelect={val => setAttributes({ BGImg: val })} render={({ open }) =>
//                         BGImg ? <div className='btnControl'>
//                             <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
//                             <Button icon='exit' onClick={() => setAttributes({ BGImg: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
//                         </div> : <div className='btnControl'>
//                             <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
//                         </div>} />
//                 </div>

//                 <img src={BGImg && BGImg.url} alt={BGImg && BGImg.title} />
//             </div>

//             <ToggleControl className='mt-20p' label={isBGOpacity ? 'Hide Background Opacity' : 'Show Background Opacity'} checked={isBGOpacity} onChange={val => setAttributes({ isBGOpacity: val })} />

//             {isBGOpacity && <PanelRow className='mb-5p'>
//                 <Title mt='5px'>{__('Background Opacity Color:', 'b-blocks')}</Title>
//                 <BColor value={BGOpacityColor} onChange={val => setAttributes({ BGOpacityColor: val })} defaultColor='#000000b3' />
//             </PanelRow>}
//         </>}

//         {'gradient' === BGType && <>
//             <PanelRow className='mt-20p mb-5p'>
//                 <Title mt='5px'>{__('Gradient Type:', 'b-blocks')}</Title>
//                 <BtnGroup options={gradientType} myValue={BGGradType} setState={val => setAttributes({ BGGradType: val })} />
//             </PanelRow>

//             {'radial' === BGGradType && <PanelRow className='mt-20p mb-5p'>
//                 <Title mt='5px'>{__('Radial Type:', 'b-blocks')}</Title>
//                 <BtnGroup options={radialType} myValue={BGGradRadialType} setState={val => setAttributes({ BGGradRadialType: val })} />
//             </PanelRow>}

//             <PanelRow className='mt-20p mb-5p'>
//                 <Title mt='5px'>{__('First Color:', 'b-blocks')}</Title>
//                 <BColor value={BGGradFColor} onChange={val => setAttributes({ BGGradFColor: val })} defaultColor='#4527a4' />
//             </PanelRow>

//             <PanelRow className='mt-20p mb-5p'>
//                 <Title mt='5px'>{__('First Color:', 'b-blocks')}</Title>
//                 <BColor value={BGGradSColor} onChange={val => setAttributes({ BGGradSColor: val })} defaultColor='#8344c5' />
//             </PanelRow>

//             <Title>{__('First Color Position:', 'b-blocks')}</Title>
//             <RangeControl value={BGGradFColorPos} onChange={val => setAttributes({ BGGradFColorPos: val })} min={0} max={100} step={1} />

//             <Title>{__('Second Color Position:', 'b-blocks')}</Title>
//             <RangeControl value={BGGradSColorPos} onChange={val => setAttributes({ BGGradSColorPos: val })} min={0} max={100} step={1} />

//             {'linear' === BGGradType && <>
//                 <Title>{__('Angel:', 'b-blocks')}</Title>
//                 <RangeControl value={BGGradAngel} onChange={val => setAttributes({ BGGradAngel: val })} min={0} max={360} step={1} />
//             </>}

//             {'radial' === BGGradType && <>
//                 <Title>{__('Center X Position:', 'b-blocks')}</Title>
//                 <RangeControl value={BGGradRadialXPos} onChange={val => setAttributes({ BGGradRadialXPos: val })} min={0} max={100} step={1} />

//                 <Title>{__('Center Y Position:', 'b-blocks')}</Title>
//                 <RangeControl value={BGGradRadialYPos} onChange={val => setAttributes({ BGGradRadialYPos: val })} min={0} max={100} step={1} />
//             </>}
//         </>}
//     </>;
// };
// export default Background;

// <Background />