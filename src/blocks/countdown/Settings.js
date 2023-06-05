import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, DateTimePicker, SelectControl, PanelRow, TabPanel, RangeControl, Dashicon } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import { Label, Background, BColor, BorderControl, ShadowControl, SpaceControl, Typography } from '../../../../Components';
import { tabController } from '../../../../Components/utils/functions';
import { pxUnit, perUnit, emUnit, remUnit } from '../../../../Components/utils/options';

import { generalStyleTabs, flexPos } from '../../utils/options';

const layouts = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Layout 1', 'b-blocks'), value: 'layout1' },
	{ label: __('Layout 2', 'b-blocks'), value: 'layout2' },
	{ label: __('Layout 3', 'b-blocks'), value: 'layout3' },
];
const sepTypes = [
	{ label: __('Dotted', 'b-blocks'), value: ':' },
	{ label: __('Dashed', 'b-blocks'), value: '-' },
	{ label: __('Solid', 'b-blocks'), value: '|' },
];

const Settings = ({ attributes, setAttributes }) => {
	const { destDate, layout, isResponsive, boxIsInline, boxPosition, isLabels, isDays, isHours, isMinutes, isSeconds, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isSep, sepType, sepSize, sepColor } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={() => tabController()}>{tab => <>
				{'general' == tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/countdown-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


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

						<ToggleControl className='mt20' label={__('Box Inline?', 'b-blocks')} checked={boxIsInline} onChange={val => setAttributes({ boxIsInline: val })} />

						<ToggleControl className='mt10' label={__('Show Labels', 'b-blocks')} checked={isLabels} onChange={val => setAttributes({ isLabels: val })} />

						<ToggleControl className='mt10' label={__('Show Days', 'b-blocks')} checked={isDays} onChange={val => setAttributes({ isDays: val })} />

						<ToggleControl className='mt10' label={__('Show Hours', 'b-blocks')} checked={isHours} onChange={val => setAttributes({ isHours: val })} />

						<ToggleControl className='mt10' label={__('Show Minutes', 'b-blocks')} checked={isMinutes} onChange={val => setAttributes({ isMinutes: val })} />

						<ToggleControl className='mt10' label={__('Show Seconds', 'b-blocks')} checked={isSeconds} onChange={val => setAttributes({ isSeconds: val })} />
					</PanelBody>
				</>}


				{'style' == tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Countdown', 'b-blocks')}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />
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

						<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={boxWidth} onChange={val => setAttributes({ boxWidth: val })} units={[pxUnit(), emUnit(), remUnit()]} />

						<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit(), emUnit(), remUnit()]} />

						<UnitControl className='mt20' label={__('Space Between Boxes:', 'b-blocks')} labelPosition='left' value={boxSpace} onChange={val => setAttributes({ boxSpace: val })} units={[pxUnit(), emUnit(), remUnit()]} />

						<BorderControl label={__('Border', 'b-blocks')} value={boxBorder} onChange={val => setAttributes({ boxBorder: val })} defaults={{ radius: '5%' }} />

						<ShadowControl label={__('Shadow:', 'b-blocks')} value={boxShadow} onChange={val => setAttributes({ boxShadow: val })} />
					</PanelBody>


					{isDays || isHours || isMinutes || isSeconds ? <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
						<Typography label={__('Digit Typography:', 'b-blocks')} value={digitTypo} onChange={val => setAttributes({ digitTypo: val })} defaults={{ fontSize: { desktop: 48, tablet: 40, mobile: 32 } }} produce={produce} />

						<BColor label={__('Digit Color:', 'b-blocks')} value={digitColor} onChange={val => setAttributes({ digitColor: val })} defaultColor='#fff' />

						{isLabels && <>
							<Typography className='mt20' label={__('Label Typography:', 'b-blocks')} value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} produce={produce} />

							<BColor label={__('Label Color:', 'b-blocks')} value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
						</>}
					</PanelBody> : null}


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
				</>}
			</>}</TabPanel>
		</InspectorControls>


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