import { __ } from '@wordpress/i18n';

const MONTHS = () => [
	__('Jan', 'b-blocks'), __('Feb', 'b-blocks'), __('Mar', 'b-blocks'),
	__('Apr', 'b-blocks'), __('May', 'b-blocks'), __('Jun', 'b-blocks'),
	__('Jul', 'b-blocks'), __('Aug', 'b-blocks'), __('Sep', 'b-blocks'),
	__('Oct', 'b-blocks'), __('Nov', 'b-blocks'), __('Dec', 'b-blocks'),
];

// "Jan 5, 2025 · 18:00" from an ISO date (YYYY-MM-DD) + optional time (HH:MM).
export const formatEventLabel = (dateStr, timeStr) => {
	if (!dateStr) return '';
	const parts = dateStr.split('-');
	if (parts.length !== 3) return dateStr;
	const mIdx = parseInt(parts[1], 10) - 1;
	const day = parseInt(parts[2], 10);
	let out = `${MONTHS()[mIdx] || ''} ${day}, ${parts[0]}`;
	if (timeStr) out += ` · ${timeStr}`;
	return out.trim();
};

// Month / day for the date badge.
export const badgeFromDate = (dateStr) => {
	const effectiveDate = dateStr || new Date().toISOString().split('T')[0];
	const parts = effectiveDate.split('-');
	if (parts.length !== 3) return { month: 'JAN', day: '1' };
	const mIdx = parseInt(parts[1], 10) - 1;
	const day = String(parseInt(parts[2], 10));
	return { month: MONTHS()[mIdx] || 'JAN', day };
};

// { label, cls } for a non-scheduled event status, or null.
export const getEventStatus = (status) => {
	const map = {
		EventCancelled: { label: __('Cancelled', 'b-blocks'), cls: 'is-cancelled' },
		EventPostponed: { label: __('Postponed', 'b-blocks'), cls: 'is-postponed' },
		EventMovedOnline: { label: __('Moved Online', 'b-blocks'), cls: 'is-moved-online' },
	};
	return map[status] || null;
};

// Comma-joined location string (or the virtual label).
export const getLocationLabel = ({ isVirtual, venueName, venueAddress, venueCity }) => {
	if (isVirtual) return __('Online / Virtual', 'b-blocks');
	return [venueName, venueAddress, venueCity].filter(Boolean).join(', ');
};

// ISO 8601 datetime with the timezone's UTC offset (e.g. 2025-05-01T18:00:00+05:30).
const buildIso = (dateStr, timeStr, tz) => {
	if (!dateStr) return '';
	const timePart = timeStr ? `${timeStr}:00` : '00:00:00';
	let offset = '';
	try {
		const at = new Date(`${dateStr}T${timeStr || '00:00'}:00Z`);
		const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz || 'UTC', timeZoneName: 'longOffset' }).formatToParts(at);
		const name = parts.find((p) => p.type === 'timeZoneName')?.value || '';
		const m = name.match(/([+-]\d{2}:\d{2})/);
		offset = m ? m[1] : '+00:00';
	} catch (e) {
		offset = '';
	}
	return `${dateStr}T${timePart}${offset}`;
};

// Build the schema.org Event object from the (nested) attributes, or null when
// not eligible: needs schema on, a name, a valid start date, and a location.
export const buildEventSchema = (attributes) => {
	const { content = {}, datetime = {}, location = {}, organizer = {}, link = {}, schema = {} } = attributes || {};
	if (!schema.show) return null;

	const name = (content.eventName || '').replace(/<[^>]*>/g, '').trim();
	const startIso = buildIso(datetime.startDate, datetime.startTime, datetime.timezone);
	const { isVirtual, virtualUrl, venueName, venueAddress, venueCity, venueCountry } = location;
	const hasLocation = isVirtual ? !!virtualUrl : !!(venueName || venueCity || venueAddress);
	if (!name || !startIso || !hasLocation) return null;

	const statuses = ['EventScheduled', 'EventCancelled', 'EventPostponed', 'EventMovedOnline'];
	const status = statuses.includes(datetime.status) ? datetime.status : 'EventScheduled';

	const out = { '@context': 'https://schema.org', '@type': 'Event', name, startDate: startIso };

	const endIso = buildIso(datetime.endDate, datetime.endTime, datetime.timezone);
	if (endIso) out.endDate = endIso;

	out.eventStatus = `https://schema.org/${status}`;
	out.eventAttendanceMode = isVirtual
		? 'https://schema.org/OnlineEventAttendanceMode'
		: 'https://schema.org/OfflineEventAttendanceMode';

	const desc = (content.eventDescription || '').replace(/<[^>]*>/g, '').trim();
	if (desc) out.description = desc;

	if (isVirtual) {
		out.location = { '@type': 'VirtualLocation', url: virtualUrl };
	} else {
		const place = { '@type': 'Place' };
		if (venueName) place.name = venueName;
		const address = { '@type': 'PostalAddress' };
		if (venueAddress) address.streetAddress = venueAddress;
		if (venueCity) address.addressLocality = venueCity;
		if (venueCountry) address.addressCountry = venueCountry;
		if (Object.keys(address).length > 1) place.address = address;
		out.location = place;
	}

	if (organizer.name) {
		const org = { '@type': 'Organization', name: organizer.name };
		if (organizer.url) org.url = organizer.url;
		out.organizer = org;
	}

	if (link.url) out.offers = { '@type': 'Offer', url: link.url };

	return out;
};
