import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { InlineMediaUpload, Label } from '../../../../../../../bpl-tools/Components';

const emptyTrack = { url: '', id: 0, title: '', artist: '', art: { url: '', id: 0 } };

const TrackItemSettings = ({ attributes, setAttributes, index }) => {
	const tracks = attributes?.tracks || [];
	const t = tracks[index] || emptyTrack;

	const setTrack = (patch) => {
		const next = [...tracks];
		next[index] = { ...emptyTrack, ...next[index], ...patch };
		setAttributes({ tracks: next });
	};

	return (
		<>
			<Label className=''>{__('Audio:', 'b-blocks')}</Label>
			<InlineMediaUpload
				value={t.url || ''}
				types={['audio']}
				onChange={(val) => setTrack({ url: val || '', id: 0 })}
				placeholder={__('Audio URL', 'b-blocks')}
			/>
			<TextControl
				className='mt10'
				label={__('Title', 'b-blocks')}
				value={t.title || ''}
				onChange={(val) => setTrack({ title: val })}
				__nextHasNoMarginBottom
			/>
			<TextControl
				className='mt10'
				label={__('Artist', 'b-blocks')}
				value={t.artist || ''}
				onChange={(val) => setTrack({ artist: val })}
				__nextHasNoMarginBottom
			/>
			<Label className='mt10'>{__('Album Art:', 'b-blocks')}</Label>
			<InlineMediaUpload
				value={t.art?.url || ''}
				types={['image']}
				onChange={(val) => setTrack({ art: { url: val || '', id: 0 } })}
				placeholder={__('Art URL', 'b-blocks')}
			/>
		</>
	);
};

export default TrackItemSettings;
