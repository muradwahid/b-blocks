import { useEffect, useRef } from 'react';

import { controlsHandler } from '../../utils/functions';
import { prefix } from '../../utils/data';

const VideoBackend = ({ attributes }) => {
    const { source, poster, controls, repeat, autoplay, muted, resetOnEnd, autoHideControl } = attributes;

    const videoEl = useRef(null);

    useEffect(() => {
        const assetsUrl = window?.bBlocksGlobal?.assetsUrl || '';

        const player = new Plyr(videoEl.current, {
            controls: controlsHandler(controls),
            clickToPlay: false,
            loop: { active: repeat },
            muted,
            autoplay,
            resetOnEnd,
            hideControls: autoHideControl,
            loadSprite: false,
            iconUrl: `${assetsUrl}plyr.svg`,
        });

        return () => player?.destroy();
    }, []);

    return <div className={prefix}>
        <div className='videoWrapper'>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <video controls playsinline data-poster={poster} preload='metadata' ref={videoEl}>
                Your browser does not support the video tag.
                <source src={source} type='video/mp4' />
            </video>
        </div>
    </div>
};

export default VideoBackend;
