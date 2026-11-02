// Chevrons point the reading direction; style.scss mirrors them for right-to-left.
export const prevIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path d='M15 18l-6-6 6-6' fill='none' stroke='currentColor' strokeWidth='2.25' strokeLinecap='round' strokeLinejoin='round' />
</svg>;

export const nextIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path d='M9 18l6-6-6-6' fill='none' stroke='currentColor' strokeWidth='2.25' strokeLinecap='round' strokeLinejoin='round' />
</svg>;

// A solid star (Font Awesome Free v7 star), in 2.5–97.6% of its box — as in Woo Product Rating.
export const starIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z' />
</svg>;

export const STAR_SPAN = [ 2.5, 97.6 ];

// Button icons, as in Woo Product Grid.
export const externalIcon = <svg className='b-blocks-woo-product-carousel-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false'>
	<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
	<path d='M15 3h6v6' />
	<path d='M10 14 21 3' />
</svg>;

export const cartIcon = <svg className='b-blocks-woo-product-carousel-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false'>
	<circle cx='9' cy='21' r='1' />
	<circle cx='20' cy='21' r='1' />
	<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
</svg>;

// Autoplay's pause / play toggle.
export const pauseIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' />
</svg>;

export const playIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path fill='currentColor' d='M8 5.5v13l10.5-6.5z' />
</svg>;