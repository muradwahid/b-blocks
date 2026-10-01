export const cartIcon = <svg className='b-blocks-woo-product-grid-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false'>
	<circle cx='9' cy='21' r='1' />
	<circle cx='20' cy='21' r='1' />
	<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
</svg>;

export const externalIcon = <svg className='b-blocks-woo-product-grid-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false'>
	<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
	<path d='M15 3h6v6' />
	<path d='M10 14 21 3' />
</svg>;

/** Alignment glyphs for the icon toggle groups. */
const alignSvg = ( paths ) => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='1em' height='1em' fill='currentColor' aria-hidden='true' focusable='false'>{ paths }</svg>;

export const alignLeftIcon = alignSvg( <>
	<rect x='3' y='5' width='14' height='2' rx='1' />
	<rect x='3' y='11' width='18' height='2' rx='1' />
	<rect x='3' y='17' width='10' height='2' rx='1' />
</> );

export const alignCenterIcon = alignSvg( <>
	<rect x='5' y='5' width='14' height='2' rx='1' />
	<rect x='3' y='11' width='18' height='2' rx='1' />
	<rect x='7' y='17' width='10' height='2' rx='1' />
</> );

export const alignRightIcon = alignSvg( <>
	<rect x='7' y='5' width='14' height='2' rx='1' />
	<rect x='3' y='11' width='18' height='2' rx='1' />
	<rect x='11' y='17' width='10' height='2' rx='1' />
</> );
