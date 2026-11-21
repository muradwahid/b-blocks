// Ids are prefixed so they cannot clash with other SVGs on the page (several blocks may show this icon).
export const googleDriveIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192' width='22' height='22' fill='none' aria-hidden='true'>
	<mask id='bbDeGDriveMask' width='168' height='154' x='12' y='18' maskUnits='userSpaceOnUse' style={{ maskType: 'alpha' }}>
		<path fill='#b43333' d='M63.09 37c14.626-25.333 51.193-25.334 65.819 0l45.033 78c14.626 25.334-3.657 57.001-32.91 57.001H50.967c-29.253 0-47.536-31.667-32.91-57.001z' />
	</mask>
	<g mask='url(#bbDeGDriveMask)'>
		<path fill='url(#bbDeGDriveB)' d='M206.905 172.02h-91.888l-19.015-32.934 45.944-79.578z' />
		<path fill='url(#bbDeGDriveC)' d='M-14.919 172.006 50.04 59.494v.002L31.032 92.422h38.02L115 172.004l-129.918.001z' />
		<path fill='url(#bbDeGDriveD)' d='M96.007-20.085 141.954 59.5l-19.011 32.928H31.048z' />
	</g>
	<defs>
		<linearGradient id='bbDeGDriveB' x1='193.6' x2='103.09' y1='165.6' y2='111.21' gradientUnits='userSpaceOnUse'>
			<stop offset='.09' stopColor='#ffe921' />
			<stop offset='1' stopColor='#fec700' />
		</linearGradient>
		<linearGradient id='bbDeGDriveC' x1='114.4' x2='15.53' y1='181.61' y2='121.8' gradientUnits='userSpaceOnUse'>
			<stop offset='.15' stopColor='#a9a8ff' />
			<stop offset='.33' stopColor='#6d97ff' />
			<stop offset='.48' stopColor='#3186ff' />
		</linearGradient>
		<linearGradient id='bbDeGDriveD' x1='128.88' x2='28.7' y1='37.88' y2='84.64' gradientUnits='userSpaceOnUse'>
			<stop offset='.55' stopColor='#0ebc5f' />
			<stop offset='.85' stopColor='#78c9ff' />
		</linearGradient>
	</defs>
</svg>;

export const dropboxIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' fill='#0061FE' aria-hidden='true'>
	<path d='M12.012 1.5L4.851 6.136l7.161 4.673 7.16-4.673L12.012 1.5zm-7.161 9.42l7.161 4.636 7.16-4.636 4.828 3.125-11.988 7.455-11.988-7.455 4.827-3.125zm0 1.93l-4.827 3.125L12.012 23.5l11.988-7.513-4.828-3.125-7.16 4.636-7.161-4.636z' />
</svg>;

export const boxIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' aria-hidden='true'>
	<rect width='24' height='24' rx='5' fill='#0061D5' />
	<g fill='none' stroke='#fff' strokeWidth='1.9' strokeLinecap='round'>
		<path d='M3.6 7.4v8.1' />
		<circle cx='6.4' cy='13.1' r='2.5' />
		<circle cx='12.6' cy='13.1' r='2.5' />
		<path d='M16.6 10.6l4 5M20.6 10.6l-4 5' />
	</g>
</svg>;

export const uploadIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
	<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
	<polyline points='17 8 12 3 7 8' />
	<line x1='12' y1='3' x2='12' y2='15' />
</svg>;

export const linkIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
	<path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
	<path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
</svg>;

export const documentIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
	<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
	<polyline points='14 2 14 8 20 8' />
	<line x1='16' y1='13' x2='8' y2='13' />
	<line x1='16' y1='17' x2='8' y2='17' />
</svg>;
