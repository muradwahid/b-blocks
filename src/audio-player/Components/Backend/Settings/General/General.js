import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, ToggleControl, RangeControl, Notice, Flex, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Label, Device, ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { UNITS } from '../../../../utils/options';
import { playerStyleOptions, alignmentOptions } from '../../../../utils/data';
import TrackItemSettings from './TrackItemSettings';

const emptyTrack = { url: '', id: 0, title: '', artist: '', art: { url: '', id: 0 } };

const General = ({ attributes, updateObj, setAttributes, device = 'desktop', activeIndex, setActiveIndex }) => {
	const { behavior = {}, layout = {} } = attributes;
	const { autoPlay, loop, showDownload, showTimecode, showVolume, showSkip, skipSeconds = 10, showRestart, showStop, showRepeat, showSpeed, showRemaining, showSeek } = behavior;

	const isMulti = layout.style === 'playlist' || layout.style === 'coverflow';

	const maxWidth = layout.maxWidth || {};
	const setMaxWidth = (val) => {
		const base = (maxWidth && typeof maxWidth === 'object') ? maxWidth : {};
		setAttributes({ layout: { ...layout, maxWidth: { ...base, [device]: val } } });
	};

	return <>
		{/* <PanelBody className='bPlPanelBody' title={__('Audio', 'b-blocks')} initialOpen={true}>
			<Label className=''>{__('Audio File:', 'b-blocks')}</Label>
			<InlineMediaUpload
				value={url}
				types={['audio']}
				onChange={(val) => setAttributes({ audio: { ...audio, url: val || '', id: 0 } })}
				placeholder={__('Audio file URL', 'b-blocks')}
			/>

			<TextControl className='mt10' label={__('Track Title', 'b-blocks')} value={trackTitle || ''} onChange={(val) => updateObj('audio', val, 'trackTitle')} placeholder={__('Episode title or leave empty', 'b-blocks')} __nextHasNoMarginBottom />
			<TextControl className='mt10' label={__('Artist / Speaker', 'b-blocks')} value={artistName || ''} onChange={(val) => updateObj('audio', val, 'artistName')} placeholder={__('Author or speaker name', 'b-blocks')} __nextHasNoMarginBottom />

			<Label className='mt10'>{__('Album Art:', 'b-blocks')}</Label>
			<InlineMediaUpload
				value={albumArt?.url}
				types={['image']}
				onChange={(val) => updateObj('audio', { url: val || '', id: 0 }, 'albumArt')}
				placeholder={__('Album art image URL', 'b-blocks')}
			/>
		</PanelBody> */}

		<PanelBody className='bPlPanelBody' title={__('Tracks (playlist / coverflow)', 'b-blocks')} initialOpen={false}>
			{!isMulti && (
				<Notice status='info' isDismissible={false}>
					{__('The track list is used by the Playlist and Coverflow themes. Other themes play the single Audio file above.', 'b-blocks')}
				</Notice>
			)}

			<ItemsPanel
				attributes={attributes}
				setAttributes={setAttributes}
				arrKey='tracks'
				newItem={emptyTrack}
				itemLabel='Track'
				title='title'
				design='sortable'
				minItem={0}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				ItemSettings={TrackItemSettings}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
			<PanelRow>
				<Label className=''>{__('Theme:', 'b-blocks')}</Label>
				<SelectControl value={layout.style || 'bar'} options={playerStyleOptions} onChange={(val) => updateObj('layout', val, 'style')} __nextHasNoMarginBottom />
			</PanelRow>
			<PanelRow>
				<Label className=''>{__('Alignment:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout.alignment} onChange={(val) => updateObj('layout', val, 'alignment')}>
					{alignmentOptions.map((o) => <ToggleGroupControlOptionIcon key={o.value} label={o.label} value={o.value} icon={`editor-align${o.value}`} />)}
				</ToggleGroupControl>
			</PanelRow>
			<Flex className='mt10'>
				<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Max Width', 'b-blocks')} <Device /></Flex></Label>
				<UnitControl className='flex1' value={maxWidth?.[device]} units={UNITS} onChange={setMaxWidth} __next40pxDefaultSize />
			</Flex>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Controls', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Skip / Prev-Next', 'b-blocks')} checked={showSkip !== false} onChange={(val) => updateObj('behavior', !!val, 'showSkip')} />
			{showSkip !== false && (
				<RangeControl label={__('Skip seconds', 'b-blocks')} value={skipSeconds} onChange={(val) => updateObj('behavior', val, 'skipSeconds')} min={5} max={60} step={5} __nextHasNoMarginBottom />
			)}
			<ToggleControl className='mt10' label={__('Restart', 'b-blocks')} checked={!!showRestart} onChange={(val) => updateObj('behavior', !!val, 'showRestart')} />
			<ToggleControl className='mt10' label={__('Stop', 'b-blocks')} checked={!!showStop} onChange={(val) => updateObj('behavior', !!val, 'showStop')} />
			<ToggleControl className='mt10' label={__('Repeat', 'b-blocks')} checked={!!showRepeat} onChange={(val) => updateObj('behavior', !!val, 'showRepeat')} />
			<ToggleControl className='mt10' label={__('Playback Speed', 'b-blocks')} checked={!!showSpeed} onChange={(val) => updateObj('behavior', !!val, 'showSpeed')} />
			<ToggleControl className='mt10' label={__('Seek Bar / Progress', 'b-blocks')} checked={showSeek !== false} onChange={(val) => updateObj('behavior', !!val, 'showSeek')} />
			<ToggleControl className='mt10' label={__('Timecode', 'b-blocks')} checked={showTimecode !== false} onChange={(val) => updateObj('behavior', !!val, 'showTimecode')} />
			<ToggleControl className='mt10' label={__('Remaining Time', 'b-blocks')} checked={!!showRemaining} onChange={(val) => updateObj('behavior', !!val, 'showRemaining')} />
			<ToggleControl className='mt10' label={__('Volume Slider', 'b-blocks')} checked={showVolume !== false} onChange={(val) => updateObj('behavior', !!val, 'showVolume')} />
			<ToggleControl className='mt10' label={__('Download Link', 'b-blocks')} checked={showDownload !== false} onChange={(val) => updateObj('behavior', !!val, 'showDownload')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Autoplay', 'b-blocks')} checked={!!autoPlay} onChange={(val) => updateObj('behavior', !!val, 'autoPlay')} />
			{autoPlay && (
				<Notice status='warning' isDismissible={false}>
					{__('Most browsers block autoplay with sound; the player starts muted. The visitor must interact to hear audio.', 'b-blocks')}
				</Notice>
			)}
			<ToggleControl className='mt20' label={__('Loop', 'b-blocks')} checked={!!loop} onChange={(val) => updateObj('behavior', !!val, 'loop')} />
		</PanelBody>
	</>;
};
export default General;