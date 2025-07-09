import { __ } from '@wordpress/i18n';

export const objectFitOptions = [
    { label: "contain", value: "contain" },
    { label: "cover", value: "cover" },
    { label: "fill", value: "fill" },
    { label: "none", value: "none" },
    { label: "scale-down", value: "scale-down" },
    { label: "initial", value: "initial" },
    { label: "inherit", value: "inherit" },
];

export const generalStyleTabs = [
    { name: "general", title: __("General", "b-blocks") },
    { name: "style", title: __("Style", "b-blocks") },
    { name: "advanced", title: __("Advanced", "b-blocks") },
];

export const sliderEffect = [
    { label: "Slide", value: "slide" },
    { label: "Fade", value: "fade" },
    { label: "Cube", value: "cube" },
    { label: "Coverflow", value: "coverflow" },
    { label: "Flip", value: "flip" },
    { label: "Cards", value: "cards" },
    { label: "Creative", value: "creative" },
];