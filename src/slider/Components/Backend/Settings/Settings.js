import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, Button, ToolbarGroup, ToolbarButton, Dashicon, TextControl, TextareaControl, ToggleControl, TabPanel, __experimentalAlignmentMatrixControl as AlignmentMatrixControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Background, ColorControl, Device, ColorsControl, HelpPanel, Typography } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro, SelectControlPro } from '../../../../../../bpl-tools/ProControls';
import { gearIcon } from '../../../../../../bpl-tools/utils/icons';
import { pxUnit, perUnit, emUnit, vhUnit } from '../../../../../../bpl-tools/utils/options';

import ProModal from '../../../../backend/ProModal/ProModal';
import { pluginSlug } from '../../../../utils/data';
import { effects, tabs } from '../../../utils/options';
import { getPosByPos } from '../../../utils/functions';

const defaultChildPositions = [
	{
		top: 36,
		right: 44.71,
		bottom: 44.5,
		left: 44.71
	},
	{
		top: 47.5,
		right: 34.67,
		bottom: 52.5,
		left: 34.67
	},
	{
		top: 55.5,
		right: 44.54,
		bottom: 67,
		left: 44.54
	}
];

const Settings = ({ attributes, setAttributes, setActiveIndex, isPremium, id, device }) => {
	const { slides = [], columns, columnGap, sliderWidth, sliderHeight, isLoop, isTouchMove, speed, isAutoplay, autoplayOptions = {}, freeModeOptions = {}, effect, keyboardOptions = {}, isMousewheel = false, isPage, pageOnDevice = {}, isPageClickable, isPageDynamic, isPrevNext, prevNextOnDevice = {}, sliderBG = {}, sliderPadding = {}, pageColor, pageWidth, pageHeight, pageBorder, prevNextColor, sliderAlign, isTitle, titleTypo, isDesc, descTypo, isBtn, linkTarget, btnTypo, btnPadding, btnBorder } = attributes;

	const [isProModal, setIsProModal] = useState(false);

	const addSlide = () => {
		setAttributes({
			slides: [...slides, {
				background: { color: '#00000080' },
				border: {},
				position: 'center center',
				childPositions: defaultChildPositions,
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
		const newSlides = produce(slides, draft => {
			draft[index][type] = val;
		})
		setAttributes({ slides: newSlides });
		setActiveIndex(index);
	}

	const premiumProps = {
		isPremium,
		setOpen: setIsProModal
	};

	const panelBodyIF = {
		className: 'bPlPanelBody',
		initialOpen: false
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={tabs}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink='https://bplugins.com/docs/content-slider-block/guides/general' />


					<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Slides', 'b-blocks')}>
						{slides.map((item, index) => {
							const { background, border = {}, title, titleColor, description, descColor, btnText, btnLink, btnColors, btnHovColors } = item;

							return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Slide No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
								<Background label={__('Background', 'b-blocks')} value={background} onChange={val => updateSlide(index, 'background', val)} defaults={{ color: '#00000080' }} />

								<BControlPro label={__('Border:', 'b-blocks')} value={border} onChange={val => updateSlide(index, 'border', val)} {...premiumProps} Component={BorderControl} />

								<PanelRow>
									<Label className=''>{__('Content Position', 'b-blocks')}</Label>
									<AlignmentMatrixControl onChange={val => {
										setAttributes({
											slides: produce(slides, draft => {
												draft[index]['position'] = val;
												draft[index]['childPositions'] = getPosByPos(id, index, val);
											})
										})
									}} />
								</PanelRow>
								<small>{__('You can also change the content position by dragging element.', 'b-blocks')}</small>

								<PanelRow className='mt20'>
									<Label className=''>{__('Title:', 'b-blocks')}</Label>
									<TextControl value={title} onChange={val => updateSlide(index, 'title', val)} placeholder={__('Slide title', 'b-blocks')} />
								</PanelRow>

								<ColorControl label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateSlide(index, 'titleColor', val)} defaultColor='#fff' />

								<Label>{__('Description:', 'b-blocks')}</Label>
								<TextareaControl value={description} onChange={val => updateSlide(index, 'description', val)} placeholder={__('Description of the slider', 'b-blocks')} />

								<ColorControl label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateSlide(index, 'descColor', val)} defaultColor='#fff' />

								<PanelRow className='mt20'>
									<Label className=''>{__('Button Text:', 'b-blocks')}</Label>
									<TextControl value={btnText} onChange={val => updateSlide(index, 'btnText', val)} placeholder={__('Button label', 'b-blocks')} />
								</PanelRow>

								<PanelRow>
									<Label className=''>{__('Button Link:', 'b-blocks')}</Label>
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


					<PanelBody title={__('Layout Settings', 'b-blocks')} {...panelBodyIF}>
						<PanelRow>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<Device />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<Label>{__('Column Gap:', 'b-blocks')}</Label>
						<RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={250} step={1} beforeIcon='arrow-right-alt' />

						<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={sliderWidth} onChange={val => setAttributes({ sliderWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={[pxUnit(), emUnit(), vhUnit()]} />
					</PanelBody>
				</>}


				{'options' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Basic Options', 'b-blocks')}>
						<ToggleControl label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

						<ToggleControl className='mt10' label={__('Enable Touch Move', 'b-blocks')} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />
						<small>{__('Switch slide with grab in anywhere in slide', 'b-blocks')}</small>
						<small>{__('Touch Move will not work in backend', 'b-blocks')}</small>

						<Label>{__('Speed (s):', 'b-blocks')}</Label>
						<RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0} max={10} step={.05} />
						<small>{__('Smaller speed value will be slide faster', 'b-blocks')}</small>
					</PanelBody>


					<PanelBody title={__('Autoplay', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />
						<small>{__('Autoplay will not work in backend', 'b-blocks')}</small>

						{isAutoplay && <>
							<BControlPro className='mt20' label={__('Delay (s):', 'b-blocks')} value={autoplayOptions.delay} onChange={val => setAttributes({ autoplayOptions: { ...autoplayOptions, delay: val } })} min={0} max={10} step={.05} beforeIcon='visibility' {...premiumProps} Component={RangeControl} />
							<small>{__('Smaller delay value will be autoplay faster', 'b-blocks')}</small>

							<BControlPro className='mt20' label={__('Disable on Interaction', 'b-blocks')} checked={autoplayOptions.disableOnInteraction} onChange={val => setAttributes({ autoplayOptions: { ...autoplayOptions, disableOnInteraction: val } })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='mt10' label={__('Pause on Mouse Enter', 'b-blocks')} checked={autoplayOptions.pauseOnMouseEnter} onChange={val => setAttributes({ autoplayOptions: { ...autoplayOptions, pauseOnMouseEnter: val } })} {...premiumProps} Component={ToggleControl} />
							<small>{__(`If 'Disable on Interaction' is also enabled, it will stop autoplay instead of pause`, 'b-blocks')}</small>

							<BControlPro className='mt10' label={__('Reverse Direction', 'b-blocks')} checked={autoplayOptions.reverseDirection} onChange={val => setAttributes({ autoplayOptions: { ...autoplayOptions, reverseDirection: val } })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='mt10' label={__('Stop on Last Slide', 'b-blocks')} checked={autoplayOptions.stopOnLastSlide} onChange={val => setAttributes({ autoplayOptions: { ...autoplayOptions, stopOnLastSlide: val } })} {...premiumProps} Component={ToggleControl} />
						</>}
					</PanelBody>


					<PanelBody title={__('Free Mode', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Enable Free Mode', 'b-blocks')} checked={freeModeOptions.enabled} onChange={val => setAttributes({ freeModeOptions: { ...freeModeOptions, enabled: val } })} {...premiumProps} Component={ToggleControl} />
						<small>{__('Smooth Scrolling with dragging the slide', 'b-blocks')}</small>
						<br />
						<small>{__('Enable Touch Move to use Free Mode', 'b-blocks')}</small>

						{freeModeOptions.enabled && <BControlPro className='mt10' label={__('Sticky', 'b-blocks')} checked={freeModeOptions.sticky} onChange={val => setAttributes({ freeModeOptions: { ...freeModeOptions, sticky: val } })} {...premiumProps} Component={ToggleControl} />}
					</PanelBody>


					<PanelBody title={__('Effects', 'b-blocks')} {...panelBodyIF}>
						<PanelRow>
							<Label className=''>{__('Effect:', 'b-blocks')}</Label>
							<SelectControlPro value={effect}
								onChange={val => {
									setAttributes({ effect: val });
									val === 'slide' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '100%',
										sliderHeight: '400px',
										sliderPadding: { vertical: '0px', horizontal: '0px' }
									});
									val === 'fade' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '100%',
										sliderHeight: '400px',
										sliderPadding: { vertical: '0px', horizontal: '0px' }
									});
									val === 'cube' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '450px',
										sliderHeight: '500px',
										sliderPadding: { vertical: '50px', horizontal: '50px' }
									});
									val === 'creative' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '100%',
										sliderHeight: '400px',
										sliderPadding: { vertical: '0px', horizontal: '0px' }
									});
									val === 'coverflow' && setAttributes({
										columns: { desktop: 3, tablet: 2, mobile: 1 },
										sliderWidth: '100%',
										sliderHeight: '400px',
										sliderPadding: { vertical: '0px', horizontal: '0px' }
									});
									val === 'flip' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '450px',
										sliderHeight: '500px',
										sliderPadding: { vertical: '50px', horizontal: '50px' }
									});
									val === 'cards' && setAttributes({
										columns: { desktop: 1, tablet: 1, mobile: 1 },
										sliderWidth: '400px',
										sliderHeight: '500px',
										sliderPadding: { vertical: '50px', horizontal: '50px' }
									});
								}}
								options={effects}
								proValues={['cube', 'coverflow', 'flip', 'cards']}
								{...premiumProps}
							/>
						</PanelRow>
						<small>{__('To work fade, cube, creative, flip & cards effects properly, set single column per view.', 'b-blocks')}</small>
						<br />
						<small>{__('Some settings may change when effect will be changed.', 'b-blocks')}</small>
					</PanelBody>


					<PanelBody title={__('Keyboard Control', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Enable Keyboard Control', 'b-blocks')} checked={keyboardOptions.enabled} onChange={val => setAttributes({ keyboardOptions: { ...keyboardOptions, enabled: val } })}{...premiumProps} Component={ToggleControl} />
					</PanelBody>


					<PanelBody title={__('Mousewheel', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Enable Slide on Mousewheel', 'b-blocks')} checked={isMousewheel} onChange={val => setAttributes({ isMousewheel: val })}{...premiumProps} Component={ToggleControl} />
					</PanelBody>


					<PanelBody title={__('Pagination', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Show Pagination', 'b-blocks')} checked={isPage} onChange={val => setAttributes({ isPage: val })} />

						{isPage && <>
							<BControlPro className='mt10' label={__('Show On Tablet', 'b-blocks')} checked={pageOnDevice?.tablet} onChange={val => setAttributes({ pageOnDevice: { ...pageOnDevice, tablet: val } })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='mt10' label={__('Show On Mobile', 'b-blocks')} checked={pageOnDevice?.mobile} onChange={val => setAttributes({ pageOnDevice: { ...pageOnDevice, mobile: val } })} {...premiumProps} Component={ToggleControl} />

							<ToggleControl className='mt10' label={__('Enable Pagination Clickable', 'b-blocks')} checked={isPageClickable} onChange={val => setAttributes({ isPageClickable: val })} />

							<ToggleControl className='mt10' label={__('Enable Pagination Dynamic Bullets', 'b-blocks')} checked={isPageDynamic} onChange={val => setAttributes({ isPageDynamic: val })} />
						</>}
					</PanelBody>


					<PanelBody title={__('Navigation', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Show Preview Next Button', 'b-blocks')} checked={isPrevNext} onChange={val => setAttributes({ isPrevNext: val })} />

						{isPrevNext && <>
							<BControlPro className='mt10' label={__('Show On Tablet', 'b-blocks')} checked={prevNextOnDevice?.tablet} onChange={val => setAttributes({ prevNextOnDevice: { ...prevNextOnDevice, tablet: val } })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='mt10' label={__('Show On Mobile', 'b-blocks')} checked={prevNextOnDevice?.mobile} onChange={val => setAttributes({ prevNextOnDevice: { ...prevNextOnDevice, mobile: val } })} {...premiumProps} Component={ToggleControl} />
						</>}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Slider', 'b-blocks')}>
						<BControlPro label={__('Background', 'b-blocks')} value={sliderBG} onChange={val => setAttributes({ sliderBG: val })} defaults={{ color: '#0000' }} {...premiumProps} Component={Background} />

						<BControlPro className='mt20' label={__('Padding:', 'b-blocks')} value={sliderPadding} onChange={val => setAttributes({ sliderPadding: val })} defaults={{ vertical: '0px', horizontal: '0px' }} {...premiumProps} Component={SpaceControl} />
					</PanelBody>


					{isPage || isPrevNext ? <PanelBody title={__('Options', 'b-blocks')} {...panelBodyIF}>
						{isPage && <>
							<ColorControl label={__('Pagination Bullets Color:', 'b-blocks')} value={pageColor} onChange={val => setAttributes({ pageColor: val })} defaultColor='#fff' />

							<UnitControl className='mt20' label={__('Pagination Width:', 'b-blocks')} labelPosition='left' value={pageWidth} onChange={val => setAttributes({ pageWidth: val })} units={[pxUnit(), emUnit()]} />

							<UnitControl className='mt20' label={__('Pagination Height:', 'b-blocks')} labelPosition='left' value={pageHeight} onChange={val => setAttributes({ pageHeight: val })} units={[pxUnit(), emUnit()]} />

							<BorderControl label={__('Pagination Border:', 'b-blocks')} value={pageBorder} onChange={val => setAttributes({ pageBorder: val })} defaults={{ radius: '50%' }} />
						</>}

						{isPrevNext && <ColorControl label={__('Preview Next Button Color:', 'b-blocks')} value={prevNextColor} onChange={val => setAttributes({ prevNextColor: val })} defaultColor='#fff' />}
					</PanelBody> : ''}


					<PanelBody title={__('Slide Title', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						{isTitle && <Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} />}
					</PanelBody>


					<PanelBody title={__('Slide Description', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

						{isDesc && <Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />}
					</PanelBody>


					<PanelBody title={__('Slide Button', 'b-blocks')} {...panelBodyIF}>
						<ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

						{isBtn && <>
							<ToggleControl className='mt10' label={__('Open link in new tab', 'b-blocks')} checked={'_blank' === linkTarget ? true : false} onChange={val => setAttributes({ linkTarget: val ? '_blank' : '' })} />

							<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} />

							<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

							<BorderControl label={__('Border:', 'b-blocks')} value={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '3px' }} />
						</>}
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Slide', 'b-blocks')} onClick={addSlide} ><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={sliderAlign} onChange={val => setAttributes({ sliderAlign: val })} describedBy={__('Slider Alignment')} alignmentControls={[
				{ title: __('Slider in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Slider in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Slider in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>


		<ProModal isProModal={isProModal} setIsProModal={setIsProModal} block='Slider'>
			<li>&emsp;<strong>{__('Border: ', 'b-blocks')}</strong>{__('Border style options in every single slide.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Delay time: ', 'b-blocks')}</strong>{__('Delay time option in autoplay.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Disable on Interaction: ', 'b-blocks')}</strong>{__('Disable on Interaction option in autoplay.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Reverse Direction: ', 'b-blocks')}</strong>{__('Reverse Direction option in autoplay.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Pause on Mouse Enter: ', 'b-blocks')}</strong>{__('Pause on Mouse Enter option in autoplay.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Stop on Last Slide: ', 'b-blocks')}</strong>{__('Stop on Last Slide option in autoplay.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Free Mode: ', 'b-blocks')}</strong>{__('Free Mode option on drag slide.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Sticky: ', 'b-blocks')}</strong>{__('Sticky option in free mode.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Effects: ', 'b-blocks')}</strong>{__('Explore more effects such as Cube, Coverflow, Flip, and Cards.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Keyboard Control: ', 'b-blocks')}</strong>{__('Slide with Keyboard control.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Slide on Mousewheel: ', 'b-blocks')}</strong>{__('Slide on Mousewheel option.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Pagination Device: ', 'b-blocks')}</strong>{__('Show/Hide pagination in different devices(tablet and mobile).', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Navigation Device: ', 'b-blocks')}</strong>{__('Show/Hide navigation in different devices(tablet and mobile).', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Background: ', 'b-blocks')}</strong>{__('Background style option for slider wrapper.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Padding: ', 'b-blocks')}</strong>{__('Padding style option for slider wrapper.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Shortcode: ', 'b-blocks')}</strong>{__('Shortcode option to use anywhere.', 'b-blocks')}</li>
		</ProModal>
	</>;
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Settings);