import Plyr from 'plyr-react';

const Player = ({ popup }) => {
	const { type = 'video', content = '' } = popup;

	return <Plyr source={{
		type, sources: [
			{
				src: content,
				provider: content.includes('youtube') ? 'youtube' : content.includes('vimeo') ? 'vimeo' : 'html5'
			}
		]
	}}
		// options={{
		// 	autoplay: true
		// }} // Add an options for autoplay muted also notify button-block
	/>
};
export default Player;