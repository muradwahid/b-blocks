import { useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, CheckboxControl, Flex, SelectControl, TabPanel, TextControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import { ColorControl, IconLibrary, Label, MediaArea, Notice, TinyEditor } from '../../../../../../../../bpl-tools/Components';
import { useWPAjax, useWPOptionQuery } from '../../../../../../../../bpl-tools/hooks';
import { SVGSanitizer } from '../../../../../../../../bpl-tools/utils/common';
import { debounce } from '../../../../../../../../bpl-tools/utils/functions';

import { geocodeErrorMessage, toNumber } from '../../../../../utils/data';
import { loadGoogleMaps } from '../../../../../utils/loadGoogleMaps';
import { iconTypes, markerAnimations, markerTabs } from '../../../../../utils/options';

const MarkerItemSettings = (props) => {
	const { attributes, setAttributes, arrKey = 'markers', index, setActiveIndex, apiKey = '' } = props;

	const items = attributes[arrKey] || [];
	const item = items[index];

	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { refetch } = useWPAjax('b-blocks-enable-svg-mime-type', { _wpnonce: bBlocksUtils?.nonce }, false);
	const svgSanitizer = new SVGSanitizer();

	const [status, setStatus] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	// TinyEditor fires onChange on keyup/input/change/paste — i.e. per keystroke —
	// so writing straight through means one store update and one full re-render
	// per character. The debounced wrapper has to be created once (a fresh one
	// each render would reset its own timer and never fire late) yet still call
	// the current updateItem, hence the ref indirection. Declared above the
	// `!item` guard so the hook order stays stable.
	const updateItemRef = useRef(null);
	const updateContent = useMemo(
		() => debounce((val) => updateItemRef.current?.('content', val), 600),
		[]
	);

	// Alt text needs a local draft as well as a debounce: TextControl is a
	// controlled input, so a delayed attribute write would leave `value` stale
	// and every keystroke would be reverted on the next render. The draft keeps
	// typing responsive while the store write waits.
	const [altDraft, setAltDraft] = useState('');
	const altPending = useRef(false);

	const updateAlt = useMemo(
		() => debounce((val) => {
			updateItemRef.current?.('image', val, 'alt');
			altPending.current = false;
		}, 600),
		[]
	);

	// Re-sync the draft from the attribute when switching markers, or when the
	// value changes underneath us (undo/redo) — but never while a write is
	// still pending, or the in-flight value would clobber what is being typed.
	const storedAlt = items[index]?.image?.alt || '';
	useEffect(() => {
		if (altPending.current) return;
		setAltDraft(storedAlt);
	}, [index, storedAlt]);

	if (!item) return null;

	const categories = attributes.categories || [];

	const updateItem = (type, val, childType = null, thirdChild = null) => {
		setAttributes({
			[arrKey]: produce(items, (draft) => {
				if (null !== thirdChild) {
					draft[index][type][childType][thirdChild] = val;
				} else if (null !== childType) {
					draft[index][type][childType] = val;
				} else {
					draft[index][type] = val;
				}
			})
		});
		setActiveIndex && setActiveIndex(index);
	};

	// Keep the debounced closure pointed at the latest updater.
	updateItemRef.current = updateItem;

	const geocode = async () => {
		const term = (item.address || '').trim();
		if (!term || !apiKey) return;

		setStatus('loading');

		try {
			const { Geocoder } = await loadGoogleMaps(apiKey, ['geocoding']);
			const { results } = await new Geocoder().geocode({ address: term });
			const location = results?.[0]?.geometry?.location;

			if (!location) throw new Error('not-found');

			setAttributes({
				[arrKey]: produce(items, (draft) => {
					draft[index].address = results[0].formatted_address;
					draft[index].lat = Number(location.lat().toFixed(6));
					draft[index].lng = Number(location.lng().toFixed(6));
				})
			});
			setStatus('done');
		} catch (error) {
			setErrorMsg(geocodeErrorMessage(error));
			setStatus('error');
		}
	};

	return <TabPanel className='bPlTabPanel small markerItemSettingsTabPanel' activeClass='activeTab' tabs={markerTabs} initialTabName='icon'>
		{({ name }) => <>
			{'location' === name && <>
				<Label>{__('Address', 'b-blocks')}</Label>
				<Flex align='flex-end' gap={2}>
					<TextControl className='flex2' value={item.address || ''} onChange={(val) => updateItem('address', val)} placeholder={__('Search an address', 'b-blocks')} __nextHasNoMarginBottom />

					<Button variant='secondary' onClick={geocode} disabled={!apiKey || !item.address || 'loading' === status}>
						{'loading' === status ? __('Locating…', 'b-blocks') : __('Locate', 'b-blocks')}
					</Button>
				</Flex>

				{'error' === status && <Notice status='danger' isIcon={true}>{errorMsg}</Notice>}

				{(null === toNumber(item.lat) || null === toNumber(item.lng)) && <Notice status='warning' isIcon={true}>
					{__('This marker has no coordinates, so it will not appear on the map. Use Locate above, or type a latitude and longitude below.', 'b-blocks')}
				</Notice>}

				<Flex className='mt10' gap={2}>
					<NumberControl className='flex1' label={__('Latitude', 'b-blocks')} step={0.000001} value={item.lat ?? ''} onChange={(val) => updateItem('lat', toNumber(val, 0))} __next40pxDefaultSize />

					<NumberControl className='flex1' label={__('Longitude', 'b-blocks')} step={0.000001} value={item.lng ?? ''} onChange={(val) => updateItem('lng', toNumber(val, 0))} __next40pxDefaultSize />
				</Flex>

				<br />

				<Flex className='m10'>
					<Label className='flex1'>{__('Category', 'b-blocks')}</Label>
					<SelectControl
						className='flex1'
						value={item.category || ''}
						options={[{ label: __('None', 'b-blocks'), value: '' }, ...categories.map((category) => ({ label: category.label, value: category.id }))]}
						onChange={(val) => updateItem('category', val)}
						__nextHasNoMarginBottom
					/>
				</Flex>

				<CheckboxControl className='mt10' label={__('Draggable in the editor', 'b-blocks')} checked={false !== item.draggable} onChange={(val) => updateItem('draggable', !!val)} />
				<br />
				<CheckboxControl className='m10' label={__('Open its info window by default', 'b-blocks')} checked={!!item.openByDefault} onChange={(val) => updateItem('openByDefault', !!val)} />
			</>}

			{'content' === name && <>
				<TextControl className='mt10' label={__('Title', 'b-blocks')} value={item.title || ''} onChange={(val) => updateItem('title', val)} __nextHasNoMarginBottom />

				<Label className='mt10'>{__('Info Window Content', 'b-blocks')}</Label>
				<TinyEditor value={item.content}
					onChange={updateContent}
				/>

				<div className='mt15'>
					<MediaArea label={__('Image', 'b-blocks')} width="90%" height="90%" value={{ url: item.image?.url }} onChange={(val) => updateItem('image', val?.url || '', 'url')} />
				</div>

				<TextControl
					className='mt10'
					label={__('Image Alt Text', 'b-blocks')}
					value={altDraft}
					onChange={(val) => {
						altPending.current = true;
						setAltDraft(val);
						updateAlt(val);
					}}
					__nextHasNoMarginBottom
				/>
			</>}

			{'icon' === name && <>
				
				<Flex className='mt10'>
					<Label className='flex1'>{__('Pin Type', 'b-blocks')}</Label>
					<SelectControl className='flex1' options={iconTypes} value={item.icon?.type || 'default'} onChange={val => updateItem('icon', val, 'type')}/>
				</Flex>

				<div className='mt15'>
					{'library' === item.icon?.type && <IconLibrary label={__('Icon Library', 'b-blocks')} value={item.icon.url.library} onChange={(val) => updateItem('icon', val, 'url', 'library')} />}

					{'upload' === item.icon?.type && <MediaArea
						label={__('Upload SVG', 'b-blocks')}
						types={['image/svg+xml']}
						value={{ url: item.icon.url.upload }}
						onClick={async () => { await refetch(); }}
						onChange={async (val) => {
							const svg = val?.url ? await svgSanitizer.sanitizeFile(val.url) : '';
							updateItem('icon', svg, 'url', 'upload');
						}}
						isSvgEnabled={true}
					/>}

					{'image' === item.icon?.type && <MediaArea label={__('Pin Image', 'b-blocks')} value={{ url: item.image?.url }} onChange={(val) => updateItem('image', val?.url || '', 'url')} />}
				</div>

				{'default' === (item.icon?.type || 'default') && <>
					<ColorControl className='mt10' label={__('Pin Color:', 'b-blocks')} value={item.pinColor} onChange={(val) => updateItem('pinColor', val)} />

					<ColorControl className='mt10' label={__('Glyph Color:', 'b-blocks')} value={item.glyphColor} onChange={(val) => updateItem('glyphColor', val)} />
				</>}

				<Flex className='mt10'>
					<Label className='flex1'>{__('Animation', 'b-blocks')}</Label>
					<SelectControl className='flex2' value={item.animation || ''} options={[{ label: __('Inherit', 'b-blocks'), value: '' }, ...markerAnimations]} onChange={(val) => updateItem('animation', val)} __nextHasNoMarginBottom />
				</Flex>
			</>}
		</>}
	</TabPanel>;
};
export default MarkerItemSettings;
