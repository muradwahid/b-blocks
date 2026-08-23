import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS'


const Styles = ({ attributes, id, isBackend = false }) => {

    const { layout, styles, media, advanced } = attributes;

    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .b-blocks-media-text-section-wrapper`;
    const mediaPanelSl = `${blockSl} .b-blocks-media-text-section-media`;
    const contentSl = `${blockSl} .b-blocks-media-text-section-content`;
    const mediaSl = `${mediaPanelSl} .b-blocks-media-text-section-media-el`;

    return <style dangerouslySetInnerHTML={{
        __html: `
            ${blockSl}{
                ${isValidCSS('flex-direction', layout.desktop.direction)}
                ${isValidCSS('align-items', layout.desktop.alignItems)}
                ${isValidCSS('gap', styles.layout.desktop.gap)}
            }

            ${mediaPanelSl}{
                position:relative;
                ${isValidCSS('width', styles.layout.desktop.ratio.media)}
                ${isValidCSS('padding', getBoxCSS(styles.media.desktop.padding))}
                ${getBorderBoxCSS(styles.media.border)}
                ${isValidCSS('border-radius', getBoxCSS(styles.media.radius))}
                ${getBackgroundCSS(styles.media.bg)}
                ${isValidCSS('box-shadow', getMultiShadowCSS(styles.media.shadow))}
            }

            ${styles.media.overlay.isOverlay ? `${mediaPanelSl}::before{
                content:'';
                position:absolute;
                inset:0;
                pointer-events:none;
                z-index:2;
                ${getBackgroundCSS(styles.media.overlay.bg)}
                ${isValidCSS('opacity', styles.media.overlay.opacity)}
            }` : ''}

            ${contentSl}{
                ${isValidCSS('width', styles.layout.desktop.ratio.content)}
                ${isValidCSS('padding', getBoxCSS(styles.content.desktop.padding))}
                ${getBackgroundCSS(styles.content.bg)}
                ${getBorderBoxCSS(styles.content.border)}
                ${isValidCSS('border-radius', getBoxCSS(styles.content.desktop.radius))}
                ${isValidCSS('box-shadow', getMultiShadowCSS(styles.content.shadow))}
            }

            ${mediaSl}{
                position:relative;
                z-index:3;
                pointer-events:auto;
                ${isValidCSS('object-fit', media?.mediaType === 'image' ? styles.media.image?.objFit : styles.media.video?.objFit)}
            }

            ${mediaPanelSl}.has-controls-on-hover video::-webkit-media-controls-panel {
                opacity: 0;
                transition: opacity 0.25s ease-in-out;
            }
            ${mediaPanelSl}.has-controls-on-hover:hover video::-webkit-media-controls-panel,
            ${mediaPanelSl}.has-controls-on-hover:focus-within video::-webkit-media-controls-panel,
            ${mediaPanelSl}.has-controls-on-hover video:focus::-webkit-media-controls-panel,
            ${mediaPanelSl}.has-controls-on-hover video:active::-webkit-media-controls-panel {
                opacity: 1 !important;
            }

            ${tabBreakpoint}{
                ${blockSl}{
                    ${isValidCSS('flex-direction', layout.tablet.direction)}
                    ${isValidCSS('align-items', layout.tablet.alignItems)}
                    ${isValidCSS('gap', styles.layout.tablet.gap)}
                }

                ${mediaPanelSl}{
                    ${isValidCSS('width', styles.layout.tablet.ratio.media)}
                    ${isValidCSS('padding', getBoxCSS(styles.media.tablet.padding))}
                }

                ${contentSl}{
                    ${isValidCSS('width', styles.layout.tablet.ratio.content)}
                    ${isValidCSS('padding', getBoxCSS(styles.content.tablet.padding))}
                }
            }

            ${mobileBreakpoint}{
                ${blockSl}{
                    ${isValidCSS('flex-direction', layout.mobile.direction)}
                    ${isValidCSS('align-items', layout.mobile.alignItems)}
                    ${isValidCSS('gap', styles.layout.mobile.gap)}
                }

                ${mediaPanelSl}{
                    ${isValidCSS('width', styles.layout.mobile.ratio.media)}
                    ${isValidCSS('padding', getBoxCSS(styles.media.mobile.padding))}
                }

                ${contentSl}{
                    ${isValidCSS('width', styles.layout.mobile.ratio.content)}
                    ${isValidCSS('padding', getBoxCSS(styles.content.mobile.padding))}
                    ${isValidCSS('border-radius', getBoxCSS(styles.content.mobile.radius))}
                }
            }

            ${generateCSS(id, advanced, isBackend)}

        `}} />
};

export default Styles;