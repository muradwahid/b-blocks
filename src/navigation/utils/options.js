import { alignCenterIcon, alignJustifyIcon, alignLeftIcon, alignRightIcon } from './icons';

export const orientations = [
    { label: 'Horizontal', value: 'is-horizontal' },
    { label: 'Vertical', value: 'is-vertical' },
];

export const alignments = [
    { label: 'Left', value: 'left', icon: alignLeftIcon },
    { label: 'Center', value: 'center', icon: alignCenterIcon },
    { label: 'Right', value: 'right', icon: alignRightIcon },
    { label: 'Justify', value: 'justify', icon: alignJustifyIcon }
];

export const verticalAlignments = [
    { label: 'Left', value: 'left', icon: alignLeftIcon },
    { label: 'Center', value: 'center', icon: alignCenterIcon },
    { label: 'Right', value: 'right', icon: alignRightIcon }
];

export const buttonTypes = [
    { label: 'Text', value: 'text', icon: 'Text' },
    { label: 'Icon', value: 'icon', icon: 'Icon' }
];

export const displayMenuTypes = [
    { value: 'never', label: 'OFF', icon: 'OFF' },
    { value: 'mobile', label: 'MOBILE', icon: 'MOBILE' },
    { value: 'always', label: 'ALWAYS', icon: 'ALWAYS' }
];