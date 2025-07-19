import { __ } from "@wordpress/i18n";

export const htmlTags = [
	{ label: "H1", value: "h1" },
	{ label: "H2", value: "h2" },
	{ label: "H3", value: "h3" },
	{ label: "H4", value: "h4" },
	{ label: "H5", value: "h5" },
	{ label: "H6", value: "h6" },
	{ label: "span", value: "span" },
	{ label: "P", value: "p" },
	{ label: "div", value: "div" },
];
export const dualColorOptions = [
	{ label: "Default", value: "default" },
	{ label: "Solid", value: "solid" },
	{ label: "Gradient", value: "gradient" },
];
export const marginResetValues = {
	top: "14px",
	right: "14px",
	bottom: "14px",
	left: "14px",
};
export const borderRadiusResetValues = {
	top: "0px",
	right: "0px",
	bottom: "0px",
	left: "0px",
};

export const aligns = [
	{
		label: __("Left", "b-blocks"),
		value: "left",
		icon: "editor-alignleft",
	},
	{
		label: __("Center", "b-blocks"),
		value: "center",
		icon: "editor-aligncenter",
	},
	{
		label: __("Right", "b-blocks"),
		value: "right",
		icon: "editor-alignright",
	},
];

export const leftRightOptions = [
	{
		title: __("Left", "b-blocks"),
		name: "left",
	},
	{
		title: __("Right", "b-blocks"),
		name: "right",
	},
]

export const generalStyleTabs = [
	{ name: "general", title: __("General", "b-blocks") },
	{ name: "style", title: __("Style", "b-blocks") },
	{ name: "advanced", title: __("Advanced", "b-blocks") }
];
