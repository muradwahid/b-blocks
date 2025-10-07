import { __ } from "@wordpress/i18n";
import { alignCenterIcon, alignLeftIcon, alignRightIcon } from './icons';
export const generalStyleTabs = [
    { name: 'general', title: __('General', 'b-blocks') },
    { name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const typeOptions = [
    { label: "Post", value: "post" },
    { label: "Video", value: "video" },
];

export const embedAlignOptions = [{ label: "Left", value: "left", icon: alignLeftIcon }, { label: "Center", value: "center", icon: alignCenterIcon }, { label: "Right", value: "right", icon: alignRightIcon }]