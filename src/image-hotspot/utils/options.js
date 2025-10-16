import { __ } from '@wordpress/i18n';


export const addNewItem = (id, id2) => {
	return {
		borderColor: "",
		bgColor: "",
		spotsSize: "",
		option: "spot",
		spotOption: "text",
		spotText: "+",
		icon: {
			url: {
				upload: "",
				library: ""
			},
			type: "library"
		},
		image: "",
		tooltip: "<p>Tooltip contents</p>",
		tooltipPosition: "left",
		position: {
			desktop: { x: id, y: id2 },
			tablet: {},
			mobile: {}
		},
		iconColor: "",
		iconSize: "12px",
		spotLink: "",
		newWindow: false
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
	desktop: {
		height: "40px", width: "40px", padding: { left: '0px', right: '0px', top: '0px', bottom: '0px' }, radius: { left: '50px', right: '50px', top: '50px', bottom: '50px' }, iconSize: "12px"
	},
	tablet: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	mobile: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	normal: { color: { bg: "#8a2be2", icon: "#fff" }, border: { width: '0px' } },
	hover: { color: { bg: "", icon: "#fff" }, border: {} },
};

export const themeTwo = {
	desktop: {
		height: "40px", width: "40px", padding: { left: '0px', right: '0px', top: '0px', bottom: '0px' }, radius: { left: '50px', right: '50px', top: '50px', bottom: '5px' }, iconSize: "12px"
	},
	tablet: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	mobile: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	normal: { color: { bg: "#cd7418", icon: "#fff" }, border: { width: '0px' } },
	hover: { color: { bg: "", icon: "#fff" }, border: {} },
};
export const themeThree = {
	desktop: {
		height: "40px", width: "40px", padding: { left: '5px', right: '5px', top: '5px', bottom: '5px' }, radius: { left: '50px', right: '50px', top: '50px', bottom: '50px' }, iconSize: "12px"
	},
	tablet: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	mobile: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	normal: { color: { bg: "#cd18bf", icon: "#fff" }, border: { color: '#fff', style: 'solid', width: '1px' } },
	hover: { color: { bg: "", icon: "#fff" }, border: {} },
};
export const themeFour = {
	desktop: {
		height: "40px", width: "40px", padding: { left: '5px', right: '5px', top: '5px', bottom: '5px' }, radius: { left: '50px', right: '50px', top: '50px', bottom: '50px' }, iconSize: "16px"
	},
	tablet: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	mobile: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	normal: { color: { bg: "", icon: "#77cd18" }, border: { color: '#77cd18', style: 'solid', width: '2px' } },
	hover: { color: { bg: "", icon: "#77cd18" }, border: { color: '#77cd18', style: 'solid', width: '2px' } },
};

export const themeFive = {
	desktop: {
		height: "40px", width: "100px", padding: { left: '5px', right: '5px', top: '5px', bottom: '5px' }, radius: { left: '50px', right: '50px', top: '50px', bottom: '50px' }, iconSize: "25px"
	},
	tablet: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	mobile: { height: "", width: "", padding: {}, radius: {}, iconSize: "" },
	normal: { color: { bg: "#3cbcd1a3", icon: "#fff" }, border: { width: '0px' } },
	hover: { color: { bg: "", icon: "#fff" }, border: { width: '0px' } },
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

export const imageFit = [{ label: 'None', value: '' }, { label: 'Cover', value: 'cover' }, { label: 'Contain', value: 'contain' }, { label: 'Fill', value: 'fill' }]