/**
 * Event Card — shared frontend markup.
 *
 * Rendered by view.js on the frontend; mirrors the editor output from Edit.js.
 * The JSON-LD Event schema is emitted by EventSchema. Per-instance styling
 * comes from <Style>; date/status/location labels derive from the attributes.
 */

import { __ } from '@wordpress/i18n';
import { formatEventLabel, badgeFromDate, getEventStatus, getLocationLabel } from '../../utils/functions';

const CalendarIcon = () => <svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7v10H5V9h14Z' /></svg>;
const PinIcon = () => <svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z' /></svg>;
const UserIcon = () => <svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z' /></svg>;

const EventCard = ({ attributes }) => {
	const { content = {}, image = {}, datetime = {}, location = {}, organizer = {}, link = {}, card = {}, cta = {}, status: statusStyle = {} } = attributes;

	const { url: imageUrl, alt: imageAlt } = image;
	const { eventName, eventDescription, titleTag } = content;
	const { startDate, startTime, endDate, endTime, status: eventStatus } = datetime;
	const { isVirtual, virtualUrl, venueName, venueAddress, venueCity, venueCountry } = location;
	const { label: ctaLabel, url: ctaUrl, newTab: ctaNewTab } = link;
	const { showButton = true } = cta;
	const { style: cardStyle, alignment, showDateBadge = true } = card;
	const { show: showStatus = true } = statusStyle;

	const TitleTag = ['h2', 'h3', 'h4'].includes(titleTag) ? titleTag : 'h3';
	const safeAlign = ['left', 'center', 'right'].includes(alignment) ? alignment : 'left';
	const safeStyle = ['default', 'outlined', 'flat'].includes(cardStyle) ? cardStyle : 'default';

	const badge = badgeFromDate(startDate);
	const startLabel = formatEventLabel(startDate, startTime);
	const endLabel = formatEventLabel(endDate, endTime);
	const status = getEventStatus(eventStatus);
	const locationLabel = getLocationLabel({ isVirtual, venueName, venueAddress, venueCity });

	const wrapperClass = [
		'b-blocks-event-card',
		`b-blocks-event-card--${safeStyle}`,
		`b-blocks-event-card--align-${safeAlign}`,
		isVirtual ? 'is-virtual' : '',
		status ? status.cls : '',
	].filter(Boolean).join(' ');

	const newTabAttrs = ctaNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

	return (
		<div className={wrapperClass}>
			<article className='b-blocks-event-card-inner'>
				{imageUrl && (
					<div className='b-blocks-event-card-cover'>
						<img src={imageUrl} alt={imageAlt || ''} loading='lazy' decoding='async' />
					</div>
				)}

				<div className='b-blocks-event-card-header'>
					{showDateBadge && badge.day && (
						<div className='b-blocks-event-card-badge' aria-hidden='true'>
							<span className='b-blocks-event-card-badge-month'>{badge.month}</span>
							<span className='b-blocks-event-card-badge-day'>{badge.day}</span>
						</div>
					)}

					<div className='b-blocks-event-card-heading'>
						<TitleTag className='b-blocks-event-card-title'>
							<span>{eventName || __('Event Name', 'b-blocks')}</span>
							{showStatus !== false && status && <span className='b-blocks-event-card-status'>{status.label}</span>}
						</TitleTag>

						{startLabel && (
							<p className='b-blocks-event-card-meta b-blocks-event-card-meta-date'>
								<CalendarIcon />
								<time>{startLabel}</time>
								{endLabel && (
									<>
										<span className='b-blocks-event-card-dash' aria-hidden='true'> – </span>
										<time>{endLabel}</time>
									</>
								)}
							</p>
						)}
					</div>
				</div>

				{locationLabel && (
					<address className='b-blocks-event-card-meta b-blocks-event-card-meta-location'>
						<PinIcon />
						{isVirtual && virtualUrl ? (
							<a href={virtualUrl} target='_blank' rel='noopener noreferrer'>
								{locationLabel}
								<span className='screen-reader-text'> {__('(opens in a new tab)', 'b-blocks')}</span>
							</a>
						) : (
							locationLabel
						)}
						{!isVirtual && venueCountry && <span className='b-blocks-event-card-country'>{venueCountry}</span>}
					</address>
				)}

				{organizer.show && organizer.name && (
					<p className='b-blocks-event-card-meta b-blocks-event-card-meta-organizer'>
						<UserIcon />
						<span className='b-blocks-event-card-organizer-label'>{__('By', 'b-blocks')}</span>{' '}
						{organizer.url ? <a href={organizer.url} rel='noopener'>{organizer.name}</a> : organizer.name}
					</p>
				)}

				{eventDescription && (
					<div className='b-blocks-event-card-description' dangerouslySetInnerHTML={{ __html: eventDescription }} />
				)}

				{showButton && (
					<div className='b-blocks-event-card-cta'>
						<a className='b-blocks-event-card-btn' href={ctaUrl || '#'} {...newTabAttrs}>
							{ctaLabel || __('Get Tickets', 'b-blocks')}
							{ctaNewTab && <span className='screen-reader-text'> {__('(opens in a new tab)', 'b-blocks')}</span>}
						</a>
					</div>
				)}
			</article>
		</div>
	);
};
export default EventCard;
