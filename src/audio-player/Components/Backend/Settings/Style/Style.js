import Player from './Player';
import Colors from './Colors';
import AllButtons from './AllButtons';
import PlayBtn from './PlayBtn';
import SkipBtn from './SkipBtn';
import RestartBtn from './RestartBtn';
import RepeatBtn from './RepeatBtn';
import StopBtn from './StopBtn';
import SpeedBtn from './SpeedBtn';
import Volume from './Volume';
import Download from './Download';
import SeekBar from './SeekBar';
import Title from './Title';
import Artist from './Artist';
import Timecode from './Timecode';
import PlaylistItems from './PlaylistItems';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, behavior = {}, player = {}, colors = {}, title = {}, artist = {}, timecode = {}, buttonStyle = {}, playBtnStyle = {}, skipBtnStyle = {}, restartBtnStyle = {}, repeatBtnStyle = {}, stopBtnStyle = {}, speedBtnStyle = {}, volumeStyle = {}, downloadStyle = {}, seekStyle = {}, playlistStyle = {} } = attributes;

	// Show a control's Style panel only when that control is enabled in the
	// General → Controls panel.
	const on = {
		skip: behavior.showSkip !== false,
		restart: !!behavior.showRestart,
		stop: !!behavior.showStop,
		repeat: !!behavior.showRepeat,
		speed: !!behavior.showSpeed,
		volume: behavior.showVolume !== false,
		download: behavior.showDownload !== false,
		seek: behavior.showSeek !== false,
		timecode: behavior.showTimecode !== false || !!behavior.showRemaining,
		playlist: layout.style === 'playlist',
	};

	return (
		<>
			{/* 1. PLAYER CONTAINER */}
			<Player player={player} updateObj={updateObj} device={device} />

			{/* 2. COLOR PALETTE */}
			<Colors colors={colors} updateObj={updateObj} />

			{/* 3. GLOBAL BUTTONS */}
			<AllButtons buttonStyle={buttonStyle} updateObj={updateObj} device={device} />

			{/* 4. INDIVIDUAL CONTROLS — each panel shows only if its control is enabled */}
			<PlayBtn playBtnStyle={playBtnStyle} updateObj={updateObj} device={device} />
			{on.skip && <SkipBtn skipBtnStyle={skipBtnStyle} updateObj={updateObj} device={device} />}
			{on.restart && <RestartBtn restartBtnStyle={restartBtnStyle} updateObj={updateObj} device={device} />}
			{on.repeat && <RepeatBtn repeatBtnStyle={repeatBtnStyle} updateObj={updateObj} device={device} />}
			{on.stop && <StopBtn stopBtnStyle={stopBtnStyle} updateObj={updateObj} device={device} />}
			{on.speed && <SpeedBtn speedBtnStyle={speedBtnStyle} updateObj={updateObj} device={device} />}
			{on.volume && <Volume volumeStyle={volumeStyle} updateObj={updateObj} device={device} />}
			{on.download && <Download downloadStyle={downloadStyle} updateObj={updateObj} device={device} />}

			{/* 5. SEEK BAR / PROGRESS */}
			{on.seek && <SeekBar seekStyle={seekStyle} updateObj={updateObj} device={device} />}

			{/* 6. TRACK TITLE */}
			<Title title={title} updateObj={updateObj} device={device} />

			{/* 7. ARTIST */}
			<Artist artist={artist} updateObj={updateObj} device={device} />

			{/* 8. TIMECODE */}
			{on.timecode && <Timecode timecode={timecode} updateObj={updateObj} device={device} />}

			{/* 9. PLAYLIST ITEMS */}
			{on.playlist && <PlaylistItems playlistStyle={playlistStyle} updateObj={updateObj} device={device} />}
		</>
	);
};

export default Style;
