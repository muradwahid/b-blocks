import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { tabBreakpoint, mobileBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const at = (obj, d) => {
	if (typeof obj === 'string') return obj;
	return obj?.[d] || (d === 'mobile' ? (obj?.tablet || obj?.desktop) : obj?.desktop);
};

const Style = ({ attributes, id, isBackend = false }) => {
	const {
		layout = {},
		player = {},
		colors = {},
		title = {},
		artist = {},
		timecode = {},
		buttonStyle = {},
		playBtnStyle = {},
		skipBtnStyle = {},
		restartBtnStyle = {},
		repeatBtnStyle = {},
		stopBtnStyle = {},
		speedBtnStyle = {},
		volumeStyle = {},
		downloadStyle = {},
		seekStyle = {},
		playlistStyle = {},
		advanced,
	} = attributes;

	const control = colors.control;
	const accent = colors.accent;
	const bgColor = player.bg?.color;
	const trackC = colors.track;
	const trackActive = colors.trackActive;

	const mainSl = `#${id} .b-blocks-audio-player`;
	const playerSl = `${mainSl} .b-blocks-audio-player-player`;
	const titleSl = `${mainSl} .b-blocks-audio-player-title`;
	const artistSl = `${mainSl} .b-blocks-audio-player-artist`;
	const timeSl = `${mainSl} .b-blocks-audio-player-time, ${mainSl} .b-blocks-audio-player-current, ${mainSl} .b-blocks-audio-player-duration`;

	// Selectors for individual buttons
	const allBtnSl = `${mainSl} .b-blocks-audio-player-playpause, ${mainSl} .b-blocks-audio-player-skip, ${mainSl} .b-blocks-audio-player-restart, ${mainSl} .b-blocks-audio-player-repeat, ${mainSl} .b-blocks-audio-player-stop, ${mainSl} .b-blocks-audio-player-speed`;
	const playSl = `${mainSl} .b-blocks-audio-player-playpause`;
	const skipSl = `${mainSl} .b-blocks-audio-player-skip`;
	const restartSl = `${mainSl} .b-blocks-audio-player-restart`;
	const repeatSl = `${mainSl} .b-blocks-audio-player-repeat`;
	const stopSl = `${mainSl} .b-blocks-audio-player-stop`;
	const speedSl = `${mainSl} .b-blocks-audio-player-speed`;
	const volumeSl = `${mainSl} input[type='range'].b-blocks-audio-player-volume`;
	const downloadSl = `${mainSl} .b-blocks-audio-player-download`;

	const seekWrapSl = `${mainSl} .b-blocks-audio-player-seek-wrap`;
	const seekSl = `${mainSl} input[type='range'].b-blocks-audio-player-seek`;
	const listRowSl = `${mainSl} .b-blocks-audio-player-list-item`;
	const listActiveSl = `${mainSl} .b-blocks-audio-player-list-item.is-active`;

	const box = (prop, obj, d) => isValidCSS(prop, getBoxCSS(obj?.[d]));

	// Append a pseudo to EVERY selector in a comma list (a bare `${list}:hover`
	// only attaches the pseudo to the last selector).
	const withPseudo = (selector, pseudo) => selector.split(',').map((s) => `${s.trim()}${pseudo}`).join(', ');

	const renderBtnCSS = (selector, styleObj) => `
		${selector}{
			${isValidCSS('color', styleObj?.color)}
			${getBackgroundCSS(styleObj?.bg)}
			${getBorderCSS(styleObj?.border)}
		}
		${withPseudo(selector, ':hover')}{
			${isValidCSS('color', styleObj?.hoverColor)}
			${getBackgroundCSS(styleObj?.hoverBg)}
		}
	`;

	const renderBtnBoxCSS = (selector, styleObj, d) => {
		const size = at(styleObj?.iconSize, d);
		return `
			${selector}{
				${box('margin', styleObj?.margin, d)}
				${box('padding', styleObj?.padding, d)}
				${box('border-radius', styleObj?.borderRadius, d)}
			}
			${(size ? `${withPseudo(selector, ' svg')}{ ${isValidCSS('width', size)} ${isValidCSS('height', size)} }` : '')}
		`;
	};

	const boxCSS = (d) => `
		${playerSl}{
			${isValidCSS('max-width', at(layout.maxWidth, d))}
			${box('margin', player.margin, d)}
			${box('padding', player.padding, d)}
			${box('border-radius', player.borderRadius, d)}
		}
		${renderBtnBoxCSS(allBtnSl, buttonStyle, d)}
		${renderBtnBoxCSS(playSl, playBtnStyle, d)}
		${renderBtnBoxCSS(skipSl, skipBtnStyle, d)}
		${renderBtnBoxCSS(restartSl, restartBtnStyle, d)}
		${renderBtnBoxCSS(repeatSl, repeatBtnStyle, d)}
		${renderBtnBoxCSS(stopSl, stopBtnStyle, d)}
		${renderBtnBoxCSS(speedSl, speedBtnStyle, d)}
		${renderBtnBoxCSS(volumeSl, volumeStyle, d)}
		${renderBtnBoxCSS(downloadSl, downloadStyle, d)}
		${seekWrapSl}{
			${box('margin', seekStyle.margin, d)}
		}
		${seekSl}::-webkit-slider-runnable-track{
			${isValidCSS('height', at(seekStyle.trackSize, d))}
			${box('border-radius', seekStyle.borderRadius, d)}
		}
		${seekSl}::-moz-range-track{
			${isValidCSS('height', at(seekStyle.trackSize, d))}
			${box('border-radius', seekStyle.borderRadius, d)}
		}
		${titleSl}{
			${box('margin', title.margin, d)}
			${box('padding', title.padding, d)}
			${box('border-radius', title.borderRadius, d)}
		}
		${artistSl}{
			${box('margin', artist.margin, d)}
			${box('padding', artist.padding, d)}
			${box('border-radius', artist.borderRadius, d)}
		}
		${listRowSl}{
			${box('padding', playlistStyle.itemPadding, d)}
			${box('border-radius', playlistStyle.borderRadius, d)}
		}
	`;

	const activeAccent = seekStyle.fillColor || accent;
	const seekBg = seekStyle.trackColor;
	const sTrack = seekStyle.trackColor || 'rgba(127, 127, 127, 0.3)';
	const vFill = volumeStyle.fillColor || accent;
	const vTrack = volumeStyle.trackColor || 'rgba(127, 127, 127, 0.3)';

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', title.typo).googleFontLink}
			${getTypoCSS('', artist.typo).googleFontLink}
			${getTypoCSS('', timecode.typo).googleFontLink}

			${playerSl}{
				${isValidCSS('color',control)}
				${getBackgroundCSS(player.bg)}
				${getBorderCSS(player.border)}
			}

			${allBtnSl}{
				${isValidCSS('color',control)}
			}

			${playSl}{
				${isValidCSS('background', accent)}
				${isValidCSS('color', bgColor)}
			}

			${repeatSl}.is-active{
				${isValidCSS('color', accent)}
			}

			${renderBtnCSS(allBtnSl, buttonStyle)}
			${renderBtnCSS(playSl, playBtnStyle)}
			${renderBtnCSS(skipSl, skipBtnStyle)}
			${renderBtnCSS(restartSl, restartBtnStyle)}
			${renderBtnCSS(repeatSl, repeatBtnStyle)}
			${renderBtnCSS(stopSl, stopBtnStyle)}
			${renderBtnCSS(speedSl, speedBtnStyle)}
			${renderBtnCSS(volumeSl, volumeStyle)}
			${renderBtnCSS(downloadSl, downloadStyle)}

			${seekSl}::-webkit-slider-runnable-track{ background: linear-gradient(to right, ${activeAccent} 0%, ${activeAccent} var(--b-blocks-audio-player-var-progress, 0%), ${sTrack} var(--b-blocks-audio-player-var-progress, 0%), ${sTrack} 100%); }
			${seekSl}::-moz-range-track{ background: ${sTrack}; }
			${seekSl}::-moz-range-progress{ background: ${activeAccent}; }
			${seekSl}::-webkit-slider-thumb {
				${isValidCSS('border-color', activeAccent)}
				${isValidCSS('background', control)}
			}
			${seekSl}::-moz-range-thumb {
				${isValidCSS('border-color', activeAccent)}
				${isValidCSS('background', control)}
			}

			${volumeSl}::-webkit-slider-runnable-track{ background: linear-gradient(to right, ${vFill} 0%, ${vFill} var(--b-blocks-audio-player-var-progress, 0%), ${vTrack} var(--b-blocks-audio-player-var-progress, 0%), ${vTrack} 100%); }
			${volumeSl}::-moz-range-track{ background: ${vTrack}; }
			${volumeSl}::-moz-range-progress{ background: ${vFill}; }
			${volumeSl}::-webkit-slider-thumb{ border-color: ${vFill}; }
			${volumeSl}::-moz-range-thumb{ border-color: ${vFill}; }

			${mainSl} .b-blocks-audio-player-bar {
				${isValidCSS('background', seekBg || 'rgba(127, 127, 127, 0.35)')}
			}

			${mainSl} .b-blocks-audio-player-bar.is-played {
				background: ${activeAccent};
			}

			${mainSl} .b-blocks-audio-player-vinyl-disc {
				${isValidCSS('border-color', accent)}
			}

			${mainSl} .b-blocks-audio-player-vinyl-center {
				${isValidCSS('background', accent)}
			}

			${titleSl}{
				${isValidCSS('color', title.color || control)}
				${getBackgroundCSS(title.bg)}
				${getBorderCSS(title.border)}
			}
			${getTypoCSS(titleSl, title.typo).styles}
			${artistSl}{
				${isValidCSS('color', artist.color || control)}
				${getBackgroundCSS(artist.bg)}
				${getBorderCSS(artist.border)}
			}
			${getTypoCSS(artistSl, artist.typo).styles}
			${timeSl}{ ${isValidCSS('color', timecode.color || control)} }
			${getTypoCSS(timeSl, timecode.typo).styles}

			${listRowSl}{
				${isValidCSS('color', playlistStyle.color || control)}
				${getBackgroundCSS(playlistStyle.bg) || `background:${trackC};`}
				${getBorderCSS(playlistStyle.border)}
			}

			${listActiveSl}{
				${isValidCSS('color', playlistStyle.activeColor)}
				${getBackgroundCSS(playlistStyle.activeBg) || `background:${trackActive};`}
			}

			${boxCSS('desktop')}
			${tabBreakpoint}{ ${boxCSS('tablet')} }
			${mobileBreakpoint}{ ${boxCSS('mobile')} }
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
