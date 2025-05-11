import { __ } from '@wordpress/i18n';
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight } from './icons';

export const tostPositionOptions = [
    { label: "Top Center", value: "top-center" },
    { label: "Top Left", value: "top-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Right", value: "bottom-right" },
];

export const generalStyleTabs = [
    { name: 'general', title: __('General', 'b-blocks') },
    { name: 'style', title: __('Style', 'b-blocks') },
    { name: "advanced", title: __('Advanced', 'b-blocks') }
];

export const submitBtnAlignOptions = [
    { label: 'Left', icon: <FaAlignLeft />, value: 'left' },
    { label: 'Center', icon: <FaAlignCenter />, value: 'center' },
    { label: 'Right', icon: <FaAlignRight />, value: 'right' },
    { label: 'Justify', icon: <FaAlignJustify />, value: 'justify' },
]

export const errorMessageOptions = [
    { name: 'success', title: __('Success', 'b-blocks') },
    { name: 'error', title: __('Error', 'b-blocks') }
];