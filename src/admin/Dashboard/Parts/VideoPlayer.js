import './VideoPlayer.scss'

const VideoPlayer = ({ src, width = '100%', height = 'auto' }) => {
	function getYouTubeEmbedSrc(youtubeUrl) {
		const regExpRegular = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=)([^#\\&\\?]*).*/;
		const regExpShort = /youtu.be\/([^#\\&\\?]+)/;

		let videoId = '';

		const match = youtubeUrl.match(regExpRegular);
		if (match && match[2].length === 11) {
			videoId = match[2];
		} else {
			const shortMatch = youtubeUrl.match(regExpShort);
			if (shortMatch && shortMatch[1].length === 11) {
				videoId = shortMatch[1];
			} else {
				return null;
			}
		}

		return `https://www.youtube.com/embed/${videoId}`;
	}

	return <div
		className="b-blocks-admin-VideoPlayer"
		style={{ width, height }}
	>
		<div className='b-blocks-admin-VideoPlayerYoutube'>
			<iframe src={getYouTubeEmbedSrc(src)}
				frameBorder="0"
				allowFullScreen
				style={{ width, height }}
				title="YouTube Video" />
		</div>
	</div>
}
export default VideoPlayer;