const svgProps = { xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true', focusable: 'false' };

// Previously duplicated: JSX in Edit.js and PHP path strings in render.php.
export const checkIcons = {
	check: <svg {...svgProps} viewBox='0 0 512 512'><path fill='currentColor' d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z' /></svg>,

	'check-circle': <svg {...svgProps} viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm141.6 192.2L235.7 360.6c-3.1 3.1-8.2 3.1-11.3 0L150.4 287c-3.1-3.1-3.1-8.2 0-11.3l24.5-24.5c3.1-3.1 8.2-3.1 11.3 0l43.5 43.5 132.2-131.3c3.1-3.1 8.2-3.1 11.3 0l24.5 24.5c3 3.1 3 8.2-.1 11.3z' /></svg>
};

export const crossIcons = {
	times: <svg {...svgProps} viewBox='0 0 352 512'><path fill='currentColor' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z' /></svg>,

	'times-circle': <svg {...svgProps} viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z' /></svg>
};

export const checkIcon = (style = 'check') => checkIcons[style] || checkIcons.check;
export const crossIcon = (style = 'times') => crossIcons[style] || crossIcons.times;

// Alignment glyphs, matching the set data-table uses for its own alignment
// ToggleGroupControl so the two blocks read the same way.
const alignProps = { stroke: 'currentColor', fill: 'currentColor', strokeWidth: '0', viewBox: '0 0 24 24', height: '1em', width: '1em', xmlns: 'http://www.w3.org/2000/svg' };

export const AlignStartIcon = (props) => <svg {...alignProps} {...props}><path fill='none' d='M0 0h24v24H0z' /><path d='M22 2v2H2V2h20zM7 22h3V6H7v16zm7-6h3V6h-3v10z' /></svg>;

export const AlignCenterIcon = (props) => <svg {...alignProps} {...props}><path fill='none' d='M0 0h24v24H0z' /><path d='M22 11h-5V6h-3v5h-4V3H7v8H1.84v2H7v8h3v-8h4v5h3v-5h5z' /></svg>;

export const AlignEndIcon = (props) => <svg {...alignProps} {...props}><path fill='none' d='M0 0h24v24H0z' /><path d='M22 22H2v-2h20v2zM10 2H7v16h3V2zm7 6h-3v10h3V8z' /></svg>;
