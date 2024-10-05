/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../Components/utils/getCSS.js":
/*!*************************************!*\
  !*** ../Components/utils/getCSS.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBackgroundCSS: () => (/* binding */ getBackgroundCSS),
/* harmony export */   getBorderCSS: () => (/* binding */ getBorderCSS),
/* harmony export */   getBoxCSS: () => (/* binding */ getBoxCSS),
/* harmony export */   getColorsCSS: () => (/* binding */ getColorsCSS),
/* harmony export */   getIconCSS: () => (/* binding */ getIconCSS),
/* harmony export */   getMultiShadowCSS: () => (/* binding */ getMultiShadowCSS),
/* harmony export */   getSeparatorCSS: () => (/* binding */ getSeparatorCSS),
/* harmony export */   getShadowCSS: () => (/* binding */ getShadowCSS),
/* harmony export */   getSpaceCSS: () => (/* binding */ getSpaceCSS),
/* harmony export */   getTypoCSS: () => (/* binding */ getTypoCSS)
/* harmony export */ });
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
    color = '#0000',
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
const getColorsCSS = colors => {
  const {
    color = '#333',
    bgType = 'solid',
    bg = '#0000',
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
		@media (max-width: 768px) {
			${selector}{
				${`font-size: ${tabletFontSize}px;`}
			}
		}
		@media (max-width: 576px) {
			${selector}{
				${`font-size: ${mobileFontSize}px;`}
			}
		}`.replace(/\s+/g, ' ').trim()
  };
};
const getBoxCSS = (val = {}) => Object.values(val).join(' ');

/***/ }),

/***/ "./src/image-comparison/Components/Common/ImageCompare.js":
/*!****************************************************************!*\
  !*** ./src/image-comparison/Components/Common/ImageCompare.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/functions */ "./src/image-comparison/utils/functions.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/image-comparison/utils/data.js");


const $ = jQuery;


const ImageCompare = ({
  attributes,
  beforeLabelEl,
  afterLabelEl,
  captionEl
}) => {
  const {
    beforeImg,
    afterImg
  } = attributes;
  const imgCompareRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dividerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const resizeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const beforeImgRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const setImgWidth = width => {
    beforeImgRef.current.style.width = width;
    beforeImgRef.current.style.minWidth = width;
  };

  // Image Slider Scripts
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const compareEl = imgCompareRef.current;
    const handleResize = () => {
      const imgCompareWidth = compareEl?.clientWidth;
      if (imgCompareWidth) {
        setImgWidth(`${imgCompareWidth}px`);
        (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.drags)($(dividerRef.current), $(resizeRef.current), $(compareEl));
      }
    };
    const observer = new ResizeObserver(handleResize);
    if (compareEl) {
      observer.observe(compareEl);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix,
    ref: imgCompareRef
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "comparison-slider"
  }, afterLabelEl, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "afterImg",
    src: afterImg?.url,
    alt: afterImg?.alt
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "resize",
    ref: resizeRef
  }, beforeLabelEl, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "beforeImg",
    src: beforeImg?.url,
    alt: beforeImg?.alt,
    ref: beforeImgRef
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "divider",
    ref: dividerRef
  })), captionEl);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageCompare);

/***/ }),

/***/ "./src/image-comparison/Components/Common/Style.js":
/*!*********************************************************!*\
  !*** ./src/image-comparison/Components/Common/Style.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../Components/utils/getCSS */ "../Components/utils/getCSS.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/image-comparison/utils/data.js");



const Style = ({
  attributes,
  id
}) => {
  const {
    alignment,
    width,
    border,
    labelTypo,
    labelColors,
    labelPadding,
    capTypo,
    capColors,
    capPadding
  } = attributes;
  const mainSl = `#${id}`;
  const imgCompareSl = `${mainSl} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', labelTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', capTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${imgCompareSl} .overlay`, labelTypo)?.styles}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${imgCompareSl} .caption`, capTypo)?.styles}

		${mainSl}{
			text-align: ${alignment};
		}
		${imgCompareSl}{
			width: ${width};
			${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBorderCSS)(border)};
		}

		${imgCompareSl} .overlay{
			${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getColorsCSS)(labelColors)}
			padding: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(labelPadding)};
		}
		${imgCompareSl} .caption{
			${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getColorsCSS)(capColors)}
			padding: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(capPadding)};
		}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/image-comparison/utils/data.js":
/*!********************************************!*\
  !*** ./src/image-comparison/utils/data.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksImageCompare';

/***/ }),

/***/ "./src/image-comparison/utils/functions.js":
/*!*************************************************!*\
  !*** ./src/image-comparison/utils/functions.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drags: () => (/* binding */ drags)
/* harmony export */ });
const $ = jQuery;
const drags = (dragElement, resizeElement, container) => {
  // This creates a variable that detects if the user is using touch input instead of the mouse.
  let touched = false;
  window.addEventListener('touchstart', function () {
    touched = true;
  });
  window.addEventListener('touchend', function () {
    touched = false;
  });

  // click the image and move the slider on interaction with the mouse or the touch input
  dragElement.on('mousedown touchstart', function (e) {
    //add classes to the elements - good for css animations if you need it to
    dragElement.addClass('icDraggable');
    resizeElement.addClass('icResizable');
    //create vars
    let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
    let dragWidth = dragElement.outerWidth();
    let posX = dragElement.offset().left + dragWidth - startX;
    let containerOffset = container.offset().left;
    let containerWidth = container.outerWidth();
    let minLeft = containerOffset + 10;
    let maxLeft = containerOffset + containerWidth - dragWidth - 10;

    //add event listener on the divider element
    dragElement.parents().on('mousemove touchmove', function (e) {
      // if the user is not using touch input let do preventDefault to prevent the user from selecting the images as he moves the slider around.
      if (touched === false) {
        e.preventDefault();
      }
      let moveX = e.pageX ? e.pageX : e.originalEvent?.touches[0].pageX;
      let leftValue = moveX + posX - dragWidth;

      // stop the divider from going over the limits of the container
      if (leftValue < minLeft) {
        leftValue = minLeft;
      } else if (leftValue > maxLeft) {
        leftValue = maxLeft;
      }
      let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
      $('.icDraggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
        $(this).removeClass('icDraggable');
        resizeElement.removeClass('icResizable');
      });
      $('.icResizable').css('width', widthValue);
    }).on('mouseup touchend touchcancel', function () {
      dragElement.removeClass('icDraggable');
      resizeElement.removeClass('icResizable');
    });
  }).on('mouseup touchend touchcancel', function () {
    // stop clicking the image and move the slider
    dragElement.removeClass('icDraggable');
    resizeElement.removeClass('icResizable');
  });
};

/***/ }),

/***/ "./src/image-comparison/style.scss":
/*!*****************************************!*\
  !*** ./src/image-comparison/style.scss ***!
  \*****************************************/
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
/*!**************************************!*\
  !*** ./src/image-comparison/view.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/image-comparison/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/image-comparison/Components/Common/Style.js");
/* harmony import */ var _Components_Common_ImageCompare__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/ImageCompare */ "./src/image-comparison/Components/Common/ImageCompare.js");





document.addEventListener('DOMContentLoaded', () => {
  const imageCompareEls = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
  imageCompareEls.forEach(imageCompareEl => {
    const attributes = JSON.parse(imageCompareEl.dataset.attributes);
    const {
      isLabel,
      beforeLabel,
      afterLabel,
      isCap,
      cap
    } = attributes;
    const beforeLabelEl = isLabel && beforeLabel && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "overlay beforeLabel",
      dangerouslySetInnerHTML: {
        __html: beforeLabel
      }
    });
    const afterLabelEl = isLabel && afterLabel && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "overlay afterLabel",
      dangerouslySetInnerHTML: {
        __html: afterLabel
      }
    });
    const captionEl = isCap && cap && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "caption",
      dangerouslySetInnerHTML: {
        __html: cap
      }
    });
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(imageCompareEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: imageCompareEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_ImageCompare__WEBPACK_IMPORTED_MODULE_4__["default"], {
      attributes: attributes,
      beforeLabelEl: beforeLabelEl,
      afterLabelEl: afterLabelEl,
      captionEl: captionEl
    })));
    imageCompareEl?.removeAttribute('data-attributes');
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map