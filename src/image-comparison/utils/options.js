import { __ } from '@wordpress/i18n';
import { alignBottom, alignMiddle, alignTop } from './icons';

export const beforeAfterImgTab = [
    { name: 'before-img', title: __('Before Img', 'image-compare') },
    { name: 'after-img', title: __('After Img', 'image-compare') }
];

export const orientationOptions = [{ label: 'Horizontal', value: 'horizontal', icon: 'image-flip-horizontal' }, { label: 'Vertical', value: 'vertical', icon: 'image-flip-vertical' }];

export const labelHAlignOptions = [{ label: 'Top', value: 'top', icon: alignTop }, { label: 'Middle', value: 'middle', icon: alignMiddle }, { label: 'Bottom', value: 'bottom', icon: alignBottom }];

export const labelVAlignOptions = [{ label: 'Left', value: 'left', icon: 'editor-alignleft' }, { label: 'Center', value: 'center', icon: 'editor-aligncenter' }, { label: 'Right', value: 'right', icon: 'editor-alignright' }];

export const iconOptions = [
    { label: 'Default', value: 'default', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-default.png' },
    { label: 'Rectangle Stroke', value: 'rectangle-caret', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-rectangle-stroke.png', isPro: true },
    { label: 'Circle Small', value: 'circle-caret', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-circle-small.png', isPro: true },
    { label: 'Circle Big', value: 'circle-big-caret', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-circle-big.png', isPro: true },
    { label: 'Circle Outline', value: 'circle-outline', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-circle-outline.png', isPro: true },
    { label: 'Circle Outline Line None', value: 'circle-outline-line-none', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-circle-outline-line-none.png', isPro: true },
    { label: 'Capsule Fill', value: 'capsule-fill', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-fill.png', isPro: true },
    { label: 'Capsule Stroke', value: 'capsule-stroke', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-stroke.png', isPro: true },
    { label: 'Capsule Tiny Fill Big', value: 'capsule-tiny-fill-big', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-tiny-fill-big.png', isPro: true },
    { label: 'Capsule Tiny Stroke Big', value: 'capsule-tiny-stroke-big', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-tiny-stroke-big.png', isPro: true },
    { label: 'Capsule Tiny Fill Small', value: 'capsule-tiny-fill-small', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-tiny-fill-small.png', isPro: true },
    { label: 'Capsule Tiny Stroke Small', value: 'capsule-tiny-stroke-small', img: 'https://templates.bplugins.com/wp-content/uploads/2025/02/beaf-preset-capsule-tiny-stroke-small.png', isPro: true }
]