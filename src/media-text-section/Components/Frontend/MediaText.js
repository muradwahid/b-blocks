import { useEffect, useRef } from 'react';

const buildControlsList = (v = {}) => {
  const list = [];
  if (!v.allowDownload) list.push('nodownload');
  if (v.allowFullscreen === false) list.push('nofullscreen');
  if (v.allowPip === false) list.push('noremoteplayback');
  return list.length ? list.join(' ') : undefined;
};

const MediaText = (props) => {
  const { attributes, mediaTextHost } = props;
  const { media } = attributes;
  const wrapperRef = useRef(null);
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
    }
  }, [isVideo, media?.video?.url, media?.video?.autoplay, media?.video?.muted]);

  useEffect(() => {
    if (!wrapperRef.current || !mediaTextHost) return;

    if (mediaTextHost.dataset.moved === '1') {
      return;
    }

    const slideNodes = Array.from(mediaTextHost.children);
    wrapperRef.current.append(...slideNodes);
    mediaTextHost.dataset.moved = '1';
  }, [mediaTextHost]);

  return <>
    <div className={`b-blocks-media-text-section-wrapper`} >
      {hasMediaUrl && (
        <div className={`b-blocks-media-text-section-media ${media?.video?.controlsOnHover ? 'has-controls-on-hover' : ''}`}>
          {isVideo ? (
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
            />
          ) : (
            <img className='b-blocks-media-text-section-media-el' src={media?.image?.url} alt={media?.image?.alt || ''} />
          )}
        </div>
      )}

      <div className={`b-blocks-media-text-section-content`} ref={wrapperRef}>
      </div>
    </div>
  </>;
};

export default MediaText;