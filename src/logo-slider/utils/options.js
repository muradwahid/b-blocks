import { __ } from '@wordpress/i18n';

export const objectFitOptions = [
    { label: 'Default', value: '' },
    { label: 'Contain', value: 'contain' },
    { label: 'Cover', value: 'cover' },
    { label: 'Fill', value: 'fill' },
    { label: 'Scale Down', value: 'scale-down' },
    { label: 'Initial', value: 'initial' },
    { label: 'Inherit', value: 'inherit' },
];

export const generalStyleTabs = [
    { name: 'general', title: __('General', 'b-blocks') },
    { name: 'style', title: __('Style', 'b-blocks') },
    { name: 'advanced', title: __('Advanced', 'b-blocks') },
];

export const sliderEffect = [
    { label: 'Slide', value: 'slide' },
    { label: 'Fade', value: 'fade' },
    { label: 'Cube', value: 'cube' },
    { label: 'Coverflow', value: 'coverflow' },
    { label: 'Flip', value: 'flip' },
    { label: 'Cards', value: 'cards' },
    { label: 'Creative', value: 'creative' },
];
export const easingOptions = [
    {label:__('Default','b-blocks'),value:''},
    {label:__('Linear','b-blocks'),value:'linear'},
    {label:__('Ease','b-blocks'),value:'ease'},
    {label:__('Ease In','b-blocks'),value:'ease-in'},
    {label:__('Ease Out','b-blocks'),value:'ease-out'},
    {label:__('Ease In Out','b-blocks'),value:'ease-in-out'},
    {label:__('Step Start','b-blocks'),value:'step-start'},
    {label:__('Step End','b-blocks'),value:'step-end'},
]