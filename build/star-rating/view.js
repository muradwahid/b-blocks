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

/***/ "./src/star-rating/Components/Common/Rating.js":
/*!*****************************************************!*\
  !*** ./src/star-rating/Components/Common/Rating.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/functions */ "./src/star-rating/utils/functions.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/icons */ "./src/star-rating/utils/icons.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/data */ "./src/star-rating/utils/data.js");




const Rating = ({
  attributes
}) => {
  const {
    ratingScale,
    iconStyle,
    prefix
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _utils_data__WEBPACK_IMPORTED_MODULE_3__.prefix
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ratingPrefix"
  }, prefix), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "stars"
  }, (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getArrFromNum)(ratingScale).map(index => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      key: index,
      className: "star"
    }, 'solid' === iconStyle ? _utils_icons__WEBPACK_IMPORTED_MODULE_2__.solidStar : _utils_icons__WEBPACK_IMPORTED_MODULE_2__.outlineStar, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "starFill"
    }, _utils_icons__WEBPACK_IMPORTED_MODULE_2__.solidStar));
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rating);

/***/ }),

/***/ "./src/star-rating/Components/Common/Style.js":
/*!****************************************************!*\
  !*** ./src/star-rating/Components/Common/Style.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../Components/utils/getCSS */ "../Components/utils/getCSS.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/functions */ "./src/star-rating/utils/functions.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/data */ "./src/star-rating/utils/data.js");




const Style = ({
  attributes,
  id
}) => {
  const {
    rating,
    gap,
    alignment,
    textTypo,
    textColor,
    textShadow
  } = attributes;
  const ratingSl = `#${id} .${_utils_data__WEBPACK_IMPORTED_MODULE_3__.prefix}`;
  const starSl = `${ratingSl} .stars .star`;
  const intAndDec = (rating + '').split('.');
  const ratingInt = parseInt(intAndDec[0]);
  const ratingDec = parseInt(intAndDec[1] || 0);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(``, textTypo)?.googleFontLink}
		${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${ratingSl} .ratingPrefix`, textTypo)?.styles}

		${ratingSl} {
			justify-content: ${alignment};
			gap: ${gap};
			color: ${textColor};
		}

		${ratingSl} .ratingPrefix{
			text-shadow: ${(0,_Components_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getMultiShadowCSS)(textShadow, 'text')}
		}

		${(0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.getArrFromNum)(ratingInt).map(index => `${starSl}:nth-child(${index}) .starFill`).join(', ')}{
			width: 100%;
		}

		${starSl}:nth-child(${ratingInt + 1}) .starFill{
			width: ${(() => {
        switch (ratingDec) {
          case 1:
            return 25;
          case 2:
            return 30;
          case 3:
            return 35;
          case 4:
            return 42.5;
          case 5:
            return 50;
          case 6:
            return 57.5;
          case 7:
            return 65;
          case 8:
            return 70;
          case 9:
            return 75;
          default:
            return 0;
        }
      })()}%;
		}
	`
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/star-rating/utils/data.js":
/*!***************************************!*\
  !*** ./src/star-rating/utils/data.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksRating';

/***/ }),

/***/ "./src/star-rating/utils/functions.js":
/*!********************************************!*\
  !*** ./src/star-rating/utils/functions.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getArrFromNum: () => (/* binding */ getArrFromNum)
/* harmony export */ });
const getArrFromNum = num => Array.from({
  length: num
}, (_, index) => index + 1);

/***/ }),

/***/ "./src/star-rating/utils/icons.js":
/*!****************************************!*\
  !*** ./src/star-rating/utils/icons.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   outlineIcon: () => (/* binding */ outlineIcon),
/* harmony export */   outlineStar: () => (/* binding */ outlineStar),
/* harmony export */   ratingIcon: () => (/* binding */ ratingIcon),
/* harmony export */   solidStar: () => (/* binding */ solidStar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const iconColor = '#4527a4';
const ratingIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 473.931 473.931"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: "236.966",
  cy: "236.966",
  r: "236.966"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFC50B",
  d: "M100.174,228.419c-0.228-0.67-0.797-1.156-1.489-1.257l-23.768-3.454l-10.634-21.538\r c-0.614-1.253-2.69-1.253-3.304,0l-10.634,21.538l-23.76,3.454c-0.696,0.101-1.272,0.587-1.489,1.257\r c-0.213,0.67-0.037,1.399,0.468,1.886l17.197,16.763l-4.056,23.67c-0.123,0.692,0.161,1.388,0.73,1.8s1.325,0.468,1.946,0.142\r l21.253-11.177l21.261,11.177c0.269,0.142,0.561,0.21,0.861,0.21c0.382,0,0.76-0.116,1.081-0.352\r c0.561-0.412,0.849-1.111,0.722-1.8l-4.052-23.67l17.197-16.763C100.212,229.819,100.388,229.086,100.174,228.419z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFC50B",
  d: "M187.339,228.419c-0.221-0.67-0.797-1.156-1.489-1.257l-23.76-3.454l-10.634-21.538\r c-0.614-1.253-2.69-1.253-3.304,0l-10.634,21.538l-23.76,3.454c-0.696,0.101-1.272,0.587-1.489,1.257\r c-0.217,0.67-0.037,1.399,0.468,1.886l17.197,16.763l-4.064,23.67c-0.109,0.692,0.168,1.388,0.73,1.8\r c0.576,0.412,1.328,0.468,1.946,0.142l21.261-11.177l21.253,11.177c0.269,0.142,0.569,0.21,0.861,0.21\r c0.389,0,0.767-0.116,1.089-0.352c0.561-0.412,0.849-1.111,0.722-1.8l-4.056-23.67l17.197-16.763\r C187.376,229.819,187.559,229.086,187.339,228.419z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFC50B",
  d: "M275.409,228.419c-0.221-0.67-0.797-1.156-1.489-1.257l-23.76-3.454l-10.634-21.538\r c-0.614-1.253-2.69-1.253-3.304,0l-10.634,21.538l-23.756,3.454c-0.696,0.101-1.272,0.587-1.489,1.257\r c-0.217,0.67-0.045,1.399,0.468,1.886l17.197,16.763l-4.064,23.67c-0.116,0.692,0.168,1.388,0.73,1.8\r c0.569,0.412,1.328,0.468,1.946,0.142l21.261-11.177l21.261,11.177c0.262,0.142,0.561,0.21,0.857,0.21\r c0.382,0,0.767-0.116,1.081-0.352c0.561-0.412,0.857-1.111,0.73-1.8l-4.056-23.67l17.197-16.763\r C275.446,229.819,275.629,229.086,275.409,228.419z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFC50B",
  d: "M360.822,228.419c-0.213-0.67-0.789-1.156-1.482-1.257l-23.76-3.454l-10.634-21.538\r c-0.621-1.253-2.69-1.253-3.304,0l-10.634,21.538l-23.76,3.454c-0.703,0.101-1.272,0.587-1.489,1.257\r c-0.217,0.67-0.045,1.399,0.46,1.886l17.205,16.763l-4.064,23.67c-0.116,0.692,0.161,1.388,0.73,1.8s1.325,0.468,1.946,0.142\r l21.261-11.177l21.253,11.177c0.269,0.142,0.561,0.21,0.861,0.21c0.382,0,0.76-0.116,1.081-0.352c0.561-0.412,0.849-1.111,0.73-1.8\r l-4.056-23.67l17.197-16.763C360.855,229.819,361.039,229.086,360.822,228.419z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#fff",
  d: "M447.997,228.419c-0.221-0.67-0.804-1.156-1.489-1.257l-23.768-3.454l-10.634-21.538\r c-0.614-1.253-2.683-1.253-3.304,0l-10.627,21.538l-23.768,3.454c-0.696,0.101-1.272,0.587-1.489,1.257\r c-0.217,0.67-0.037,1.399,0.468,1.886l17.197,16.763l-4.056,23.67c-0.116,0.692,0.161,1.388,0.73,1.8s1.325,0.468,1.938,0.142\r l21.261-11.177l21.261,11.177c0.269,0.142,0.561,0.21,0.861,0.21c0.382,0,0.76-0.116,1.081-0.352\r c0.561-0.412,0.849-1.111,0.722-1.8l-4.049-23.67l17.19-16.763C448.035,229.819,448.21,229.086,447.997,228.419z"
}));
const outlineIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polygon", {
  points: "12 4 9.22 9.27 3 10.11 7.5 14.21 6.44 20 12 17.27 17.56 20 16.5 14.21 21 10.11 14.78 9.27 12 4",
  style: {
    fill: 'none',
    stroke: 'rgb(0, 0, 0)',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2
  }
}));
const solidStar = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 576 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
}));
const outlineStar = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 576 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
}));

/***/ }),

/***/ "./src/star-rating/style.scss":
/*!************************************!*\
  !*** ./src/star-rating/style.scss ***!
  \************************************/
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
/*!*********************************!*\
  !*** ./src/star-rating/view.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/star-rating/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/star-rating/Components/Common/Style.js");
/* harmony import */ var _Components_Common_Rating__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/Rating */ "./src/star-rating/Components/Common/Rating.js");





document.addEventListener('DOMContentLoaded', () => {
  const ratingEls = document.querySelectorAll('.wp-block-b-blocks-star-rating');
  ratingEls.forEach(ratingEl => {
    const attributes = JSON.parse(ratingEl.dataset.attributes);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(ratingEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: ratingEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Rating__WEBPACK_IMPORTED_MODULE_4__["default"], {
      attributes: attributes
    })));
    ratingEl?.removeAttribute('data-attributes');
  });
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map