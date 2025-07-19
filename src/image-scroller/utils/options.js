import { __ } from "@wordpress/i18n";
export const directionOptions = [
	{ label: __("Vertical", "b-blocks"), value: "vertical" },
	{ label: __("Horizontal", "b-blocks"), value: "horizontal" },
];

export const easingOptions = [
	{ label: __("Ease", "b-blocks"), value: "ease" },
	{ label: __("Linear", "b-blocks"), value: "linear" },
	{ label: __("Ease In", "b-blocks"), value: "ease-in" },
	{ label: __("Ease Out", "b-blocks"), value: "ease-out" },
	{ label: __("Ease In Out", "b-blocks"), value: "ease-in-out" },
];

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];