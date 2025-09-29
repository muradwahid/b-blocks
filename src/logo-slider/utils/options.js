import { __ } from '@wordpress/i18n';

export const objectFitOptions = [
    { label: "Default", value: "" },
    { label: "Contain", value: "contain" },
    { label: "Cover", value: "cover" },
    { label: "Fill", value: "fill" },
    { label: "Scale Down", value: "scale-down" },
    { label: "Initial", value: "initial" },
    { label: "Inherit", value: "inherit" },
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