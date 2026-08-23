import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { Dashicon } from '@wordpress/components';
import { InnerBlocks, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { useSelect, withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Settings from './Settings/Settings';
import Styles from '../Common/Styles';

const ALLOWED_CONTENT_BLOCKS = undefined;

const buildControlsList = (v = {}) => {
	const list = [];
	if (!v.allowDownload) list.push('nodownload');
	if (v.allowFullscreen === false) list.push('nofullscreen');
	if (v.allowPip === false) list.push('noremoteplayback');
	return list.length ? list.join(' ') : undefined;
};

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;
	const { media } = attributes;

	const hasInnerBlocks = useSelect((select) => select('core/block-editor').getBlocks(clientId).length > 0, [clientId]);

	const updateObj = updateAttributes(attributes, setAttributes);

	const videoRef = useRef(null);
	const isVideo = media?.mediaType === 'video';
	const hasMediaUrl = isVideo ? !!media?.video?.url : !!media?.image?.url;

	useEffect(() => {
		if (isVideo && videoRef.current) {
			const v = videoRef.current;
			v.muted = media?.video?.muted !== false;
			if (media?.video?.autoplay) {
				v.play().catch(() => {});
			} else {
				v.pause();
			}

			const stopCapture = (e) => {
				e.stopPropagation();
			};

			v.addEventListener('pointerdown', stopCapture, true);
			v.addEventListener('mousedown', stopCapture, true);
			v.addEventListener('touchstart', stopCapture, true);

			return () => {
				v.removeEventListener('pointerdown', stopCapture, true);
				v.removeEventListener('mousedown', stopCapture, true);
				v.removeEventListener('touchstart', stopCapture, true);
			};
		}
	}, [isVideo, media?.video?.url, media?.video?.autoplay, media?.video?.muted]);

	return (
		<>
			<Settings {...{ setAttributes, attributes, updateObj, device }} />

			<div {...useBlockProps()}>
				<Styles attributes={attributes} id={`block-${clientId}`} isBackend={true} />
				<div>
					<div className={`b-blocks-media-text-section-wrapper`} >
						<div className={`b-blocks-media-text-section-media ${media?.video?.controlsOnHover ? 'has-controls-on-hover' : ''}`}>
							{hasMediaUrl ? (
								media?.mediaType === 'video' ? (
									<video
										ref={videoRef}
										className='b-blocks-media-text-section-media-el'
										src={media?.video?.url}
										poster={media?.video?.poster?.url || ''}
										autoPlay={!!media?.video?.autoplay}
										loop={media?.video?.loop !== false}
										muted={media?.video?.muted !== false}
										controls={media?.video?.controls !== false}
										controlsList={buildControlsList(media?.video)}
										disablePictureInPicture={media?.video?.allowPip === false}
										playsInline
										onMouseDown={(e) => e.stopPropagation()}
										onPointerDown={(e) => e.stopPropagation()}
										onClick={(e) => e.stopPropagation()}
										onTouchStart={(e) => e.stopPropagation()}
									/>
								) : (
									<img className='b-blocks-media-text-section-media-el' src={media?.image?.url} alt={media?.image?.alt || ''} />
								)
							) : (
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(val) => {
											if (isVideo) {
												updateObj('media', { ...media?.video, id: val.id, url: val.url }, 'video');
											} else {
												updateObj('media', { ...media?.image, id: val.id, url: val.url, alt: val.alt || '' }, 'image');
											}
										}}
										allowedTypes={isVideo ? ['video'] : ['image']}
										value={isVideo ? media?.video?.id : media?.image?.id}
										render={({ open }) => (
											<div className='b-blocks-media-text-section-media-el--placeholder' onClick={open}>
												<Dashicon icon={isVideo ? 'format-video' : 'format-image'} style={{ fontSize: 36, width: 36, height: 36, marginBottom: 8 }} />
												<div><strong>{isVideo ? __('Select or Upload Video', 'b-blocks') : __('Select or Upload Image', 'b-blocks')}</strong></div>
												<span style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{__('Click to open Media Library', 'b-blocks')}</span>
											</div>
										)}
									/>
								</MediaUploadCheck>
							)}
						</div>

						<div className={`b-blocks-media-text-section-content`}>
							<InnerBlocks
								allowedBlocks={ALLOWED_CONTENT_BLOCKS}
								template={[
									['core/heading', { level: 2, placeholder: __('Section heading…', 'b-blocks') }],
									['core/paragraph', { placeholder: __('Add your content here…', 'b-blocks') }],
								]}
								templateLock={false}
								renderAppender={hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Edit);


{/* <div className={`bb-mts-inner${isReverse ? ' is-reverse' : ''}${stickyMedia ? ' has-sticky' : ''}`} >
	<div className='bb-mts-media' style={{ flexBasis: `${leftPct}%` }}>
		{mediaUrl ? (
			mediaType === 'video' ? (
				<video
					className='bb-mts-media-el'
					src={mediaUrl}
					poster={mediaPosterUrl || undefined}
					muted
					loop
					playsInline
				/>
			) : (
				<img
					className='bb-mts-media-el'
					src={mediaUrl}
					alt={mediaAlt || ''}
				/>
			)
		) : (
			<div className='bb-mts-placeholder'>
				<span>{__('Select an image or video in the Media panel.', 'b-blocks')}</span>
			</div>
		)}
		{!!mediaOverlayColor && mediaOverlayOpacity > 0 && (
			<span className='bb-mts-overlay' aria-hidden='true' />
		)}
	</div>

	<div className='bb-mts-content'>
		<InnerBlocks
			allowedBlocks={ALLOWED_CONTENT_BLOCKS}
			template={[
				['core/heading', { level: 2, placeholder: __('Section heading…', 'b-blocks') }],
				['core/paragraph', { placeholder: __('Add your content here…', 'b-blocks') }],
			]}
			templateLock={false}
			renderAppender={
				hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender
			}
		/>
	</div>
</div> */}