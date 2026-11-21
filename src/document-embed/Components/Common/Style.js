import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	const { align = '', toolbar = {}, dimensions = {}, container = {}, toolbarStyle = {}, downloadButton = {}, lightboxButton = {}, lightboxImage = {}, loader = {}, advanced } = attributes;

	const root = `#${id} .b-blocks-document-embed`;
	const toolbarSl = `${root} .b-blocks-document-embed-toolbar`;
	const downloadSl = `${root} .b-blocks-document-embed-download`;
	const lightboxBtnSl = `${root} .b-blocks-document-embed-lightbox-btn`;
	const lightboxImgSl = `${root} .b-blocks-document-embed-lightbox-img`;

	// Wide / Full alignment sizes the block itself; the viewer just fills it.
	const isAligned = 'wide' === align || 'full' === align;

	// Lightbox image alignment; none follows the reading direction (start of the line, RTL too).
	const imageMargins = { center: 'margin-left: auto; margin-right: auto;', right: 'margin-left: auto; margin-right: 0;', left: 'margin-left: 0; margin-right: auto;' };

	// An empty BorderBoxControl value would print "border: 0px solid #000" over the theme's border.
	const borderCSS = (border) => [border, border?.top, border?.right, border?.bottom, border?.left].some((side) => side?.width || side?.color) ? getBorderBoxCSS(border) : '';

	// Each device states its own value once any device hides the toolbar, so a hidden desktop
	// toolbar does not stay hidden on phones.
	const hasHiddenToolbar = ['desktop', 'tablet', 'mobile'].some((device) => toolbarStyle[device]?.hide);

	const deviceCSS = (device) => `
		${root}:not(.is-lightbox){
			${isAligned ? '' : isValidCSS('width', dimensions[device]?.width)}
			${dimensions.aspectRatio ? '' : isValidCSS('height', dimensions[device]?.height)}
		}
		${root}{
			${isValidCSS('padding', getBoxCSS(container[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(container[device]?.radius))}
		}
		${toolbarSl}{
			${isValidCSS('padding', getBoxCSS(toolbarStyle[device]?.padding))}
			${isValidCSS('min-height', toolbarStyle[device]?.height)}
			${hasHiddenToolbar ? `display: ${toolbarStyle[device]?.hide ? 'none' : 'flex'};` : ''}
		}
		${downloadSl}{
			${isValidCSS('padding', getBoxCSS(downloadButton[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(downloadButton.normal?.[device]?.radius))}
		}
		${downloadSl}:hover, ${downloadSl}:focus-visible{ ${isValidCSS('border-radius', getBoxCSS(downloadButton.hover?.[device]?.radius))} }
		${lightboxBtnSl}{
			${isValidCSS('padding', getBoxCSS(lightboxButton[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(lightboxButton.normal?.[device]?.radius))}
		}
		${lightboxBtnSl}:hover, ${lightboxBtnSl}:focus-visible{ ${isValidCSS('border-radius', getBoxCSS(lightboxButton.hover?.[device]?.radius))} }
		${lightboxImgSl}{
			${isValidCSS('width', lightboxImage[device]?.width)}
			${isValidCSS('height', lightboxImage[device]?.height)}
			${isValidCSS('border-radius', getBoxCSS(lightboxImage[device]?.radius))}
		}
	`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', toolbarStyle.typo)?.googleFontLink}
		${getTypoCSS('', downloadButton.typo)?.googleFontLink}
		${getTypoCSS('', lightboxButton.typo)?.googleFontLink}

		${dimensions.aspectRatio ? `${root}:not(.is-lightbox){ height: auto; ${isValidCSS('aspect-ratio', dimensions.aspectRatio)} }` : ''}

		${root}{
			${getBackgroundCSS(container.bg)}
			${borderCSS(container.border)}
			${isValidCSS('box-shadow', container.shadow?.length ? getMultiShadowCSS(container.shadow) : '')}
		}

		${'custom' === toolbar.theme ? `
			${toolbarSl}{ ${getBackgroundCSS(toolbar.bg, true, true, false)} ${isValidCSS('border-color', toolbar.bg?.color)} }
			${toolbarSl} .b-blocks-document-embed-name, ${toolbarSl} .b-blocks-document-embed-count{ ${isValidCSS('color', toolbar.color)} }
			${toolbarSl} .b-blocks-document-embed-download, ${toolbarSl} .b-blocks-document-embed-fullscreen{ ${isValidCSS('color', toolbar.color)} ${isValidCSS('border-color', toolbar.color)} }
		` : ''}
		${getTypoCSS(toolbarSl, toolbarStyle.typo)?.styles}

		${downloadSl}{
			${isValidCSS('color', downloadButton.normal?.color?.text)}
			${getBackgroundCSS(downloadButton.normal?.color?.bg, true, true, false)}
			${borderCSS(downloadButton.normal?.border)}
			${isValidCSS('transition', `all ${downloadButton.transition ?? 0.2}s ease`)}
		}
		${downloadSl}:hover, ${downloadSl}:focus-visible{
			${isValidCSS('color', downloadButton.hover?.color?.text)}
			${getBackgroundCSS(downloadButton.hover?.color?.bg, true, true, false)}
			${borderCSS(downloadButton.hover?.border)}
		}
		${getTypoCSS(downloadSl, downloadButton.typo)?.styles}

		${lightboxBtnSl}{
			${isValidCSS('color', lightboxButton.normal?.color?.text)}
			${getBackgroundCSS(lightboxButton.normal?.color?.bg, true, true, false)}
			${borderCSS(lightboxButton.normal?.border)}
			${isValidCSS('transition', `all ${lightboxButton.transition ?? 0.2}s ease`)}
		}
		${lightboxBtnSl}:hover, ${lightboxBtnSl}:focus-visible{
			${isValidCSS('color', lightboxButton.hover?.color?.text)}
			${getBackgroundCSS(lightboxButton.hover?.color?.bg, true, true, false)}
			${borderCSS(lightboxButton.hover?.border)}
		}
		${getTypoCSS(lightboxBtnSl, lightboxButton.typo)?.styles}

		${lightboxImgSl}{
			${isValidCSS('object-fit', lightboxImage.fit)}
			${imageMargins[lightboxImage.align] || 'margin-inline-start: 0; margin-inline-end: auto;'}
		}

		#${id} .b-blocks-document-embed-loader{
			${isValidCSS('border-color', loader.bg)}
			${isValidCSS('border-top-color', loader.color)}
		}

		${deviceCSS('desktop')}
		${tabBreakpoint}{ ${deviceCSS('tablet')} }
		${mobileBreakpoint}{ ${deviceCSS('mobile')} }

		${generateCSS(id, advanced, isBackend, false)}
		`.replace(/\s+/g, ' ')
	}} />;
};
export default Style;
