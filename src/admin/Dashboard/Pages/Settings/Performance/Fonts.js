import { __ } from '@wordpress/i18n';
import { ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

const Fonts = ({ fonts, set }) => {
	return (
		<div className='bBlocksPerformance__rows'>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Use font-display: swap', 'b-blocks')}
				help={__('Show text straight away in a fallback font while the web font loads, instead of leaving it invisible.', 'b-blocks')}
				checked={fonts.fontSwap}
				onChange={(v) => set('fonts', 'fontSwap', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Preload the fonts this page uses', 'b-blocks')}
				help={__('Tell the browser to fetch the fonts this page uses (theme fonts and fonts chosen in bBlocks blocks) early, so text does not jump when the font arrives.', 'b-blocks')}
				checked={fonts.preloadFonts}
				onChange={(v) => set('fonts', 'preloadFonts', v)}
			/>
			{fonts.preloadFonts && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-preloadMax' className='bBlocksPerformance__label'>{__('Max fonts to preload', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl isSmall'>
						<NumberControl id='bBlocksPerformance-preloadMax' __next40pxDefaultSize min={1} max={6} value={fonts.preloadMax} onChange={(v) => set('fonts', 'preloadMax', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				className={fonts.disableGoogle && !fonts.hostLocal ? 'isDisabled' : ''}
				disabled={fonts.disableGoogle && !fonts.hostLocal}
				label={__('Host Google Fonts locally', 'b-blocks')}
				help={__('Download the Google Fonts your blocks use and serve them from this site — faster, and no visitor data is sent to Google.', 'b-blocks')}
				checked={fonts.hostLocal}
				onChange={(v) => set('fonts', 'hostLocal', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				className={fonts.hostLocal && !fonts.disableGoogle ? 'isDisabled' : ''}
				disabled={fonts.hostLocal && !fonts.disableGoogle}
				label={__('Disable Google Fonts entirely', 'b-blocks')}
				help={__('Do not load any Google Fonts from bBlocks blocks; text falls back to the theme font.', 'b-blocks')}
				checked={fonts.disableGoogle}
				onChange={(v) => set('fonts', 'disableGoogle', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Only load font weights in use', 'b-blocks')}
				help={__('Request only the weights and styles that blocks on the page actually use, instead of every weight of the family.', 'b-blocks')}
				checked={fonts.usedWeights}
				onChange={(v) => set('fonts', 'usedWeights', v)}
			/>
		</div>
	);
};

export default Fonts;
