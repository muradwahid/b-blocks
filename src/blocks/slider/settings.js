import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, Button, ToolbarGroup, ToolbarButton, Dashicon, TextControl, TextareaControl, ToggleControl, TabPanel, __experimentalAlignmentMatrixControl as AlignmentMatrixControl, __experimentalUnitControl as UnitControl, SelectControl } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BDevice from '../../../../Components/BDevice';
import Background from '../../../../Components/Background';
import BColor from '../../../../Components/BColor';
import BorderControl from '../../../../Components/BorderControl';
import SpaceControl from '../../../../Components/SpaceControl';
import ColorsControl from '../../../../Components/ColorsControl';
import Typography from '../../../../Components/Typography';
import { gearIcon } from '../../../../Components/Helper/icons';
import { pxUnit, perUnit, emUnit, vhUnit } from '../../../../Components/Helper/options';

import options from '../../utils/options';
const { sliderEffects } = options;
const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'options', title: __('Options', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
]

const Settings = ({ attributes, setAttributes, setActiveIndex }) => {
	const { slides = [], columns, columnGap, sliderWidth, sliderHeight, isLoop, isAutoplay, speed, effect, isTouchMove, isPage, isPageClickable, isPageDynamic, pageColor, pageWidth, pageHeight, pageBorder, isPrevNext, prevNextColor, sliderAlign, isTitle, titleTypo, isDesc, descTypo, isBtn, linkTarget, btnTypo, btnPadding, btnBorder } = attributes;

	const [device, setDevice] = useState('desktop');

	const addSlide = () => {
		setAttributes({
			slides: [...slides, {
				background: { color: '#00000080' },
				position: 'center center',
				positionHolder: 'center center',
				childPositions: [{ 'top': 11, 'left': 5.8 }, { 'top': 22, 'left': 5.8 }, { 'top': 33, 'left': 5.8 }],
				title: `Slide Title ${slides.length + 1}`,
				titleColor: '#fff',
				description: `This content area describes slider ${slides.length + 1} descriptions/details.`,
				descColor: '#fff',
				btnText: `Button ${slides.length + 1}`,
				btnLink: '#',
				btnColors: { color: '#fff', bg: '#4527a4' },
				btnHovColors: { color: '#fff', bg: '#8344c5' }
			}]
		});
		setActiveIndex(slides.length);
	}

	const updateSlide = (index, type, val) => {
		const newSlides = [...slides];
		newSlides[index][type] = val;
		setAttributes({ slides: newSlides });
		setActiveIndex(index);
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/slider-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Slides', 'b-blocks')}>
						{slides.map((item, index) => {
							const { background, title, titleColor, description, descColor, btnText, btnLink, btnColors, btnHovColors } = item;

							return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Slide No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
								<Background label={__('Background', 'b-blocks')} value={background} onChange={val => updateSlide(index, 'background', val)} defaults={{ color: '#00000080' }} />

								<PanelRow>
									<Title className=''>{__('Content Position', 'b-blocks')}</Title>
									<AlignmentMatrixControl onChange={val => updateSlide(index, 'position', val)} />
								</PanelRow>
								<small>{__('You can also change the content position by dragging element.', 'b-blocks')}</small>

								<PanelRow className='mt20'>
									<Title className=''>{__('Title:', 'b-blocks')}</Title>
									<TextControl value={title} onChange={val => updateSlide(index, 'title', val)} placeholder={__('Slide title', 'b-blocks')} />
								</PanelRow>

								<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateSlide(index, 'titleColor', val)} defaultColor='#fff' />

								<Title>{__('Description:', 'b-blocks')}</Title>
								<TextareaControl value={description} onChange={val => updateSlide(index, 'description', val)} placeholder={__('Description of the slider', 'b-blocks')} />

								<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateSlide(index, 'descColor', val)} defaultColor='#fff' />

								<PanelRow className='mt20'>
									<Title className=''>{__('Button Text:', 'b-blocks')}</Title>
									<TextControl value={btnText} onChange={val => updateSlide(index, 'btnText', val)} placeholder={__('Button label', 'b-blocks')} />
								</PanelRow>

								<PanelRow>
									<Title className=''>{__('Button Link:', 'b-blocks')}</Title>
									<TextControl value={btnLink} onChange={val => updateSlide(index, 'btnLink', val)} placeholder={__('Button link', 'b-blocks')} />
								</PanelRow>

								<ColorsControl label={__('Button Colors:', 'b-blocks')} value={btnColors} onChange={val => updateSlide(index, 'btnColors', val)} defaults={{ color: '#fff', bg: '#4527a4' }} />

								<ColorsControl label={__('Button Hover Colors:', 'b-blocks')} value={btnHovColors} onChange={val => updateSlide(index, 'btnHovColors', val)} defaults={{ color: '#fff', bg: '#8344c5' }} />

								<PanelRow className='itemAction mt20'>
									<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
										e.preventDefault();
										setAttributes({ slides: [...slides.slice(0, index), ...slides.slice(index + 1)] });
									}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

									<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
										e.preventDefault();
										setAttributes({ slides: [...slides, { ...slides[index] }] });
									}}>{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
								</PanelRow>
							</PanelBody>
						})}

						<div className='addItem'>
							<Button label={__('Add New Slide', 'b-blocks')} onClick={addSlide}><Dashicon icon='plus' />{__('Add New Slide', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<Title>{__('Column Gap:', 'b-blocks')}</Title>
						<RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={250} step={1} beforeIcon='arrow-right-alt' />

						<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={sliderWidth} onChange={val => setAttributes({ sliderWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={[pxUnit(), emUnit(), vhUnit()]} />
					</PanelBody>
				</>}


				{'options' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Basic Options', 'b-blocks')}>
						<ToggleControl label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

						<ToggleControl className='mt10' label={__('Enable Touch Move', 'b-blocks')} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />

						<Title>{__('Speed & Delay (s):', 'b-blocks')}</Title>
						<RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0} max={10} step={.05} />
						<small>{__('Smaller speed & delay value will be slide faster', 'b-blocks')}</small>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Autoplay', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Effects', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className=''>{__('Effect:', 'b-blocks')}</Title>
							<SelectControl value={effect} onChange={val => setAttributes({ effect: val })} options={sliderEffects} />
						</PanelRow>
						<small>{__('To work fade & creative effects properly, set single column per view', 'b-blocks')}</small>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Pagination', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Pagination', 'b-blocks')} checked={isPage} onChange={val => setAttributes({ isPage: val })} />

						{isPage && <>
							<ToggleControl className='mt10' label={__('Enable Pagination Clickable', 'b-blocks')} checked={isPageClickable} onChange={val => setAttributes({ isPageClickable: val })} />

							<ToggleControl className='mt10' label={__('Enable Pagination Dynamic Bullets', 'b-blocks')} checked={isPageDynamic} onChange={val => setAttributes({ isPageDynamic: val })} />
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Navigation', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Preview Next Button', 'b-blocks')} checked={isPrevNext} onChange={val => setAttributes({ isPrevNext: val })} />
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					{isPage || isPrevNext ? <PanelBody className='bPlPanelBody' title={__('Options', 'b-blocks')}>
						{isPage && <>
							<BColor label={__('Pagination Bullets Color:', 'b-blocks')} value={pageColor} onChange={val => setAttributes({ pageColor: val })} defaultColor='#fff' />

							<UnitControl className='mt20' label={__('Pagination Width:', 'b-blocks')} labelPosition='left' value={pageWidth} onChange={val => setAttributes({ pageWidth: val })} units={[pxUnit(), emUnit()]} />

							<UnitControl className='mt20' label={__('Pagination Height:', 'b-blocks')} labelPosition='left' value={pageHeight} onChange={val => setAttributes({ pageHeight: val })} units={[pxUnit(), emUnit()]} />

							<BorderControl label={__('Pagination Border:', 'b-blocks')} value={pageBorder} onChange={val => setAttributes({ pageBorder: val })} defaults={{ radius: '50%' }} />
						</>}

						{isPrevNext && <BColor label={__('Preview Next Button Color:', 'b-blocks')} value={prevNextColor} onChange={val => setAttributes({ prevNextColor: val })} defaultColor='#fff' />}
					</PanelBody> : ''}


					<PanelBody className='bPlPanelBody' title={__('Slide Title', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						{isTitle && <Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} produce={produce} />}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Slide Description', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

						{isDesc && <Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Slide Button', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

						{isBtn && <>
							<ToggleControl label={__('Open link in new tab', 'b-blocks')} checked={'_blank' === linkTarget ? true : false} onChange={val => setAttributes({ linkTarget: val ? '_blank' : '' })} />

							<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} produce={produce} />

							<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

							<BorderControl label={__('Border:', 'b-blocks')} value={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '3px' }} />
						</>}
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Slide', 'b-blocks')} onClick={addSlide}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={sliderAlign} onChange={val => setAttributes({ sliderAlign: val })} describedBy={__('Slider Alignment')} alignmentControls={[
				{ title: __('Slider in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Slider in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Slider in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;