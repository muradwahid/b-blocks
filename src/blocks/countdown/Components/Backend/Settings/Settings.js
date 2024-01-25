import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, DateTimePicker, SelectControl, PanelRow, TabPanel, RangeControl } from '@wordpress/components';

import { Label, Background, BColor, BorderControl, ShadowControl, SpaceControl, Typography, HelpPanel, ColorsControl } from '../../../../../../../Components';
import { BControlPro } from '../../../../../../../Components/Pro';
import { tabController } from '../../../../../../../Components/utils/functions';
import { pxUnit, perUnit, emUnit, remUnit } from '../../../../../../../Components/utils/options';

import { generalStyleTabs, flexPos } from '../../../../../utils/options';
import { TextControl } from '@wordpress/components';
import { Button } from '@wordpress/components';
import { TextareaControl } from '@wordpress/components';
import { flexDirections, layouts, sepTypes } from '../../../utils/options';
import ProModal from '../../../../../ProModal/ProModal';

const Settings = ({ attributes, setAttributes, isPremium }) => {
	const { destDate, layout, isResponsive, boxIsInline, boxPosition, isLabels, isDays, isHours, isMinutes, isSeconds, isExpired = false, hideOn0 = false, hideOnMobile = false, hideOnTablet = false, prefixSuffixDirection = 'row', prefixText = '', suffixButtonText = '', suffixButtonUrl = '#', addID = '', addClass = '', addCSS = '', width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isDaysSingleStyle = false, daysBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, daysDigitColor = '#fff', daysLabelColor = '#fff', isHoursSingleStyle = false, hoursBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, hoursDigitColor = '#fff', hoursLabelColor = '#fff', isMinutesSingleStyle = false, minutesBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, minutesDigitColor = '#fff', minutesLabelColor = '#fff', isSecondsSingleStyle = false, secondsBG = { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }, secondsDigitColor = '#fff', secondsLabelColor = '#fff', isSep, sepType, sepSize, sepColor, prefixTextTypo = { fontSize: { desktop: 15 } }, prefixTextColor = '#222', suffixButtonTypo = { fontSize: { desktop: 16 } }, suffixButtonColors = { color: '#fff', bg: '#222' }, suffixButtonPadding = { vertical: '14px', horizontal: '28px' }, isDismiss = false, dismissColor = '#333' } = attributes;

	const [isProModal, setIsProModal] = useState(false);

	const premiumProps = {
		isPremium,
		setOpen: setIsProModal
	};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={() => tabController()}>{tab => <>
				{'general' == tab.name && <>
					<HelpPanel slug='b-blocks' docsLink='https://bblockswp.com/docs/countdown-block' />


					<PanelBody className='bPlPanelBody' title={__('Countdown Settings', 'b-blocks')}>
						<Label className='mb5'>{__('Destination Date:', 'b-blocks')}</Label>
						<DateTimePicker currentDate={destDate} onChange={val => setAttributes({ destDate: val })} is12Hour={true} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Layout:', 'b-blocks')}</Label>
							<SelectControl value={layout} onChange={val => {
								setAttributes({ layout: val });
								'default' === val && setAttributes({
									boxIsInline: false,
									background: { type: 'solid', color: '#0000' },
									shadow: { hOffset: '0px', vOffset: '0px', color: '#0000' },
									boxBG: { type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' },
									boxSpace: '30px',
									boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%' },
									digitColor: '#fff',
									labelColor: '#fff',
									isSep: false,
									sepColor: '#4527a4'
								});
								'layout1' === val && setAttributes({
									boxIsInline: false,
									background: { type: 'gradient', gradient: 'linear-gradient(180deg, #4527a4, #8344c5)' },
									shadow: { hOffset: '5px', vOffset: '5px', color: '#4527a4' },
									boxBG: { type: 'solid', color: '#0000' },
									boxSpace: '0px',
									boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%' },
									digitColor: '#fff',
									labelColor: '#fff',
									isSep: true,
									sepColor: '#fff'
								});
								'layout2' === val && setAttributes({
									boxIsInline: false,
									background: { type: 'solid', color: '#0000' },
									shadow: { hOffset: '0px', vOffset: '0px', color: '#0000' },
									boxBG: { type: 'solid', color: '#0000' },
									boxSpace: '30px',
									boxBorder: { width: '2px', type: 'solid', color: '#4527a4', radius: '5%' },
									digitColor: '#4527a4',
									labelColor: '#4527a4',
									isSep: true,
									sepColor: '#4527a4'
								});
								'layout3' === val && setAttributes({
									boxIsInline: true,
									background: { type: 'solid', color: '#0000' },
									shadow: { hOffset: '0px', vOffset: '8px', blur: '15px', color: '#4527a4' },
									boxBG: { type: 'solid', color: '#0000' },
									boxSpace: '30px',
									boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%' },
									digitColor: '#4527a4',
									labelColor: '#4527a4',
									isSep: true,
									sepColor: '#4527a4'
								});
							}} options={layouts} />
						</PanelRow>

						<ToggleControl className='mt20' label={__('Responsive on Mobile', 'b-blocks')} checked={isResponsive} onChange={val => setAttributes({ isResponsive: val })} />

						<ToggleControl className='mt10' label={__('Box Inline?', 'b-blocks')} checked={boxIsInline} onChange={val => setAttributes({ boxIsInline: val })} />

						<ToggleControl className='mt10' label={__('Show Labels', 'b-blocks')} checked={isLabels} onChange={val => setAttributes({ isLabels: val })} />

						<ToggleControl className='mt10' label={__('Show Days', 'b-blocks')} checked={isDays} onChange={val => setAttributes({ isDays: val })} />

						<ToggleControl className='mt10' label={__('Show Hours', 'b-blocks')} checked={isHours} onChange={val => setAttributes({ isHours: val })} />

						<ToggleControl className='mt10' label={__('Show Minutes', 'b-blocks')} checked={isMinutes} onChange={val => setAttributes({ isMinutes: val })} />

						<ToggleControl className='mt10' label={__('Show Seconds', 'b-blocks')} checked={isSeconds} onChange={val => setAttributes({ isSeconds: val })} />

						<BControlPro className='mt10' label={__('Show expired content on expire', 'b-blocks')} checked={isExpired} onChange={val => setAttributes({ isExpired: val })} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt10' label={__('Hide box if value is 0', 'b-blocks')} checked={hideOn0} onChange={val => setAttributes({ hideOn0: val })} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt10' label={__('Hide Countdown on Mobile', 'b-blocks')} checked={hideOnMobile} onChange={val => setAttributes({ hideOnMobile: val })} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt10' label={__('Hide Countdown on Tablet', 'b-blocks')} checked={hideOnTablet} onChange={val => setAttributes({ hideOnTablet: val })} {...premiumProps} Component={ToggleControl} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Prefix & Suffix', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('Prefix Suffix Direction:', 'b-blocks')} labelPosition='left' value={prefixSuffixDirection} onChange={val => setAttributes({ prefixSuffixDirection: val })} options={flexDirections} {...premiumProps} Component={SelectControl} />

						<BControlPro className='mt20' label={__('Prefix Text:', 'b-blocks')} value={prefixText} onChange={val => setAttributes({ prefixText: val })} placeholder={__('Prefix/Before Text', 'b-blocks')} {...premiumProps} Component={TextControl} />
						<small>{__('Enter prefix text to show a message before countdown', 'b-blocks')}</small>

						<hr />

						<BControlPro label={__('Suffix Button Text:', 'b-blocks')} value={suffixButtonText} onChange={val => setAttributes({ suffixButtonText: val })} placeholder={__('Suffix/After Button Text', 'b-blocks')} {...premiumProps} Component={TextControl} />
						<small>{__('Enter suffix button text to display a button after countdown', 'b-blocks')}</small>

						{suffixButtonText && <>
							<BControlPro className='mt20' label={__('Suffix Button Url:', 'b-blocks')} value={suffixButtonUrl} onChange={val => setAttributes({ suffixButtonUrl: val })} placeholder={__('Button url', 'b-blocks')} {...premiumProps} Component={TextControl} />
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Additional', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('ID:', 'b-blocks')} value={addID} onChange={val => setAttributes({ addID: val })} placeholder={__('Enter additional ID', 'b-blocks')} {...premiumProps} Component={TextControl} />

						<BControlPro className='mt20' label={__('Class:', 'b-blocks')} value={addClass} onChange={val => setAttributes({ addClass: val })} placeholder={__('Enter additional Class', 'b-blocks')} {...premiumProps} Component={TextControl} />

						<BControlPro className='mt20' label={__('CSS:', 'b-blocks')} value={addCSS} onChange={val => setAttributes({ addCSS: val })} placeholder={__('Enter additional CSS', 'b-blocks')} {...premiumProps} Component={TextareaControl} />
					</PanelBody>
				</>}


				{'style' == tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Countdown', 'b-blocks')}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(900), perUnit(100), emUnit(56)]} isResetValueOnUnitChange={true} />
						<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '10px', horizontal: '15px' }} />

						<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Boxes', 'b-blocks')} initialOpen={false}>
						{['0px', '0%', '0em'].includes(width) ? '' : <PanelRow>
							<Label className=''>{__('Box Position:', 'b-blocks')}</Label>
							<SelectControl value={boxPosition} onChange={val => setAttributes({ boxPosition: val })} options={flexPos} />
						</PanelRow>}

						<Background label={__('Background:', 'b-blocks')} value={boxBG} onChange={val => setAttributes({ boxBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} />

						<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={boxWidth} onChange={val => setAttributes({ boxWidth: val })} units={[pxUnit(170), emUnit(10.5), remUnit(10.5)]} isResetValueOnUnitChange={true} />

						<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit(120), emUnit(7.5), remUnit(7.5)]} isResetValueOnUnitChange={true} />

						<UnitControl className='mt20' label={__('Space Between Boxes:', 'b-blocks')} labelPosition='left' value={boxSpace} onChange={val => setAttributes({ boxSpace: val })} units={[pxUnit(30), emUnit(2), remUnit(2)]} isResetValueOnUnitChange={true} />

						<BorderControl label={__('Border', 'b-blocks')} value={boxBorder} onChange={val => setAttributes({ boxBorder: val })} defaults={{ radius: '5%' }} />

						<ShadowControl label={__('Shadow:', 'b-blocks')} value={boxShadow} onChange={val => setAttributes({ boxShadow: val })} />
					</PanelBody>


					{isDays || isHours || isMinutes || isSeconds ? <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
						<Typography label={__('Digit Typography:', 'b-blocks')} value={digitTypo} onChange={val => setAttributes({ digitTypo: val })} defaults={{ fontSize: { desktop: 48, tablet: 40, mobile: 32 } }} />

						<BColor label={__('Digit Color:', 'b-blocks')} value={digitColor} onChange={val => setAttributes({ digitColor: val })} defaultColor='#fff' />

						{isLabels && <>
							<Typography className='mt20' label={__('Label Typography:', 'b-blocks')} value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} />

							<BColor label={__('Label Color:', 'b-blocks')} value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
						</>}
					</PanelBody> : null}


					{isDays && <PanelBody className='bPlPanelBody' title={__('Days Style', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<BControlPro label={__('Enable Single Style', 'b-blocks')} checked={isDaysSingleStyle} onChange={val => setAttributes({ isDaysSingleStyle: val })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='bPlResetVal' icon='image-rotate' label={__('Reset style according to parent', 'b-blocks')} tooltipPosition='top right' onClick={() => setAttributes({
								daysBG: boxBG,
								daysDigitColor: digitColor,
								daysLabelColor: labelColor
							})} {...premiumProps} Component={Button} />
						</PanelRow>

						{isDaysSingleStyle && <>
							<BControlPro label={__('Box Background:', 'b-blocks')} value={daysBG} onChange={val => setAttributes({ daysBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} {...premiumProps} Component={Background} />

							<BControlPro label={__('Digit Color:', 'b-blocks')} value={daysDigitColor} onChange={val => setAttributes({ daysDigitColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />

							{isLabels && <BControlPro label={__('Label Color:', 'b-blocks')} value={daysLabelColor} onChange={val => setAttributes({ daysLabelColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />}
						</>}
					</PanelBody>}


					{isHours && <PanelBody className='bPlPanelBody' title={__('Hours Style', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<BControlPro label={__('Enable Single Style', 'b-blocks')} checked={isHoursSingleStyle} onChange={val => setAttributes({ isHoursSingleStyle: val })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='bPlResetVal' icon='image-rotate' label={__('Reset style according to parent', 'b-blocks')} tooltipPosition='top right' onClick={() => setAttributes({
								hoursBG: boxBG,
								hoursDigitColor: digitColor,
								hoursLabelColor: labelColor
							})} {...premiumProps} Component={Button} />
						</PanelRow>

						{isHoursSingleStyle && <>
							<BControlPro label={__('Box Background:', 'b-blocks')} value={hoursBG} onChange={val => setAttributes({ hoursBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} {...premiumProps} Component={Background} />

							<BControlPro label={__('Digit Color:', 'b-blocks')} value={hoursDigitColor} onChange={val => setAttributes({ hoursDigitColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />

							{isLabels && <BControlPro label={__('Label Color:', 'b-blocks')} value={hoursLabelColor} onChange={val => setAttributes({ hoursLabelColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />}
						</>}
					</PanelBody>}


					{isMinutes && <PanelBody className='bPlPanelBody' title={__('Minutes Style', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<BControlPro label={__('Enable Single Style', 'b-blocks')} checked={isMinutesSingleStyle} onChange={val => setAttributes({ isMinutesSingleStyle: val })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='bPlResetVal' icon='image-rotate' label={__('Reset style according to parent', 'b-blocks')} tooltipPosition='top right' onClick={() => setAttributes({
								minutesBG: boxBG,
								minutesDigitColor: digitColor,
								minutesLabelColor: labelColor
							})} {...premiumProps} Component={Button} />
						</PanelRow>

						{isMinutesSingleStyle && <>
							<BControlPro label={__('Box Background:', 'b-blocks')} value={minutesBG} onChange={val => setAttributes({ minutesBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} {...premiumProps} Component={Background} />

							<BControlPro label={__('Digit Color:', 'b-blocks')} value={minutesDigitColor} onChange={val => setAttributes({ minutesDigitColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />

							{isLabels && <BControlPro label={__('Label Color:', 'b-blocks')} value={minutesLabelColor} onChange={val => setAttributes({ minutesLabelColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />}
						</>}
					</PanelBody>}


					{isSeconds && <PanelBody className='bPlPanelBody' title={__('Seconds Style', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<BControlPro label={__('Enable Single Style', 'b-blocks')} checked={isSecondsSingleStyle} onChange={val => setAttributes({ isSecondsSingleStyle: val })} {...premiumProps} Component={ToggleControl} />

							<BControlPro className='bPlResetVal' icon='image-rotate' label={__('Reset style according to parent', 'b-blocks')} tooltipPosition='top right' onClick={() => setAttributes({
								secondsBG: boxBG,
								secondsDigitColor: digitColor,
								secondsLabelColor: labelColor
							})} {...premiumProps} Component={Button} />
						</PanelRow>

						{isSecondsSingleStyle && <>
							<BControlPro label={__('Box Background:', 'b-blocks')} value={secondsBG} onChange={val => setAttributes({ secondsBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} {...premiumProps} Component={Background} />

							<BControlPro label={__('Digit Color:', 'b-blocks')} value={secondsDigitColor} onChange={val => setAttributes({ secondsDigitColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />

							{isLabels && <BControlPro label={__('Label Color:', 'b-blocks')} value={secondsLabelColor} onChange={val => setAttributes({ secondsLabelColor: val })} defaultColor='#fff' {...premiumProps} Component={BColor} />}
						</>}
					</PanelBody>}


					<PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

						{isSep && <>
							<PanelRow>
								<Label className=''>{__('Type:', 'b-blocks')}</Label>
								<SelectControl value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
							</PanelRow>

							<Label>{__('Size:', 'b-blocks')}</Label>
							<RangeControl value={sepSize} onChange={val => setAttributes({ sepSize: val })} min={0} max={160} step={1} allowReset={true} resetFallbackValue={48} initialPosition={48} />

							<BColor label={__('Color:', 'b-blocks')} value={sepColor} onChange={val => setAttributes({ sepColor: val })} defaultColor='#4527a4' />
						</>}
					</PanelBody>


					{prefixText && <PanelBody className='bPlPanelBody' title={__('Prefix Text', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('Typography:', 'b-blocks')} value={prefixTextTypo} onChange={val => setAttributes({ prefixTextTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} {...premiumProps} Component={Typography} />

						<BControlPro label={__('Color:', 'b-blocks')} value={prefixTextColor} onChange={val => setAttributes({ prefixTextColor: val })} defaultColor='#222' {...premiumProps} Component={BColor} />
					</PanelBody>}


					{suffixButtonText && <PanelBody className='bPlPanelBody' title={__('Suffix Button', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('Typography:', 'b-blocks')} value={suffixButtonTypo} onChange={val => setAttributes({ suffixButtonTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} {...premiumProps} Component={Typography} />

						<BControlPro value={suffixButtonColors} onChange={val => setAttributes({ suffixButtonColors: val })} defaults={{ color: '#fff', bg: '#222' }} {...premiumProps} Component={ColorsControl} />

						<BControlPro className='mt20' label={__('Padding:', 'b-blocks')} value={suffixButtonPadding} onChange={val => setAttributes({ suffixButtonPadding: val })} defaults={{ vertical: '14px', horizontal: '28px' }} {...premiumProps} Component={SpaceControl} />
					</PanelBody>}


					<PanelBody className='bPlPanelBody' title={__('Dismiss Button', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('Countdown Dismissible?', 'b-blocks')} checked={isDismiss} onChange={val => setAttributes({ isDismiss: val })} {...premiumProps} Component={ToggleControl} />

						{isDismiss && <>
							<BControlPro label={__('Color:', 'b-blocks')} value={dismissColor} onChange={val => setAttributes({ dismissColor: val })} defaultColor='#333' {...premiumProps} Component={BColor} />
						</>}
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModal={isProModal} setIsProModal={setIsProModal} block='Countdown'>
			<li>&emsp;<strong>{__('Expired Display: ', 'b-blocks')}</strong>{__('Show content that has expired after the countdown timer has elapsed.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Hide at Zero: ', 'b-blocks')}</strong>{__('Conceal the box when the countdown timer reaches 0.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Mobile Visibility: ', 'b-blocks')}</strong>{__('Toggle visibility of the countdown timer on mobile devices.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Tablet Visibility: ', 'b-blocks')}</strong>{__('Toggle visibility of the countdown timer on tablet devices.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Prefix Text: ', 'b-blocks')}</strong>{__('Display text before the countdown timer.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Prefix Style: ', 'b-blocks')}</strong>{__('Implement typography settings and adjust the color for the prefix text.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Suffix Button: ', 'b-blocks')}</strong>{__('Show a button after the countdown timer.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Suffix Button Style: ', 'b-blocks')}</strong>{__('Apply typography, colors(text and background) and padding for the suffix button.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Prefix Suffix Direction: ', 'b-blocks')}</strong>{__('Direction of the content displayed before and after the countdown timer.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Single Style: ', 'b-blocks')}</strong>{__('Apply different styles to each box, including variations in background, digit color, and label color.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Dismiss Button: ', 'b-blocks')}</strong>{__('Provide a button to dismiss/hide the countdown timer.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Patterns: ', 'b-blocks')}</strong>{__('Additional patterns for expanding the variety of countdown styles.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Shortcode Integration: ', 'b-blocks')}</strong>{__('Shortcode for flexible use across various locations.', 'b-blocks')}</li>
		</ProModal>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Countdown Alignment')} alignmentControls={[
				{ title: __('Countdown in left', 'b-blocks'), align: 'flex-start', icon: 'align-left' },
				{ title: __('Countdown in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Countdown in right', 'b-blocks'), align: 'flex-end', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;