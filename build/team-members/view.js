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

/***/ "./src/team-members/Components/Common/Style.js":
/*!*****************************************************!*\
  !*** ./src/team-members/Components/Common/Style.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../Components/utils/getCSS */ "../Components/utils/getCSS.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/team-members/utils/data.js");



const Style = ({
  attributes,
  id
}) => {
  const {
    members = [],
    columnGap,
    rowGap,
    layout,
    textAlign,
    padding,
    photoWidth,
    photoMargin,
    nameTypo,
    nameMargin,
    titleTypo,
    titleMargin,
    sepMargin,
    bioTypo,
    bioMargin,
    socialSize,
    socialIconMargin
  } = attributes;
  const mainSl = `#${id}`;
  const membersSl = `${mainSl} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix}`;
  const gMemberSl = `${membersSl} .teamMember`;
  const gMemberDetailsSl = `${gMemberSl} .memberDetails`;
  const gMemberSocialSl = `${gMemberDetailsSl} .memberSocial`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', nameTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', titleTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', bioTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${gMemberDetailsSl} .memberName`, nameTypo)?.styles}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${gMemberDetailsSl} .memberTitle`, titleTypo)?.styles}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${gMemberDetailsSl} .memberBio`, bioTypo)?.styles}

		${membersSl}{
			grid-gap: ${rowGap} ${columnGap};
		}
		${gMemberSl}{
			text-align: ${textAlign};
			padding: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(padding)};
		}
		${gMemberSl} .memberPhoto{
			width: ${photoWidth};
			margin: ${'horizontal' === layout ? '0 20px 0 0' : `${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(photoMargin)}`};
		}
		${gMemberDetailsSl} .memberName{
			margin: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(nameMargin)};
		}
		${gMemberDetailsSl} .memberTitle{
			margin: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(titleMargin)};
		}
		${gMemberDetailsSl} .memberSeparator{
			margin: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(sepMargin)};
		}
		${gMemberDetailsSl} .memberBio{
			margin: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(bioMargin)};
		}
		${gMemberSocialSl} .icon,
		${gMemberSocialSl} .memberSocialAdd{
			margin: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(socialIconMargin)};
		}
		${gMemberSocialSl} .icon i,
		${gMemberSocialSl} .memberSocialAdd i{
			font-size: ${socialSize};
			width: ${socialSize};
		}

		${members.map((item, index) => {
        const {
          background,
          border,
          shadow,
          photoBorder,
          nameColor,
          titleColor,
          separator,
          bioColor,
          socialIconColors
        } = item;
        const memberSl = `${mainSl} #teamMember-${index}`;
        const memberDetailsSl = `${memberSl} .memberDetails`;
        const memberSocialSl = `${memberDetailsSl} .memberSocial`;
        return `
				${memberSl}{
					${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(background)}
					${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBorderCSS)(border)}
					box-shadow: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getMultiShadowCSS)(shadow?.shadow || (shadow?.color ? [shadow] : shadow))};
				}
				${memberSl} .memberPhoto{
					${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBorderCSS)(photoBorder)}
				}
				${memberDetailsSl} .memberName{
					color: ${nameColor};
				}
				${memberDetailsSl} .memberTitle{
					color: ${titleColor};
				}
				${memberSl} .memberSeparator{
					${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSeparatorCSS)(separator)}
				}
				${memberDetailsSl} .memberBio{
					color: ${bioColor};
				}
				${memberSocialSl}{
					justify-content: ${'center' === textAlign ? 'center' : 'right' === textAlign ? 'flex-end' : 'flex-start'}
				}
				${memberSocialSl} li a{
					${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getColorsCSS)(socialIconColors)}
				}
				${memberSocialSl} li.isSelected{
					border: 2px solid ${socialIconColors?.bg};
				}
				${memberSocialSl} li.memberSocialAdd button i{
					color: ${socialIconColors?.bg};
				}
			`;
      }).join(' ')}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/team-members/utils/data.js":
/*!****************************************!*\
  !*** ./src/team-members/utils/data.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksTeamMembers';

/***/ }),

/***/ "./src/team-members/style.scss":
/*!*************************************!*\
  !*** ./src/team-members/style.scss ***!
  \*************************************/
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/team-members/view.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/team-members/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/team-members/Components/Common/Style.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/data */ "./src/team-members/utils/data.js");





document.addEventListener('DOMContentLoaded', () => {
  const teamEls = document.querySelectorAll('.wp-block-b-blocks-team-members');
  teamEls.forEach(teamEl => {
    const attributes = JSON.parse(teamEl.dataset.attributes);
    const {
      members = [],
      columns,
      layout,
      isLinkNewTab,
      isTitle,
      isSep,
      isBio,
      isSocial
    } = attributes;
    const {
      desktop,
      tablet,
      mobile
    } = columns || {};
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(teamEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: teamEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `${_utils_data__WEBPACK_IMPORTED_MODULE_4__.prefix} ${layout || 'vertical'} columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`
    }, members.map((item, index) => {
      const {
        photo,
        name,
        title,
        bio,
        social = []
      } = item;
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: index,
        className: "teamMember",
        id: `teamMember-${index}`
      }, photo?.url && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
        className: "memberPhoto",
        src: photo.url,
        alt: photo?.alt
      }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "memberDetails"
      }, name && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
        className: "memberName",
        dangerouslySetInnerHTML: {
          __html: name
        }
      }), isTitle && title && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "memberTitle",
        dangerouslySetInnerHTML: {
          __html: title
        }
      }), isSep && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "memberSeparator"
      }), isBio && bio && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "memberBio",
        dangerouslySetInnerHTML: {
          __html: bio
        }
      }), isSocial && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
        className: "memberSocial"
      }, social?.map((socialItem, socialIndex) => {
        const {
          link,
          icon
        } = socialItem;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
          key: socialIndex,
          className: `icon icon-${index}-${socialIndex}`
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: link,
          target: isLinkNewTab ? '_blank' : '_self',
          rel: "noreferrer"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
          className: icon?.class
        })));
      }))));
    }))));
    teamEl?.removeAttribute('data-attributes');
  });
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map