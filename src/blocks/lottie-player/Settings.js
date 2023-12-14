import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl, RangeControl, __experimentalUnitControl as UnitControl, TextControl, TabPanel, Dashicon } from '@wordpress/components';

import { Label, BColor, BtnGroup } from '../../../../Components';
import { pxUnit, perUnit, emUnit } from '../../../../Components/utils/options';

import { generalStyleTabs } from '../../utils/options';
const modes = [
	{ label: __('Normal', 'b-blocks'), value: 'normal', icon: __('Normal', 'b-blocks') },
	{ label: __('Bounce', 'b-blocks'), value: 'bounce', icon: __('Bounce', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes }) => {
	const { playerAlign, file, isControls, isAutoplay, isLoop, isHover, mode, count, speed, intermission, link, width, background, controlsHeight, controlsBG, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' == tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/lottie-player-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Player Settings', 'b-blocks')}>
						<Label className='mb5'>{__('Lottie Json file url:', 'b-blocks')}</Label>
						<TextControl value={file} onChange={val => setAttributes({ file: val })} />

						<ToggleControl className='mt20' label={__('Show Controls', 'b-blocks')} checked={isControls} onChange={val => setAttributes({ isControls: val })} />

						<ToggleControl className='mt10' label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

						<ToggleControl className='mt10' label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

						<ToggleControl className='mt10' label={__('Enable Hover', 'b-blocks')} checked={isHover} onChange={val => setAttributes({ isHover: val })} />

						<PanelRow className='mt20'>
							<Label className=''>{__('Mode:', 'b-blocks')}</Label>
							<BtnGroup value={mode} onChange={val => setAttributes({ mode: val })} options={modes} />
						</PanelRow>

						<Label>{__('Count (Set 0 to infinite):', 'b-blocks')}</Label>
						<RangeControl value={count} onChange={val => setAttributes({ count: val })} min={0} max={50} step={1} />

						<Label>{__('Speed:', 'b-blocks')}</Label>
						<RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0.01} max={20} step={.01} />

						<Label>{__('Interval (s):', 'b-blocks')}</Label>
						<RangeControl value={intermission} onChange={val => setAttributes({ intermission: val })} min={0} max={20} step={.01} />

						<Label className='mb5'>{__('Link the player:', 'lottie-player')}</Label>
						<TextControl value={link} onChange={val => setAttributes({ link: val })} />
						<small>{__('If you want to link the player, enter the link here. Otherwise, leave as blank.')}</small>
					</PanelBody>
				</>}


				{'style' == tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Player', 'b-blocks')}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<BColor label={__('Background Color:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaultColor='#0000' />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Controls', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={controlsHeight} onChange={val => setAttributes({ controlsHeight: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<BColor label={__('Background Color:', 'b-blocks')} value={controlsBG} onChange={val => setAttributes({ controlsBG: val })} defaultColor='#0000' />

						<BColor label={__('Icons Color:', 'b-blocks')} value={controlsIconColor} onChange={val => setAttributes({ controlsIconColor: val })} defaultColor='#4527a4' />

						<BColor label={__('Icons Hover Color:', 'b-blocks')} value={controlsIconHoverColor} onChange={val => setAttributes({ controlsIconHoverColor: val })} defaultColor='#8344c5' />

						<BColor label={__('Icons Active Color:', 'b-blocks')} value={controlsIconActiveColor} onChange={val => setAttributes({ controlsIconActiveColor: val })} defaultColor='#8344c5' />

						<BColor label={__('Track Color:', 'b-blocks')} value={controlsTrackColor} onChange={val => setAttributes({ controlsTrackColor: val })} defaultColor='#8344c5' />

						<BColor label={__('Thumb Color:', 'b-blocks')} value={controlsThumbColor} onChange={val => setAttributes({ controlsThumbColor: val })} defaultColor='#4527a4' />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={playerAlign} onChange={val => setAttributes({ playerAlign: val })} describedBy={__('Player Alignment')} alignmentControls={[
				{ title: __('Player in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Player in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Player in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;