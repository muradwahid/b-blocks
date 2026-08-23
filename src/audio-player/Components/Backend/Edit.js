import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import AudioPlayer from '../Frontend/AudioPlayer';
import Settings from './Settings/Settings';

const AudioMark = () => (
	<svg viewBox='0 0 24 24' fill='none' aria-hidden='true' focusable='false'>
		<path d='M9 18V6l10-2v12' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
		<circle cx='6' cy='18' r='3' stroke='currentColor' strokeWidth='1.6' />
		<circle cx='16' cy='16' r='3' stroke='currentColor' strokeWidth='1.6' />
	</svg>
);

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { layout = {}, audio = {}, tracks = [] } = attributes;
	const [activeIndex, setActiveIndex] = useState(0);

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	const blockProps = useBlockProps({ id: `block-${clientId}` });

	// Playable when the single audio file OR any playlist/coverflow track has a URL.
	const hasAudio = !!(audio.url || tracks.some((t) => t?.url));

	return <>
		<Settings {...{ ...props, updateObj, isPremium, activeIndex, setActiveIndex }} />

		<BlockControls>
			<AlignmentToolbar value={layout.alignment} onChange={(val) => updateObj('layout', val, 'alignment')} />
		</BlockControls>

		<div {...blockProps}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

			{hasAudio
				? <AudioPlayer attributes={attributes} isBackend={true} />
				: (
					<div className='b-blocks-audio-player-placeholder'>
						<span className='b-blocks-audio-player-placeholder-icon' aria-hidden='true'><AudioMark /></span>
						<h4 className='b-blocks-audio-player-placeholder-title'>{__('Audio Player', 'b-blocks')}</h4>
						<p className='b-blocks-audio-player-placeholder-text'>{__('Upload an audio file or pick one from your media library.', 'b-blocks')}</p>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['audio']}
								value={audio.id}
								onSelect={(m) => setAttributes({ audio: { ...audio, url: m?.url || '', id: m?.id || 0, trackTitle: audio.trackTitle || m?.title || '' } })}
								render={({ open }) => (
									<Button variant='primary' icon='upload' onClick={open}>{__('Select Audio', 'b-blocks')}</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				)}
		</div>
	</>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	};
})(Edit);