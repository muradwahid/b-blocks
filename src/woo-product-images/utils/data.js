import { __ } from '@wordpress/i18n';

// Four images of different shapes, for the editor when no product is in context.
const sample = ( n, w, h, from, to ) => ( {
	id: -n,
	alt: `${ __( 'Sample image', 'b-blocks' ) } ${ n }`,
	src: `data:image/svg+xml;utf8,${ encodeURIComponent( `<svg xmlns='http://www.w3.org/2000/svg' width='${ w }' height='${ h }' viewBox='0 0 ${ w } ${ h }'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${ from }'/><stop offset='1' stop-color='${ to }'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='54%' font-family='sans-serif' font-size='${ Math.round( Math.min( w, h ) / 4 ) }' font-weight='700' fill='rgba(255,255,255,.85)' text-anchor='middle'>${ n }</text></svg>` ) }`,
	width: w,
	height: h
} );

export const sampleImages = () => [
	sample( 1, 800, 800, '#146ef5', '#7dd3fc' ),
	sample( 2, 800, 1000, '#7c3aed', '#f0abfc' ),
	sample( 3, 1200, 800, '#059669', '#a7f3d0' ),
	sample( 4, 800, 800, '#ea580c', '#fde68a' )
].map( ( s ) => ( { id: s.id, alt: s.alt, main: { src: s.src, width: s.width, height: s.height }, thumb: { src: s.src }, full: { src: s.src } } ) );
