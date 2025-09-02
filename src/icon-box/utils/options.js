import { __ } from '@wordpress/i18n';

export const animationOptions = [
	{ label: __('None','b-blocks'), value: 'none' },
	{ label: __('Bounce','b-blocks'), value: 'nBounce' },
	{ label: __('Pulse','b-blocks'), value: 'nPulse' },
	{ label: __('Spin','b-blocks'), value: 'nSpin' },
	{ label: __('Shake','b-blocks'), value: 'nShake' },
	{ label: __('Wiggle','b-blocks'), value: 'nWiggle' },
	{ label: __('Ping','b-blocks'), value: 'nPing' },
	{ label: __('Float','b-blocks'), value: 'nFloat' },
];
export const hAnimationOptions = [
	{ label: __('None','b-blocks'), value: 'none' },
	{ label: __('Bounce','b-blocks'), value: 'hBounce' },
	{ label: __('Pulse','b-blocks'), value: 'hPulse' },
	{ label: __('Spin','b-blocks'), value: 'hSpin' },
	{ label: __('Shake','b-blocks'), value: 'hShake' },
	{ label: __('Wiggle','b-blocks'), value: 'hWiggle' },
	{ label: __('Ping','b-blocks'), value: 'hPing' },
	{ label: __('Float','b-blocks'), value: 'hFloat' },
];

export const iterationOptions = [
	{label: __('None','b-blocks'), value:''},
	{label: __('Infinite','b-blocks'), value:'infinite'},
	{label: __('Number','b-blocks'), value:'number'}
]