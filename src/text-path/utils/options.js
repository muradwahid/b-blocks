import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];

export const pathTypeOptions = [
	{Label:__('Wave','b-blocks'),value:'wave'},
	{Label:__('Arc','b-blocks'),value:'arc'},
	{Label:__('Circle','b-blocks'),value:'circle'},
	// {Label:__('Line','b-blocks'),value:'line'},
	// {Label:__('Oval','b-blocks'),value:'oval'},
	// {Label:__('Spiral','b-blocks'),value:'spiral'},
	{Label:__('Custom','b-blocks'),value:'custom'}
]