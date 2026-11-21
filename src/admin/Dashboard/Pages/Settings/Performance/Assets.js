import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

const Assets = ({ assets, set, status }) => {
	return (
		<div className='bBlocksPerformance__rows'>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Enable asset file generation', 'b-blocks')}
				help={__('bBlocks blocks print their CSS inside the page. This writes it to one file per post (uploads/b-blocks/css/) and loads that instead, so browsers can cache it between visits. The file is rebuilt when the post is saved; if it cannot be written, the CSS simply stays in the page. Search results and archive pages keep their CSS in the page (a file for each search term would fill the disk).', 'b-blocks')}
				checked={assets.assetFiles}
				onChange={(v) => set('assets', 'assetFiles', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Inline critical CSS', 'b-blocks')}
				help={__('Print the stylesheets of the blocks on the first screen straight into the page, so it can render without waiting for them. Worked out on the server from the order of blocks on the page — no external service.', 'b-blocks')}
				checked={assets.criticalCss}
				onChange={(v) => set('assets', 'criticalCss', v)}
			/>
			{assets.criticalCss && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-criticalBlocks' className='bBlocksPerformance__label'>{__('Blocks counted as first screen', 'b-blocks')}</label>
						<p className='bBlocksPerformance__help'>{__('How many different block types, from the top of the page, count as the first screen (header blocks included).', 'b-blocks')}</p>
					</div>
					<div className='bBlocksPerformance__rowControl isSmall'>
						<NumberControl id='bBlocksPerformance-criticalBlocks' __next40pxDefaultSize min={1} max={50} value={assets.criticalBlocks} onChange={(v) => set('assets', 'criticalBlocks', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Load large page CSS asynchronously', 'b-blocks')}
				help={__('Large block stylesheets (of any plugin, not only bBlocks) below the first screen load without holding up the page. Theme, global and other non-block stylesheets are never changed.', 'b-blocks')}
				checked={assets.asyncCss}
				onChange={(v) => set('assets', 'asyncCss', v)}
			/>
			{assets.asyncCss && !assets.criticalCss && (<div className='bBlocksPerformance__notice'>
				{__('Without "Inline critical CSS" every large block stylesheet loads late — including blocks on the first screen, which can then flash unstyled for a moment. Turn on "Inline critical CSS" too.', 'b-blocks')}
			</div>)}
			{assets.asyncCss && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-asyncCssMin' className='bBlocksPerformance__label'>{__('Minimum size (bytes)', 'b-blocks')}</label>
						<p className='bBlocksPerformance__help'>{__('Only block stylesheets at least this big load asynchronously; smaller ones are not worth the extra repaint.', 'b-blocks')}</p>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<NumberControl id='bBlocksPerformance-asyncCssMin' __next40pxDefaultSize min={1024} value={assets.asyncCssMin} onChange={(v) => set('assets', 'asyncCssMin', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Combine & inline block CSS', 'b-blocks')}
				help={__('Print the stylesheets of the blocks used on a page straight into the page, up to the budget below, so they need no extra request. Nothing is merged into a new file.', 'b-blocks')}
				checked={assets.combineCss}
				onChange={(v) => set('assets', 'combineCss', v)}
			/>
			{assets.combineCss && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-inlineThreshold' className='bBlocksPerformance__label'>{__('Inline threshold (bytes)', 'b-blocks')}</label>
						<p className='bBlocksPerformance__help'>{__('Total inline budget for block CSS on a page. WordPress itself inlines up to 40000 bytes (20000 before WordPress 6.9), so set a higher value to inline more. Block stylesheets are printed inline, smallest first, until the budget is used up; the rest load as files.', 'b-blocks')}</p>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<NumberControl id='bBlocksPerformance-inlineThreshold' __next40pxDefaultSize min={0} value={assets.inlineThreshold} onChange={(v) => set('assets', 'inlineThreshold', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Load block CSS only on pages that use the block', 'b-blocks')}
				help={__('Skip the stylesheet of every block that is not on the current page, instead of loading all of them everywhere. Block themes on current WordPress already do this, so there it changes nothing.', 'b-blocks')}
				checked={assets.cssPerBlock}
				onChange={(v) => set('assets', 'cssPerBlock', v)}
			/>
			{assets.cssPerBlock && false === status?.blockTheme && (<div className='bBlocksPerformance__notice'>
				{__('Inactive: your theme is a classic theme. There the page content is printed after the <head>, so block stylesheets would arrive late and the page would flash unstyled. WordPress 6.9 and newer already load only the block CSS a page uses in classic themes, so nothing is lost.', 'b-blocks')}
			</div>)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Defer non-critical scripts', 'b-blocks')}
				help={__('Add defer to front-end scripts so they download in parallel and run after the page is parsed, instead of blocking the first paint.', 'b-blocks')}
				checked={assets.deferScripts}
				onChange={(v) => set('assets', 'deferScripts', v)}
			/>
			{(assets.deferScripts || assets.delayJs) && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-deferExclude' className='bBlocksPerformance__label'>{__('Exclude scripts', 'b-blocks')}</label>
						<p className='bBlocksPerformance__help'>{__('Comma-separated script handles to leave as they are — neither deferred nor delayed (an inline snippet is excluded through the handle it is attached to).', 'b-blocks')}</p>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<TextControl id='bBlocksPerformance-deferExclude' __nextHasNoMarginBottom __next40pxDefaultSize placeholder={__('e.g. jquery-core, my-script', 'b-blocks')} value={assets.deferExclude} onChange={(v) => set('assets', 'deferExclude', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Delay JavaScript until user interaction', 'b-blocks')}
				help={__('Hold back the scripts of other plugins and the theme until the visitor scrolls, taps or moves the mouse, or the time below has passed. bBlocks block scripts (and what they need) always run at once, so blocks show and work right away; so do those under "Exclude scripts". A click or tap made before the delayed scripts have run is replayed once they have.', 'b-blocks')}
				checked={assets.delayJs}
				onChange={(v) => set('assets', 'delayJs', v)}
			/>
			{assets.delayJs && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-delayTimeout' className='bBlocksPerformance__label'>{__('Timeout (seconds)', 'b-blocks')}</label>
						<p className='bBlocksPerformance__help'>{__('Run the delayed scripts anyway after this long, even with no interaction.', 'b-blocks')}</p>
					</div>
					<div className='bBlocksPerformance__rowControl isSmall'>
						<NumberControl id='bBlocksPerformance-delayTimeout' __next40pxDefaultSize min={1} max={30} value={assets.delayTimeout} onChange={(v) => set('assets', 'delayTimeout', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Minify inline CSS & JS', 'b-blocks')}
				help={__('Strip comments and whitespace from every inline <style> on the page, and indentation and blank lines from inline scripts.', 'b-blocks')}
				checked={assets.minifyInline}
				onChange={(v) => set('assets', 'minifyInline', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Remove query strings from static assets', 'b-blocks')}
				help={__('Drop the ?ver= suffix from CSS and JS URLs. Only helps with some older proxies and CDNs; leave off if yours caches versioned files already.', 'b-blocks')}
				checked={assets.removeQuery}
				onChange={(v) => set('assets', 'removeQuery', v)}
			/>

			<div className='bBlocksPerformance__row'>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-preconnect' className='bBlocksPerformance__label'>{__('Preconnect / DNS-prefetch domains', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('Comma-separated third-party domains the page loads from, so the browser opens the connection early. Font hosts (fonts.gstatic.com, use.typekit.net) get the crossorigin flag font files need; entries that are not a domain are skipped.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-preconnect' __nextHasNoMarginBottom __next40pxDefaultSize placeholder={__('e.g. https://cdn.example.com', 'b-blocks')} value={assets.preconnect} onChange={(v) => set('assets', 'preconnect', v)} />
				</div>
			</div>
		</div>
	);
};

export default Assets;