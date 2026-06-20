import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';

import Settings from './Settings/Settings';

const TITLE_TAGS = [
	{ tag: 'h2', label: __('Heading 2', 'b-blocks'), icon: 'heading' },
	{ tag: 'h3', label: __('Heading 3', 'b-blocks'), icon: 'heading' },
	{ tag: 'h4', label: __('Heading 4', 'b-blocks'), icon: 'heading' },
];

const formatLabel = (dateStr, timeStr) => {
	if (!dateStr) return '';
	const parts = dateStr.split('-');
	if (parts.length !== 3) return dateStr;
	const months = [
		__('Jan', 'b-blocks'), __('Feb', 'b-blocks'), __('Mar', 'b-blocks'),
		__('Apr', 'b-blocks'), __('May', 'b-blocks'), __('Jun', 'b-blocks'),
		__('Jul', 'b-blocks'), __('Aug', 'b-blocks'), __('Sep', 'b-blocks'),
		__('Oct', 'b-blocks'), __('Nov', 'b-blocks'), __('Dec', 'b-blocks'),
	];
	const mIdx = parseInt(parts[1], 10) - 1;
	const day = parseInt(parts[2], 10);
	let out = `${months[mIdx] || ''} ${day}, ${parts[0]}`;
	if (timeStr) out += ` · ${timeStr}`;
	return out.trim();
};

const badgeFromDate = (dateStr) => {
	if (!dateStr) return { month: '', day: '' };
	const parts = dateStr.split('-');
	if (parts.length !== 3) return { month: '', day: '' };
	const months = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
	];
	const mIdx = parseInt(parts[1], 10) - 1;
	return { month: months[mIdx] || '', day: String(parseInt(parts[2], 10)) };
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		eventName,
		eventDescription,
		startDate,
		startTime,
		endDate,
		endTime,
		venueName,
		venueAddress,
		venueCity,
		venueCountry,
		isVirtual,
		organizerName,
		eventStatus,
		ctaLabel,
		ctaUrl,
		cardStyle,
		accentColor,
		cardBg,
		textColor,
		mutedColor,
		ctaBg,
		ctaTextColor,
		ctaHoverBg,
		borderRadius,
		padding = {},
		maxWidth,
		alignment,
		titleTag,
		titleFontSize,
		titleFontWeight,
		metaFontSize,
		descFontSize,
		ctaFontSize,
		ctaBorderRadius,
		showDateBadge,
		showOrganizer,
	} = attributes;

	const safeTitleTag = ['h2', 'h3', 'h4'].includes(titleTag) ? titleTag : 'h3';
	const safeAlign = ['left', 'center', 'right'].includes(alignment) ? alignment : 'left';
	const safeCardStyle = ['default', 'outlined', 'flat'].includes(cardStyle) ? cardStyle : 'default';

	const pad = {
		top: padding?.top || '24px',
		right: padding?.right || '28px',
		bottom: padding?.bottom || '24px',
		left: padding?.left || '28px',
	};

	const wrapperStyle = {
		'--bb-ec-accent': accentColor || '#146EF5',
		'--bb-ec-bg': cardBg || '#ffffff',
		'--bb-ec-text': textColor || '#1a1a1a',
		'--bb-ec-muted': mutedColor || '#6b7280',
		'--bb-ec-cta-bg': ctaBg || '#146EF5',
		'--bb-ec-cta-text': ctaTextColor || '#ffffff',
		'--bb-ec-cta-hover-bg': ctaHoverBg || '#0040E3',
		'--bb-ec-radius': `${parseInt(borderRadius, 10) || 0}px`,
		'--bb-ec-cta-radius': `${parseInt(ctaBorderRadius, 10) || 0}px`,
		'--bb-ec-padding': `${pad.top} ${pad.right} ${pad.bottom} ${pad.left}`,
		'--bb-ec-max-width': maxWidth === '0px' ? '100%' : (maxWidth || '640px'),
		'--bb-ec-title-size': titleFontSize || '22px',
		'--bb-ec-title-weight': titleFontWeight || '700',
		'--bb-ec-meta-size': metaFontSize || '14px',
		'--bb-ec-desc-size': descFontSize || '15px',
		'--bb-ec-cta-size': ctaFontSize || '15px',
	};

	const statusMap = {
		EventCancelled: { label: __('Cancelled', 'b-blocks'), cls: 'is-cancelled' },
		EventPostponed: { label: __('Postponed', 'b-blocks'), cls: 'is-postponed' },
		EventMovedOnline: { label: __('Moved Online', 'b-blocks'), cls: 'is-moved-online' },
	};
	const status = statusMap[eventStatus] || null;

	const wrapperClasses = [
		'bb-event-card',
		`bb-event-card--${safeCardStyle}`,
		`bb-event-card--align-${safeAlign}`,
		isVirtual ? 'is-virtual' : '',
		status ? status.cls : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const badge = badgeFromDate(startDate);
	const startLabel = formatLabel(startDate, startTime);
	const endLabel = formatLabel(endDate, endTime);

	const locationParts = [];
	if (isVirtual) {
		locationParts.push(__('Online / Virtual', 'b-blocks'));
	} else {
		if (venueName) locationParts.push(venueName);
		if (venueAddress) locationParts.push(venueAddress);
		if (venueCity) locationParts.push(venueCity);
	}
	const locationLabel = locationParts.join(', ');

	const TitleTag = safeTitleTag;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<BlockControls>
				<AlignmentControl
					value={safeAlign}
					onChange={(val) => setAttributes({ alignment: val || 'left' })}
				/>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon='heading'
						label={__('Title heading level', 'b-blocks')}
						controls={TITLE_TAGS.map((t) => ({
							title: t.label,
							isActive: safeTitleTag === t.tag,
							onClick: () => setAttributes({ titleTag: t.tag }),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<article className='bBlocksEventCard bb-event-card__inner'>
					<div className='bb-event-card__header'>
						{showDateBadge && badge.day && (
							<div className='bb-event-card__badge' aria-hidden='true'>
								<span className='bb-event-card__badge-month'>{badge.month}</span>
								<span className='bb-event-card__badge-day'>{badge.day}</span>
							</div>
						)}

						<div className='bb-event-card__heading'>
							<RichText
								tagName={TitleTag}
								className='bb-event-card__title'
								value={eventName || ''}
								onChange={(val) => setAttributes({ eventName: val })}
								placeholder={__('Event Name', 'b-blocks')}
								allowedFormats={[]}
							/>
							{status && (
								<span className='bb-event-card__status' style={{ marginTop: 4, display: 'inline-block' }}>
									{status.label}
								</span>
							)}

							{startLabel && (
								<p className='bb-event-card__meta bb-event-card__meta--date'>
									<svg className='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7v10H5V9h14Z' /></svg>
									<time>{startLabel}</time>
									{endLabel && (
										<>
											<span className='bb-event-card__dash' aria-hidden='true'> – </span>
											<time>{endLabel}</time>
										</>
									)}
								</p>
							)}
						</div>
					</div>

					{locationLabel && (
						<address className='bb-event-card__meta bb-event-card__meta--location'>
							<svg className='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z' /></svg>
							{locationLabel}
							{!isVirtual && venueCountry && (
								<span className='bb-event-card__country'>{venueCountry}</span>
							)}
						</address>
					)}

					{showOrganizer && organizerName && (
						<p className='bb-event-card__meta bb-event-card__meta--organizer'>
							<svg className='bb-event-card__meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z' /></svg>
							<span className='bb-event-card__organizer-label'>{__('By', 'b-blocks')}</span>
							{' '}
							{organizerName}
						</p>
					)}

					<RichText
						tagName='div'
						className='bb-event-card__description'
						value={eventDescription || ''}
						onChange={(val) => setAttributes({ eventDescription: val })}
						placeholder={__('Optional event description…', 'b-blocks')}
						allowedFormats={['core/bold', 'core/italic', 'core/link']}
					/>

					{ctaLabel && ctaUrl && (
						<div className='bb-event-card__cta'>
							<span className='bb-event-card__btn'>{ctaLabel}</span>
						</div>
					)}
				</article>
			</div>
		</>
	);
};

export default Edit;
