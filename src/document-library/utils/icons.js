const svgProps = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const fileIcon = <svg {...svgProps}>
	<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
	<path d='M14 2v4a2 2 0 0 0 2 2h4' />
</svg>;

export const fileTextIcon = <svg {...svgProps}>
	<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
	<path d='M14 2v4a2 2 0 0 0 2 2h4' />
	<path d='M10 9H8M16 13H8M16 17H8' />
</svg>;

export const imageIcon = <svg {...svgProps}>
	<rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
	<circle cx='9' cy='9' r='2' />
	<path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
</svg>;

export const videoIcon = <svg {...svgProps}>
	<path d='m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5' />
	<rect x='2' y='6' width='14' height='12' rx='2' />
</svg>;

export const musicIcon = <svg {...svgProps}>
	<path d='M9 18V5l12-2v13' />
	<circle cx='6' cy='18' r='3' />
	<circle cx='18' cy='16' r='3' />
</svg>;

export const archiveIcon = <svg {...svgProps}>
	<rect width='20' height='5' x='2' y='3' rx='1' />
	<path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4' />
</svg>;

export const searchIcon = <svg {...svgProps}>
	<circle cx='11' cy='11' r='8' />
	<path d='m21 21-4.3-4.3' />
</svg>;

export const calendarIcon = <svg {...svgProps}>
	<path d='M8 2v4M16 2v4' />
	<rect width='18' height='18' x='3' y='4' rx='2' />
	<path d='M3 10h18' />
</svg>;

export const eyeIcon = <svg {...svgProps}>
	<path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
	<circle cx='12' cy='12' r='3' />
</svg>;

export const downloadIcon = <svg {...svgProps}>
	<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
	<path d='m7 10 5 5 5-5M12 15V3' />
</svg>;

export const closeIcon = <svg {...svgProps}>
	<path d='M18 6 6 18M6 6l12 12' />
</svg>;
