import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },

    contentAlign: { type: 'string', default: 'center' },

    file: { type: 'string', default: 'https://assets4.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json' },
    isControls: { type: 'boolean', default: true },
    isAutoplay: { type: 'boolean', default: true },
    isLoop: { type: 'boolean', default: true },
    isHover: { type: 'boolean', default: false },
    mode: { type: 'string', default: 'normal' },
    count: { type: 'number', default: 0 },
    speed: { type: 'number', default: 1 },
    direction: { type: 'number', default: 1 },
    intermission: { type: 'number', default: 0 },

    width: { type: 'string', default: '450px' },
    bgColor: { type: 'string', default: '#0000' },

    controlsHeight: { type: 'string', default: '35px' },
    controlsBGColor: { type: 'string', default: '#0000' },
    controlsIconColor: { type: 'string', default: '#4527a4' },
    controlsIconHoverColor: { type: 'string', default: '#8344c5' },
    controlsIconActiveColor: { type: 'string', default: '#8344c5' },
    controlsTrackColor: { type: 'string', default: '#8344c5' },
    controlsThumbColor: { type: 'string', default: '#4527a4' }
}

registerBlockType('b-blocks/lottie-player', {
    // Build In attributes
    title: __('Lottie Player', 'b-blocks'),
    description: __('Lottie player for display lottie files', 'b-blocks'),
    icon: icons.lottie,
    category: 'bBlocks',
    keywords: [__('lottie player', 'b-blocks'), __('json player', 'b-blocks'), __('lottie animation', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { cId, contentAlign, file, isControls, isAutoplay, isLoop, isHover, mode, count, speed, direction, intermission, width, bgColor, controlsHeight, controlsBGColor, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor } = props.attributes;

        return <div id={`bBlocksLottiePlayer-${cId}`} className={`text-${contentAlign}`} data-controls={`{"isControls": ${JSON.stringify(isControls)}, "isAutoplay": ${isAutoplay}, "isLoop": ${isLoop}, "isHover": ${isHover}}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksLottiePlayer-${cId} lottie-player{
                    width: ${width};
                    --lottie-player-toolbar-height: ${controlsHeight};
                    --lottie-player-toolbar-background-color: ${controlsBGColor};
                    --lottie-player-toolbar-icon-color: ${controlsIconColor};
                    --lottie-player-toolbar-icon-hover-color: ${controlsIconHoverColor};
                    --lottie-player-toolbar-icon-active-color: ${controlsIconActiveColor};
                    --lottie-player-seeker-track-color: ${controlsTrackColor};
                    --lottie-player-seeker-thumb-color: ${controlsThumbColor};
                }
            `}} />

            <lottie-player
                controls
                autoplay
                loop
                mode={mode}
                background={bgColor}
                count={count}
                speed={speed}
                direction={direction}
                intermission={intermission * 1000}
                src={file}
            >
            </lottie-player>
        </div>;
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});