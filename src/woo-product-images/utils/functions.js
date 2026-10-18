export const BOX = 'b-blocks-woo-product-images';

export const POSITIONS = [ 'left', 'right', 'top', 'bottom' ];

export const FITS = [ 'cover', 'contain', 'fill', 'scale-down', 'none' ];

export const RATIOS = [ '1/1', '4/3', '3/2', '16/9', '3/4', '2/3' ];

/** Thumbnail hover transition timing functions. */
export const EASINGS = [ 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out' ];

/** Slide Effect: Swiper's own (Fade, Flip, Cube, Cards) and two made with its Creative effect (Zoom, Parallax). */
export const EFFECTS = [ 'slide', 'fade', 'flip', 'cube', 'cards', 'zoom', 'parallax' ];

/** The effects whose slides cover each other: each has the Featured Image's background. */
export const SOLID_EFFECTS = [ 'flip', 'cube', 'cards', 'zoom', 'parallax' ];

/** "View image %1$s of %2$s" with its numbers. */
export const viewLabel = ( template, n, total ) => String( template || '%1$s / %2$s' ).replace( '%1$s', n ).replace( '%2$s', total );
