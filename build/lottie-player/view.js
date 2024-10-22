/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lottie-player/Components/Common/DotLottiePlayer.js":
/*!****************************************************************!*\
  !*** ./src/lottie-player/Components/Common/DotLottiePlayer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/functions */ "./src/lottie-player/utils/functions.js");



const DotLottiePlayer = ({
  attributes
}, ref) => {
  const {
    file,
    isControls,
    isAutoplay,
    isLoop,
    isHover,
    mode,
    direction = 1,
    count,
    speed,
    intermission,
    background
  } = attributes;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (ref?.current) {
      (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.toggleAttr)(ref?.current, isControls, 'controls', '');
      (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.toggleAttr)(ref?.current, isAutoplay, 'autoplay', '');
      (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.toggleAttr)(ref?.current, isLoop, 'loop', '');
      (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.toggleAttr)(ref?.current, isHover, 'hover', '');
    }
  }, [ref]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("dotlottie-player", {
    ref: ref,
    src: file,
    autoplay: true,
    loop: true,
    mode: mode,
    count: count,
    speed: speed,
    direction: direction,
    intermission: intermission * 1000,
    background: background,
    debug: true
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(DotLottiePlayer));

/***/ }),

/***/ "./src/lottie-player/Components/Common/Style.js":
/*!******************************************************!*\
  !*** ./src/lottie-player/Components/Common/Style.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../bpl-tools/utils/getCSS */ "../bpl-tools/utils/getCSS.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/lottie-player/utils/data.js");



const Style = ({
  attributes,
  id
}) => {
  const {
    playerAlign,
    link,
    width,
    controlsHeight,
    controlsBG,
    controlsIconColor,
    controlsIconHoverColor,
    controlsIconActiveColor,
    controlsTrackColor,
    controlsThumbColor,
    capAlign = 'center',
    capTypo = {},
    capColors = {
      color: '#333'
    },
    capPadding = {},
    capMargin = {}
  } = attributes;
  const lottiePlayerSl = `#${id} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', capTypo)?.googleFontLink}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${lottiePlayerSl} .caption`, capTypo)?.styles}

		${lottiePlayerSl}{
			text-align: ${playerAlign};
		}
		${lottiePlayerSl} dotlottie-player{
			width: ${width};
			cursor: ${link ? 'pointer' : 'auto'};
			--lottie-player-toolbar-height: ${controlsHeight};
			--lottie-player-toolbar-background-color: ${controlsBG};
			--lottie-player-toolbar-icon-color: ${controlsIconColor};
			--lottie-player-toolbar-icon-hover-color: ${controlsIconHoverColor};
			--lottie-player-toolbar-icon-active-color: ${controlsIconActiveColor};
			--lottie-player-seeker-track-color: ${controlsTrackColor};
			--lottie-player-seeker-thumb-color: ${controlsThumbColor};
		}
		${lottiePlayerSl} .caption{
			width: ${width};
			text-align: ${capAlign};
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getColorsCSS)(capColors)};
			padding: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(capPadding)};
			margin: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(capMargin)};
		}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/lottie-player/utils/data.js":
/*!*****************************************!*\
  !*** ./src/lottie-player/utils/data.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksLottiePlayer';

/***/ }),

/***/ "./src/lottie-player/utils/functions.js":
/*!**********************************************!*\
  !*** ./src/lottie-player/utils/functions.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionsOnInteractivityChange: () => (/* binding */ actionsOnInteractivityChange),
/* harmony export */   toggleAttr: () => (/* binding */ toggleAttr)
/* harmony export */ });
const toggleAttr = (selector, condition, attribute, value) => {
  condition && selector?.setAttribute(attribute, value);
  !condition && selector?.removeAttribute(attribute, value);
};
const actionsOnInteractivityChange = (val, fileFrameSize) => {
  const actions = {
    noInteractivity: [],
    syncWithScroll: [{
      visibility: [0, 1],
      type: 'seek',
      frames: [0, fileFrameSize]
    }],
    scrollRelativeToContainer: [{
      visibility: [0, 1],
      type: 'seek',
      frames: [0, fileFrameSize]
    }],
    scrollWithOffset: [{
      visibility: [0, 0.3],
      type: 'stop',
      frames: [0]
    }, {
      visibility: [0.3, 1.0],
      type: 'seek',
      frames: [0, fileFrameSize]
    }],
    syncAnimationWithCursorPosition: [{
      position: {
        x: [0, 1],
        y: [0, 1]
      },
      type: 'seek',
      frames: [0, fileFrameSize]
    }],
    syncAnimationWithCursorHorizontalMovement: [{
      position: {
        x: [0, 1],
        y: [-1, 2]
      },
      type: 'seek',
      frames: [0, fileFrameSize]
    }],
    playAnimationOnClick: [{
      type: 'click',
      forceFlag: false
    }],
    toggleAnimation: [{
      type: 'toggle'
    }],
    playAnimationWhenVisible: [{
      visibility: [0.50, 1.0],
      type: 'play'
    }]
  };
  return actions[val];
};

/***/ }),

/***/ "../bpl-tools/utils/data.js":
/*!**********************************!*\
  !*** ../bpl-tools/utils/data.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deskBreakpoint: () => (/* binding */ deskBreakpoint),
/* harmony export */   mobileBreakpoint: () => (/* binding */ mobileBreakpoint),
/* harmony export */   tabBreakpoint: () => (/* binding */ tabBreakpoint)
/* harmony export */ });
const deskBreakpoint = '@media only screen and (min-width: 1025px)';
const tabBreakpoint = '@media only screen and (min-width: 641px) and (max-width: 1024px)';
const mobileBreakpoint = '@media only screen and (max-width: 640px)';

/***/ }),

/***/ "../bpl-tools/utils/getCSS.js":
/*!************************************!*\
  !*** ../bpl-tools/utils/getCSS.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdvBGCSS: () => (/* binding */ getAdvBGCSS),
/* harmony export */   getBackgroundCSS: () => (/* binding */ getBackgroundCSS),
/* harmony export */   getBorderBoxCSS: () => (/* binding */ getBorderBoxCSS),
/* harmony export */   getBorderCSS: () => (/* binding */ getBorderCSS),
/* harmony export */   getBoxCSS: () => (/* binding */ getBoxCSS),
/* harmony export */   getColorsCSS: () => (/* binding */ getColorsCSS),
/* harmony export */   getGradientCSS: () => (/* binding */ getGradientCSS),
/* harmony export */   getIconCSS: () => (/* binding */ getIconCSS),
/* harmony export */   getMultiShadowCSS: () => (/* binding */ getMultiShadowCSS),
/* harmony export */   getOverlayCSS: () => (/* binding */ getOverlayCSS),
/* harmony export */   getPropertyBoxCSS: () => (/* binding */ getPropertyBoxCSS),
/* harmony export */   getSeparatorCSS: () => (/* binding */ getSeparatorCSS),
/* harmony export */   getShadowCSS: () => (/* binding */ getShadowCSS),
/* harmony export */   getSpaceCSS: () => (/* binding */ getSpaceCSS),
/* harmony export */   getTypoCSS: () => (/* binding */ getTypoCSS)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "../bpl-tools/utils/data.js");

const getBackgroundCSS = (bg, isSolid = true, isGradient = true, isImage = true) => {
  const {
    type = 'solid',
    color = '#000000b3',
    gradient = 'linear-gradient(135deg, #4527a4, #8344c5)',
    image = {},
    position = 'center center',
    attachment = 'initial',
    repeat = 'no-repeat',
    size = 'cover',
    overlayColor = '#000000b3'
  } = bg || {};
  const styles = 'gradient' === type && isGradient ? `background: ${gradient};` : 'image' === type && isImage ? `background: url(${image?.url});
				background-color: ${overlayColor};
				background-position: ${position};
				background-size: ${size};
				background-repeat: ${repeat};
				background-attachment: ${attachment};
				background-blend-mode: overlay;` : isSolid && `background: ${color};`;
  return styles;
}; // PHP version in Stepped Content

const getBorderCSS = border => {
  const {
    width = '0px',
    style = 'solid',
    color = '',
    side = 'all',
    radius = '0px'
  } = border || {};
  const borderSideCheck = s => {
    const bSide = side?.toLowerCase();
    return bSide?.includes('all') || bSide?.includes(s);
  };
  const noWidth = width === '0px' || !width;
  const borderCSS = `${width} ${style} ${color}`;
  const styles = `
		${noWidth ? '' : ['top', 'right', 'bottom', 'left'].map(side => borderSideCheck(side) ? `border-${side}: ${borderCSS};` : '').join('')}
		${!radius ? '' : `border-radius: ${radius};`}
	`;
  return styles;
};
const getBorderBoxCSS = border => {
  if (!border) return '';
  const generateBorderCSS = borderObj => {
    const {
      color = '#000000',
      style = 'solid',
      width = '0px'
    } = borderObj;
    return `${width} ${style} ${color}`;
  };
  if ('object' === typeof border && !Array.isArray(border)) {
    if (border.hasOwnProperty('top') || border.hasOwnProperty('right') || border.hasOwnProperty('bottom') || border.hasOwnProperty('left')) {
      const sides = ['top', 'right', 'bottom', 'left'];
      return sides.map(side => border[side] ? `border-${side}: ${generateBorderCSS(border[side])};` : '').join(' ').trim();
    } else {
      return `border: ${generateBorderCSS(border)};`;
    }
  }
  return '';
};
const getColorsCSS = colors => {
  const {
    color = '#333',
    bgType = 'solid',
    bg = '',
    gradient = 'linear-gradient(135deg, #4527a4, #8344c5)'
  } = colors || {};
  const styles = `
		${color ? `color: ${color};` : ''}
		${gradient || bg ? `background: ${'gradient' === bgType ? gradient : bg};` : ''}
	`;
  return styles;
};
const getIconCSS = (icon, isSize = true, isColor = true) => {
  const {
    fontSize = 16,
    colorType = 'solid',
    color = 'inherit',
    gradient = 'linear-gradient(135deg, #4527a4, #8344c5)'
  } = icon || {};
  const colorCSS = 'gradient' === colorType ? `color: transparent; background-image: ${gradient}; -webkit-background-clip: text; background-clip: text;` : `color: ${color};`;
  const styles = `
		${!fontSize || !isSize ? '' : `font-size: ${fontSize}px;`}
		${isColor ? colorCSS : ''}
	`;
  return styles;
};
const getMultiShadowCSS = (value, type = 'box') => {
  let styles = '';
  value?.map((item, index) => {
    const {
      hOffset = '0px',
      vOffset = '0px',
      blur = '0px',
      spreed = '0px',
      color = '#7090b0',
      isInset = false
    } = item || {};
    const inset = isInset ? 'inset' : '';
    const offsetBlur = `${hOffset} ${vOffset} ${blur}`;
    const isComa = index + 1 >= value.length ? '' : ', ';
    styles += 'text' === type ? `${offsetBlur} ${color}${isComa}` : `${offsetBlur} ${spreed} ${color} ${inset}${isComa}`;
  });
  return styles || 'none';
};
const getSeparatorCSS = separator => {
  const {
    width = '50%',
    height = '2px',
    style = 'solid',
    color = '#bbb'
  } = separator || {};
  const styles = `
		width: ${width};
		${'0px' === height && '0em' === height && '0rem' === height ? '' : `border-top: ${height} ${style} ${color};`}
	`;
  return styles;
};
const getShadowCSS = shadow => {
  const {
    type = 'box',
    hOffset = '0px',
    vOffset = '0px',
    blur = '0px',
    spreed = '0px',
    color = '#7090b0',
    isInset = false
  } = shadow || {};
  const inset = isInset ? 'inset' : '';
  const offsetBlur = `${hOffset} ${vOffset} ${blur}`;
  const styles = 'text' === type ? `${offsetBlur} ${color}` : `${offsetBlur} ${spreed} ${color} ${inset}`;
  return styles || 'none';
};
const getSpaceCSS = space => {
  const {
    side = 2,
    vertical = '0px',
    horizontal = '0px',
    top = '0px',
    right = '0px',
    bottom = '0px',
    left = '0px'
  } = space || {};
  const styles = 2 === side ? `${vertical} ${horizontal}` : `${top} ${right} ${bottom} ${left}`;
  return styles;
};
const getTypoCSS = (selector, typo, isFamily = true) => {
  const {
    fontFamily = 'Default',
    fontCategory = 'sans-serif',
    fontVariant = 400,
    fontWeight = 400,
    isUploadFont = true,
    fontSize = {
      desktop: 15,
      tablet: 15,
      mobile: 15
    },
    fontStyle = 'normal',
    textTransform = 'none',
    textDecoration = 'auto',
    lineHeight = '135%',
    letterSpace = '0px'
  } = typo || {};
  const generateCss = (value, cssProperty) => !value ? '' : `${cssProperty}: ${value};`;
  const isEmptyFamily = !isFamily || !fontFamily || 'Default' === fontFamily;
  const desktopFontSize = fontSize?.desktop || fontSize;
  const tabletFontSize = fontSize?.tablet || desktopFontSize;
  const mobileFontSize = fontSize?.mobile || tabletFontSize;
  const styles = `
		${isEmptyFamily ? '' : `font-family: '${fontFamily}', ${fontCategory};`}
		${generateCss(fontWeight, 'font-weight')}
		${`font-size: ${desktopFontSize}px;`}
		${generateCss(fontStyle, 'font-style')}
		${generateCss(textTransform, 'text-transform')}
		${generateCss(textDecoration, 'text-decoration')}
		${generateCss(lineHeight, 'line-height')}
		${generateCss(letterSpace, 'letter-spacing')}
	`;

  // Google font link
  const linkQuery = !fontVariant || 400 === fontVariant ? '' : '400i' === fontVariant ? ':ital@1' : fontVariant?.includes('00i') ? `: ital, wght@1, ${fontVariant?.replace('00i', '00')} ` : `: wght@${fontVariant} `;
  const link = isEmptyFamily ? '' : `https://fonts.googleapis.com/css2?family=${fontFamily?.split(' ').join('+')}${linkQuery.replace(/ /g, '')}&display=swap`;
  return {
    googleFontLink: !isUploadFont || isEmptyFamily ? '' : `@import url(${link});`,
    styles: `${selector}{
			${styles}
		}
		${_data__WEBPACK_IMPORTED_MODULE_0__.tabBreakpoint} {
			${selector}{
				${`font-size: ${tabletFontSize}px;`}
			}
		}
		${_data__WEBPACK_IMPORTED_MODULE_0__.mobileBreakpoint} {
			${selector}{
				${`font-size: ${mobileFontSize}px;`}
			}
		}`.replace(/\s+/g, ' ').trim()
  };
};
const getBoxCSS = val => {
  if (!val) return '0';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && !Array.isArray(val)) {
    const order = ['top', 'right', 'bottom', 'left'];
    return order.map(side => val[side] || '0').join(' ');
  }
  return '0';
};
const getPropertyBoxCSS = (property, value) => value ? `${property}: ${getBoxCSS(value)};` : '';

// Murad Wahid
const getGradientCSS = gradient => {
  const {
    type,
    radialType,
    colors,
    centerPositions,
    angel
  } = gradient || {};
  if (gradient) {
    const gradientColors = colors?.map(({
      color,
      position
    }) => `${color} ${position}%`);
    const liner = `linear-gradient(${angel}deg, ${gradientColors})`;
    const radial = `radial-gradient(${radialType} at ${centerPositions?.x}% ${centerPositions?.y}%,${gradientColors})`;
    return type === 'linear' ? `background: ${liner};` : `background: ${radial};`;
  }
  return '';
};
const getSolidBGCSS = bg => `${bg ? `background: ${bg};` : ''}`;
const getImagePosition = img => {
  const {
    position = 'center center',
    xPosition = 0,
    yPosition = 0,
    attachment = '',
    repeat = 'no-repeat',
    size = 'cover',
    customSize = '0px'
  } = img || {};
  return `
		background-position: ${'custom' === position ? `${xPosition} ${yPosition}` : position};
		background-attachment: ${attachment};
		background-repeat: ${repeat};
		background-size: ${'custom' === size ? `${customSize} auto` : size};
	`;
};
const getImageCSS = (img = {}) => {
  let desktop, tablet, mobile;
  if (Object.keys(img).length > 1) {
    if (img?.desktop) {
      desktop = getImagePosition(img?.desktop);
    }
    if (img?.tablet) {
      tablet = getImagePosition(img?.tablet);
    }
    if (img?.mobile) {
      mobile = getImagePosition(img?.mobile);
    }
  }
  if (img) {
    return {
      desktop: img.url ? `background-image: url(${img.url}); ${desktop}` : '',
      tablet: img.url ? tablet : '',
      mobile: img.url ? mobile : ''
    };
  }
  return '';
};
const getVideoCSS = (video, selector) => {
  const {
    url,
    loop
  } = video || {};
  const parentEl = document.querySelector(selector);
  const el = parentEl?.querySelector('.bPlVideo');
  const videoEl = document.createElement('video');
  videoEl.muted = true;
  videoEl.autoplay = true;
  videoEl.classList.add('bPlVideo');
  if (!el) {
    if (parentEl && url) {
      videoEl.innerHTML = `<source src=${url}></source>`;
      parentEl.appendChild(videoEl);
    }
  }
  videoEl.loop = loop;
  videoEl.play();
  return `${selector} .bPlVideo{
		left: 0;
		min-height: 100%;
		min-width: 100%;
		position: absolute;
		width: -webkit-fill-available;
		top: 0;
		z-index: 0;
	}`;
};
const getAdvBGCSS = (background, selector, isHover = false) => {
  const {
    type = 'color',
    color,
    gradient,
    img,
    video
  } = background || {};
  const bgCSS = type === 'color' ? getSolidBGCSS(color) : type === 'gradient' ? getGradientCSS(gradient) : type === 'image' ? getImageCSS(img).desktop : '';
  const tablet = type === 'image' ? getImageCSS(img).tablet : '';
  const mobile = type === 'image' ? getImageCSS(img).mobile : '';
  const sl = isHover ? `${selector}:hover` : selector;
  return `
		${type === 'video' ? getVideoCSS(video, selector) : ''}

		${sl}{
			${bgCSS}
		}

		${_data__WEBPACK_IMPORTED_MODULE_0__.tabBreakpoint} {
			${sl}{
				${tablet}
			}
		}
		${_data__WEBPACK_IMPORTED_MODULE_0__.mobileBreakpoint} {
			${sl}{
				${mobile}
			}
		}
	`.replace(/\s+/g, ' ').trim();
};
const getOverlayCSS = (overlay, selector, isHover = false) => {
  const {
    isEnabled,
    colors,
    opacity = 1,
    blend,
    filter = '',
    blur = 0,
    brightness = 100,
    contrast = 100,
    saturation = 100,
    hue = 0
  } = overlay || {};
  const filterCSSValue = `${100 !== brightness ? `brightness(${brightness}%)` : ''} ${100 !== contrast ? `contrast(${contrast}%)` : ''} ${100 !== saturation ? `saturate(${saturation}%)` : ''} ${0 !== blur ? `blur(${blur}px)` : ''} ${0 !== hue ? `hue-rotate(${hue}deg)` : ''}`;
  const filterCSS = `${filter}: ${filter ? filterCSSValue : ''}; -webkit-${filter}: ${filter ? filterCSSValue : ''};`;
  const blendCSS = blend ? `mix-blend-mode: ${blend};` : '';
  const sl = isHover ? `${selector}:hover::after` : `${selector}::after`;
  return isEnabled ? `
		${selector}::after{
			content: '';
			position: absolute;
			inset: 0;
		}
		${getAdvBGCSS(colors, sl, false)}
		${sl}{
			opacity: ${opacity};
			${blendCSS}
			${filterCSS}
		}
	`.replace(/\s+/g, ' ').trim() : '';
};

/***/ }),

/***/ "./src/lottie-player/style.scss":
/*!**************************************!*\
  !*** ./src/lottie-player/style.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "../plugin-slug/node_modules/react-dom/client.js":
/*!*******************************************************!*\
  !*** ../plugin-slug/node_modules/react-dom/client.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/lottie-player/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/lottie-player/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/lottie-player/Components/Common/Style.js");
/* harmony import */ var _Components_Common_DotLottiePlayer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/DotLottiePlayer */ "./src/lottie-player/Components/Common/DotLottiePlayer.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/functions */ "./src/lottie-player/utils/functions.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/data */ "./src/lottie-player/utils/data.js");








document.addEventListener('DOMContentLoaded', () => {
  const lottiePlayerEls = document.querySelectorAll('.wp-block-b-blocks-lottie-player');
  lottiePlayerEls.forEach(lottiePlayerEl => {
    const attributes = JSON.parse(lottiePlayerEl.dataset.attributes);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(lottiePlayerEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: lottiePlayerEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RenderLottiePlayer, {
      attributes: attributes,
      id: lottiePlayerEl.id
    })));
    lottiePlayerEl?.removeAttribute('data-attributes');
  });
});
const RenderLottiePlayer = ({
  attributes,
  id
}) => {
  const {
    isControls,
    isAutoplay,
    isLoop,
    isHover,
    link,
    isLinkInNewTab = false,
    interactivity = 'noInteractivity',
    interactivityMode = '',
    interactivityContainer = '.wp-block-b-blocks-lottie-player',
    interactivityActions = [],
    isCap = false,
    caption = ''
  } = attributes;
  const lottieEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const lottiePlayer = document.querySelector(`#${id} .${_utils_data__WEBPACK_IMPORTED_MODULE_6__.prefix} lottie-player`);
    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_5__.toggleAttr)(lottiePlayer, isControls, 'controls', '');
    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_5__.toggleAttr)(lottiePlayer, isAutoplay, 'autoplay', '');
    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_5__.toggleAttr)(lottiePlayer, isLoop, 'loop', '');
    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_5__.toggleAttr)(lottiePlayer, isHover, 'hover', '');
  }, []);

  // Interactivity
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const player = lottieEl?.current;
    if (player && interactivity && 'noInteractivity' !== interactivity) {
      player.addEventListener('ready', () => {
        LottieInteractivity.create({
          player: player.getLottie(),
          container: 'scrollRelativeToContainer' === interactivity ? interactivityContainer : `#${id}`,
          mode: interactivityMode,
          actions: interactivityActions
        });
      });
    }
  }, [lottieEl?.current]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _utils_data__WEBPACK_IMPORTED_MODULE_6__.prefix
  }, link ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: link,
    target: isLinkInNewTab ? '_blank' : '_self',
    rel: "noreferrer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_DotLottiePlayer__WEBPACK_IMPORTED_MODULE_4__["default"], {
    ref: lottieEl,
    attributes: attributes
  })) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_DotLottiePlayer__WEBPACK_IMPORTED_MODULE_4__["default"], {
    ref: lottieEl,
    attributes: attributes
  }), isCap && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "caption"
  }, caption)));
};
/******/ })()
;
//# sourceMappingURL=view.js.map