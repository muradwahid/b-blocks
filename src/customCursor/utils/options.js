import { __ } from '@wordpress/i18n';
export const cursorStyleTabs = [
  { name: 'shape', title: __('Cursor', 'b-blocks') },
  { name: 'effect', title: __('Click Effect', 'b-blocks') }
];

export const cursorShapeTabs = [
  { name: 'shape', title: __('Cursor', 'b-blocks') },
  { name: 'style', title: __('Shape Style', 'b-blocks') }
];

export const cursorEffectTabs = [
  { name: 'type', title: __('Effect Type', 'b-blocks') },
  { name: 'style', title: __('Effect Style', 'b-blocks') }
];

// export const 

export const cursorSourceOptions = (isPremium) => [
  { label: __('Default', 'b-blocks'), value: 'cursor', default: true },
  { label: __('Customizable Shape', 'b-blocks'), value: 'shape' },
  { label: __(`Most Popular ${isPremium ? '' : '(Pro)'}`, 'b-blocks'), value: 'predefined' },
  { label: __(`Custom Url ${isPremium ? '' : '(Pro)'}`, 'b-blocks'), value: 'customUrl' },
]

export const cursorProOptions = ['matrix', 'cyberpunk', 'analog', 'digital', 'glow', 'gradient', 'image', 'magnetic', 'neon', 'pixelated', 'ribbon', 'ring', 'sketch', 'spotlight', 'splash', 'text']

export const cursorOptions = [
  { label: __('Default', 'b-blocks'), value: '', default: true },
  { label: __('Unset', 'b-blocks'), value: 'unset' },
  { label: __('Follow', 'b-blocks'), value: 'follow' },
  { label: __('Blob', 'b-blocks'), value: 'blob' },
  { label: __('Dot', 'b-blocks'), value: 'dot' },
  { label: __('Elastic', 'b-blocks'), value: 'elastic' },
  { label: __(`Glitch Matrix`, 'b-blocks'), value: 'matrix' },
  { label: __(`Glitch Cyberpunk`, 'b-blocks'), value: 'cyberpunk' },
  { label: __(`Glitch Analog`, 'b-blocks'), value: 'analog' },
  { label: __(`Glitch Digital Error`, 'b-blocks'), value: 'digital' },
  { label: __(`Glow`, 'b-blocks'), value: 'glow' },
  { label: __(`Gradient`, 'b-blocks'), value: 'gradient' },
  { label: __(`Image`, 'b-blocks'), value: 'image' },
  { label: __(`Magnetic`, 'b-blocks'), value: 'magnetic' },
  { label: __(`Neon`, 'b-blocks'), value: 'neon' },
  { label: __(`Pixelated`, 'b-blocks'), value: 'pixelated' },
  { label: __(`Ribbon`, 'b-blocks'), value: 'ribbon' },
  { label: __(`Ring`, 'b-blocks'), value: 'ring' },
  // { label: __('Ripple','b-blocks'), value: 'ripple' },
  { label: __(`Sketch`, 'b-blocks'), value: 'sketch' },
  { label: __(`Spotlight`, 'b-blocks'), value: 'spotlight' },
  { label: __(`Splash`, 'b-blocks'), value: 'splash' },
  { label: __(`Text`, 'b-blocks'), value: 'text' },
]

export const cursorEffectsOptions = [
  { label: __("None", 'b-blocks'), value: "", default: true },
  { label: __('Unset', 'b-blocks'), value: 'unset' },
  { label: __("Spark", 'b-blocks'), value: "spark" },
  { label: __("Spark Simple", 'b-blocks'), value: "sparkSimple" },
  { label: __("Starburst", 'b-blocks'), value: "starburst" },
  { label: __("Radial", 'b-blocks'), value: "radial" },
  { label: __("Explosion", 'b-blocks'), value: "explosion" },
  { label: __("Ripple Circle", 'b-blocks'), value: "rippleCircle" },
  { label: __("Ripple Double", 'b-blocks'), value: "rippleDouble" },
  { label: __("Ripple Wave", 'b-blocks'), value: "rippleWave" },
  { label: __("Ripple Pulse", 'b-blocks'), value: "ripplePulse" },
  // { Label: __("Ripple Tsunami", 'b-blocks'), value: "tsunami" },
]

export const glitchIntensityOptions = [
  { label: __('Low', 'b-blocks'), value: 'low' },
  { label: __('Medium', 'b-blocks'), value: 'medium', default: true },
  { label: __('High', 'b-blocks'), value: 'high' },
];

export const glitchSpeedOptions = [
  { label: __('Slow', 'b-blocks'), value: 'slow' },
  { label: __('Medium', 'b-blocks'), value: 'medium' },
  { label: __('Fast', 'b-blocks'), value: 'fast' },
];

export const glitchBlendModeOptions = [
  { label: __('Normal', 'b-blocks'), value: 'normal' },
  { label: __('Multiply', 'b-blocks'), value: 'multiply' },
  { label: __('Screen', 'b-blocks'), value: 'screen' },
  { label: __('Overlay', 'b-blocks'), value: 'overlay' },
  { label: __('Difference', 'b-blocks'), value: 'difference' },
];

export const magneticTargetElDefaults = 'button, a, textarea, select, [role="button"], [type="submit"]'

export const effectSparkEasingOptions = [
  { label: __('Ease Out', 'b-blocks'), value: 'ease-out', default: true },
  { label: __('Ease In', 'b-blocks'), value: 'ease-in' },
  { label: __('Ease In Out', 'b-blocks'), value: 'ease-in-out' },
  { label: __('Linear', 'b-blocks'), value: 'linear' }
]