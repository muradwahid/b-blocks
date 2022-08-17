const TWO50 = [50, 50];
const THREE50 = [50, 50, 50];
const TWO100 = [100, 100];
const THREE100 = [100, 100, 100];

export const colOptions = [
	{ label: '100', columns: 1, layout: { desktop: [100], tablet: [100], mobile: [100] } },
	{ label: '50/50', columns: 2, layout: { desktop: [50, 50], tablet: TWO100, mobile: TWO100 } },
	{ label: '34/66', columns: 2, layout: { desktop: [34, 66], tablet: TWO100, mobile: TWO100 } },
	{ label: '66/34', columns: 2, layout: { desktop: [66, 34], tablet: TWO100, mobile: TWO100 } },
	{ label: '33.33/33.33/33.34', columns: 3, layout: { desktop: [33.33, 33.33, 33.34], tablet: THREE50, mobile: THREE100 } },
	{ label: '25/25/50', columns: 3, layout: { desktop: [25, 25, 50], tablet: [...TWO50, 100], mobile: THREE100 } },
	{ label: '50/25/25', columns: 3, layout: { desktop: [50, 25, 25], tablet: [100, ...TWO50], mobile: THREE100 } },
	{ label: '25/50/25', columns: 3, layout: { desktop: [25, 50, 25], tablet: THREE100, mobile: THREE100 } },
	{ label: '16.66/66.68/16.66', columns: 3, layout: { desktop: [16.66, 66.68, 16.66], tablet: THREE100, mobile: THREE100 } },
	{ label: '25/25/25/25', columns: 4, layout: { desktop: [25, 25, 25, 25], tablet: [50, 50, 50, 50], mobile: [100, 100, 100, 100] } },
	{ label: '20/20/20/20/20', columns: 5, layout: { desktop: [20, 20, 20, 20, 20], tablet: [33.33, 33.33, 33.34, 50, 50], mobile: [50, 50, 50, 50, 100] } },
	{
		label: '16.66/16.67/16.67/16.67/16.67/16.66', columns: 6, layout: {
			desktop: [16.66, 16.67, 16.67, 16.67, 16.67, 16.66],
			tablet: [33.33, 33.33, 33.34, 33.33, 33.33, 33.34], mobile: [50, 50, 50, 50, 50, 50]
		}
	}
];