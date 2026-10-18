// A chevron drawn in its own direction — not turned in CSS, which the
// generated right-to-left stylesheet would turn the other way.
const CHEVRONS = { up: 'm5 15 7-7 7 7', down: 'm5 9 7 7 7-7', left: 'm15 5-7 7 7 7', right: 'm9 5 7 7-7 7' };

export const ArrowIcon = ( { to = 'right' } ) => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path fill='none' stroke='currentColor' strokeWidth='2.25' strokeLinecap='round' strokeLinejoin='round' d={ CHEVRONS[ to ] || CHEVRONS.right } />
</svg>;

export const CloseIcon = () => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path fill='none' stroke='currentColor' strokeWidth='2.25' strokeLinecap='round' d='M6 6l12 12M18 6 6 18' />
</svg>;

export const ExpandIcon = () => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
	<path fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7' />
</svg>;
