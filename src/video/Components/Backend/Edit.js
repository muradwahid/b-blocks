import { useBlockProps } from '@wordpress/block-editor';

import { MediaPlaceholder } from '../../../../../bpl-tools/Components';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
// import Video from '../Common/Video';
import VideoBackend from './VideoBackend';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { source } = attributes;

	const VideoEl = () => <VideoBackend attributes={attributes} />

	return source ? <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<VideoEl />
		</div>
	</> : <MediaPlaceholder type='video' icon={<svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' className='html5-block-icon' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<polygon points='23 7 16 12 23 17 23 7'></polygon>
		<rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect>
	</svg>} onChange={val => setAttributes({ source: val.url })} />;
};
export default Edit;