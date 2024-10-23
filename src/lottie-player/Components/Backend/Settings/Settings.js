import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, TextControl, __experimentalNumberControl as NumberControl, ToggleControl, RangeControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, ColorControl, BtnGroup, ColorsControl, HelpPanel, InlineMediaUpload, Typography } from '../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro } from '../../../../../../bpl-tools/ProControls';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import ProModal from '../../../../backend/ProModal/ProModal';
import { pluginSlug } from '../../../../utils/data';
import { aligns, generalStyleTabs } from '../../../../utils/options';
import { directions, interactivities, modes } from '../../../utils/options';
import { actionsOnInteractivityChange } from '../../../utils/functions';

const Settings = ({ attributes, setAttributes, fileFrameSize, isPremium }) => {
	const { playerAlign, file, isControls, isAutoplay, isLoop, isHover, mode, direction = 1, count, speed, intermission, link, isLinkInNewTab = false, interactivity = 'noInteractivity', interactivityContainer = '.wp-block-b-blocks-lottie-player', interactivityActions = [], width, background, controlsHeight, controlsBG, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor, isCap = false, caption = '', capAlign = 'center', capTypo = {}, capColors = { color: '#333' }, capPadding = {}, capMargin = {} } = attributes;

	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const updateInteractivityAction = (index, type, val, otherIndex = null) => {
		const newInterAction = produce(interactivityActions, draft => {
			if (null !== otherIndex) {
				draft[index][type][otherIndex] = val;
			} else {
				draft[index][type] = val;
			}
		});
		setAttributes({ interactivityActions: newInterAction });
	}

	const premiumProps = {
		isPremium,
		setIsProModalOpen
	};

	const panelBodyIF = {
		className: 'bPlPanelBody',
		initialOpen: false
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' == tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink='https://bplugins.com/docs/lottie-player' />


					<PanelBody className='bPlPanelBody' title={__('Player', 'b-blocks')}>
						<Label className='mb5'>{__('Lottie file url:', 'b-blocks')}</Label>
						{isPremium ?
							<InlineMediaUpload value={file} types={['application/json']} onChange={val => setAttributes({ file: val })} placeholder={__('Enter lottie file url', 'b-blocks')} /> :
							<TextControl value={file} onChange={val => setAttributes({ file: val })} />}
						<small>{__('Support only .json or .lottie file!', 'b-blocks')}</small>

						<ToggleControl className='mt20' label={__('Show Controls', 'b-blocks')} checked={isControls} onChange={val => setAttributes({ isControls: val })} />

						<ToggleControl className='mt10' label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

						<ToggleControl className='mt10' label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

						<BControlPro className='mt10' label={__('Enable Hover', 'b-blocks')} checked={isHover} onChange={val => setAttributes({ isHover: val })} {...premiumProps} Component={ToggleControl} />

						<BControlPro className='mt20' label={__('Mode:', 'b-blocks')} value={mode} onChange={val => setAttributes({ mode: val })} options={modes} {...premiumProps} Component={BtnGroup} />

						<BControlPro className='mt20' label={__('Direction:', 'b-blocks')} value={direction} onChange={val => setAttributes({ direction: parseInt(val) })} options={directions} {...premiumProps} Component={BtnGroup} />

						<BControlPro className='mt20' label={__('Count (Set 0 to infinite):', 'b-blocks')} value={count} onChange={val => setAttributes({ count: val })} min={0} max={50} step={1} {...premiumProps} Component={RangeControl} />

						<BControlPro className='mt20' label={__('Speed:', 'b-blocks')} value={speed} onChange={val => setAttributes({ speed: val })} min={0.01} max={20} step={.01} {...premiumProps} Component={RangeControl} />

						<BControlPro className='mt20' label={__('Interval (s):', 'b-blocks')} value={intermission} onChange={val => setAttributes({ intermission: val })} min={0} max={20} step={.01} {...premiumProps} Component={RangeControl} />

						<Label>{__('Link the player:', 'b-blocks')}</Label>
						<TextControl value={link} onChange={val => setAttributes({ link: val })} />
						<small>{__('If you want to link the player, enter the link here. Otherwise, leave as blank.', 'b-blocks')}</small>

						<BControlPro className='mt20' label={__('Open link in a new tab', 'b-blocks')} checked={isLinkInNewTab} onChange={val => setAttributes({ isLinkInNewTab: val })} {...premiumProps} Component={ToggleControl} />
					</PanelBody>


					<PanelBody title={__('Interactivity', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Interactivity:', 'b-blocks')} value={interactivity} onChange={val => setAttributes({
							interactivity: val,
							interactivityMode: ['syncWithScroll', 'scrollRelativeToContainer', 'scrollWithOffset', 'playAnimationWhenVisible'].includes(val) ? 'scroll' : (['syncAnimationWithCursorPosition', 'syncAnimationWithCursorHorizontalMovement', 'playAnimationOnClick', 'toggleAnimation'].includes(val) ? 'cursor' : ''),
							interactivityContainer: 'scrollRelativeToContainer' === val ? '.wp-block-lpb-lottie-player' : interactivityContainer,
							interactivityActions: actionsOnInteractivityChange(val, fileFrameSize)
						})} options={interactivities} {...premiumProps} Component={SelectControl} />

						<small>{__('Upload file first then change interactivity option.', 'b-blocks')}</small>
						<br />
						<small>{__('Interactivity will not working in backend(editor).', 'b-blocks')}</small>

						{'scrollRelativeToContainer' === interactivity && <>
							<Label>{__('Container Selector', 'b-blocks')}</Label>
							<TextControl value={interactivityContainer} onChange={val => setAttributes({ interactivityContainer: val })} />

							<small>{__(`Enter container selector. Ex: if id enter '#id', if class '.class' or if tag 'tag name'`, 'b-blocks')}</small>
						</>}

						{'scrollWithOffset' === interactivity && <>
							<NumberControl className='mt20' label={__('Offset (%)', 'b-blocks')} labelPosition='left' value={interactivityActions?.[0]?.visibility?.[1] * 100} onChange={val => setAttributes({
								interactivityActions: produce(interactivityActions, draft => {
									draft[0]['visibility'][1] = parseFloat(val) / 100;
									draft[1]['visibility'][0] = parseFloat(val) / 100;
								})
							})} />

							<small>{__(`Scroll animation when lottie player reached at ${interactivityActions?.[0]?.visibility?.[1] * 100} % of viewport`, 'b-blocks')}</small>
						</>}

						{'playAnimationWhenVisible' === interactivity && <>
							<NumberControl className='mt20' label={__('Offset (%)', 'b-blocks')} labelPosition='left' value={interactivityActions?.[0]?.visibility?.[0] * 100} onChange={val => updateInteractivityAction(0, 'visibility', parseFloat(val) / 100, 0)} />

							<small>{__(`Play animation when lottie player reached at ${interactivityActions?.[0]?.visibility?.[0] * 100} % of viewport`, 'b-blocks')}</small>
						</>}
					</PanelBody>


					<PanelBody title={__('Caption', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} {...premiumProps} Component={ToggleControl} />

						{isCap && <BControlPro className='mt20' label={__('Text:', 'b-blocks')} value={caption} onChange={val => setAttributes({ caption: val })} {...premiumProps} Component={TextControl} />}
					</PanelBody>
				</>}


				{'style' == tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Player', 'b-blocks')}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<ColorControl label={__('Background Color:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaultColor='#0000' />
					</PanelBody>


					{isControls && <PanelBody title={__('Controls', 'b-blocks')}{...panelBodyIF}>
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={controlsHeight} onChange={val => setAttributes({ controlsHeight: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<ColorControl label={__('Background Color:', 'b-blocks')} value={controlsBG} onChange={val => setAttributes({ controlsBG: val })} defaultColor='#0000' />

						<ColorControl label={__('Icons Color:', 'b-blocks')} value={controlsIconColor} onChange={val => setAttributes({ controlsIconColor: val })} defaultColor='#4527a4' />

						<ColorControl label={__('Icons Hover Color:', 'b-blocks')} value={controlsIconHoverColor} onChange={val => setAttributes({ controlsIconHoverColor: val })} defaultColor='#8344c5' />

						<ColorControl label={__('Icons Active Color:', 'b-blocks')} value={controlsIconActiveColor} onChange={val => setAttributes({ controlsIconActiveColor: val })} defaultColor='#8344c5' />

						<ColorControl label={__('Track Color:', 'b-blocks')} value={controlsTrackColor} onChange={val => setAttributes({ controlsTrackColor: val })} defaultColor='#8344c5' />

						<ColorControl label={__('Thumb Color:', 'b-blocks')} value={controlsThumbColor} onChange={val => setAttributes({ controlsThumbColor: val })} defaultColor='#4527a4' />
					</PanelBody>}


					{isCap && <PanelBody title={__('Caption', 'b-blocks')} {...panelBodyIF}>
						<BControlPro label={__('Text Align:', 'b-blocks')} value={capAlign} onChange={val => setAttributes({ capAlign: val })} options={aligns} isIcon={true} size={isPremium ? 'medium' : 'small'} {...premiumProps} Component={BtnGroup} />

						<BControlPro label={__('Typography:', 'b-blocks')} value={capTypo} onChange={val => setAttributes({ capTypo: val })} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} {...premiumProps} Component={Typography} />

						<BControlPro label={__('Colors:', 'b-blocks')} value={capColors} onChange={val => setAttributes({ capColors: val })} {...premiumProps} Component={ColorsControl} />

						<BControlPro className='mt20' label={__('Padding:', 'b-blocks')} value={capPadding} onChange={val => setAttributes({ capPadding: val })} defaults={{ vertical: '10px', horizontal: '10px' }} {...premiumProps} Component={SpaceControl} />

						<BControlPro className='mt20' label={__('Margin:', 'b-blocks')} value={capMargin} onChange={val => setAttributes({ capMargin: val })} defaults={{ side: 4, top: '5px' }} {...premiumProps} Component={SpaceControl} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Lottie Player'>
			<li>&emsp;<strong>{__('Upload File ', 'b-blocks')}</strong>{__('Upload Lottie JSON files from the media library.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Hover ', 'b-blocks')}</strong>{__('Play the Lottie animation on mouseover.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Mode ', 'b-blocks')}</strong>{__('Choose between normal and bounce modes.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Direction ', 'b-blocks')}</strong>{__('Set the animation direction to forward or backward.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Count ', 'b-blocks')}</strong>{__('Specify how many times the animation will play.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Speed ', 'b-blocks')}</strong>{__('Adjust the player speed.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Interval ', 'b-blocks')}</strong>{__('Set the autoplay interval.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Link Tab ', 'b-blocks')}</strong>{__('Option to open the link in a new tab.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Interactivity ', 'b-blocks')}</strong>{__('Define interactivity options to determine when and where the animation will play.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Caption ', 'b-blocks')}</strong>{__('Add a caption for the Lottie player.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Caption Style ', 'b-blocks')}</strong>{__('Style the caption, including text alignment, typography, text and background colors, padding, and margin.', 'b-blocks')}</li>
		</ProModal>


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