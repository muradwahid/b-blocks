import { __ } from '@wordpress/i18n';

// Curated set of IANA timezones. A short, opinionated list is enough for
// MVP — the editor can extend later via the dropdown. Values are real
// IANA strings that PHP's DateTimeZone and JS Intl.DateTimeFormat accept.
export const timezoneOptions = [
	{ label: __( 'UTC', 'b-blocks' ), value: 'UTC' },
	{ label: __( 'Honolulu (UTC−10)', 'b-blocks' ), value: 'Pacific/Honolulu' },
	{ label: __( 'Anchorage (UTC−09)', 'b-blocks' ), value: 'America/Anchorage' },
	{ label: __( 'Los Angeles (UTC−08)', 'b-blocks' ), value: 'America/Los_Angeles' },
	{ label: __( 'Vancouver (UTC−08)', 'b-blocks' ), value: 'America/Vancouver' },
	{ label: __( 'Denver (UTC−07)', 'b-blocks' ), value: 'America/Denver' },
	{ label: __( 'Phoenix (UTC−07)', 'b-blocks' ), value: 'America/Phoenix' },
	{ label: __( 'Chicago (UTC−06)', 'b-blocks' ), value: 'America/Chicago' },
	{ label: __( 'Mexico City (UTC−06)', 'b-blocks' ), value: 'America/Mexico_City' },
	{ label: __( 'New York (UTC−05)', 'b-blocks' ), value: 'America/New_York' },
	{ label: __( 'Toronto (UTC−05)', 'b-blocks' ), value: 'America/Toronto' },
	{ label: __( 'Sao Paulo (UTC−03)', 'b-blocks' ), value: 'America/Sao_Paulo' },
	{ label: __( 'London (UTC+00)', 'b-blocks' ), value: 'Europe/London' },
	{ label: __( 'Lisbon (UTC+00)', 'b-blocks' ), value: 'Europe/Lisbon' },
	{ label: __( 'Paris (UTC+01)', 'b-blocks' ), value: 'Europe/Paris' },
	{ label: __( 'Berlin (UTC+01)', 'b-blocks' ), value: 'Europe/Berlin' },
	{ label: __( 'Madrid (UTC+01)', 'b-blocks' ), value: 'Europe/Madrid' },
	{ label: __( 'Athens (UTC+02)', 'b-blocks' ), value: 'Europe/Athens' },
	{ label: __( 'Istanbul (UTC+03)', 'b-blocks' ), value: 'Europe/Istanbul' },
	{ label: __( 'Moscow (UTC+03)', 'b-blocks' ), value: 'Europe/Moscow' },
	{ label: __( 'Dubai (UTC+04)', 'b-blocks' ), value: 'Asia/Dubai' },
	{ label: __( 'Karachi (UTC+05)', 'b-blocks' ), value: 'Asia/Karachi' },
	{ label: __( 'Kolkata (UTC+05:30)', 'b-blocks' ), value: 'Asia/Kolkata' },
	{ label: __( 'Dhaka (UTC+06)', 'b-blocks' ), value: 'Asia/Dhaka' },
	{ label: __( 'Bangkok (UTC+07)', 'b-blocks' ), value: 'Asia/Bangkok' },
	{ label: __( 'Singapore (UTC+08)', 'b-blocks' ), value: 'Asia/Singapore' },
	{ label: __( 'Hong Kong (UTC+08)', 'b-blocks' ), value: 'Asia/Hong_Kong' },
	{ label: __( 'Shanghai (UTC+08)', 'b-blocks' ), value: 'Asia/Shanghai' },
	{ label: __( 'Tokyo (UTC+09)', 'b-blocks' ), value: 'Asia/Tokyo' },
	{ label: __( 'Seoul (UTC+09)', 'b-blocks' ), value: 'Asia/Seoul' },
	{ label: __( 'Sydney (UTC+10)', 'b-blocks' ), value: 'Australia/Sydney' },
	{ label: __( 'Auckland (UTC+12)', 'b-blocks' ), value: 'Pacific/Auckland' }
];

export const titleTagOptions = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' },
	{ label: __( 'H5', 'b-blocks' ), value: 'h5' },
	{ label: __( 'H6', 'b-blocks' ), value: 'h6' }
];

export const timeFormatOptions = [
	{ label: __( '12-hour (9:00 AM)', 'b-blocks' ), value: '12h' },
	{ label: __( '24-hour (09:00)', 'b-blocks' ), value: '24h' }
];

// Format a 24-hour HH:MM string for display in the chosen format.
// Mirrors the PHP formatter in render.php so the editor preview matches the frontend.
export const formatTime = ( hhmm, format ) => {
	const value = String( hhmm || '' ).trim();
	const match = value.match( /^(\d{1,2}):(\d{2})$/ );
	if ( ! match ) {
		return value;
	}
	let hours = Math.max( 0, Math.min( 23, parseInt( match[ 1 ], 10 ) ) );
	const minutes = Math.max( 0, Math.min( 59, parseInt( match[ 2 ], 10 ) ) );
	if ( '24h' === format ) {
		return `${ String( hours ).padStart( 2, '0' ) }:${ String( minutes ).padStart( 2, '0' ) }`;
	}
	const suffix = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	if ( 0 === hours ) {
		hours = 12;
	}
	return `${ hours }:${ String( minutes ).padStart( 2, '0' ) } ${ suffix }`;
};
