import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksUrgencyTimer';

export const timerModeOptions = [
	{ label: __( 'Evergreen (per-visitor deadline)', 'b-blocks' ), value: 'evergreen' },
	{ label: __( 'Recurring (weekly reset)', 'b-blocks' ), value: 'recurring' }
];

export const resetDayOptions = [
	{ label: __( 'Monday', 'b-blocks' ), value: 'monday' },
	{ label: __( 'Tuesday', 'b-blocks' ), value: 'tuesday' },
	{ label: __( 'Wednesday', 'b-blocks' ), value: 'wednesday' },
	{ label: __( 'Thursday', 'b-blocks' ), value: 'thursday' },
	{ label: __( 'Friday', 'b-blocks' ), value: 'friday' },
	{ label: __( 'Saturday', 'b-blocks' ), value: 'saturday' },
	{ label: __( 'Sunday', 'b-blocks' ), value: 'sunday' }
];

export const expiredActionOptions = [
	{ label: __( 'Show expired message', 'b-blocks' ), value: 'message' },
	{ label: __( 'Hide the block', 'b-blocks' ), value: 'hide' }
];

export const boxLayoutOptions = [
	{ label: __( 'Boxed', 'b-blocks' ), value: 'boxed' },
	{ label: __( 'Plain', 'b-blocks' ), value: 'plain' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
