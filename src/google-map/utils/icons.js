const svgProps = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' };

export const pinIcon = <svg {...svgProps}><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' /><circle cx='12' cy='10' r='3' /></svg>;

export const searchIcon = <svg {...svgProps}><circle cx='11' cy='11' r='8' /><line x1='21' y1='21' x2='16.65' y2='16.65' /></svg>;

export const crosshairIcon = <svg {...svgProps}><circle cx='12' cy='12' r='9' /><line x1='12' y1='2' x2='12' y2='5' /><line x1='12' y1='19' x2='12' y2='22' /><line x1='2' y1='12' x2='5' y2='12' /><line x1='19' y1='12' x2='22' y2='12' /><circle cx='12' cy='12' r='2' fill='currentColor' stroke='none' /></svg>;

export const playIcon = <svg {...svgProps}><polygon points='6 3 20 12 6 21 6 3' fill='currentColor' /></svg>;

export const layersIcon = <svg {...svgProps}><polygon points='12 2 2 7 12 12 22 7 12 2' /><polyline points='2 17 12 22 22 17' /><polyline points='2 12 12 17 22 12' /></svg>;

export const routeIcon = <svg {...svgProps}><circle cx='6' cy='19' r='3' /><circle cx='18' cy='5' r='3' /><path d='M9 19h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6' /></svg>;
