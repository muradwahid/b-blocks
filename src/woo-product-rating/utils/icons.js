const outlineStar = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z' />
</svg>;

// Style 2: the left half of an outline star (Font Awesome Free v7 star-half, regular), in the left 2.5–52.8% of its box.
const halfStar = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M285.7-15.8c10.8 2.6 18.4 12.2 18.4 23.3l0 387.1c0 9-5.1 17.3-13.1 21.4L143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3L193.1 125.3 258.8-3.3c5-9.9 16.2-15 27-12.4zM256.1 107.4L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 92.2-46.9 0-272.6z' />
</svg>;

// Style 3: left half solid, right half outline (Font Awesome Free v7 star-half-stroke), in 2.5–97.6% of its box.
const halfStrokeStar = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M288.1 353.6c10 0 19.9 2.3 29 7l74.4 37.9-13-82.5c-3.2-20.2 3.5-40.7 17.9-55.2l59-59.1-82.5-13.1c-20.2-3.2-37.7-15.9-47-34.1l-38-74.4 0 273.6zM457.4 489c-7.3 5.3-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1s17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2z' />
</svg>;

// Style 4: a solid star (Font Awesome Free v7 star), in 2.5–97.6% of its box.
const classicStar = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z' />
</svg>;

// Style 5: the left half of a solid star (Font Awesome Free v7 star-half), in the left 2.5–52.8% of its box.
const halfSolidStar = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M304.1 7.6c0-11.1-7.6-20.7-18.4-23.3s-21.9 2.5-27 12.4L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L291 416.1c8-4.1 13.1-12.4 13.1-21.4l0-387.1z' />
</svg>;

// Per Stars Type: the star under it all (All color) and the filled one over it (Rated color);
// `span`: the part of the box the shape covers (%), so the fill follows the shape, not the box.
export const starIcons = {
	'style-1': { base: outlineStar, fill: outlineStar, span: [ 2.5, 97.6 ] },
	'style-2': { base: halfStar, fill: halfStar, span: [ 2.5, 52.8 ] },
	'style-3': { base: halfStrokeStar, fill: halfStrokeStar, span: [ 2.5, 97.6 ] },
	'style-4': { base: classicStar, fill: classicStar, span: [ 2.5, 97.6 ] },
	'style-5': { base: halfSolidStar, fill: halfSolidStar, span: [ 2.5, 52.8 ] }
};
