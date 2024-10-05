import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, BColor, BorderControl, BtnGroup, ColorsControl, SpaceControl, Typography } from '../../../../../../Components';
import { pxUnit, emUnit } from '../../../../../../Components/utils/options';

import { aligns } from '../../../../utils/options';

const Style = ({ attributes, setAttributes }) => {
	const { layout, contentAlign, contentBG, contentPadding, border, sliderIsPage, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderIsPrevNext, sliderPrevNextColor, isTitle, titleTypo, titleColor, titleMargin, isMeta, metaCategoryIn, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, isExcerpt, excerptAlign, excerptTypo, excerptColor, excerptMargin, isReadMore, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const isSlider = 'slider' === layout;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')}>
			<PanelRow>
				<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
				<BtnGroup value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} options={aligns} isIcon={true} />
			</PanelRow>

			<Background label={__('Background', 'b-blocks')} value={contentBG} onChange={val => setAttributes({ contentBG: val })} defaults={{ color: '#f4f2fc' }} />

			<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={contentPadding} onChange={val => setAttributes({ contentPadding: val })} defaults={{ vertical: '20px', horizontal: '25px' }} />

			<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
		</PanelBody>


		{isSlider && <PanelBody className='bPlPanelBody' title={__('Slider Options', 'b-blocks')} initialOpen={false}>
			{sliderIsPage && <>
				<BColor label={__('Pagination Bullets Color:', 'b-blocks')} value={sliderPageColor} onChange={val => setAttributes({ sliderPageColor: val })} defaultColor='#4527a4' />

				<UnitControl className='mt20' label={__('Pagination Width:', 'b-blocks')} labelPosition='left' value={sliderPageWidth} onChange={val => setAttributes({ sliderPageWidth: val })} units={[pxUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Pagination Height:', 'b-blocks')} labelPosition='left' value={sliderPageHeight} onChange={val => setAttributes({ sliderPageHeight: val })} units={[pxUnit(), emUnit()]} />

				<BorderControl label={__('Pagination Border:', 'b-blocks')} value={sliderPageBorder} onChange={val => setAttributes({ sliderPageBorder: val })} defaults={{ radius: '50%' }} />
			</>}

			{sliderIsPrevNext && <BColor label={__('Preview Next Button Color:', 'b-blocks')} value={sliderPrevNextColor} onChange={val => setAttributes({ sliderPrevNextColor: val })} defaultColor='#4527a4' />}
		</PanelBody>}


		{isTitle && <PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
			<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} />

			<BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />

			<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
		</PanelBody>}


		{isMeta && <PanelBody className='bPlPanelBody' title={__('Meta Data', 'b-blocks')} initialOpen={false}>
			<Typography value={metaTypo} onChange={val => setAttributes({ metaTypo: val })} defaults={{ fontSize: { desktop: 13, tablet: 13, mobile: 13 }, textTransform: 'uppercase' }} />

			<BColor label={__('Text Color:', 'b-blocks')} value={metaTextColor} onChange={val => setAttributes({ metaTextColor: val })} defaultColor='#333' />

			<BColor label={__('Link Color:', 'b-blocks')} value={metaLinkColor} onChange={val => setAttributes({ metaLinkColor: val })} defaultColor='#8344c5' />

			<BColor label={__('Icon Color:', 'b-blocks')} value={metaIconColor} onChange={val => setAttributes({ metaIconColor: val })} defaultColor='#4527a4' />

			{'image' === metaCategoryIn && <ColorsControl label={__('Category Colors On Image:', 'b-blocks')} value={metaColorsOnImage} onChange={val => setAttributes({ metaColorsOnImage: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />}

			<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={metaMargin} onChange={val => setAttributes({ metaMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
		</PanelBody>}


		{isExcerpt && <PanelBody className='bPlPanelBody' title={__('Excerpt', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
				<BtnGroup value={excerptAlign} onChange={val => setAttributes({ excerptAlign: val })} options={aligns} isIcon={true} />
			</PanelRow>

			<Typography value={excerptTypo} onChange={val => setAttributes({ excerptTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

			<BColor label={__('Color:', 'b-blocks')} value={excerptColor} onChange={val => setAttributes({ excerptColor: val })} defaultColor='#333' />

			<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={excerptMargin} onChange={val => setAttributes({ excerptMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
		</PanelBody>}


		{isReadMore && <PanelBody className='bPlPanelBody' title={__('Read More', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Button Align:', 'b-blocks')}</Label>
				<BtnGroup value={readMoreAlign} onChange={val => setAttributes({ readMoreAlign: val })} options={aligns.filter(a => a.value !== 'justify')} isIcon={true} />
			</PanelRow>

			<Typography value={readMoreTypo} onChange={val => setAttributes({ readMoreTypo: val })} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 }, textTransform: 'uppercase', fontWeight: 600 }} />

			<ColorsControl value={readMoreColors} onChange={val => setAttributes({ readMoreColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

			<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={readMoreHovColors} onChange={val => setAttributes({ readMoreHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

			<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={readMorePadding} onChange={val => setAttributes({ readMorePadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

			<BorderControl label={__('Border:', 'b-blocks')} value={readMoreBorder} onChange={val => setAttributes({ readMoreBorder: val })} defaults={{ radius: '3px' }} />
		</PanelBody>}
	</>
}
export default Style;