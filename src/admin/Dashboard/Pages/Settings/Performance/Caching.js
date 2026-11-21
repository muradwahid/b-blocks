import { __, sprintf } from '@wordpress/i18n';
import { Button, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

const Caching = ({ caching, set, stats, purging, onPurge, objectCache, status }) => {
	// The page-cache options do nothing while it is off, or while another page cache handles pages.
	const noPageCache = !caching.fullPage || !!status?.pageCacheConflict;

	return (
		<div className='bBlocksPerformance__rows'>
			<div className='bBlocksPerformance__status'>
				<span>
					{stats.pages} {__('pages cached', 'b-blocks')} · {stats.bytes} {__('on disk', 'b-blocks')} · {stats.sheets} {__('consolidated stylesheets', 'b-blocks')}
				</span>
				<Button className='bBlocksPerformance__purgeBtn' isBusy={purging} disabled={purging} onClick={onPurge}>
					{purging ? __('Purging…', 'b-blocks') : __('Purge Cache', 'b-blocks')}
				</Button>
			</div>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Full-page cache', 'b-blocks')}
				help={__('Save each rendered page to disk so repeat visitors are served a finished HTML file instead of re-running WordPress, block parsing and theme rendering. Logged-in visitors, carts, previews, searches and password-protected pages are never cached.', 'b-blocks')}
				checked={caching.fullPage}
				onChange={(v) => set('caching', 'fullPage', v)}
			/>
			{status?.pageCacheConflict && (<div className='bBlocksPerformance__notice'>
				{sprintf(
					/* translators: %s: name of the other caching plugin. */
					__('Inactive: %s is already caching pages on this site. Two page caches would serve each other\'s stale copies, so bBlocks leaves page caching to it. Moving inline CSS into files, the header and footer cache and template lookups are not affected by it.', 'b-blocks'),
					status.pageCacheConflict
				)}
			</div>)}

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-cacheWhich' className='bBlocksPerformance__label'>{__('Cache which pages', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('"Only pages built with bBlocks" caches posts and pages whose content uses at least one bBlocks block; everything else is served fresh.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<SelectControl
						id='bBlocksPerformance-cacheWhich'
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						disabled={noPageCache}
						value={caching.cacheWhich}
						options={[
							{ label: __('All public pages', 'b-blocks'), value: 'all' },
							{ label: __('Only pages built with bBlocks', 'b-blocks'), value: 'bblocks' },
						]}
						onChange={(v) => set('caching', 'cacheWhich', v)}
					/>
				</div>
			</div>

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-expireHours' className='bBlocksPerformance__label'>{__('Expire after (hours, 0 = never; pages with a security token are rebuilt every 10 hours)', 'b-blocks')}</label>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<NumberControl id='bBlocksPerformance-expireHours' __next40pxDefaultSize min={0} disabled={noPageCache} value={caching.expireHours} onChange={(v) => set('caching', 'expireHours', v)} />
				</div>
			</div>

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-allowedQuery' className='bBlocksPerformance__label'>{__('Allowed query parameters', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('Any URL carrying a parameter not listed here is served fresh and never cached. Leave empty unless a parameter genuinely changes the page — this is what stops ?utm_source… from overwriting the cached copy of a page.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-allowedQuery' __nextHasNoMarginBottom __next40pxDefaultSize disabled={noPageCache} placeholder={__('e.g. lang, currency', 'b-blocks')} value={caching.allowedQuery} onChange={(v) => set('caching', 'allowedQuery', v)} />
				</div>
			</div>

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-neverCache' className='bBlocksPerformance__label'>{__('Never cache these URLs', 'b-blocks')}</label>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-neverCache' __nextHasNoMarginBottom __next40pxDefaultSize disabled={noPageCache} placeholder={__('e.g. /account/*, /cart', 'b-blocks')} value={caching.neverCache} onChange={(v) => set('caching', 'neverCache', v)} />
				</div>
			</div>

			<div className={`bBlocksPerformance__row${noPageCache && !caching.headerFooter ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-neverCookies' className='bBlocksPerformance__label'>{__('Never cache when these cookies are set', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('A visitor who has one of these cookies (its name, or the start of it) always gets a fresh page and never fills the cache. Use it for a language, currency or cookie-consent plugin that changes the page through a cookie. Logged-in users and carts are already excluded.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-neverCookies' __nextHasNoMarginBottom __next40pxDefaultSize disabled={noPageCache && !caching.headerFooter} placeholder={__('e.g. pll_language, wmc_current_currency', 'b-blocks')} value={caching.neverCookies} onChange={(v) => set('caching', 'neverCookies', v)} />
				</div>
			</div>

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-alwaysPurge' className='bBlocksPerformance__label'>{__('Always purge these URLs', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('Cleared whenever any post or product is saved. A post\'s own page, the home page, its archives and its categories are cleared already — add pages that list posts some other way, such as a landing page with a "Latest posts" block. End with * to include everything under it.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-alwaysPurge' __nextHasNoMarginBottom __next40pxDefaultSize disabled={noPageCache} placeholder={__('e.g. /landing/, /news/*', 'b-blocks')} value={caching.alwaysPurge} onChange={(v) => set('caching', 'alwaysPurge', v)} />
				</div>
			</div>

			<ToggleControl
				__nextHasNoMarginBottom
				className={noPageCache ? 'isDisabled' : ''}
				disabled={noPageCache}
				label={__('Rebuild pages after saving', 'b-blocks')}
				help={__('After a page is edited, rebuild its cached copy in the background so the next visitor does not pay for the render.', 'b-blocks')}
				checked={caching.rebuildOnSave}
				onChange={(v) => set('caching', 'rebuildOnSave', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				className={noPageCache ? 'isDisabled' : ''}
				disabled={noPageCache}
				label={__('Store compressed copies', 'b-blocks')}
				help={__('Write a gzipped copy alongside each cached page and send it to browsers that accept gzip, so the page is not compressed again on every visit. Costs a little disk.', 'b-blocks')}
				checked={caching.compressed}
				onChange={(v) => set('caching', 'compressed', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				className={noPageCache ? 'isDisabled' : ''}
				disabled={noPageCache}
				label={__('Separate mobile cache', 'b-blocks')}
				help={__('Keep a second copy of every page for mobile visitors, for themes and blocks that send phones different HTML. It doubles the copies to build and store; a site whose pages differ only through responsive CSS can turn it off.', 'b-blocks')}
				checked={caching.separateMobile}
				onChange={(v) => set('caching', 'separateMobile', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				className={noPageCache ? 'isDisabled' : ''}
				disabled={noPageCache}
				label={__('Cache pages in the background', 'b-blocks')}
				help={__('Every hour, quietly build cached copies of pages nobody has visited yet, a few at a time. Without this a page is only cached once someone waits for it. Pages that can never be cached, like cart and account pages, are dropped after a few tries rather than retried forever.', 'b-blocks')}
				checked={caching.background}
				onChange={(v) => set('caching', 'background', v)}
			/>
			{caching.background && (
				<div className={`bBlocksPerformance__row bBlocksPerformance__child${noPageCache ? ' isDisabled' : ''}`}>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-pagesPerHour' className='bBlocksPerformance__label'>{__('Pages per hour', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<NumberControl id='bBlocksPerformance-pagesPerHour' __next40pxDefaultSize min={1} disabled={noPageCache} value={caching.pagesPerHour} onChange={(v) => set('caching', 'pagesPerHour', v)} />
					</div>
				</div>
			)}

			<div className={`bBlocksPerformance__row${noPageCache ? ' isDisabled' : ''}`}>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-preloadUrls' className='bBlocksPerformance__label'>{__('Also preload these URLs', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('Addresses of this site to cache first in every preload (the hourly one, "Preload all pages now" and WP-CLI), within the same "Pages per hour". Posts, pages and the busiest categories are preloaded already — add landing pages and the like. An address with a query parameter is cached only if that parameter is in "Allowed query parameters".', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<TextControl id='bBlocksPerformance-preloadUrls' __nextHasNoMarginBottom __next40pxDefaultSize disabled={noPageCache} placeholder={__('e.g. /landing/, /offers/', 'b-blocks')} value={caching.preloadUrls} onChange={(v) => set('caching', 'preloadUrls', v)} />
				</div>
			</div>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Move inline CSS into cached files', 'b-blocks')}
				help={__('Block themes print tens of kilobytes of CSS into every page, which the browser cannot reuse between pages. This moves it into files it can cache once and share across your whole site — measured at 110KB down to 69KB per page on Twenty Twenty-Four.', 'b-blocks')}
				checked={caching.inlineCssFiles}
				onChange={(v) => set('caching', 'inlineCssFiles', v)}
			/>
			{caching.inlineCssFiles && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-inlineBelow' className='bBlocksPerformance__label'>{__('Keep CSS inline below (bytes)', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<NumberControl id='bBlocksPerformance-inlineBelow' __next40pxDefaultSize min={0} value={caching.inlineBelow} onChange={(v) => set('caching', 'inlineBelow', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Cache header and footer', 'b-blocks')}
				help={__('Reuse the rendered header and footer instead of rebuilding them on every request. Unlike the page cache this also helps logged-in visitors and first-time views. Only logged-out output is shared.', 'b-blocks')}
				checked={caching.headerFooter}
				onChange={(v) => set('caching', 'headerFooter', v)}
			/>
			{false === status?.headerFooterSupported && (<div className='bBlocksPerformance__notice'>
				{__('Inactive: this needs WordPress 6.8 or newer. Older versions number layout classes per page, so a cached header would clash with the page around it. It will start working on its own after you update WordPress.', 'b-blocks')}
			</div>)}
			{caching.headerFooter && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-headerFooterExpire' className='bBlocksPerformance__label'>{__('Expire after (seconds)', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl'>
						<NumberControl id='bBlocksPerformance-headerFooterExpire' __next40pxDefaultSize min={60} value={caching.headerFooterExpire} onChange={(v) => set('caching', 'headerFooterExpire', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Cache template lookups', 'b-blocks')}
				help={__('Remember which block template each URL uses, instead of scanning the theme and querying the database every request.', 'b-blocks')}
				checked={caching.templateLookups}
				onChange={(v) => set('caching', 'templateLookups', v)}
			/>
			{!objectCache && (<div className='bBlocksPerformance__notice'>
				{__('Inactive: this needs a persistent object cache (Redis or Memcached), which this site does not have. Without one, storing the lookup costs more database queries than repeating it — we measured 81 queries per request cached against 75 uncached — so the setting stays off rather than making your site slower. It will start working on its own if an object cache is added.', 'b-blocks')}
			</div>)}
		</div>
	);
};

export default Caching;
