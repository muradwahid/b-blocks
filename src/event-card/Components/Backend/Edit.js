import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';

import { useSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { formatEventLabel, badgeFromDate, getEventStatus, getLocationLabel } from '../../utils/functions';

const TITLE_TAGS = [
	{ tag: 'h2', label: __('Heading 2', 'b-blocks') },
	{ tag: 'h3', label: __('Heading 3', 'b-blocks') },
	{ tag: 'h4', label: __('Heading 4', 'b-blocks') },
];

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { content = {}, image = {}, datetime = {}, location = {}, organizer = {}, link = {}, card = {}, cta = {}, status: statusStyle = {} } = attributes;

	const device = useSelect((select) => select('core/editor')?.getDeviceType()?.toLowerCase() || 'desktop', []);

	const { url: imageUrl, alt: imageAlt } = image;
	const { eventName, eventDescription, titleTag } = content;
	const { startDate, startTime, endDate, endTime, status: eventStatus } = datetime;
	const { isVirtual, venueName, venueAddress, venueCity, venueCountry } = location;
	const { label: ctaLabel } = link;
	const { showButton = true } = cta;
	const { style: cardStyle, alignment, showDateBadge = true } = card;
	const { show: showStatus = true } = statusStyle;

	const updateObj = updateAttributes(attributes, setAttributes);

	const safeTitleTag = ['h2', 'h3', 'h4'].includes(titleTag) ? titleTag : 'h3';
	const safeAlign = ['left', 'center', 'right'].includes(alignment) ? alignment : 'left';
	const safeCardStyle = ['default', 'outlined', 'flat'].includes(cardStyle) ? cardStyle : 'default';

	const status = getEventStatus(eventStatus);

	const wrapperClasses = [
		'b-blocks-event-card',
		`b-blocks-event-card--${safeCardStyle}`,
		`b-blocks-event-card--align-${safeAlign}`,
		isVirtual ? 'is-virtual' : '',
		status ? status.cls : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({ id: `block-${clientId}` });

	const badge = badgeFromDate(startDate);
	const startLabel = formatEventLabel(startDate, startTime);
	const endLabel = formatEventLabel(endDate, endTime);
	const locationLabel = getLocationLabel({ isVirtual, venueName, venueAddress, venueCity });

	const TitleTag = safeTitleTag;

	return (
		<>
			<Settings {...{ ...props, updateObj, device }} />

			<BlockControls>
				<AlignmentControl
					value={safeAlign}
					onChange={(val) => updateObj('card', val || 'left', 'alignment')}
				/>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon='heading'
						label={__('Title heading level', 'b-blocks')}
						controls={TITLE_TAGS.map((t) => ({
							title: t.label,
							isActive: safeTitleTag === t.tag,
							onClick: () => updateObj('content', t.tag, 'titleTag'),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<div>
					<div className={wrapperClasses}>
						<article className='b-blocks-event-card-inner'>
							{imageUrl && (
								<div className='b-blocks-event-card-cover'>
									<img src={imageUrl} alt={imageAlt || ''} />
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
										<RichText
											tagName='span'
											value={eventName || ''}
											onChange={(val) => updateObj('content', val, 'eventName')}
											placeholder={__('Event Name', 'b-blocks')}
											allowedFormats={[]}
										/>
										{showStatus !== false && status && (
											<span className='b-blocks-event-card-status' contentEditable={false}>
												{status.label}
											</span>
										)}
									</TitleTag>

									{startLabel && (
										<p className='b-blocks-event-card-meta b-blocks-event-card-meta-date'>
											<svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7v10H5V9h14Z' /></svg>
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
									<svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z' /></svg>
									{locationLabel}
									{!isVirtual && venueCountry && (
										<span className='b-blocks-event-card-country'>{venueCountry}</span>
									)}
								</address>
							)}

							{organizer.show && organizer.name && (
								<p className='b-blocks-event-card-meta b-blocks-event-card-meta-organizer'>
									<svg className='b-blocks-event-card-meta-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='currentColor' d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z' /></svg>
									<span className='b-blocks-event-card-organizer-label'>{__('By', 'b-blocks')}</span>{' '}
									{organizer.name}
								</p>
							)}

							<RichText
								tagName='div'
								className='b-blocks-event-card-description'
								value={eventDescription || ''}
								onChange={(val) => updateObj('content', val, 'eventDescription')}
								placeholder={__('Optional event description…', 'b-blocks')}
								allowedFormats={['core/bold', 'core/italic', 'core/link']}
							/>

							{showButton && (
								<div className='b-blocks-event-card-cta'>
									<span className='b-blocks-event-card-btn'>{ctaLabel || __('Get Tickets', 'b-blocks')}</span>
								</div>
							)}
						</article>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
