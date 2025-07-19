import { __ } from '@wordpress/i18n';


export const addNewItem = (id, id2) => {
	return {
		borderColor: '',
		bgColor: '',
		spotsSize: '',
		option: 'spot',
		spotOption: 'text',
		spotText: '+',
		icon: '',
		image: '',
		tooltip: '<p>Tooltip contents</p>',
		tooltipPosition: 'left',
		position: {
			x: id,
			y: id2,
		},
		iconColor: '',
		iconSize: '12px',
		spotLink: '',
	}
};
export const toolbarPositions = [
	{ label: 'Default', value: 'left' },
	{ label: 'Left', value: 'left' },
	{ label: 'Top', value: 'top' },
	{ label: 'Right', value: 'right' },
	{ label: 'Bottom', value: 'bottom' },
	{ label: 'Top Left', value: 'topleft' },
	{ label: 'Top Right', value: 'topright' },
	{ label: 'Bottom Left', value: 'bottomleft' },
	{ label: 'Bottom Right', value: 'bottomright' },
];

export const defaultTheme = {
	bgColor: '#8a2be2',
	border: { width: '0px' },
	height: { desktop: '40px', tablet: '40px', mobile: '40px' },
	width: { desktop: '40px', tablet: '40px', mobile: '40px' },
	padding: {
		desktop: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
		tablet: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
		mobile: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
	},
	borderRadius: {
		desktop: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		tablet: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		mobile: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
	},
	iconColor: '#fff',
	iconSize: { desktop: '12px', tablet: '12px', mobile: '12px' },
	hover: 'normal',
	hoverColor: { icon: '#fff', bg: '', border: '' },
};

export const themeTwo = {
	bgColor: '#cd7418',
	border: { width: '0px' },
	height: { desktop: '40px', tablet: '40px', mobile: '40px' },
	width: { desktop: '40px', tablet: '40px', mobile: '40px' },
	padding: {
		desktop: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
		tablet: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
		mobile: {
			left: '0px',
			right: '0px',
			top: '0px',
			bottom: '0px',
		},
	},
	borderRadius: {
		desktop: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '5px',
		},
		tablet: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '5px',
		},
		mobile: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '5px',
		},
	},
	iconColor: '#fff',
	iconSize: { desktop: '12px', tablet: '12px', mobile: '12px' },
	hover: 'normal',
	hoverColor: { icon: '#fff', bg: '', border: '' },
};
export const themeThree = {
	bgColor: '#cd18bf',
	borderColor: '#fff',
	border: { color: '#fff', style: 'solid', width: '1px' },
	height: { desktop: '40px', tablet: '40px', mobile: '40px' },
	width: { desktop: '40px', tablet: '40px', mobile: '40px' },
	padding: {
		desktop: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		tablet: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		mobile: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
	},
	borderRadius: {
		desktop: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		tablet: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		mobile: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
	},
	iconColor: '#fff',
	iconSize: { desktop: '12px', tablet: '12px', mobile: '12px' },
	hover: 'normal',
	hoverColor: { icon: '#fff', bg: '', border: '' },
};
export const themeFour = {
	bgColor: '',
	border: { color: '#77cd18', style: 'solid', width: '2px' },
	height: { desktop: '40px', tablet: '40px', mobile: '40px' },
	width: { desktop: '40px', tablet: '40px', mobile: '40px' },
	padding: {
		desktop: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		tablet: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		mobile: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
	},
	borderRadius: {
		desktop: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		tablet: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		mobile: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
	},
	iconColor: '#77cd18',
	iconSize: { desktop: '16px', tablet: '16px', mobile: '16px' },
	hover: 'normal',
	hoverColor: { icon: '#77cd18', bg: '', border: '#77cd18' },
};

export const themeFive = {
	bgColor: '#3cbcd1a3',
	border: { width: '0px', color: 'transparent' },
	height: { desktop: '40px', tablet: '40px', mobile: '40px' },
	width: { desktop: '100px', tablet: '100px', mobile: '100px' },
	padding: {
		desktop: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		tablet: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
		mobile: {
			left: '5px',
			right: '5px',
			top: '5px',
			bottom: '5px',
		},
	},
	borderRadius: {
		desktop: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		tablet: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
		mobile: {
			left: '50px',
			right: '50px',
			top: '50px',
			bottom: '50px',
		},
	},
	iconColor: '#fff',
	iconSize: { desktop: '25px', tablet: '25px', mobile: '25px' },
	hover: 'normal',
	hoverColor: { icon: '#fff', bg: '', border: '' },
};

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') },
];
export const themes = {
	default: {
		isPremium: false,
		theme: ''
	}
}