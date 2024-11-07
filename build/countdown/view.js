/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/countdown/Components/Common/Countdown.js":
/*!******************************************************!*\
  !*** ./src/countdown/Components/Common/Countdown.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CountdownBoxes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CountdownBoxes */ "./src/countdown/Components/Common/CountdownBoxes.js");
/* harmony import */ var _hook_useCountdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hook/useCountdown */ "./src/countdown/hook/useCountdown.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/data */ "./src/countdown/utils/data.js");




const Countdown = ({
  attributes,
  Box,
  closeEl,
  isBackend = false,
  custom = {},
  children
}) => {
  const {
    destDate,
    isResponsive,
    isExpired,
    prefixText,
    suffixButtonText,
    suffixButtonUrl,
    addID,
    addClass,
    isDismiss
  } = attributes;
  const destTime = new Date(destDate).getTime();
  const {
    expired
  } = (0,_hook_useCountdown__WEBPACK_IMPORTED_MODULE_2__["default"])(destTime);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `${_utils_data__WEBPACK_IMPORTED_MODULE_3__.prefix} ${addClass}`,
    id: addID
  }, isExpired && expired ? children : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, prefixText && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "prefixText",
    dangerouslySetInnerHTML: {
      __html: prefixText
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `countdownItems ${isResponsive ? `${_utils_data__WEBPACK_IMPORTED_MODULE_3__.prefix}Responsive` : ''}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_CountdownBoxes__WEBPACK_IMPORTED_MODULE_1__["default"], {
    attributes: attributes,
    Box: Box,
    isBackend: isBackend,
    custom: custom
  })), suffixButtonText && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: "suffixButton",
    href: suffixButtonUrl
  }, suffixButtonText)), isDismiss && closeEl);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Countdown);

/***/ }),

/***/ "./src/countdown/Components/Common/CountdownBoxes.js":
/*!***********************************************************!*\
  !*** ./src/countdown/Components/Common/CountdownBoxes.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook_useCountdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hook/useCountdown */ "./src/countdown/hook/useCountdown.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/functions */ "./src/countdown/utils/functions.js");



const CountdownBoxes = ({
  attributes,
  Box,
  isBackend = false,
  custom = {}
}) => {
  const {
    destDate,
    boxIsInline,
    isLabels,
    isDays,
    daysLabel,
    isHours,
    hoursLabel,
    isMinutes,
    minutesLabel,
    isSeconds,
    secondsLabel,
    hideOn0,
    isSep
  } = attributes;
  const destTime = new Date(destDate).getTime();
  const {
    days,
    hours,
    minutes,
    seconds
  } = (0,_hook_useCountdown__WEBPACK_IMPORTED_MODULE_1__["default"])(destTime, isDays, isHours, isMinutes);

  // Classes
  const boxClass = `${boxIsInline ? 'inline' : ''}`;
  const isDaysHide = hideOn0 && 0 === days;
  const isHoursHide = hideOn0 && 0 === days + hours;
  const isMinutesHide = hideOn0 && 0 === days + hours + minutes;
  const isSecondsHide = hideOn0 && 0 === days + hours + minutes + seconds;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, !isDaysHide && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Box, {
    is: isDays,
    boxClass: `countdownDays ${boxClass}`,
    digit: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.getTwoFixed)(days),
    isLabels: isLabels,
    label: daysLabel,
    onChange: val => isBackend && custom.setAttributes({
      daysLabel: val
    })
  }), isSep && isDays && (isHours || isMinutes || isSeconds) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "separator"
  })), !isHoursHide && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Box, {
    is: isHours,
    boxClass: `countdownHours ${boxClass}`,
    digit: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.getTwoFixed)(hours),
    isLabels: isLabels,
    label: hoursLabel,
    onChange: val => isBackend && custom.setAttributes({
      hoursLabel: val
    })
  }), isSep && isHours && (isMinutes || isSeconds) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "separator"
  })), !isMinutesHide && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Box, {
    is: isMinutes,
    boxClass: `countdownMinutes ${boxClass}`,
    digit: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.getTwoFixed)(minutes),
    isLabels: isLabels,
    label: minutesLabel,
    onChange: val => isBackend && custom.setAttributes({
      minutesLabel: val
    })
  }), isSep && isMinutes && isSeconds && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "separator"
  })), !isSecondsHide && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Box, {
    is: isSeconds,
    boxClass: `countdownSeconds ${boxClass}`,
    digit: (0,_utils_functions__WEBPACK_IMPORTED_MODULE_2__.getTwoFixed)(seconds),
    isLabels: isLabels,
    label: secondsLabel,
    onChange: val => isBackend && custom.setAttributes({
      secondsLabel: val
    })
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CountdownBoxes);

/***/ }),

/***/ "./src/countdown/Components/Common/Style.js":
/*!**************************************************!*\
  !*** ./src/countdown/Components/Common/Style.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../bpl-tools/utils/getCSS */ "../bpl-tools/utils/getCSS.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/data */ "./src/countdown/utils/data.js");



const Style = ({
  attributes,
  id
}) => {
  const {
    boxPosition,
    prefixSuffixDirection = 'row',
    prefixText = '',
    suffixButtonText = '',
    addCSS = '',
    width,
    background,
    padding,
    shadow,
    alignment,
    boxBG,
    boxWidth,
    boxHeight,
    boxSpace,
    boxBorder,
    boxShadow,
    digitTypo,
    digitColor,
    labelTypo,
    labelColor,
    isDaysSingleStyle = false,
    daysBG = {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #4527a4, #8344c5)'
    },
    daysDigitColor = '#fff',
    daysLabelColor = '#fff',
    isHoursSingleStyle = false,
    hoursBG = {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #4527a4, #8344c5)'
    },
    hoursDigitColor = '#fff',
    hoursLabelColor = '#fff',
    isMinutesSingleStyle = false,
    minutesBG = {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #4527a4, #8344c5)'
    },
    minutesDigitColor = '#fff',
    minutesLabelColor = '#fff',
    isSecondsSingleStyle = false,
    secondsBG = {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #4527a4, #8344c5)'
    },
    secondsDigitColor = '#fff',
    secondsLabelColor = '#fff',
    sepType,
    sepSize,
    sepColor,
    prefixTextTypo = {
      fontSize: {
        desktop: 15
      }
    },
    prefixTextColor = '#222',
    suffixButtonTypo = {
      fontSize: {
        desktop: 16
      }
    },
    suffixButtonColors = {
      color: '#fff',
      bg: '#222'
    },
    suffixButtonPadding = {
      vertical: '14px',
      horizontal: '28px'
    },
    dismissColor = '#333'
  } = attributes;
  const mainSl = `#${id}`;
  const itemsSl = `${mainSl} .countdownItems`;
  const itemSl = `${itemsSl} .countdownItem`;
  const timeSl = `${mainSl} .${_utils_data__WEBPACK_IMPORTED_MODULE_2__.prefix}`;
  const singleStyle = (condition, className, bg, digit, label) => condition ? `${itemsSl} .${className}{
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(bg)}
	}
	${itemsSl} .${className} .digit{
		color: ${digit};
	}
	${itemsSl} .${className} .label{
		color: ${label};
	}` : '';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', digitTypo)?.googleFontLink}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', labelTypo)?.googleFontLink}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', prefixTextTypo)?.googleFontLink}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)('', suffixButtonTypo)?.googleFontLink}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${itemSl} .digit`, digitTypo)?.styles}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${itemSl} .label`, labelTypo)?.styles}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${timeSl} .prefixText`, prefixTextTypo)?.styles}
		${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getTypoCSS)(`${timeSl} .suffixButton`, suffixButtonTypo)?.styles}

		${mainSl}{
			align-items: ${alignment};
			justify-content: ${alignment};
		}
		${timeSl}{
			flex-direction: ${prefixSuffixDirection};
			justify-content: ${prefixText || suffixButtonText ? 'space-between' : 'center'};
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(background)}
			padding: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(padding)};
			box-shadow: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getShadowCSS)(shadow)};
		}
		${itemsSl}{
			justify-content: ${boxPosition};
			gap: ${boxSpace};
			margin: ${prefixText || suffixButtonText ? 'column' === prefixSuffixDirection ? '20px 0' : '0 20px' : '0'}
		}
		${itemSl}{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBackgroundCSS)(boxBG)}
			width: ${boxWidth};
			height: ${boxHeight};
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getBorderCSS)(boxBorder)}
			box-shadow: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getShadowCSS)(boxShadow)};
		}
		${itemSl} .digit{
			color: ${digitColor};
		}
		${itemSl} .label{
			color: ${labelColor};
		}
		${singleStyle(isDaysSingleStyle, 'countdownDays', daysBG, daysDigitColor, daysLabelColor)}
		${singleStyle(isHoursSingleStyle, 'countdownHours', hoursBG, hoursDigitColor, hoursLabelColor)}
		${singleStyle(isMinutesSingleStyle, 'countdownMinutes', minutesBG, minutesDigitColor, minutesLabelColor)}
		${singleStyle(isSecondsSingleStyle, 'countdownSeconds', secondsBG, secondsDigitColor, secondsLabelColor)}

		${itemsSl} .separator::before{
			content: '${sepType}';
			font-size: ${sepSize}px;
			color: ${sepColor};
		}
		${timeSl} .prefixText{
			color: ${prefixTextColor};
		}
		${timeSl} .suffixButton{
			${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getColorsCSS)(suffixButtonColors)}
			padding: ${(0,_bpl_tools_utils_getCSS__WEBPACK_IMPORTED_MODULE_1__.getSpaceCSS)(suffixButtonPadding)};
		}
		${timeSl} .countdownClose{
			fill: ${dismissColor};
		}
		${addCSS}
		`.replace(/\s+/g, ' ')
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/countdown/hook/useCountdown.js":
/*!********************************************!*\
  !*** ./src/countdown/hook/useCountdown.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/functions */ "./src/countdown/utils/functions.js");


const useCountdown = (destTime, isDays = true, isHours = true, isMinutes = true) => {
  const [diffTime, setDiffTime] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getDiff)(destTime));
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const interval = setInterval(() => {
      setDiffTime((0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getDiff)(destTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [destTime]);
  return getReturnValues(diffTime, isDays, isHours, isMinutes);
};
const getReturnValues = (diffTime, isDays = true, isHours = true, isMinutes = true) => {
  const days = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getDays)(diffTime);
  const hours = isDays ? (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getHours)(diffTime) : days * 24 + (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getHours)(diffTime);
  const minutes = isHours ? (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getMinutes)(diffTime) : hours * 60 + (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getMinutes)(diffTime);
  const seconds = isMinutes ? (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getSeconds)(diffTime) : minutes * 60 + (0,_utils_functions__WEBPACK_IMPORTED_MODULE_1__.getSeconds)(diffTime);
  const expired = days + hours + minutes + seconds > 0 ? false : true;
  return {
    days,
    hours,
    minutes,
    seconds,
    expired
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useCountdown);

/***/ }),

/***/ "./src/countdown/utils/data.js":
/*!*************************************!*\
  !*** ./src/countdown/utils/data.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = 'bBlocksCountdown';

/***/ }),

/***/ "./src/countdown/utils/functions.js":
/*!******************************************!*\
  !*** ./src/countdown/utils/functions.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDays: () => (/* binding */ getDays),
/* harmony export */   getDiff: () => (/* binding */ getDiff),
/* harmony export */   getHours: () => (/* binding */ getHours),
/* harmony export */   getMinutes: () => (/* binding */ getMinutes),
/* harmony export */   getSeconds: () => (/* binding */ getSeconds),
/* harmony export */   getTwoFixed: () => (/* binding */ getTwoFixed),
/* harmony export */   isMobile: () => (/* binding */ isMobile),
/* harmony export */   isTablet: () => (/* binding */ isTablet)
/* harmony export */ });
const minuteSeconds = 60;
const hourSeconds = 60 * 60;
const daySeconds = 24 * 60 * 60;
const getDiff = time => time > new Date().getTime() ? (time - new Date().getTime()) / 1000 : 0;
const getDays = time => Math.floor(time / daySeconds);
const getHours = time => Math.floor(time % daySeconds / hourSeconds);
const getMinutes = time => Math.floor(time % hourSeconds / minuteSeconds);
const getSeconds = time => Math.floor(time % minuteSeconds);
const getTwoFixed = value => value < 10 ? ('0' + value).slice(-2) : value;
const isMobile = window.matchMedia('(max-width: 576px)');
const isTablet = window.matchMedia('(max-width: 768px)');

/***/ }),

/***/ "./src/countdown/utils/icons.js":
/*!**************************************!*\
  !*** ./src/countdown/utils/icons.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeIcon: () => (/* binding */ closeIcon),
/* harmony export */   countdownIcon: () => (/* binding */ countdownIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const iconColor = '#4527a4';
const countdownIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: 24,
  height: 24,
  viewBox: "0 0 512 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m288 48h-64a24 24 0 0 1 0-48h64a24 24 0 0 1 0 48z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m414.392 129.608c-1.867-1.867-3.772-3.684-5.692-5.477l19.963-26.769a8 8 0 0 0 -1.63-11.195l-25.65-19.13a8 8 0 0 0 -11.2 1.631l-19.844 26.614a224.63 224.63 0 1 0 44.053 34.326zm-158.392 350.392c-105.869 0-192-86.131-192-192s86.131-192 192-192 192 86.131 192 192-86.131 192-192 192z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: iconColor,
  d: "m408 296h-152a8 8 0 0 1 -8-8v-152a8 8 0 0 1 8-8c88.224 0 160 71.775 160 160a8 8 0 0 1 -8 8z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 201.421,
  cy: 145.912,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 160.185,
  cy: 169.732,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 128.327,
  cy: 205.129,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 108.967,
  cy: 248.638,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 104,
  cy: 296,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 113.912,
  cy: 342.579,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 137.732,
  cy: 383.815,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 173.129,
  cy: 415.673,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 216.638,
  cy: 435.033,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 264,
  cy: 440,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 310.579,
  cy: 430.088,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 351.815,
  cy: 406.268,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 383.673,
  cy: 370.871,
  r: 8
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: iconColor,
  cx: 403.033,
  cy: 327.362,
  r: 8
}));
const closeIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  className: "countdownClose",
  xmlns: "http://www.w3.org/2000/svg",
  width: 22,
  height: 22,
  viewBox: "0 0 512 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M256,31C131.7,31,31,131.7,31,256s100.7,225,225,225s225-100.7,225-225S380.3,31,256,31z M366.3,315.1 c4.3,4.3,4.3,11.2,0,15.4l-35.9,35.8c-4.3,4.3-11.2,4.3-15.4,0l-59-59.5l-59.1,59.5c-4.3,4.3-11.2,4.3-15.4,0l-35.8-35.9 c-4.3-4.3-4.3-11.2,0-15.4l59.5-59l-59.5-59.1c-4.3-4.3-4.3-11.2,0-15.4l35.9-35.9c4.3-4.3,11.2-4.3,15.4,0l59,59.6l59.1-59.5 c4.3-4.3,11.2-4.3,15.4,0l35.9,35.9c4.3,4.3,4.3,11.2,0,15.4l-59.6,59L366.3,315.1z"
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

/***/ "./src/countdown/style.scss":
/*!**********************************!*\
  !*** ./src/countdown/style.scss ***!
  \**********************************/
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
/*!*******************************!*\
  !*** ./src/countdown/view.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/countdown/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/countdown/Components/Common/Style.js");
/* harmony import */ var _Components_Common_Countdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/Countdown */ "./src/countdown/Components/Common/Countdown.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/functions */ "./src/countdown/utils/functions.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/icons */ "./src/countdown/utils/icons.js");







document.addEventListener('DOMContentLoaded', () => {
  const countdownEls = document.querySelectorAll('.wp-block-b-blocks-countdown');
  countdownEls.forEach(countdownEl => {
    const attributes = JSON.parse(countdownEl.dataset.attributes);
    const content = JSON.parse(countdownEl.dataset.content);
    const {
      hideOnMobile = false,
      hideOnTablet = false
    } = attributes;
    const ifHideOnMobile = hideOnMobile && _utils_functions__WEBPACK_IMPORTED_MODULE_5__.isMobile.matches;
    const ifHideOnTablet = hideOnTablet && _utils_functions__WEBPACK_IMPORTED_MODULE_5__.isTablet.matches;
    const closeEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      onClick: () => {
        countdownEl.classList.add('transformHidden');
        setTimeout(() => {
          countdownEl.style.display = 'none';
        }, 450);
      }
    }, _utils_icons__WEBPACK_IMPORTED_MODULE_6__.closeIcon);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(countdownEl).render(!ifHideOnMobile && !ifHideOnTablet ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: countdownEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Countdown__WEBPACK_IMPORTED_MODULE_4__["default"], {
      attributes: attributes,
      Box: Box,
      closeEl: closeEl
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "countdownExpired",
      dangerouslySetInnerHTML: {
        __html: content
      }
    }))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null));
    countdownEl?.removeAttribute('data-attributes');
    countdownEl?.removeAttribute('data-content');
  });
});
const Box = props => {
  const {
    is,
    boxClass,
    digit,
    isLabels,
    label
  } = props;
  return is && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `countdownItem ${boxClass}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "digit"
  }, digit), isLabels && label && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "label",
    dangerouslySetInnerHTML: {
      __html: label
    }
  }));
};
/******/ })()
;
//# sourceMappingURL=view.js.map