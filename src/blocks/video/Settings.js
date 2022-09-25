import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import { InlineMediaUpload } from '../../../../Components/MediaControl';

import options from '../../utils/options';
const { pxUnit, perUnit, emUnit } = options;

const Settings = ({ attributes, setAttributes }) => {
	const { source, poster, controls, width, radius, repeat, autoplay, muted, resetOnEnd, autoHideControl } = attributes;
	const { restart, rewind, play, progress, duration, mute, volume, pip, airplay, settings, download, fullscreen } = controls;

	const updateControls = (type, val) => {
		const newControls = { ...controls };
		newControls[type] = val;

		setAttributes({ controls: newControls });
	}

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={[
			{ name: 'settings', title: __('Settings', 'b-blocks') },
			{ name: 'controls', title: __('Controls', 'b-blocks') },
			{ name: 'style', title: __('Style', 'b-blocks') }
		]}>{tab => <>
			{'settings' === tab.name && <>
				<Title mt='0' mb='0' />
				<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
					{/* <div className='helpItem'>
						<a href='https://bblockswp.com/docs/video-player-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
					</div> */}

					<div className='helpItem rateUs'>
						<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
							<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
							<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
						</a>
					</div>
				</PanelBody>


				<PanelBody className='bPlPanelBody' title={__('Settings', 'b-blocks')}>
					<InlineMediaUpload value={source} types={['video']} onChange={val => setAttributes({ source: val })} placeholder={__('Video url', 'b-blocks')} />

					<InlineMediaUpload value={poster} types={['image']} onChange={val => setAttributes({ poster: val })} placeholder={__('Poster url', 'b-blocks')} />

					<ToggleControl className='mt20' label={__('Repeat', 'b-blocks')} checked={repeat} onChange={val => setAttributes({ repeat: val })} />

					<ToggleControl className='mt20' label={__('Autoplay', 'b-blocks')} checked={autoplay} onChange={val => setAttributes({ autoplay: val })} />

					<ToggleControl className='mt20' label={__('Muted', 'b-blocks')} checked={muted} onChange={val => setAttributes({ muted: val })} />

					<ToggleControl className='mt20' label={__('Reset On End', 'b-blocks')} checked={resetOnEnd} onChange={val => setAttributes({ resetOnEnd: val })} />

					<ToggleControl className='mt20' label={__('Auto Hide Control', 'b-blocks')} checked={autoHideControl} onChange={val => setAttributes({ autoHideControl: val })} />
				</PanelBody>
			</>}


			{'controls' === tab.name && <PanelBody className='bPlPanelBody'>
				<ToggleControl label={__('Play Large', 'b-blocks')} checked={controls['play-large']} onChange={val => updateControls('play-large', val)} />

				<ToggleControl className='mt20' label={__('Restart', 'b-blocks')} checked={restart} onChange={val => updateControls('restart', val)} />

				<ToggleControl className='mt20' label={__('Rewind', 'b-blocks')} checked={rewind} onChange={val => updateControls('rewind', val)} />

				<ToggleControl className='mt20' label={__('Play', 'b-blocks')} checked={play} onChange={val => updateControls('play', val)} />

				<ToggleControl className='mt20' label={__('Fast Forward', 'b-blocks')} checked={controls['fast-forward']} onChange={val => updateControls('fast-forward', val)} />

				<ToggleControl className='mt20' label={__('Progress', 'b-blocks')} checked={progress} onChange={val => updateControls('progress', val)} />

				<ToggleControl className='mt20' label={__('Current Time', 'b-blocks')} checked={controls['current-time']} onChange={val => updateControls('current-time', val)} />

				<ToggleControl className='mt20' label={__('Duration', 'b-blocks')} checked={duration} onChange={val => updateControls('duration', val)} />

				<ToggleControl className='mt20' label={__('Mute', 'b-blocks')} checked={mute} onChange={val => updateControls('mute', val)} />

				<ToggleControl className='mt20' label={__('Volume', 'b-blocks')} checked={volume} onChange={val => updateControls('volume', val)} />

				<ToggleControl className='mt20' label={__('PIP', 'b-blocks')} checked={pip} onChange={val => updateControls('pip', val)} />

				<ToggleControl className='mt20' label={__('Airplay', 'b-blocks')} checked={airplay} onChange={val => updateControls('airplay', val)} />

				<ToggleControl className='mt20' label={__('Settings', 'b-blocks')} checked={settings} onChange={val => updateControls('settings', val)} />

				<ToggleControl className='mt20' label={__('Download', 'b-blocks')} checked={download} onChange={val => updateControls('download', val)} />

				<ToggleControl className='mt20' label={__('Fullscreen', 'b-blocks')} checked={fullscreen} onChange={val => updateControls('fullscreen', val)} />
			</PanelBody>}


			{'style' === tab.name && <PanelBody className='bPlPanelBody'>
				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, emUnit, perUnit]} />

				<UnitControl className='mt20' label={__('Round Corner:', 'b-blocks')} labelPosition='left' value={radius} onChange={val => setAttributes({ radius: val })} units={[pxUnit]} />
			</PanelBody>}
		</>}</TabPanel>
	</InspectorControls>;
};
export default Settings;