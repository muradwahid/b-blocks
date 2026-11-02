export const BOX = 'b-blocks-woo-product-carousel';

export const queryAction = 'bb_wpc_query';
export const searchAction = 'bb_wpc_search';

// Card elements a preset's design leaves out, whatever their settings say. 'view' is the View Product
// button. Category and rating are left to their Show toggles in every preset.
export const PRESET_HIDDEN = {
	'preset-2': [ 'view' ],
	'preset-3': [ 'view' ],
	'preset-4': [ 'view' ]
};
// Presets whose content is a panel that slides up over the image on hover / focus.
export const HOVER_PRESETS = [ 'preset-1' ];
// Presets whose active slide sits in the middle, as wide as the image, with as many slides around it as fit.
export const CENTERED_PRESETS = [ 'preset-2' ];
// Presets whose grey content box sits apart from the image (Content Space).
export const CONTENT_SPACE_PRESETS = [ 'preset-3' ];
// Presets that show the first product large beside a headed carousel of the rest.
export const FEATURED_PRESETS = [ 'preset-4' ];
export const DOT_PRESETS = [ 'style-1', 'style-2', 'style-3' ];
export const titleTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

// Slides To Show per device when nothing (or nonsense) is saved.
export const slidesFallback = { desktop: 3, tablet: 2, mobile: 1 };

// Swiper breakpoints, matching bpl-tools' tabBreakpoint (≤1024px) and mobileBreakpoint (≤640px).
export const TABLET_MIN = 641;
export const DESKTOP_MIN = 1025;

// What the editor shows until the first products load.
export const fallbackLabels = {
	carousel: 'Products',
	roleCarousel: 'carousel',
	roleSlide: 'slide',
	prev: 'Previous products',
	next: 'Next products',
	first: 'This is the first slide',
	last: 'This is the last slide',
	goTo: 'Go to slide %d',
	slideOf: '%1$d of %2$d',
	buttonAria: '%1$s: %2$s',
	pause: 'Pause autoplay',
	play: 'Play autoplay'
};
