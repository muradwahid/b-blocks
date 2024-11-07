/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/service/Components/Common/Service.js":
/*!**************************************************!*\
  !*** ./src/service/Components/Common/Service.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_utils_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../services/utils/icons */ "./src/services/utils/icons.js");
/* harmony import */ var _services_utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/utils/data */ "./src/services/utils/data.js");



const Service = ({
  attributes,
  children
}) => {
  const {
    isIcon,
    isUpIcon,
    icon,
    upIcon,
    isLink,
    link,
    linkIn
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _services_utils_data__WEBPACK_IMPORTED_MODULE_2__.childPrefix
  }, 'service' === linkIn && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "serviceLink",
    href: link
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bgLayer"
  }), isIcon && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "icon"
  }, isUpIcon ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: upIcon?.url,
    alt: upIcon?.alt
  }) : icon?.class && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: icon?.class
  })), children, isLink && 'button' === linkIn && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "link"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: link
  }, _services_utils_icons__WEBPACK_IMPORTED_MODULE_1__.longArrowToRightIcon)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Service);

/***/ }),

/***/ "./src/service/Components/Common/Style.js":
/*!************************************************!*\
  !*** ./src/service/Components/Common/Style.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../bpl-tools/utils/getCSS */ "../bpl-tools/utils/getCSS.js");
/* harmony import */ var _services_utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/utils/data */ "./src/services/utils/data.js");



const Style = ({
  attributes,
  id
}) => {
  const {
    background,
    hoverBG,
    icon,
    iconWidth,
    iconBorder,
    titleColor,
    descColor,
    linkIconColor,
    linkBGColor,
    linkBGHovColor
  } = attributes;
  const mainSl = `#${id}`;
  const serviceSl = `${mainSl} .${_services_utils_data__WEBPACK_IMPORTED_MODULE_2__.childPrefix}`;
  const iconSl = `${serviceSl} .icon`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${serviceSl}{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(background)}
		}
		${serviceSl} .bgLayer{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(hoverBG)}
		}

		${serviceSl} .title{
			color: ${titleColor};
		}
		${iconSl}{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBorderCSS)(iconBorder)}
		}
		${iconSl} i{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getIconCSS)(icon)}
		}
		${iconSl} img{
			width: ${iconWidth};
		}
		${serviceSl} .description{
			color: ${descColor};
		}
		${serviceSl} .link a{
			background-color: ${linkBGColor};
		}
		${mainSl}:hover .ssbService .link a{
			background-color: ${linkBGHovColor};
		}
		${serviceSl} .link a svg{
			fill: ${linkIconColor};
		}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/services/utils/data.js":
/*!************************************!*\
  !*** ./src/services/utils/data.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   childPrefix: () => (/* binding */ childPrefix),
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksServices';
const childPrefix = 'bBlocksService';

/***/ }),

/***/ "./src/services/utils/icons.js":
/*!*************************************!*\
  !*** ./src/services/utils/icons.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   longArrowToRightIcon: () => (/* binding */ longArrowToRightIcon),
/* harmony export */   servicesIcon: () => (/* binding */ servicesIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const iconColor = '#4527a4';
const servicesIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 512.013 512.013"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m469.481 127.589h-5.19c-3.068-10.775-7.354-21.113-12.802-30.887l3.689-3.69c4.221-4.219 6.544-9.846 6.544-15.845s-2.323-11.625-6.547-15.849l-24.58-24.551c-4.221-4.247-9.855-6.585-15.865-6.585-6.009 0-11.644 2.338-15.844 6.564l-3.685 3.685c-9.781-5.465-20.123-9.759-30.891-12.826v-5.189c.001-12.36-10.054-22.416-22.415-22.416h-34.752c-12.36 0-22.416 10.056-22.416 22.416v5.189c-10.766 3.066-21.114 7.361-30.915 12.83l-3.668-3.668c-4.223-4.247-9.857-6.585-15.866-6.584-6.009 0-11.643 2.339-15.843 6.564l-24.575 24.576c-4.221 4.219-6.544 9.846-6.544 15.845s2.323 11.625 6.543 15.844l3.688 3.689c-5.471 9.804-9.759 20.144-12.81 30.888h-5.209c-12.36 0-22.416 10.056-22.416 22.416v34.782c0 12.36 10.056 22.416 22.416 22.416h5.209c3.051 10.743 7.339 21.083 12.81 30.888l-3.688 3.689c-4.221 4.219-6.544 9.846-6.544 15.845 0 5.998 2.323 11.625 6.543 15.844l24.556 24.556c4.221 4.247 9.854 6.585 15.863 6.585h.001c6.009 0 11.644-2.338 15.845-6.564l3.688-3.689c9.811 5.474 20.159 9.763 30.915 12.813v5.207c0 12.36 10.056 22.416 22.416 22.416h34.752c12.36 0 22.416-10.056 22.416-22.416v-5.207c10.759-3.051 21.099-7.338 30.891-12.809l3.664 3.664c4.221 4.247 9.855 6.585 15.864 6.585 6.01 0 11.645-2.339 15.841-6.56l24.608-24.581c4.22-4.22 6.543-9.847 6.543-15.845 0-5.999-2.323-11.625-6.543-15.844l-3.69-3.69c5.448-9.774 9.733-20.112 12.802-30.887h5.19c12.36 0 22.416-10.056 22.416-22.416v-34.782c.001-12.36-10.054-22.416-22.415-22.416zm-125.17 184.787c0 1.31-1.106 2.416-2.416 2.416h-34.752c-1.31 0-2.416-1.106-2.416-2.416v-12.983-63.043c0-4.182-2.602-7.922-6.522-9.376-26.872-9.966-44.926-35.828-44.926-64.354 0-22.607 11.257-43.799 30.107-56.684.846-.578 1.594-1.05 2.248-1.437-.036 1.3-.128 2.536-.177 3.181-.075 1.015-.135 1.816-.135 2.611v47.197c0 21.663 16.927 39.755 38.534 41.188.441.029.883.029 1.324 0 21.592-1.432 38.506-19.524 38.506-41.188v-47.197c0-.791-.059-1.587-.133-2.596-.048-.648-.14-1.891-.175-3.197.652.386 1.396.857 2.239 1.434 18.855 12.888 30.112 34.08 30.112 56.687 0 28.523-18.044 54.386-44.9 64.355-3.919 1.455-6.52 5.194-6.52 9.375v63.043 12.984zm127.586-127.589c0 1.287-1.129 2.416-2.416 2.416h-12.954c-4.672 0-8.722 3.235-9.753 7.792-3.167 13.993-8.652 27.225-16.303 39.328-2.498 3.952-1.924 9.108 1.382 12.414l9.185 9.185c.596.596.685 1.322.685 1.702 0 .379-.089 1.106-.682 1.698l-24.629 24.602c-.563.566-1.226.685-1.682.685-.455 0-1.117-.119-1.701-.707l-9.185-9.185c-3.311-3.31-8.472-3.88-12.424-1.376-8.536 5.409-17.622 9.701-27.109 12.873v-43.213c31.024-14.438 51.42-45.901 51.42-80.383 0-29.217-14.515-56.581-38.825-73.198-3.724-2.545-15.049-10.288-24.954-4.587-9.726 5.6-8.757 18.727-8.344 24.333.036.487.071.896.079 1.125v47.197c0 10.946-8.366 20.123-19.168 21.178-10.817-1.056-19.196-10.233-19.196-21.178l-.001-47.125c.009-.301.045-.71.081-1.199.417-5.603 1.394-18.723-8.324-24.326-9.901-5.711-21.243 2.035-24.974 4.582-24.312 16.618-38.826 43.982-38.826 73.199 0 34.487 20.407 65.952 51.448 80.386v43.21c-9.489-3.172-18.586-7.466-27.147-12.878-1.646-1.04-3.498-1.547-5.341-1.547-2.583 0-5.145.999-7.074 2.929l-9.204 9.205c-.563.567-1.226.686-1.682.686s-1.117-.119-1.701-.706l-24.576-24.577c-.597-.596-.686-1.323-.686-1.702 0-.38.089-1.106.686-1.703l9.184-9.185c3.306-3.306 3.88-8.462 1.382-12.414-7.69-12.167-13.174-25.393-16.299-39.311-1.024-4.565-5.078-7.81-9.757-7.81h-12.982c-1.287 0-2.416-1.129-2.416-2.416v-34.782c0-1.31 1.106-2.416 2.416-2.416h12.982c4.679 0 8.732-3.245 9.757-7.81 3.125-13.918 8.608-27.145 16.299-39.311 2.498-3.952 1.924-9.108-1.382-12.414l-9.185-9.185c-.596-.596-.685-1.322-.685-1.702s.089-1.106.686-1.703l24.597-24.598c.563-.566 1.225-.685 1.681-.685s1.118.119 1.702.706l9.184 9.185c3.308 3.307 8.464 3.88 12.415 1.382 12.151-7.682 25.392-13.177 39.351-16.33 4.56-1.03 7.797-5.081 7.797-9.754v-12.953c0-1.31 1.106-2.416 2.416-2.416h34.752c1.31 0 2.416 1.106 2.416 2.416v12.955c0 4.674 3.237 8.724 7.796 9.754 13.972 3.156 27.198 8.648 39.313 16.325 3.953 2.504 9.113 1.934 12.424-1.376l9.205-9.206c.563-.566 1.226-.685 1.681-.685.456 0 1.118.119 1.706.71l24.602 24.573c.596.596.685 1.322.685 1.702s-.089 1.106-.686 1.703l-9.184 9.185c-3.306 3.306-3.88 8.462-1.382 12.414 7.65 12.103 13.136 25.334 16.303 39.328 1.031 4.557 5.081 7.792 9.753 7.792h12.954c1.31 0 2.416 1.106 2.416 2.416v34.781z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m382.786 440.321c-3.905 3.905-3.905 10.237 0 14.143 1.953 1.952 4.512 2.929 7.071 2.929s5.118-.977 7.071-2.929l.028-.028c3.905-3.905 3.891-10.223-.015-14.128s-10.25-3.89-14.155.013z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m429.112 343.45-79.391 40.771c-6.73-6.97-16.16-11.318-26.591-11.318h-54.396c-3.046 0-3.79-.242-3.84-.259-.441-.232-1.835-1.542-2.954-2.594l-.496-.466c-44.008-41.427-81.183-38.802-123.458-22.118-6.84 2.7-6.972 2.706-13.841 2.999l-12.3.009c-3.504-10.571-13.476-18.221-25.207-18.221h-39.996c-14.627 0-26.526 11.913-26.526 26.555v104.969c0 14.626 11.899 26.526 26.526 26.526h39.996c11.73 0 21.701-7.641 25.206-18.199h22.5c1.987 0 1.987 0 4.298.651.84.237 1.862.525 3.182.88l103.494 27.688c4.562 1.232 8.746 2.445 12.793 3.617 13.26 3.842 24.406 7.072 36.023 7.072 13.13 0 26.859-4.126 44.916-16.16.087-.058.174-.118.26-.179l19.758-14.089c4.497-3.207 5.543-9.451 2.336-13.948-3.207-4.498-9.453-5.543-13.947-2.336l-19.627 13.995c-26.204 17.429-37.331 14.207-64.153 6.435-4.132-1.197-8.404-2.435-13.165-3.721l-103.502-27.689c-1.212-.326-2.163-.594-2.943-.814-3.776-1.064-5.188-1.4-9.722-1.4h-21.152v-81.624h10.807c.144 0 .286-.003.43-.009l.57-.024c8.383-.358 10.728-.587 20.33-4.378 37.129-14.652 65.789-16.393 102.419 18.09l.495.465c6.26 5.883 9.865 8.279 20.491 8.279h54.396c6.384 0 11.951 3.544 14.853 8.765.031.058.067.113.099.171 1.296 2.397 2.034 5.139 2.034 8.051 0 9.351-7.619 16.958-16.985 16.958h-88.157c-5.522 0-10 4.477-10 10s4.478 10 10 10h88.157c20.394 0 36.985-16.579 36.985-36.958 0-2.77-.316-5.466-.896-8.063l79.028-40.585c7.48-3.84 17.708-3.428 22.786 4.812 4.492 7.263 2.021 16.917-5.744 22.453l-34.667 24.69c-4.499 3.204-5.549 9.448-2.345 13.947 1.951 2.739 5.029 4.2 8.154 4.2 2.007 0 4.033-.603 5.792-1.855l34.671-24.693c16.466-11.739 21.258-32.917 11.156-49.248-9.934-16.122-30.972-21.324-48.94-12.1zm-335.92 120.327c0 3.538-3.001 6.526-6.554 6.526h-39.996c-3.538 0-6.526-2.989-6.526-6.526v-104.968c0-3.614 2.928-6.555 6.526-6.555h39.996c3.553 0 6.554 3.001 6.554 6.555z"
}));
const longArrowToRightIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 493.356 493.356"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M490.498,239.278l-109.632-99.929c-3.046-2.474-6.376-2.95-9.993-1.427c-3.613,1.525-5.427,4.283-5.427,8.282v63.954H9.136 c-2.666,0-4.856,0.855-6.567,2.568C0.859,214.438,0,216.628,0,219.292v54.816c0,2.663,0.855,4.853,2.568,6.563 c1.715,1.712,3.905,2.567,6.567,2.567h356.313v63.953c0,3.812,1.817,6.57,5.428,8.278c3.62,1.529,6.95,0.951,9.996-1.708 l109.632-101.077c1.903-1.902,2.852-4.182,2.852-6.849C493.356,243.367,492.401,241.181,490.498,239.278z"
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
/*!*****************************!*\
  !*** ./src/service/view.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/service/Components/Common/Style.js");
/* harmony import */ var _Components_Common_Service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Service */ "./src/service/Components/Common/Service.js");




document.addEventListener('DOMContentLoaded', () => {
  const serviceEls = document.querySelectorAll('.wp-block-b-blocks-service');
  serviceEls.forEach(serviceEl => {
    const attributes = JSON.parse(serviceEl.dataset.attributes);
    const {
      isTitle,
      title,
      isDesc,
      desc,
      link,
      linkIn
    } = attributes;
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(serviceEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_2__["default"], {
      attributes: attributes,
      id: serviceEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Service__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes
    }, isTitle && title && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, 'title' === linkIn && link ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: link
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "title",
      dangerouslySetInnerHTML: {
        __html: title
      }
    })) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "title",
      dangerouslySetInnerHTML: {
        __html: title
      }
    })), isDesc && desc && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "description",
      dangerouslySetInnerHTML: {
        __html: desc
      }
    }))));
    serviceEl?.removeAttribute('data-attributes');
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map