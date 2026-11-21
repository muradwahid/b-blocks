import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

const Images = ({ images, set }) => {
	return <div className='bBlocksPerformance__rows'>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Lazy-load images', 'b-blocks')}
				help={__('Add loading="lazy" and decoding="async" to images in bBlocks blocks that are printed in the page HTML (images a block draws later in the browser load as the block decides). The first images load at once; the first large one of them also gets high priority (small icons and SVG files are skipped), unless a larger image above it (a cover, a featured image) is the main image of the page.', 'b-blocks')}
				checked={images.lazyLoad}
				onChange={(v) => set('images', 'lazyLoad', v)}
		/>

			{images.lazyLoad && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-eagerCount' className='bBlocksPerformance__label'>{__('Eager (above-the-fold) images', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl isSmall'>
						<NumberControl id='bBlocksPerformance-eagerCount' __next40pxDefaultSize min={0} max={10} value={images.eagerCount} onChange={(v) => set('images', 'eagerCount', v)} />
					</div>
				</div>
			)}

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Set image dimensions (reduce layout shift)', 'b-blocks')}
				help={__('Add width and height to images in bBlocks blocks that are missing them, so the browser reserves space before they load, preventing Cumulative Layout Shift (CLS).', 'b-blocks')}
				checked={images.dimensions}
				onChange={(v) => set('images', 'dimensions', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Serve responsive images (srcset)', 'b-blocks')}
				help={__('Add a srcset/sizes to images in bBlocks blocks so browsers download a right-sized file for the screen instead of the full-size image. Big data saving on mobile.', 'b-blocks')}
				checked={images.srcset}
				onChange={(v) => set('images', 'srcset', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Preload the largest image (faster LCP)', 'b-blocks')}
				help={__('Preload the main image of the page when a bBlocks block shows it (the first large image that loads at once), so the browser starts fetching it sooner — best when that block is at the top of the page, where it is usually the largest image (Largest Contentful Paint). Lazy-loaded images, icons and SVG files are never preloaded.', 'b-blocks')}
				checked={images.preloadLcp}
				onChange={(v) => set('images', 'preloadLcp', v)}
			/>

			<h3 className='bBlocksPerformance__section'>{__('Compression', 'b-blocks')}</h3>

			<div className='bBlocksPerformance__row'>
				<div className='bBlocksPerformance__rowText'>
					<label htmlFor='bBlocksPerformance-compression' className='bBlocksPerformance__label'>{__('Compression strength', 'b-blocks')}</label>
					<p className='bBlocksPerformance__help'>{__('JPEG photos and every size made of them. PNG and GIF files keep their quality (WebP copies make PNG images smaller). Your original files are always kept beside the compressed copy. A new strength applies to images uploaded from then on. Measured on a 1.2 MB photo: 1x saved 25%, 2x saved 44%, 5x saved 63%.', 'b-blocks')}</p>
				</div>
				<div className='bBlocksPerformance__rowControl'>
					<SelectControl
						id='bBlocksPerformance-compression'
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={images.compression}
						options={[
							{ label: __('Off', 'b-blocks'), value: 'off' },
							{ label: __('1x — light', 'b-blocks'), value: '1' },
							{ label: __('2x — balanced (recommended)', 'b-blocks'), value: '2' },
							{ label: __('3x — strong', 'b-blocks'), value: '3' },
							{ label: __('5x — maximum', 'b-blocks'), value: '5' },
						]}
						onChange={(v) => set('images', 'compression', v)}
					/>
				</div>
			</div>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Also create WebP copies', 'b-blocks')}
				help={__('Save a modern WebP version beside each image, which is usually much smaller. The originals stay in place, so nothing that links to them breaks. A WebP is discarded if it would be bigger than the image it replaces. Pages show the WebP to browsers that announce WebP support (Chrome, Edge, older Firefox); with another page cache plugin active, pages keep the original images.', 'b-blocks')}
				checked={images.webp}
				onChange={(v) => set('images', 'webp', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				className={'off' === images.compression ? 'isDisabled' : ''}
				disabled={'off' === images.compression}
				label={__('Optimize new uploads automatically', 'b-blocks')}
				help={__('Compress each new JPEG upload at the strength above as it is added to the media library. Off: uploads keep their quality, and WebP copies are still made when that option is on.', 'b-blocks')}
				checked={images.optimizeUploads}
				onChange={(v) => set('images', 'optimizeUploads', v)}
			/>

			<h3 className='bBlocksPerformance__section'>{__('Upload standards', 'b-blocks')}</h3>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Require meaningful filenames', 'b-blocks')}
				help={__('Refuse images still named the way a camera or phone named them — IMG_4821.jpg, DSC00123.JPG, "Screenshot 2024-05-01 at 10.02.33.png". The upload is rejected with a message explaining what to rename it to. Filenames are read by search engines, and they are what everyone sees when hunting through the media library later.', 'b-blocks')}
				checked={images.requireFilenames}
				onChange={(v) => set('images', 'requireFilenames', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Require alt text before an image is used', 'b-blocks')}
				help={__('Images with no alt text cannot be inserted from the media library, and a post that still contains one is saved as a draft rather than published, with a list of what to fix. Decorative images marked role="presentation" or aria-hidden="true" are allowed without alt text.', 'b-blocks')}
				checked={images.requireAlt}
				onChange={(v) => set('images', 'requireAlt', v)}
			/>

			<p className='bBlocksPerformance__footnote'>{__('Alt text cannot be demanded while a file is uploading — WordPress only creates the field to type it into once the upload has finished. So this stops the image being used instead, which reaches the same result without throwing away a file someone just waited to upload.', 'b-blocks')}</p>

			<p className='bBlocksPerformance__footnote'>{__('Compression and WebP copies are made for new uploads only; images already in the media library keep their original files.', 'b-blocks')}</p>

		</div>
};

export default Images;