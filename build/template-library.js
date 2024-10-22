/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/TemplateLibrary/Modal/Modal.js":
/*!****************************************************!*\
  !*** ./src/backend/TemplateLibrary/Modal/Modal.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sidebar */ "./src/backend/TemplateLibrary/Modal/Sidebar.js");
/* harmony import */ var _Templates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Templates */ "./src/backend/TemplateLibrary/Modal/Templates.js");
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/icons */ "./src/backend/TemplateLibrary/utils/icons.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/functions */ "./src/backend/TemplateLibrary/utils/functions.js");
/* harmony import */ var _data_pages_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../data/pages.json */ "./src/backend/TemplateLibrary/data/pages.json");
/* harmony import */ var _data_patterns_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../data/patterns.json */ "./src/backend/TemplateLibrary/data/patterns.json");








const Modal = ({
  isPremium,
  show,
  setShow
}) => {
  const [type, setType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('pages');
  const [category, setCategory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  // Modal outside click
  const contentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let handler = e => {
      if (!contentRef.current?.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  // Filter and search
  const typeFilter = 'pages' === type ? _data_pages_json__WEBPACK_IMPORTED_MODULE_5__ : _data_patterns_json__WEBPACK_IMPORTED_MODULE_6__;
  const categoryFilter = typeFilter.filter(item => 'all' === category ? true : item.categories?.includes(category));
  const filteredItems = search ? (0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.searchData)(search, [..._data_pages_json__WEBPACK_IMPORTED_MODULE_5__, ..._data_patterns_json__WEBPACK_IMPORTED_MODULE_6__]) : categoryFilter;

  // Load More
  const [itemsDisplayed, setItemsDisplayed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(9);
  const itemsPerPage = 9;
  const pageItems = filteredItems.slice(0, itemsDisplayed);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "templateLibraryModalWrap",
    style: {
      visibility: show ? 'visible' : 'hidden'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: contentRef,
    style: {
      marginTop: show ? '0' : '50px',
      transition: 'margin 0.5s ease-out'
    },
    className: "modalContainer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "modalHeader"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalHeaderLogo"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: "https://ps.w.org/b-blocks/assets/icon-128x128.png",
    alt: "B Blocks"
  }), " B Blocks"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    onClick: () => setShow(false),
    className: "modalHeaderClose"
  }, _utils_icons__WEBPACK_IMPORTED_MODULE_3__.closeIcon)), show && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalBody"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Sidebar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    type: type,
    category: category,
    search: search,
    setType: setType,
    setCategory: setCategory,
    setSearch: setSearch,
    setItemsDisplayed: setItemsDisplayed,
    itemsPerPage: itemsPerPage
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Templates__WEBPACK_IMPORTED_MODULE_2__["default"], {
    filteredItems: filteredItems,
    pageItems: pageItems,
    setShow: setShow,
    isPremium: isPremium
  }, itemsDisplayed < filteredItems.length && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "modalBodyTemplateLoadMore libraryBtn active",
    onClick: () => setItemsDisplayed(itemsDisplayed + itemsPerPage)
  }, "Load More")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ }),

/***/ "./src/backend/TemplateLibrary/Modal/Sidebar.js":
/*!******************************************************!*\
  !*** ./src/backend/TemplateLibrary/Modal/Sidebar.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/options */ "./src/backend/TemplateLibrary/utils/options.js");




const Sidebar = ({
  type,
  setType,
  category,
  setCategory,
  setSearch,
  setItemsDisplayed,
  itemsPerPage
}) => {
  const handleSearch = event => {
    setSearch(event.target.value);
    setItemsDisplayed(itemsPerPage);
  };
  const categories = 'pages' === type ? _utils_options__WEBPACK_IMPORTED_MODULE_3__.pageCategories : _utils_options__WEBPACK_IMPORTED_MODULE_3__.patternCategories;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("aside", {
    className: "modalBodySidebar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalBodySidebarSearch"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Search",
    onChange: handleSearch
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    onClick: handleSearch,
    xmlns: "http://www.w3.org/2000/svg",
    height: "16",
    width: "16",
    viewBox: "0 0 512 512"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
    className: "bPlTabPanel",
    activeClass: "activeTab",
    tabs: [{
      name: 'pages',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pages', 'b-blocks')
    }, {
      name: 'patterns',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Patterns', 'b-blocks')
    }],
    onSelect: tabName => {
      setType(tabName);
      setCategory('all');
      setItemsDisplayed(itemsPerPage);
    }
  }, () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "modalBodySidebarCategories"
  }, categories.map((cat, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    onClick: () => {
      setCategory(cat.name);
      setItemsDisplayed(itemsPerPage);
    },
    className: `libraryBtn ${cat.name === category ? 'active' : ''}`,
    key: i
  }, cat.label)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sidebar);

/***/ }),

/***/ "./src/backend/TemplateLibrary/Modal/Templates.js":
/*!********************************************************!*\
  !*** ./src/backend/TemplateLibrary/Modal/Templates.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/icons */ "./src/backend/TemplateLibrary/utils/icons.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/data */ "./src/utils/data.js");





const Templates = ({
  filteredItems,
  pageItems,
  isPremium,
  setShow,
  children
}) => {
  return filteredItems.length ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalBodyTemplates"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid columns-3 columns-tablet-1 columns-mobile-1"
  }, pageItems.map((item, index) => {
    const {
      title,
      pro,
      content
    } = item;
    const hasAccess = isPremium || !pro;
    const linkProps = hasAccess ? {
      onClick: () => {
        const blocks = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.parse)(content);
        wp.data.dispatch('core/block-editor').insertBlocks(blocks);
        setShow(false);
      }
    } : {
      href: `${_utils_data__WEBPACK_IMPORTED_MODULE_4__.siteURL}#pricing`,
      target: '_blank',
      rel: 'noreferrer'
    };
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "modalBodyTemplateItem",
      key: index
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "modalBodyTemplateItemPreviewWrap"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "modalBodyTemplateItemPreview"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockPreview, {
      blocks: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.parse)(content),
      viewportWidth: 700
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "modalBodyTemplateItemButton"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      ...linkProps
    }, hasAccess ? 'Import' : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "Get Pro", _utils_icons__WEBPACK_IMPORTED_MODULE_3__.externalIcon)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "modalBodyTemplateItemTitle"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, title), hasAccess ? '' : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "modalBodyTemplateItemProBadge"
    }, "Pro")));
  })), children) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modalBodyTemplateNotFound"
  }, "No Templates Found!!");
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Templates);

/***/ }),

/***/ "./src/backend/TemplateLibrary/TemplateLibrary.js":
/*!********************************************************!*\
  !*** ./src/backend/TemplateLibrary/TemplateLibrary.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _TemplateLibrary_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TemplateLibrary.scss */ "./src/backend/TemplateLibrary/TemplateLibrary.scss");
/* harmony import */ var _Modal_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Modal/Modal */ "./src/backend/TemplateLibrary/Modal/Modal.js");
/* harmony import */ var _hooks_usePremiumInEditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/usePremiumInEditor */ "./src/hooks/usePremiumInEditor.js");






const TemplateLibrary = () => {
  const {
    isPremium
  } = (0,_hooks_usePremiumInEditor__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "templateLibraryButton",
    onClick: () => setShow(true)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: "https://ps.w.org/b-blocks/assets/icon-128x128.png",
    alt: "B Blocks"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Template Library', 'b-blocks')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Modal_Modal__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isPremium: isPremium,
    show: show,
    setShow: setShow
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TemplateLibrary);

/***/ }),

/***/ "./src/backend/TemplateLibrary/utils/functions.js":
/*!********************************************************!*\
  !*** ./src/backend/TemplateLibrary/utils/functions.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   searchData: () => (/* binding */ searchData)
/* harmony export */ });
const searchData = (searchText, data) => {
  const srcTxt = searchText.toLowerCase().trim();
  return data.filter(item => {
    const {
      title = '',
      type = '',
      categories = [],
      keywords = []
    } = item;
    const lowerCaseCategories = categories.map(category => category.toLowerCase());
    const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());
    return title.toLowerCase()?.includes(srcTxt) || type.toLowerCase()?.includes(srcTxt) || lowerCaseCategories?.some(category => category.includes(srcTxt)) || lowerCaseKeywords?.some(keyword => keyword.includes(srcTxt));
  });
};

/***/ }),

/***/ "./src/backend/TemplateLibrary/utils/icons.js":
/*!****************************************************!*\
  !*** ./src/backend/TemplateLibrary/utils/icons.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeIcon: () => (/* binding */ closeIcon),
/* harmony export */   externalIcon: () => (/* binding */ externalIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const closeIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  height: "16",
  width: "12",
  viewBox: "0 0 384 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
}));
const externalIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  height: "11",
  width: "11",
  viewBox: "0 0 512 512",
  fill: "currentColor"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
}));

/***/ }),

/***/ "./src/backend/TemplateLibrary/utils/options.js":
/*!******************************************************!*\
  !*** ./src/backend/TemplateLibrary/utils/options.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pageCategories: () => (/* binding */ pageCategories),
/* harmony export */   patternCategories: () => (/* binding */ patternCategories)
/* harmony export */ });
const patternCategories = [{
  label: 'All',
  name: 'all'
}, {
  label: 'Countdown',
  name: 'countdown'
}, {
  label: 'Slider',
  name: 'slider'
}, {
  label: 'CTA',
  name: 'cta'
}];
const pageCategories = [{
  label: 'All',
  name: 'all'
}];

/***/ }),

/***/ "./src/hooks/usePremiumInEditor.js":
/*!*****************************************!*\
  !*** ./src/hooks/usePremiumInEditor.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_utils_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../react-utils/hooks */ "../react-utils/hooks/index.js");


const usePremiumInEditor = () => {
  const {
    data: bBlocksUtils
  } = (0,_react_utils_hooks__WEBPACK_IMPORTED_MODULE_1__.useWPOptionQuery)('bBlocksUtils');
  const {
    data = null,
    refetch,
    isLoading = true
  } = (0,_react_utils_hooks__WEBPACK_IMPORTED_MODULE_1__.useWPAjax)('bBlocksPipeChecker', {
    _wpnonce: bBlocksUtils?.nonce
  }, true);
  const isPremium = !isLoading && data?.isPipe || false;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    refetch();
  }, [bBlocksUtils]);
  return {
    isPremium,
    isLoading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (usePremiumInEditor);

/***/ }),

/***/ "./src/utils/data.js":
/*!***************************!*\
  !*** ./src/utils/data.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alertDocs: () => (/* binding */ alertDocs),
/* harmony export */   animatedTextDocs: () => (/* binding */ animatedTextDocs),
/* harmony export */   chartDocs: () => (/* binding */ chartDocs),
/* harmony export */   countdownDocs: () => (/* binding */ countdownDocs),
/* harmony export */   countersDocs: () => (/* binding */ countersDocs),
/* harmony export */   docsURL: () => (/* binding */ docsURL),
/* harmony export */   gifDocs: () => (/* binding */ gifDocs),
/* harmony export */   imbCompareDocs: () => (/* binding */ imbCompareDocs),
/* harmony export */   mailToDocs: () => (/* binding */ mailToDocs),
/* harmony export */   pluginSlug: () => (/* binding */ pluginSlug),
/* harmony export */   pricingTableDocs: () => (/* binding */ pricingTableDocs),
/* harmony export */   qrCodeDocs: () => (/* binding */ qrCodeDocs),
/* harmony export */   rowDocs: () => (/* binding */ rowDocs),
/* harmony export */   servicesDocs: () => (/* binding */ servicesDocs),
/* harmony export */   siteURL: () => (/* binding */ siteURL),
/* harmony export */   socialShareDocs: () => (/* binding */ socialShareDocs),
/* harmony export */   tdViewerDocs: () => (/* binding */ tdViewerDocs),
/* harmony export */   teamMembersDocs: () => (/* binding */ teamMembersDocs)
/* harmony export */ });
const pluginSlug = 'b-blocks';
const siteURL = 'https://bblockswp.com/';
const docsURL = `${siteURL}docs/`;
const tdViewerDocs = `${docsURL}3d-viewer-block/`;
const alertDocs = `${docsURL}alert-block/`;
const animatedTextDocs = `${docsURL}animated-text-block/`;
const chartDocs = `${docsURL}chart-block/`;
const countdownDocs = `${docsURL}countdown-block/`;
const countersDocs = `${docsURL}counters-block/`;
const gifDocs = `${docsURL}gif-block/`;
const imbCompareDocs = `${docsURL}image-comparison-block/`;
const mailToDocs = `${docsURL}mail-to-block/`;
const pricingTableDocs = `${docsURL}pricing-table-block/`;
const qrCodeDocs = `${docsURL}qr-code-block/`;
const rowDocs = `${docsURL}row-block/`;
const servicesDocs = `${docsURL}services-section-block/`;
const socialShareDocs = `${docsURL}social-share-block/`;
const teamMembersDocs = `${docsURL}team-block/`;

/***/ }),

/***/ "../react-utils/hooks/index.js":
/*!*************************************!*\
  !*** ../react-utils/hooks/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useWPAjax: () => (/* reexport safe */ _useWPAjax__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useWPOptionQuery: () => (/* reexport safe */ _useWPOptionQuery__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _useWPAjax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useWPAjax */ "../react-utils/hooks/useWPAjax.js");
/* harmony import */ var _useWPOptionQuery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useWPOptionQuery */ "../react-utils/hooks/useWPOptionQuery.js");




/***/ }),

/***/ "../react-utils/hooks/useWPAjax.js":
/*!*****************************************!*\
  !*** ../react-utils/hooks/useWPAjax.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const useWPAjax = (action, params = {}, set = true) => {
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isError, setIsError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  if (!wp.ajax) {
    // eslint-disable-next-line no-console
    console.error('Please use wp-util as a dependency');
    return;
  }
  const sendRequest = (payload = {}) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    wp.ajax.post(action, {
      ...params,
      ...payload
    }).done(res => {
      setIsLoading(false);
      setData(res);
    }).fail(error => {
      setIsLoading(false);
      setIsError(true);
      setError(error);
    });
  };
  const request = async (payload = {}) => {
    sendRequest(payload);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (set) {
      sendRequest(params);
    }
  }, []);
  return {
    data,
    saveData: request,
    refetch: request,
    isLoading,
    isError,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useWPAjax);

/***/ }),

/***/ "../react-utils/hooks/useWPOptionQuery.js":
/*!************************************************!*\
  !*** ../react-utils/hooks/useWPOptionQuery.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const useWPOptionQuery = key => {
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [isError, setIsError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setIsError(false);
    setError(null);
    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings();
      settings.fetch().then(response => {
        setData(prepareData(response[key]));
        setIsLoading(false);
      });
    });
  }, []);
  const prepareData = data => {
    let newData = data;
    try {
      newData = JSON.parse(data);
    } catch (error) {
      setIsError(true);
      setError(error.message);
    }
    return newData;
  };
  return {
    data,
    isLoading,
    isError,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useWPOptionQuery);

/***/ }),

/***/ "./src/backend/TemplateLibrary/TemplateLibrary.scss":
/*!**********************************************************!*\
  !*** ./src/backend/TemplateLibrary/TemplateLibrary.scss ***!
  \**********************************************************/
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

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/backend/TemplateLibrary/data/pages.json":
/*!*****************************************************!*\
  !*** ./src/backend/TemplateLibrary/data/pages.json ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = [];

/***/ }),

/***/ "./src/backend/TemplateLibrary/data/patterns.json":
/*!********************************************************!*\
  !*** ./src/backend/TemplateLibrary/data/patterns.json ***!
  \********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('[{"name":"csb-patterns/slider-banner-1","title":"Slider Banner 1","description":"Content Slider Block Design","type":"patterns","categories":["slider","carousel","banner"],"keywords":["content slider","carousel block","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"align\\":\\"full\\",\\"cId\\":\\"b050b35d-8\\",\\"slides\\":[{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/black-and-brown-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"}},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":35,\\"right\\":36.822429906542055,\\"bottom\\":45.46153846153846,\\"left\\":36.822429906542055},{\\"top\\":48.46153846153846,\\"right\\":38.53582554517134,\\"bottom\\":51.53846153846154,\\"left\\":38.53582554517134},{\\"top\\":54.53846153846154,\\"right\\":46.35514018691589,\\"bottom\\":61,\\"left\\":46.35514018691589}],\\"title\\":\\"Slide Title 1\\",\\"titleColor\\":\\"#fff\\",\\"description\\":\\"This content area describes slider 1 descriptions/details.\\",\\"descColor\\":\\"#fff\\",\\"btnText\\":\\"Button 1\\",\\"btnLink\\":\\"#\\",\\"btnColors\\":{\\"color\\":\\"#fff\\",\\"bg\\":\\"rgba(0, 0, 0, 0)\\",\\"bgType\\":\\"solid\\"},\\"btnHovColors\\":{\\"color\\":\\"rgba(55, 55, 55, 1)\\",\\"bg\\":\\"rgba(255, 255, 255, 1)\\",\\"bgType\\":\\"solid\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/gray-and-brown-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"}},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":35,\\"right\\":36.60436137071651,\\"bottom\\":45.46153846153846,\\"left\\":36.60436137071651},{\\"top\\":48.46153846153846,\\"right\\":38.53582554517134,\\"bottom\\":51.53846153846154,\\"left\\":38.53582554517134},{\\"top\\":54.53846153846154,\\"right\\":46.32398753894081,\\"bottom\\":61,\\"left\\":46.32398753894081}],\\"title\\":\\"Slide Title 2\\",\\"titleColor\\":\\"#fff\\",\\"description\\":\\"This content area describes slider 2 descriptions/details.\\",\\"descColor\\":\\"#fff\\",\\"btnText\\":\\"Button 2\\",\\"btnLink\\":\\"#\\",\\"btnColors\\":{\\"color\\":\\"#fff\\",\\"bg\\":\\"rgba(0, 0, 0, 0)\\",\\"bgType\\":\\"solid\\"},\\"btnHovColors\\":{\\"color\\":\\"rgba(55, 55, 55, 1)\\",\\"bg\\":\\"rgba(255, 255, 255, 1)\\",\\"bgType\\":\\"solid\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/green-forest-near-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"}},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":35,\\"right\\":36.60436137071651,\\"bottom\\":45.46153846153846,\\"left\\":36.60436137071651},{\\"top\\":48.46153846153846,\\"right\\":38.53582554517134,\\"bottom\\":51.53846153846154,\\"left\\":38.53582554517134},{\\"top\\":54.53846153846154,\\"right\\":46.32398753894081,\\"bottom\\":61,\\"left\\":46.32398753894081}],\\"title\\":\\"Slide Title 3\\",\\"titleColor\\":\\"#fff\\",\\"description\\":\\"This content area describes slider 3 descriptions/details.\\",\\"descColor\\":\\"#fff\\",\\"btnText\\":\\"Button 3\\",\\"btnLink\\":\\"#\\",\\"btnColors\\":{\\"color\\":\\"#fff\\",\\"bg\\":\\"rgba(0, 0, 0, 0)\\",\\"bgType\\":\\"solid\\"},\\"btnHovColors\\":{\\"color\\":\\"rgba(55, 55, 55, 1)\\",\\"bg\\":\\"rgba(255, 255, 255, 1)\\",\\"bgType\\":\\"solid\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/green-hill.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"}},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":35,\\"right\\":36.573208722741434,\\"bottom\\":45.46153846153846,\\"left\\":36.573208722741434},{\\"top\\":48.46153846153846,\\"right\\":38.53582554517134,\\"bottom\\":51.53846153846154,\\"left\\":38.53582554517134},{\\"top\\":54.53846153846154,\\"right\\":46.32398753894081,\\"bottom\\":61,\\"left\\":46.32398753894081}],\\"title\\":\\"Slide Title 4\\",\\"titleColor\\":\\"#fff\\",\\"description\\":\\"This content area describes slider 4 descriptions/details.\\",\\"descColor\\":\\"#fff\\",\\"btnText\\":\\"Button 4\\",\\"btnLink\\":\\"#\\",\\"btnColors\\":{\\"color\\":\\"#fff\\",\\"bg\\":\\"rgba(0, 0, 0, 0)\\",\\"bgType\\":\\"solid\\"},\\"btnHovColors\\":{\\"color\\":\\"rgba(55, 55, 55, 1)\\",\\"bg\\":\\"rgba(255, 255, 255, 1)\\",\\"bgType\\":\\"solid\\"}}],\\"sliderHeight\\":\\"650px\\",\\"pageWidth\\":\\"36px\\",\\"pageHeight\\":\\"2px\\",\\"pageBorder\\":{\\"radius\\":\\"50%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"titleTypo\\":{\\"fontSize\\":{\\"desktop\\":50,\\"tablet\\":40,\\"mobile\\":30},\\"googleFontLink\\":\\"https://fonts.googleapis.com/css2?family=Oswald:wght@300&display=swap\\",\\"fontFamily\\":\\"Oswald\\",\\"fontCategory\\":\\"sans-serif\\",\\"fontWeight\\":300,\\"fontVariant\\":\\"300\\",\\"textTransform\\":\\"uppercase\\",\\"letterSpace\\":\\"15px\\",\\"lineHeight\\":\\"135%\\"},\\"btnTypo\\":{\\"fontSize\\":{\\"desktop\\":12,\\"tablet\\":12,\\"mobile\\":12},\\"fontFamily\\":\\"Oswald\\",\\"fontCategory\\":\\"sans-serif\\",\\"fontWeight\\":400,\\"fontVariant\\":400,\\"textTransform\\":\\"uppercase\\",\\"letterSpace\\":\\"4.5px\\"},\\"btnPadding\\":{\\"vertical\\":\\"13px\\",\\"horizontal\\":\\"19px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"btnBorder\\":{\\"radius\\":\\"0px\\",\\"width\\":\\"1px\\",\\"style\\":\\"solid\\",\\"color\\":\\"rgba(225, 225, 225, 1)\\",\\"side\\":\\"all\\"}} /-->"},{"name":"csb-patterns/slider-cube-1","title":"Cube Slider 1","description":"Awesome Cube Slider","type":"patterns","categories":["slider","carousel","cube"],"keywords":["content slider","cube slider","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"cId\\":\\"1365abf8-7\\",\\"slides\\":[{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/orange-petaled-flower.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/pink-flowers.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/red-petal-flower.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/white-blooming-flower-under-the-tree.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}}],\\"sliderWidth\\":\\"380px\\",\\"effect\\":\\"cube\\",\\"isPrevNext\\":false,\\"isTitle\\":false,\\"isDesc\\":false,\\"isBtn\\":false} /-->"},{"name":"csb-patterns/slider-creative-1","title":"Creative Slider 1","description":"Awesome Creative Slider","type":"patterns","categories":["slider","carousel","creative"],"keywords":["content slider","creative slider","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"cId\\":\\"8e77f4e1-a\\",\\"slides\\":[{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/green-grass-field.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/wheat-plants.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/white-blooming-flower-under-the-tree.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/white-daisy-on-grass.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}}],\\"effect\\":\\"creative\\",\\"isPage\\":false,\\"isTitle\\":false,\\"isDesc\\":false,\\"isBtn\\":false} /-->"},{"name":"csb-patterns/slider-coverflow-1","title":"Coverflow Slider 1","description":"Awesome Coverflow Slider","type":"patterns","categories":["slider","carousel","coverflow"],"keywords":["content slider","coverflow slider","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"cId\\":\\"06331073-d\\",\\"slides\\":[{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/black-and-brown-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/gray-and-brown-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/green-forest-near-mountain.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/green-hill.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}}],\\"columns\\":{\\"desktop\\":3,\\"tablet\\":2,\\"mobile\\":1},\\"effect\\":\\"coverflow\\",\\"isPrevNext\\":false,\\"isTitle\\":false,\\"isDesc\\":false,\\"isBtn\\":false} /-->"},{"name":"csb-patterns/slider-flip-1","title":"Flip Slider 1","description":"Awesome Flip Slider","type":"patterns","categories":["slider","carousel","flip"],"keywords":["content slider","flip slider","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"cId\\":\\"7be38db9-c\\",\\"slides\\":[{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/orange-petaled-flower.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/pink-flowers.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/red-petal-flower.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}},{\\"background\\":{\\"type\\":\\"image\\",\\"image\\":{\\"id\\":null,\\"url\\":\\"https://csb.bplugins.com/wp-content/pattern/white-blooming-flower-under-the-tree.jpg\\",\\"alt\\":\\"\\",\\"title\\":\\"\\"},\\"overlayColor\\":\\"rgba(0, 0, 0, 0)\\"}}],\\"sliderWidth\\":\\"480px\\",\\"effect\\":\\"flip\\",\\"isPage\\":false,\\"sliderPadding\\":{\\"vertical\\":\\"0px\\",\\"horizontal\\":\\"50px\\",\\"side\\":2},\\"pageColor\\":\\"rgba(69, 39, 164, 1)\\",\\"prevNextColor\\":\\"rgba(69, 39, 164, 1)\\",\\"isTitle\\":false,\\"isDesc\\":false,\\"isBtn\\":false} /-->"},{"name":"csb-patterns/slider-cards-1","title":"Cards Slider 1","description":"Awesome Cards Slider","type":"patterns","categories":["slider","carousel","cards"],"keywords":["content slider","cards slider","carousel slider"],"blockTypes":["b-blocks/slider"],"pro":true,"content":"<!-- wp:b-blocks/slider {\\"cId\\":\\"a06f34b9-3\\",\\"slides\\":[{\\"background\\":{\\"color\\":\\"rgba(255, 0, 0, 1)\\",\\"type\\":\\"solid\\"},\\"border\\":{\\"radius\\":\\"20px\\"},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":45.75,\\"right\\":37.666666666666664,\\"bottom\\":54.25,\\"left\\":37.666666666666664}],\\"title\\":\\"Slide 1\\",\\"titleColor\\":\\"#fff\\"},{\\"background\\":{\\"color\\":\\"rgba(255, 69, 0, 1)\\",\\"type\\":\\"solid\\"},\\"border\\":{\\"radius\\":\\"20px\\"},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":45.75,\\"right\\":37.666666666666664,\\"bottom\\":54.25,\\"left\\":37.666666666666664}],\\"title\\":\\"Slide 2\\",\\"titleColor\\":\\"#fff\\"},{\\"background\\":{\\"color\\":\\"rgba(0, 128, 0, 1)\\",\\"type\\":\\"solid\\"},\\"border\\":{\\"radius\\":\\"20px\\"},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":45.75,\\"right\\":37.666666666666664,\\"bottom\\":54.25,\\"left\\":37.666666666666664}],\\"title\\":\\"Slide 3\\",\\"titleColor\\":\\"#fff\\"},{\\"background\\":{\\"color\\":\\"rgba(0, 0, 255, 1)\\",\\"type\\":\\"solid\\"},\\"border\\":{\\"radius\\":\\"20px\\"},\\"position\\":\\"center center\\",\\"childPositions\\":[{\\"top\\":45.75,\\"right\\":37.666666666666664,\\"bottom\\":54.25,\\"left\\":37.666666666666664}],\\"title\\":\\"Slide 4\\",\\"titleColor\\":\\"#fff\\"}],\\"sliderWidth\\":\\"400px\\",\\"sliderHeight\\":\\"500px\\",\\"effect\\":\\"cards\\",\\"isPage\\":false,\\"isPrevNext\\":false,\\"sliderPadding\\":{\\"vertical\\":\\"50px\\",\\"horizontal\\":\\"50px\\"},\\"isDesc\\":false,\\"isBtn\\":false} /-->"},{"name":"bb-patterns/countdown-cta-1","title":"Countdown CTA 1","description":"Countdown Time Design","type":"patterns","categories":["countdown","cta"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown","core/heading","core/paragraph"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"747e593f-d\\",\\"destDate\\":\\"\\",\\"isDays\\":false,\\"isExpired\\":true,\\"prefixSuffixDirection\\":\\"column\\",\\"prefixText\\":\\"The fresh deal ends in:\\",\\"suffixButtonText\\":\\"Shop Now\\",\\"width\\":\\"700px\\",\\"background\\":{\\"type\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(255,255,255) 0%,rgb(242,243,244) 100%)\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"5px\\",\\"blur\\":\\"10px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"rgba(170, 170, 170, 1)\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(85,85,85) 0%,rgb(34,34,34) 100%)\\"},\\"boxWidth\\":\\"100px\\",\\"boxHeight\\":\\"100px\\",\\"boxSpace\\":\\"60px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":42,\\"tablet\\":36,\\"mobile\\":30}},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":12,\\"tablet\\":12,\\"mobile\\":12},\\"textTransform\\":\\"uppercase\\",\\"fontWeight\\":600,\\"fontVariant\\":\\"600\\"},\\"isSep\\":true,\\"sepSize\\":79,\\"sepColor\\":\\"rgba(85, 85, 85, 1)\\",\\"prefixTextTypo\\":{\\"fontSize\\":{\\"desktop\\":28,\\"tablet\\":26,\\"mobile\\":22},\\"fontStyle\\":\\"italic\\"},\\"prefixTextColor\\":\\"rgba(85, 85, 85, 1)\\",\\"suffixButtonTypo\\":{\\"fontSize\\":{\\"desktop\\":16,\\"tablet\\":16,\\"mobile\\":16},\\"fontWeight\\":600,\\"fontVariant\\":\\"600\\",\\"textTransform\\":\\"uppercase\\"},\\"suffixButtonColors\\":{\\"color\\":\\"#fff\\",\\"bgType\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(85,85,85) 0%,rgb(34,34,34) 100%)\\"},\\"suffixButtonPadding\\":{\\"vertical\\":\\"14px\\",\\"horizontal\\":\\"38px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"}} --><!-- wp:heading {\\"textAlign\\":\\"center\\",\\"level\\":3,\\"style\\":{\\"color\\":{\\"text\\":\\"#dc3545\\"}}} --> <h3 class=\\"has-text-align-center has-text-color\\" style=\\"color:#dc3545\\">Oops! the deal just expired!</h3> <!-- /wp:heading --> <!-- wp:paragraph {\\"style\\":{\\"color\\":{\\"text\\":\\"#222\\"}}} --> <p class=\\"has-text-color\\" style=\\"color:#222\\">But don\\"t worry! we will announce next deal as soon as possible. Stay with us.</p> <!-- /wp:paragraph --><!-- /wp:b-blocks/countdown -->"},{"name":"bb-patterns/countdown-cta-2","title":"Countdown CTA 2","description":"Countdown Time Design","type":"patterns","categories":["countdown","cta"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown","core/heading"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"bd6e1ae5-5\\",\\"destDate\\":\\"\\",\\"isDays\\":false,\\"isExpired\\":true,\\"prefixSuffixDirection\\":\\"column\\",\\"prefixText\\":\\"Hurry up! ends in:\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(69, 234, 1, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(0, 0, 0, 0)\\"},\\"boxWidth\\":\\"100px\\",\\"boxHeight\\":\\"100px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":50,\\"tablet\\":40,\\"mobile\\":30},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"digitColor\\":\\"rgba(0, 0, 0, 1)\\",\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\",\\"textTransform\\":\\"uppercase\\"},\\"labelColor\\":\\"rgba(0, 0, 0, 1)\\",\\"isSep\\":true,\\"sepColor\\":\\"rgba(0, 0, 0, 1)\\",\\"prefixTextTypo\\":{\\"fontSize\\":{\\"desktop\\":28,\\"tablet\\":26,\\"mobile\\":22},\\"textTransform\\":\\"uppercase\\",\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"prefixTextColor\\":\\"rgba(0, 0, 0, 1)\\"} --> <!-- wp:heading {\\"textAlign\\":\\"center\\",\\"level\\":3,\\"style\\":{\\"typography\\":{\\"textTransform\\":\\"uppercase\\",\\"fontStyle\\":\\"normal\\",\\"fontWeight\\":\\"700\\"}},\\"textColor\\":\\"black\\",\\"fontSize\\":\\"large\\"} --> <h3 class=\\"has-text-align-center has-black-color has-text-color has-large-font-size\\" style=\\"font-style:normal;font-weight:700;text-transform:uppercase\\">You\\"re too late!</h3> <!-- /wp:heading --> <!-- /wp:b-blocks/countdown -->"},{"name":"bb-patterns/countdown-cta-3","title":"Countdown CTA 3","description":"Countdown Time Design","type":"patterns","categories":["countdown","cta"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown","core/heading"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"6276ce3b-7\\",\\"destDate\\":\\"\\",\\"isExpired\\":true,\\"prefixSuffixDirection\\":\\"column\\",\\"prefixText\\":\\"🔥BIg Sale! 50% Off.\\",\\"suffixButtonText\\":\\"See all offers\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(27, 27, 27, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(34, 77, 255, 1)\\"},\\"boxWidth\\":\\"120px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"digitColor\\":\\"rgba(238, 238, 238, 1)\\",\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16}},\\"prefixTextTypo\\":{\\"fontSize\\":{\\"desktop\\":38,\\"tablet\\":34,\\"mobile\\":30},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"prefixTextColor\\":\\"rgba(255, 255, 255, 1)\\",\\"suffixButtonTypo\\":{\\"fontSize\\":{\\"desktop\\":16,\\"tablet\\":16,\\"mobile\\":16},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"suffixButtonColors\\":{\\"color\\":\\"rgba(27, 27, 27, 1)\\",\\"bg\\":\\"rgba(255, 193, 34, 1)\\",\\"bgType\\":\\"solid\\"},\\"suffixButtonPadding\\":{\\"vertical\\":\\"14px\\",\\"horizontal\\":\\"28px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"}} --> <!-- wp:heading {\\"textAlign\\":\\"center\\",\\"level\\":3,\\"textColor\\":\\"white\\"} --> <h3 class=\\"has-text-align-center has-white-color has-text-color\\">Oops! the offers just expired!</h3> <!-- /wp:heading --> <!-- /wp:b-blocks/countdown -->"},{"name":"bb-patterns/countdown-cta-4","title":"Countdown CTA 4","description":"Countdown Time Design","type":"patterns","categories":["countdown","cta"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown","core/heading"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"0a7b415b-a\\",\\"destDate\\":\\"\\",\\"isDays\\":false,\\"isExpired\\":true,\\"prefixSuffixDirection\\":\\"column\\",\\"prefixText\\":\\"Save up to 35%! Only for a short time!\\",\\"suffixButtonText\\":\\"About the offers\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(37, 34, 37, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(0, 0, 0, 0)\\"},\\"boxWidth\\":\\"150px\\",\\"boxSpace\\":\\"20px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"2px\\",\\"style\\":\\"solid\\",\\"color\\":\\"rgba(255, 255, 255, 1)\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32}},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":16,\\"tablet\\":16,\\"mobile\\":16},\\"textTransform\\":\\"uppercase\\",\\"fontWeight\\":600,\\"fontVariant\\":\\"600\\"},\\"prefixTextTypo\\":{\\"fontSize\\":{\\"desktop\\":22,\\"tablet\\":20,\\"mobile\\":18},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"prefixTextColor\\":\\"rgba(255, 255, 255, 1)\\",\\"suffixButtonTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16},\\"textTransform\\":\\"uppercase\\",\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"suffixButtonColors\\":{\\"color\\":\\"rgba(34, 34, 34, 1)\\",\\"bg\\":\\"rgba(253, 215, 1, 1)\\",\\"bgType\\":\\"solid\\"},\\"suffixButtonPadding\\":{\\"vertical\\":\\"14px\\",\\"horizontal\\":\\"28px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"}} --> <!-- wp:heading {\\"textAlign\\":\\"center\\",\\"level\\":3,\\"textColor\\":\\"white\\"} --> <h3 class=\\"has-text-align-center has-white-color has-text-color\\">Oops! the offers just expired!</h3> <!-- /wp:heading --> <!-- /wp:b-blocks/countdown -->"},{"name":"bb-patterns/countdown-cta-5","title":"Countdown CTA 5","description":"Countdown Time Design","type":"patterns","categories":["countdown","cta"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown","core/heading"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"e9182de8-6\\",\\"destDate\\":\\"\\",\\"isLabels\\":false,\\"isDays\\":false,\\"isExpired\\":true,\\"prefixSuffixDirection\\":\\"column\\",\\"prefixText\\":\\"10% OFF!<br />When you complete order in...\\",\\"suffixButtonText\\":\\"Get my 10% off! \\",\\"width\\":\\"700px\\",\\"background\\":{\\"type\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(224,72,113) 0%,rgb(241,157,183) 100%)\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(255, 255, 255, 1)\\"},\\"boxWidth\\":\\"100px\\",\\"boxHeight\\":\\"100px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"digitColor\\":\\"rgba(34, 34, 34, 1)\\",\\"isSep\\":true,\\"sepSize\\":80,\\"sepColor\\":\\"rgba(255, 255, 255, 1)\\",\\"prefixTextTypo\\":{\\"fontSize\\":{\\"desktop\\":20,\\"tablet\\":18,\\"mobile\\":16},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"prefixTextColor\\":\\"rgba(255, 255, 255, 1)\\",\\"suffixButtonTypo\\":{\\"fontSize\\":{\\"desktop\\":14,\\"tablet\\":14,\\"mobile\\":14},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\",\\"textTransform\\":\\"uppercase\\"},\\"suffixButtonColors\\":{\\"color\\":\\"#fff\\",\\"bg\\":\\"#222\\",\\"bgType\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(230,100,138) 0%,rgb(230,72,115) 100%)\\"},\\"suffixButtonPadding\\":{\\"vertical\\":\\"14px\\",\\"horizontal\\":\\"28px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"}} --> <!-- wp:heading {\\"textAlign\\":\\"center\\",\\"level\\":3,\\"textColor\\":\\"white\\"} --> <h3 class=\\"has-text-align-center has-white-color has-text-color\\">Oops! the offers just expired!</h3> <!-- /wp:heading --> <!-- /wp:b-blocks/countdown -->"},{"name":"bb-patterns/countdown-1","title":"Countdown Time 1","description":"Countdown Time Design","type":"patterns","categories":["countdown"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown"],"pro":true,"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"941a1f86-e\\",\\"destDate\\":\\"\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(221, 222, 224, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"50px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(255, 255, 255, 1)\\"},\\"boxWidth\\":\\"100px\\",\\"boxHeight\\":\\"100px\\",\\"boxSpace\\":\\"50px\\",\\"boxBorder\\":{\\"radius\\":\\"3%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":44,\\"tablet\\":38,\\"mobile\\":32},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"digitColor\\":\\"rgba(34, 34, 34, 1)\\",\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":14,\\"tablet\\":14,\\"mobile\\":14},\\"textTransform\\":\\"uppercase\\",\\"letterSpace\\":\\"3px\\",\\"fontWeight\\":500,\\"fontVariant\\":\\"500\\"},\\"labelColor\\":\\"rgba(34, 34, 34, 1)\\",\\"isHoursSingleStyle\\":true,\\"hoursBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(243, 75, 74, 1)\\"},\\"isSecondsSingleStyle\\":true,\\"secondsBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(243, 75, 74, 1)\\"}} /-->"},{"name":"bb-patterns/countdown-2","title":"Countdown Time 2","description":"Countdown Time Design","type":"patterns","categories":["countdown"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown"],"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"f58ad4f5-c\\",\\"destDate\\":\\"\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(254, 206, 204, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(0, 0, 0, 0)\\"},\\"boxWidth\\":\\"120px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":16,\\"tablet\\":16,\\"mobile\\":16},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"labelColor\\":\\"rgba(0, 0, 0, 0.33)\\",\\"isSep\\":true,\\"sepSize\\":48,\\"sepColor\\":\\"rgba(255, 255, 255, 0.5)\\"} /-->"},{"name":"bb-patterns/countdown-3","title":"Countdown Time 3","description":"Countdown Time Design","type":"patterns","categories":["countdown"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown"],"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"1caee4a2-f\\",\\"destDate\\":\\"\\",\\"width\\":\\"700px\\",\\"background\\":{\\"color\\":\\"rgba(30, 32, 44, 1)\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(0, 0, 0, 0)\\"},\\"boxWidth\\":\\"100px\\",\\"boxBorder\\":{\\"radius\\":\\"5%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32},\\"googleFontLink\\":\\"https://fonts.googleapis.com/css2?family=Play&display=swap\\",\\"fontFamily\\":\\"Play\\",\\"fontCategory\\":\\"sans-serif\\",\\"fontWeight\\":400,\\"fontVariant\\":400},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16},\\"googleFontLink\\":\\"https://fonts.googleapis.com/css2?family=Play&display=swap\\",\\"fontFamily\\":\\"Play\\",\\"fontCategory\\":\\"sans-serif\\",\\"fontWeight\\":400,\\"fontVariant\\":400},\\"isSep\\":true,\\"sepColor\\":\\"rgba(255, 255, 255, 1)\\"} /-->"},{"name":"bb-patterns/countdown-4","title":"Countdown Time 4","description":"Countdown Time Design","type":"patterns","categories":["countdown"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown"],"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"cd8f36d0-9\\",\\"destDate\\":\\"\\",\\"background\\":{\\"color\\":\\"#0000\\",\\"type\\":\\"solid\\"},\\"padding\\":{\\"vertical\\":\\"10px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(238, 104, 84, 1)\\"},\\"boxWidth\\":\\"120px\\",\\"boxSpace\\":\\"5px\\",\\"boxBorder\\":{\\"radius\\":\\"0%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":25,\\"tablet\\":22,\\"mobile\\":20},\\"fontWeight\\":500,\\"fontVariant\\":\\"500\\"},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16}}} /-->"},{"name":"bb-patterns/countdown-5","title":"Countdown Time 5","description":"Countdown Time Design","type":"patterns","categories":["countdown"],"keywords":["countdown timer block","countdown ceremony time","countdown events time"],"blockTypes":["b-blocks/countdown"],"content":"<!-- wp:b-blocks/countdown {\\"cId\\":\\"ee50e5af-c\\",\\"destDate\\":\\"\\",\\"width\\":\\"100%\\",\\"background\\":{\\"type\\":\\"gradient\\",\\"gradient\\":\\"linear-gradient(180deg,rgb(1,1,1) 0%,rgb(61,62,65) 100%)\\"},\\"padding\\":{\\"vertical\\":\\"50px\\",\\"horizontal\\":\\"15px\\",\\"side\\":2,\\"top\\":\\"0px\\",\\"right\\":\\"0px\\",\\"bottom\\":\\"0px\\",\\"left\\":\\"0px\\"},\\"shadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"boxBG\\":{\\"type\\":\\"solid\\",\\"color\\":\\"rgba(255, 255, 255, 0.2)\\"},\\"boxWidth\\":\\"120px\\",\\"boxSpace\\":\\"15px\\",\\"boxBorder\\":{\\"radius\\":\\"0%\\",\\"width\\":\\"0px\\",\\"style\\":\\"solid\\",\\"color\\":\\"#0000\\",\\"side\\":\\"all\\"},\\"boxShadow\\":{\\"type\\":\\"box\\",\\"hOffset\\":\\"0px\\",\\"vOffset\\":\\"0px\\",\\"blur\\":\\"0px\\",\\"spreed\\":\\"0px\\",\\"color\\":\\"#7090b0\\",\\"isInset\\":false},\\"digitTypo\\":{\\"fontSize\\":{\\"desktop\\":48,\\"tablet\\":40,\\"mobile\\":32},\\"fontWeight\\":700,\\"fontVariant\\":\\"700\\"},\\"labelTypo\\":{\\"fontSize\\":{\\"desktop\\":18,\\"tablet\\":18,\\"mobile\\":16}},\\"labelColor\\":\\"rgba(250, 232, 43, 1)\\"} /-->"}]');

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
/*!*****************************************!*\
  !*** ./src/backend/template-library.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom/client */ "../plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _TemplateLibrary_TemplateLibrary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TemplateLibrary/TemplateLibrary */ "./src/backend/TemplateLibrary/TemplateLibrary.js");





const mountTemplateLibrary = () => {
  // Render our button.
  const templateLibraryWrap = document.createElement('div');
  templateLibraryWrap.classList.add('bBlocksTemplateLibraryWrap');
  (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(templateLibraryWrap).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TemplateLibrary_TemplateLibrary__WEBPACK_IMPORTED_MODULE_4__["default"], null));

  // Just keep on checking because there are times when the toolbar gets
  // unmounted.
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.subscribe)(() => {
    setTimeout(() => {
      const toolbar = document.querySelector('.edit-post-header-toolbar');
      if (toolbar) {
        if (!toolbar.querySelector('.bBlocksTemplateLibraryWrap')) {
          toolbar.appendChild(templateLibraryWrap);
        }
      }
    }, 1);
  });
};
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2___default()(mountTemplateLibrary);
/******/ })()
;
//# sourceMappingURL=template-library.js.map