import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { TIMEZONES } from '../../../../utils/options';

const General = ({ attributes, setAttributes, updateObj }) => {
	const { image = {}, datetime = {}, location = {}, organizer = {}, link = {}, cta = {} } = attributes;

	const { id: imageId, url: imageUrl, alt: imageAlt } = image;

	const { startDate, startTime, endDate, endTime, timezone, status } = datetime;
	const { isVirtual, virtualUrl, venueName, venueAddress, venueCity, venueCountry } = location;
	const { label: ctaLabel, url: ctaUrl, newTab: ctaNewTab } = link;
	const { showButton = true } = cta;

	const isCustomTz = timezone === '_custom' || (timezone && !TIMEZONES.includes(timezone));
	const tzSelectValue = isCustomTz ? '_custom' : (timezone || 'UTC');

	return <>
		<PanelBody className='bPlPanelBody' title={__('Event Details', 'b-blocks')} initialOpen={true}>
			<p style={{ marginTop: 0, fontStyle: 'italic', opacity: 0.75 }}>
				{__('Edit the event name and description directly on the card. Set the heading level (H2–H4) from the block toolbar.', 'b-blocks')}
			</p>

			<TextControl label={__('Start Date', 'b-blocks')} type='date' value={startDate || ''} onChange={(val) => updateObj('datetime', val, 'startDate')} __nextHasNoMarginBottom />
			<TextControl label={__('Start Time', 'b-blocks')} type='time' value={startTime || ''} onChange={(val) => updateObj('datetime', val, 'startTime')} __nextHasNoMarginBottom />
			<TextControl label={__('End Date (optional)', 'b-blocks')} type='date' value={endDate || ''} onChange={(val) => updateObj('datetime', val, 'endDate')} __nextHasNoMarginBottom />
			<TextControl label={__('End Time (optional)', 'b-blocks')} type='time' value={endTime || ''} onChange={(val) => updateObj('datetime', val, 'endTime')} __nextHasNoMarginBottom />

			<SelectControl
				label={__('Timezone', 'b-blocks')}
				value={tzSelectValue}
				options={[...TIMEZONES.map((tz) => ({ label: tz, value: tz })), { label: __('Custom…', 'b-blocks'), value: '_custom' }]}
				onChange={(val) => updateObj('datetime', val === '_custom' ? '' : val, 'timezone')}
				__nextHasNoMarginBottom
			/>

			{isCustomTz && (
				<TextControl
					label={__('Custom timezone', 'b-blocks')}
					value={timezone === '_custom' ? '' : (timezone || '')}
					onChange={(val) => updateObj('datetime', val, 'timezone')}
					placeholder='Continent/City'
					help={__('Use a valid IANA timezone name, e.g. America/New_York.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			)}

			<SelectControl
				label={__('Event Status', 'b-blocks')}
				value={status || 'EventScheduled'}
				options={[
					{ label: __('Scheduled', 'b-blocks'), value: 'EventScheduled' },
					{ label: __('Cancelled', 'b-blocks'), value: 'EventCancelled' },
					{ label: __('Postponed', 'b-blocks'), value: 'EventPostponed' },
					{ label: __('Moved Online', 'b-blocks'), value: 'EventMovedOnline' },
				]}
				onChange={(val) => updateObj('datetime', val, 'status')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl className='mt20' label={__('Virtual / Online event', 'b-blocks')} checked={!!isVirtual} onChange={(val) => updateObj('location', val, 'isVirtual')} />

			{isVirtual && (
				<TextControl label={__('Virtual Event URL', 'b-blocks')} type='url' value={virtualUrl || ''} onChange={(val) => updateObj('location', val, 'virtualUrl')} placeholder='https://example.com/webinar' __nextHasNoMarginBottom />
			)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
			<Label>{__('Cover Image:', 'b-blocks')}</Label>
			<MediaArea
				label={imageUrl ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
				value={{ id: imageId, url: imageUrl, alt: imageAlt }}
				types={['image']}
				height='100%'
				width='100%'
				onChange={(media) => setAttributes({ image: { ...image, id: media?.id || 0, url: media?.url || '', alt: media?.alt || imageAlt || '' } })}
			/>

			<TextControl
				className='mt10'
				label={__('Alt Text', 'b-blocks')}
				value={imageAlt || ''}
				onChange={(val) => updateObj('image', val, 'alt')}
				help={__('Describes the image; leave empty for a decorative image.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		{!isVirtual && (
			<PanelBody className='bPlPanelBody' title={__('Location', 'b-blocks')} initialOpen={false}>
				<TextControl label={__('Venue Name', 'b-blocks')} value={venueName || ''} onChange={(val) => updateObj('location', val, 'venueName')} placeholder={__('e.g. City Hall Auditorium', 'b-blocks')} __nextHasNoMarginBottom />
				<TextControl label={__('Address', 'b-blocks')} value={venueAddress || ''} onChange={(val) => updateObj('location', val, 'venueAddress')} __nextHasNoMarginBottom />
				<TextControl label={__('City', 'b-blocks')} value={venueCity || ''} onChange={(val) => updateObj('location', val, 'venueCity')} __nextHasNoMarginBottom />
				<TextControl label={__('Country (ISO 2-letter)', 'b-blocks')} value={venueCountry || ''} onChange={(val) => updateObj('location', val, 'venueCountry')} placeholder='US' help={__('Two-letter ISO country code used in schema markup.', 'b-blocks')} __nextHasNoMarginBottom />
			</PanelBody>
		)}

		<PanelBody className='bPlPanelBody' title={__('Organizer', 'b-blocks')} initialOpen={false}>
			<TextControl label={__('Organizer Name', 'b-blocks')} value={organizer.name || ''} onChange={(val) => updateObj('organizer', val, 'name')} __nextHasNoMarginBottom />
			<TextControl label={__('Organizer URL', 'b-blocks')} type='url' value={organizer.url || ''} onChange={(val) => updateObj('organizer', val, 'url')} placeholder='https://example.com' __nextHasNoMarginBottom />
			<ToggleControl className='mt20' label={__('Show organizer on card', 'b-blocks')} checked={!!organizer.show} onChange={(val) => updateObj('organizer', val, 'show')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('CTA Button', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Button', 'b-blocks')} checked={showButton !== false} onChange={(val) => updateObj('cta', val, 'showButton')} />
			<TextControl className='mt10' label={__('Button Label', 'b-blocks')} value={ctaLabel || ''} onChange={(val) => updateObj('link', val, 'label')} placeholder={__('Get Tickets', 'b-blocks')} __nextHasNoMarginBottom />
			<TextControl label={__('Button URL', 'b-blocks')} type='url' value={ctaUrl || ''} onChange={(val) => updateObj('link', val, 'url')} placeholder='https://example.com/register' __nextHasNoMarginBottom />
			<ToggleControl className='mt20' label={__('Open in new tab', 'b-blocks')} checked={!!ctaNewTab} onChange={(val) => updateObj('link', val, 'newTab')} />
		</PanelBody>
	</>;
};
export default General;
