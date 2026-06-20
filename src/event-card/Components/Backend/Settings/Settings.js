import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	RangeControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const TIMEZONES = [
	'UTC',
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
	'America/Toronto',
	'America/Sao_Paulo',
	'America/Mexico_City',
	'Europe/London',
	'Europe/Paris',
	'Europe/Berlin',
	'Europe/Madrid',
	'Europe/Rome',
	'Europe/Amsterdam',
	'Europe/Moscow',
	'Africa/Cairo',
	'Africa/Johannesburg',
	'Asia/Dubai',
	'Asia/Kolkata',
	'Asia/Bangkok',
	'Asia/Shanghai',
	'Asia/Hong_Kong',
	'Asia/Singapore',
	'Asia/Tokyo',
	'Asia/Seoul',
	'Australia/Sydney',
	'Australia/Perth',
	'Pacific/Auckland',
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		startDate,
		startTime,
		endDate,
		endTime,
		timezone,
		venueName,
		venueAddress,
		venueCity,
		venueCountry,
		isVirtual,
		virtualUrl,
		organizerName,
		organizerUrl,
		eventStatus,
		ctaLabel,
		ctaUrl,
		ctaNewTab,
		showSchema,
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
		titleFontSize,
		titleFontWeight,
		metaFontSize,
		descFontSize,
		ctaFontSize,
		ctaBorderRadius,
		showDateBadge,
		showOrganizer,
	} = attributes;

	const isCustomTz = timezone === '_custom' || (timezone && !TIMEZONES.includes(timezone));
	const tzSelectValue = isCustomTz ? '_custom' : (timezone || 'UTC');

	const setPad = (key, val) => {
		setAttributes({ padding: { ...padding, [key]: val } });
	};

	const numFromPx = (val, fallback) => {
		const n = parseInt(val, 10);
		return Number.isNaN(n) ? fallback : n;
	};

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Event Details', 'b-blocks')} initialOpen={true}>
				<p style={{ marginTop: 0, fontStyle: 'italic', opacity: 0.75 }}>
					{__('Edit the event name and description directly on the card. Set the heading level (H2–H4) from the block toolbar.', 'b-blocks')}
				</p>

				<TextControl
					label={__('Start Date', 'b-blocks')}
					type='date'
					value={startDate || ''}
					onChange={(val) => setAttributes({ startDate: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Start Time', 'b-blocks')}
					type='time'
					value={startTime || ''}
					onChange={(val) => setAttributes({ startTime: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('End Date (optional)', 'b-blocks')}
					type='date'
					value={endDate || ''}
					onChange={(val) => setAttributes({ endDate: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('End Time (optional)', 'b-blocks')}
					type='time'
					value={endTime || ''}
					onChange={(val) => setAttributes({ endTime: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Timezone', 'b-blocks')}
					value={tzSelectValue}
					options={[
						...TIMEZONES.map((tz) => ({ label: tz, value: tz })),
						{ label: __('Custom…', 'b-blocks'), value: '_custom' },
					]}
					onChange={(val) => setAttributes({ timezone: val === '_custom' ? '' : val })}
					__nextHasNoMarginBottom
				/>

				{isCustomTz && (
					<TextControl
						label={__('Custom timezone', 'b-blocks')}
						value={timezone === '_custom' ? '' : (timezone || '')}
						onChange={(val) => setAttributes({ timezone: val })}
						placeholder='Continent/City'
						help={__('Use a valid IANA timezone name, e.g. America/New_York.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<SelectControl
					label={__('Event Status', 'b-blocks')}
					value={eventStatus || 'EventScheduled'}
					options={[
						{ label: __('Scheduled', 'b-blocks'), value: 'EventScheduled' },
						{ label: __('Cancelled', 'b-blocks'), value: 'EventCancelled' },
						{ label: __('Postponed', 'b-blocks'), value: 'EventPostponed' },
						{ label: __('Moved Online', 'b-blocks'), value: 'EventMovedOnline' },
					]}
					onChange={(val) => setAttributes({ eventStatus: val })}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					className='mt20'
					label={__('Virtual / Online event', 'b-blocks')}
					checked={!!isVirtual}
					onChange={(val) => setAttributes({ isVirtual: val })}
				/>

				{isVirtual && (
					<TextControl
						label={__('Virtual Event URL', 'b-blocks')}
						type='url'
						value={virtualUrl || ''}
						onChange={(val) => setAttributes({ virtualUrl: val })}
						placeholder='https://example.com/webinar'
						__nextHasNoMarginBottom
					/>
				)}
			</PanelBody>

			{!isVirtual && (
				<PanelBody className='bPlPanelBody' title={__('Location', 'b-blocks')} initialOpen={true}>
					<TextControl
						label={__('Venue Name', 'b-blocks')}
						value={venueName || ''}
						onChange={(val) => setAttributes({ venueName: val })}
						placeholder={__('e.g. City Hall Auditorium', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Address', 'b-blocks')}
						value={venueAddress || ''}
						onChange={(val) => setAttributes({ venueAddress: val })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('City', 'b-blocks')}
						value={venueCity || ''}
						onChange={(val) => setAttributes({ venueCity: val })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Country (ISO 2-letter)', 'b-blocks')}
						value={venueCountry || ''}
						onChange={(val) => setAttributes({ venueCountry: val })}
						placeholder='US'
						help={__('Two-letter ISO country code used in schema markup.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			)}

			<PanelBody className='bPlPanelBody' title={__('Organizer', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Organizer Name', 'b-blocks')}
					value={organizerName || ''}
					onChange={(val) => setAttributes({ organizerName: val })}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Organizer URL', 'b-blocks')}
					type='url'
					value={organizerUrl || ''}
					onChange={(val) => setAttributes({ organizerUrl: val })}
					placeholder='https://example.com'
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					className='mt20'
					label={__('Show organizer on card', 'b-blocks')}
					checked={!!showOrganizer}
					onChange={(val) => setAttributes({ showOrganizer: val })}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('CTA Button', 'b-blocks')} initialOpen={true}>
				<TextControl
					label={__('Button Label', 'b-blocks')}
					value={ctaLabel || ''}
					onChange={(val) => setAttributes({ ctaLabel: val })}
					placeholder={__('Get Tickets', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Button URL', 'b-blocks')}
					type='url'
					value={ctaUrl || ''}
					onChange={(val) => setAttributes({ ctaUrl: val })}
					placeholder='https://example.com/register'
					help={__('Leave blank to hide the button.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					className='mt20'
					label={__('Open in new tab', 'b-blocks')}
					checked={!!ctaNewTab}
					onChange={(val) => setAttributes({ ctaNewTab: val })}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<SelectControl
					label={__('Card Style', 'b-blocks')}
					value={cardStyle || 'default'}
					options={[
						{ label: __('Default (shadow)', 'b-blocks'), value: 'default' },
						{ label: __('Outlined', 'b-blocks'), value: 'outlined' },
						{ label: __('Flat', 'b-blocks'), value: 'flat' },
					]}
					onChange={(val) => setAttributes({ cardStyle: val })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Card Alignment', 'b-blocks')}
					value={alignment || 'left'}
					options={[
						{ label: __('Left', 'b-blocks'), value: 'left' },
						{ label: __('Center', 'b-blocks'), value: 'center' },
						{ label: __('Right', 'b-blocks'), value: 'right' },
					]}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{__('Accent Color:', 'b-blocks')}</Label>
					<ColorControl
						value={accentColor || '#146EF5'}
						onChange={(val) => setAttributes({ accentColor: val })}
						defaultColor='#146EF5'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Card Background:', 'b-blocks')}</Label>
					<ColorControl
						value={cardBg || '#ffffff'}
						onChange={(val) => setAttributes({ cardBg: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={textColor || '#1a1a1a'}
						onChange={(val) => setAttributes({ textColor: val })}
						defaultColor='#1a1a1a'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Muted Text Color:', 'b-blocks')}</Label>
					<ColorControl
						value={mutedColor || '#6b7280'}
						onChange={(val) => setAttributes({ mutedColor: val })}
						defaultColor='#6b7280'
					/>
				</PanelRow>

				<ToggleControl
					className='mt20'
					label={__('Show date badge', 'b-blocks')}
					checked={!!showDateBadge}
					onChange={(val) => setAttributes({ showDateBadge: val })}
				/>

				<RangeControl
					label={__('Card Border Radius (px)', 'b-blocks')}
					value={numFromPx(borderRadius, 8)}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={48}
				/>

				<div style={{ display: 'flex', gap: 8 }}>
					<TextControl
						label={__('Pad Top', 'b-blocks')}
						value={padding.top || '24px'}
						onChange={(val) => setPad('top', val)}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Pad Right', 'b-blocks')}
						value={padding.right || '28px'}
						onChange={(val) => setPad('right', val)}
						__nextHasNoMarginBottom
					/>
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<TextControl
						label={__('Pad Bottom', 'b-blocks')}
						value={padding.bottom || '24px'}
						onChange={(val) => setPad('bottom', val)}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Pad Left', 'b-blocks')}
						value={padding.left || '28px'}
						onChange={(val) => setPad('left', val)}
						__nextHasNoMarginBottom
					/>
				</div>

				<TextControl
					className='mt10'
					label={__('Max Width', 'b-blocks')}
					value={maxWidth || '640px'}
					onChange={(val) => setAttributes({ maxWidth: val })}
					placeholder='640px'
					help={__('Use 0px or 100% for full width.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					className='mt10'
					label={__('Title Font Size', 'b-blocks')}
					value={titleFontSize || '22px'}
					onChange={(val) => setAttributes({ titleFontSize: val })}
					placeholder='22px'
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={__('Title Font Weight', 'b-blocks')}
					value={titleFontWeight || '700'}
					options={[
						{ label: '400', value: '400' },
						{ label: '500', value: '500' },
						{ label: '600', value: '600' },
						{ label: '700', value: '700' },
						{ label: '800', value: '800' },
					]}
					onChange={(val) => setAttributes({ titleFontWeight: val })}
					__nextHasNoMarginBottom
				/>

				<TextControl
					className='mt10'
					label={__('Meta Font Size', 'b-blocks')}
					value={metaFontSize || '14px'}
					onChange={(val) => setAttributes({ metaFontSize: val })}
					placeholder='14px'
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Description Font Size', 'b-blocks')}
					value={descFontSize || '15px'}
					onChange={(val) => setAttributes({ descFontSize: val })}
					placeholder='15px'
					__nextHasNoMarginBottom
				/>

				<div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e0e0e0' }}>
					<Label>{__('CTA Button Style', 'b-blocks')}</Label>
				</div>

				<PanelRow>
					<Label className=''>{__('Button Background:', 'b-blocks')}</Label>
					<ColorControl
						value={ctaBg || '#146EF5'}
						onChange={(val) => setAttributes({ ctaBg: val })}
						defaultColor='#146EF5'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Button Text:', 'b-blocks')}</Label>
					<ColorControl
						value={ctaTextColor || '#ffffff'}
						onChange={(val) => setAttributes({ ctaTextColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>
				<PanelRow>
					<Label className=''>{__('Button Hover Background:', 'b-blocks')}</Label>
					<ColorControl
						value={ctaHoverBg || '#0040E3'}
						onChange={(val) => setAttributes({ ctaHoverBg: val })}
						defaultColor='#0040E3'
					/>
				</PanelRow>

				<TextControl
					className='mt10'
					label={__('CTA Font Size', 'b-blocks')}
					value={ctaFontSize || '15px'}
					onChange={(val) => setAttributes({ ctaFontSize: val })}
					placeholder='15px'
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('CTA Border Radius (px)', 'b-blocks')}
					value={numFromPx(ctaBorderRadius, 6)}
					onChange={(val) => setAttributes({ ctaBorderRadius: val })}
					min={0}
					max={48}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('SEO / Schema', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Output JSON-LD Schema', 'b-blocks')}
					checked={!!showSchema}
					onChange={(val) => setAttributes({ showSchema: val })}
				/>
				<Notice status='info' isDismissible={false}>
					{__('When enabled, a schema.org Event JSON-LD block is added to this page for Google rich results. Requires an event name, a valid start date, and a physical location (or a Virtual URL for online events).', 'b-blocks')}
				</Notice>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
