import { useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Flex, PanelBody, TextControl, TextareaControl } from '@wordpress/components';

import { BtnGroup, Label, Notice } from '../../../../../../../bpl-tools/Components';

import { EMBED_URL_PLACEHOLDER, extractEmbedSrc, geocodeErrorMessage, isValidEmbedUrl } from '../../../../utils/data';
import { loadGoogleMaps } from '../../../../utils/loadGoogleMaps';
import { sourceTypes } from '../../../../utils/options';

const Source = ({ source = {}, updateObj, apiKey = '' }) => {
	const type = source.type || (source.embedUrl ? 'embed' : 'interactive');
	const center = source.center || {};
	const embedUrl = source.embedUrl || '';
	const invalidEmbed = embedUrl && !isValidEmbedUrl(embedUrl);

	const [address, setAddress] = useState(center.address || '');
	const [status, setStatus] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	// Remembers which address produced the coordinates currently stored, so a
	// re-render never triggers a second (billable) lookup for the same text.
	const resolved = useRef(center.address || '');

	useEffect(() => {
		setAddress(center.address || '');
		resolved.current = center.address || '';
	}, [center.address]);

	const geocode = async (query) => {
		const term = (query ?? address).trim();
		if (!term || !apiKey) return;

		setStatus('loading');

		try {
			const { Geocoder } = await loadGoogleMaps(apiKey, ['geocoding']);
			const { results } = await new Geocoder().geocode({ address: term });
			const location = results?.[0]?.geometry?.location;

			if (!location) throw new Error('not-found');

			resolved.current = results[0].formatted_address;
			updateObj('source', {
				lat: Number(location.lat().toFixed(6)),
				lng: Number(location.lng().toFixed(6)),
				address: results[0].formatted_address
			}, 'center');
			setStatus('done');
		} catch (error) {
			setErrorMsg(geocodeErrorMessage(error));
			setStatus('error');
		}
	};

	// Debounced auto-lookup — only when the text differs from what is cached.
	useEffect(() => {
		if ('interactive' !== type || !apiKey) return undefined;

		const term = address.trim();
		if (!term || term === resolved.current) return undefined;

		const timer = setTimeout(() => geocode(term), 900);

		return () => clearTimeout(timer);
	}, [address, type, apiKey]);

	return <PanelBody className='bPlPanelBody' title={__('Map Source', 'b-blocks')} initialOpen={true}>
		<BtnGroup label={__('Mode', 'b-blocks')} options={sourceTypes} value={type} onChange={(val) => updateObj('source', val, 'type')} />

		{'embed' === type ? <>
			<TextareaControl
				className='mt10'
				label={__('Google Maps Embed', 'b-blocks')}
				value={embedUrl}
				onChange={(raw) => updateObj('source', extractEmbedSrc(raw), 'embedUrl')}
				placeholder={EMBED_URL_PLACEHOLDER}
				help={__('In Google Maps, click Share → Embed a map → Copy HTML. Paste the full iframe code OR just the src URL — we will extract it for you.', 'b-blocks')}
				rows={4}
				__nextHasNoMarginBottom
			/>

			{invalidEmbed && <Notice status='warning' isIcon={true}>
				{__('This does not look like a Google Maps embed URL. Only https://www.google.com/maps/embed URLs are allowed.', 'b-blocks')}
			</Notice>}
		</> : <>
			<Label className='mt15'>{__('Center Address', 'b-blocks')}</Label>
			<Flex align='flex-end' gap={2}>
				<TextControl
					className='flex2'
					value={address}
					onChange={setAddress}
					placeholder={__('e.g. 1600 Amphitheatre Parkway, Mountain View', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
				<Button variant='secondary' onClick={() => geocode()} disabled={!apiKey || !address.trim() || 'loading' === status}>
					{'loading' === status ? __('Locating…', 'b-blocks') : __('Locate', 'b-blocks')}
				</Button>
			</Flex>

			{!apiKey && <Notice status='warning' isIcon={true}>
				{__('Add a Google Maps API key to look up addresses.', 'b-blocks')}
			</Notice>}

			{'error' === status && <Notice status='danger' isIcon={true}>{errorMsg}</Notice>}

			<Flex className='mt10' gap={2}>
				<TextControl
					className='flex1'
					label={__('Latitude', 'b-blocks')}
					value={center.lat ?? ''}
					step={0.000001}
					onChange={(val) => updateObj('source', val, 'center', 'lat')}
					__next40pxDefaultSize
				/>
				<TextControl
					className='flex1'
					label={__('Longitude', 'b-blocks')}
					value={center.lng ?? ''}
					step={0.000001}
					onChange={(val) => updateObj('source', val, 'center', 'lng')}
					__next40pxDefaultSize
				/>
			</Flex>

			<TextControl
				className='mt10'
				label={__('Map ID', 'b-blocks')}
				value={source.mapId || ''}
				onChange={(val) => updateObj('source', val, 'mapId')}
				help={__('Optional. A Map ID from Google Cloud console enables cloud-based styling. Leave empty to use the JSON themes in the Style tab.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<Flex className='mt10' gap={2}>
				<TextControl
					className='flex1'
					label={__('Language', 'b-blocks')}
					value={source.language || ''}
					onChange={(val) => updateObj('source', val.trim(), 'language')}
					placeholder='en'
					__nextHasNoMarginBottom
				/>
				<TextControl
					className='flex1'
					label={__('Region', 'b-blocks')}
					value={source.region || ''}
					onChange={(val) => updateObj('source', val.trim(), 'region')}
					placeholder='US'
					__nextHasNoMarginBottom
				/>
			</Flex>
		</>}
	</PanelBody>;
};
export default Source;
