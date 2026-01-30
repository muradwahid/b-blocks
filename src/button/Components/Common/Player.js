import Plyr from 'plyr-react';

const Player = ({ popup }) => {
	const { type = 'video', content = '', videoOptions = { } } = popup;
	const { autoplay = false }= videoOptions || {};

	return <Plyr source={{
		type, sources: [
			{
				src: content,
				provider: content.includes('youtube') ? 'youtube' : content.includes('vimeo') ? 'vimeo' : 'html5'
			}
		]
	}}
		options={{
			autoplay
		}} // Add an options for autoplay muted also notify button-block
	/>
};
export default Player;