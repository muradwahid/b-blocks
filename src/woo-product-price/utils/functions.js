export const BOX = 'b-blocks-woo-product-price';

export const toBackground = ( bg ) => ( 'string' === typeof bg ? { type: 'solid', color: bg } : bg || {} );

export const ALIGNMENTS = [ 'left', 'center', 'right' ];

export const DIRECTIONS = [ 'row', 'column' ];

export const VERTICAL_ALIGNS = [ 'baseline', 'top', 'middle', 'bottom', 'super', 'sub' ];
