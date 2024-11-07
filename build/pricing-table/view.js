/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pricing-table/Components/Common/PriceFeatures.js":
/*!**************************************************************!*\
  !*** ./src/pricing-table/Components/Common/PriceFeatures.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/icons */ "./src/pricing-table/utils/icons.js");


const PriceFeatures = ({
  features
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "priceFeatures"
  }, features?.map((feature, index) => {
    const {
      isEnable,
      label
    } = feature;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: index,
      className: "priceFeature"
    }, isEnable ? _utils_icons__WEBPACK_IMPORTED_MODULE_1__.enabledIcon : _utils_icons__WEBPACK_IMPORTED_MODULE_1__.disabledIcon, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "priceFeatureLabel",
      dangerouslySetInnerHTML: {
        __html: label
      }
    }));
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PriceFeatures);

/***/ }),

/***/ "./src/pricing-table/Components/Common/Style.js":
/*!******************************************************!*\
  !*** ./src/pricing-table/Components/Common/Style.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../bpl-tools/utils/getCSS */ "../bpl-tools/utils/getCSS.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/pricing-table/utils/data.js");



const Style = ({
  attributes,
  id,
  isStandard
}) => {
  const {
    pricingTables,
    columnGap,
    rowGap,
    textAlign,
    padding,
    shadow
  } = attributes;
  const mainSl = `#${id}`;
  const pricingTableSl = `${mainSl} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${pricingTableSl}{
			grid-gap: ${rowGap} ${columnGap};
			text-align: ${textAlign};
			padding: ${isStandard ? '30px 0' : '0'}
		}
		${pricingTableSl} .priceItem{
			padding: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(padding)};
			box-shadow: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getShadowCSS)(shadow)};
		}

		${pricingTables?.map((priceTable, index) => {
        const {
          color
        } = priceTable;
        const defPriceTableSelect = `${pricingTableSl} #priceItem-${index} .priceItem`;
        const priceTableSelect = hasClass => `${mainSl}.is-style-${hasClass} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix} #priceItem-${index} .priceItem`;
        return `
				${defPriceTableSelect} .priceName,
				${priceTableSelect('basic')} .priceAmountWrap,
				${priceTableSelect('standard')} .priceAmountWrap{
					color: ${color};
				}
				${defPriceTableSelect} .priceLink,
				${priceTableSelect('basic')} .priceName,
				${priceTableSelect('standard')}::before,
				${priceTableSelect('ultimate')} .priceAmountWrap{
					color: #fff;
					background-color: ${color};
				}
				${priceTableSelect('basic')} .priceName::before{
					border-top-color: ${color};
				}
			`;
      }).join(' ')}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/pricing-table/utils/data.js":
/*!*****************************************!*\
  !*** ./src/pricing-table/utils/data.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksPricingTable';

/***/ }),

/***/ "./src/pricing-table/utils/icons.js":
/*!******************************************!*\
  !*** ./src/pricing-table/utils/icons.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disabledIcon: () => (/* binding */ disabledIcon),
/* harmony export */   enabledIcon: () => (/* binding */ enabledIcon),
/* harmony export */   pricingTableIcon: () => (/* binding */ pricingTableIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const iconColor = '#4527a4';
const pricingTableIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 34 34"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  transform: "translate(-1094.000000, -2938.000000)",
  d: "M1118.5,2938.0001 C1119.881,2938.0001 1121,2939.1191 1121,2940.5001 L1121,2940.5001 L1121,2969.5001 C1121,2970.8801 1119.881,2972.0001 1118.5,2972.0001 L1118.5,2972.0001 L1103.5,2972.0001 C1102.12,2972.0001 1101,2970.8801 1101,2969.5001 L1101,2969.5001 L1101,2940.5001 C1101,2939.1191 1102.12,2938.0001 1103.5,2938.0001 L1103.5,2938.0001 Z M1118.5,2939.0001 L1103.5,2939.0001 C1102.673,2939.0001 1102,2939.6731 1102,2940.5001 L1102,2940.5001 L1102,2969.5001 C1102,2970.3271 1102.673,2971.0001 1103.5,2971.0001 L1103.5,2971.0001 L1118.5,2971.0001 C1119.327,2971.0001 1120,2970.3271 1120,2969.5001 L1120,2969.5001 L1120,2940.5001 C1120,2939.6731 1119.327,2939.0001 1118.5,2939.0001 L1118.5,2939.0001 Z M1125.23077,2942 C1126.75754,2942 1128,2943.29615 1128,2944.88889 L1128,2944.88889 L1128,2965.11111 C1128,2966.70385 1126.75754,2968 1125.23077,2968 L1125.23077,2968 L1123,2968 L1123,2967.03704 L1125.23077,2967.03704 C1126.24892,2967.03704 1127.07692,2966.17326 1127.07692,2965.11111 L1127.07692,2965.11111 L1127.07692,2944.88889 C1127.07692,2943.82674 1126.24892,2942.96296 1125.23077,2942.96296 L1125.23077,2942.96296 L1123,2942.96296 L1123,2942 Z M1099,2942 L1099,2942.96296 L1096.76923,2942.96296 C1095.75108,2942.96296 1094.92308,2943.82674 1094.92308,2944.88889 L1094.92308,2944.88889 L1094.92308,2965.11111 C1094.92308,2966.17326 1095.75108,2967.03704 1096.76923,2967.03704 L1096.76923,2967.03704 L1099,2967.03704 L1099,2968 L1096.76923,2968 C1095.24246,2968 1094,2966.70385 1094,2965.11111 L1094,2965.11111 L1094,2944.88889 C1094,2943.29615 1095.24246,2942 1096.76923,2942 L1096.76923,2942 L1099,2942 Z M1116.6436,2962.4107 C1117.4726,2962.4107 1118.1436,2963.0817 1118.1436,2963.9107 C1118.1436,2964.7397 1117.4726,2965.4107 1116.6436,2965.4107 L1116.6436,2965.4107 L1106.0266,2965.4107 C1105.1976,2965.4107 1104.5266,2964.7397 1104.5266,2963.9107 C1104.5266,2963.0817 1105.1976,2962.4107 1106.0266,2962.4107 L1106.0266,2962.4107 Z M1115.6434,2955.9249 C1115.9204,2955.9249 1116.1434,2956.1489 1116.1434,2956.4249 C1116.1434,2956.7009 1115.9204,2956.9249 1115.6434,2956.9249 L1115.6434,2956.9249 L1105.0264,2956.9249 C1104.7504,2956.9249 1104.5264,2956.7009 1104.5264,2956.4249 C1104.5264,2956.1489 1104.7504,2955.9249 1105.0264,2955.9249 L1105.0264,2955.9249 Z M1110.3354,2952.2164 C1110.6114,2952.2164 1110.8354,2952.4404 1110.8354,2952.7164 C1110.8354,2952.9924 1110.6114,2953.2164 1110.3354,2953.2164 L1110.3354,2953.2164 L1105.0264,2953.2164 C1104.7504,2953.2164 1104.5264,2952.9924 1104.5264,2952.7164 C1104.5264,2952.4404 1104.7504,2952.2164 1105.0264,2952.2164 L1105.0264,2952.2164 Z M1114.7064,2948.2579 C1114.9824,2948.2579 1115.2064,2948.4819 1115.2064,2948.7579 C1115.2064,2949.0339 1114.9824,2949.2579 1114.7064,2949.2579 L1114.7064,2949.2579 L1105.0264,2949.2579 C1104.7504,2949.2579 1104.5264,2949.0339 1104.5264,2948.7579 C1104.5264,2948.4819 1104.7504,2948.2579 1105.0264,2948.2579 L1105.0264,2948.2579 Z M1116.8594,2944.2022 C1117.1354,2944.2022 1117.3594,2944.4262 1117.3594,2944.7022 C1117.3594,2944.9782 1117.1354,2945.2022 1116.8594,2945.2022 L1116.8594,2945.2022 L1105.0264,2945.2022 C1104.7504,2945.2022 1104.5264,2944.9782 1104.5264,2944.7022 C1104.5264,2944.4262 1104.7504,2944.2022 1105.0264,2944.2022 L1105.0264,2944.2022 Z"
}));
const enabledIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "priceFeatureEnabled",
  viewBox: "0 0 512 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#01944e",
  d: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
}));
const disabledIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "priceFeatureDisabled",
  viewBox: "0 0 352 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#f00025",
  d: "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
}));

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
const getShadowCSS = (shadow, type = 'box') => {
  const {
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
  const cd = v => 'initial' !== v;
  return `
		${cd(position) ? `background-position: ${'custom' === position ? `${xPosition} ${yPosition}` : position};` : ''}
		${attachment && cd(attachment) ? `background-attachment: ${attachment};` : ''}
		${cd(repeat) ? `background-repeat: ${repeat};` : ''}
		${cd(size) ? `background-size: ${'custom' === size ? `${customSize} auto` : size};` : ''}
	`;
};
const getImageCSS = (img = {}) => {
  if (img) {
    return {
      desktop: img.url ? `background-image: url(${img.url}); ${getImagePosition(img?.desktop)}` : '',
      tablet: img.url ? getImagePosition(img?.tablet) : '',
      mobile: img.url ? getImagePosition(img?.mobile) : ''
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

/***/ "./src/pricing-table/style.scss":
/*!**************************************!*\
  !*** ./src/pricing-table/style.scss ***!
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
  !*** ./src/pricing-table/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/pricing-table/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/pricing-table/Components/Common/Style.js");
/* harmony import */ var _Components_Common_PriceFeatures__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/PriceFeatures */ "./src/pricing-table/Components/Common/PriceFeatures.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/data */ "./src/pricing-table/utils/data.js");







document.addEventListener('DOMContentLoaded', () => {
  const pricingTableEls = document.querySelectorAll('.wp-block-b-blocks-pricing-table');
  pricingTableEls.forEach(pricingTableEl => {
    const attributes = JSON.parse(pricingTableEl.dataset.attributes);
    const isBasic = pricingTableEl.className.includes('basic');
    const isStandard = pricingTableEl.className.includes('standard');
    const isUltimate = pricingTableEl.className.includes('ultimate');
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(pricingTableEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: pricingTableEl.id,
      isStandard: isStandard
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PricingTable, {
      attributes: attributes,
      id: pricingTableEl.id,
      isBasic: isBasic,
      isStandard: isStandard,
      isUltimate: isUltimate
    })));
    pricingTableEl?.removeAttribute('data-attributes');
  });
});
const PricingTable = ({
  attributes,
  id,
  isBasic,
  isStandard,
  isUltimate
}) => {
  const {
    pricingTables,
    columns
  } = attributes;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const priceFeaturesAll = document.querySelectorAll(`#${id} .priceItem .priceFeatures`);
    const priceFeaturesHeight = [];
    priceFeaturesAll?.forEach(priceFeatures => {
      priceFeaturesHeight.push(priceFeatures?.clientHeight);
    });
    priceFeaturesAll?.forEach(priceFeatures => {
      priceFeatures.style.height = Math.max(...priceFeaturesHeight) + 'px';
    });
  }, [pricingTables]);

  // Single Price Table
  const PriceTable = ({
    priceTable,
    index
  }) => {
    const {
      name,
      price,
      priceCurrency,
      period,
      link,
      linkLabel,
      features
    } = priceTable;
    const priceTableEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const priceAmountWrapEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      if (isUltimate) {
        const widthOfPriceWrap = priceTableEl?.current?.clientHeight / 100 * 82;
        priceAmountWrapEl.current.style.width = `${widthOfPriceWrap}px`;
        priceAmountWrapEl.current.style.top = `${widthOfPriceWrap / 2}px`;
        priceAmountWrapEl.current.style.left = `${-widthOfPriceWrap / 2 + 60}px`;
      }
    }, []);
    const priceAmountEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "priceAmount"
    }, priceCurrency, price);
    const pricePeriodEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "pricePeriod",
      dangerouslySetInnerHTML: {
        __html: period
      }
    });
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: index,
      id: `priceItem-${index}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "priceItem",
      ref: priceTableEl
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "priceName",
      dangerouslySetInnerHTML: {
        __html: name
      }
    }), isStandard || isUltimate ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "priceAmountWrap",
      ref: priceAmountWrapEl
    }, priceAmountEl, " / ", pricePeriodEl) : '', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_PriceFeatures__WEBPACK_IMPORTED_MODULE_4__["default"], {
      features: features
    }), !isStandard && !isUltimate ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "priceAmountWrap"
    }, priceAmountEl) : '', !isBasic && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      className: "priceLink",
      href: link,
      dangerouslySetInnerHTML: {
        __html: linkLabel
      }
    })));
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `${_utils_data__WEBPACK_IMPORTED_MODULE_5__.prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`
  }, pricingTables?.map((priceTable, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PriceTable, {
    key: index,
    priceTable: priceTable,
    index: index
  })));
};
/******/ })()
;
//# sourceMappingURL=view.js.map