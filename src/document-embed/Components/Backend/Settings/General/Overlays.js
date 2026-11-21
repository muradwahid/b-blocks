import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, PanelBody, RangeControl, SelectControl, TextControl, TextareaControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Background, ColorControl, ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { PremiumBadge } from '../../../../../../../bpl-tools/ProControls';
import { overlayTypeOptions } from '../../../../utils/options';

/** One overlay, inside the sortable Overlays list. */
const OverlaySettings = ({ attributes, setAttributes, index }) => {
	const { overlays = [] } = attributes;
	const { page = 1, type = 'note', x = 0, y = 0, w = 10, h = 10, url = '', content = '', color = '', bg = {} } = overlays[index] || {};

	const update = (prop, val) => setAttributes({ overlays: overlays.map((overlay, i) => (i === index ? { ...overlay, [prop]: val } : overlay)) });

	const percent = (prop, value, label) => <RangeControl className='mt10' label={label} value={value} min={0} max={100} step={0.5} onChange={(val) => update(prop, val ?? 0)} __nextHasNoMarginBottom />;

	return <>
		<NumberControl label={__('Page', 'b-blocks')} value={page} min={1} onChange={(val) => update('page', Math.max(1, parseInt(val, 10) || 1))} />

		<SelectControl className='mt10' label={__('Type', 'b-blocks')} value={type} options={overlayTypeOptions} onChange={(val) => update('type', val)} __next40pxDefaultSize __nextHasNoMarginBottom />

		{/* The editor cannot draw on the PDF viewer, so this sketch of the page shows where each overlay on it sits. */}
		<div className='b-blocks-document-embed-overlay-map mt10' aria-hidden='true'>
			{overlays.map((overlay, i) => Number(overlay.page) === Number(page) && <span
				key={i}
				className={i === index ? 'is-current' : ''}
				style={{ left: `${overlay.x}%`, top: `${overlay.y}%`, width: `${overlay.w}%`, height: `${overlay.h}%` }}
			/>)}
		</div>

		{percent('x', x, __('Left (%)', 'b-blocks'))}
		{percent('y', y, __('Top (%)', 'b-blocks'))}
		{percent('w', w, __('Width (%)', 'b-blocks'))}
		{percent('h', h, __('Height (%)', 'b-blocks'))}

		{('note' === type || 'cta' === type || 'link' === type) && <TextareaControl
			className='mt10'
			label={{ note: __('Note Text', 'b-blocks'), cta: __('Button Text', 'b-blocks') }[type] || __('Link Label (for screen readers)', 'b-blocks')}
			value={content}
			rows={2}
			onChange={(val) => update('content', val)}
			__nextHasNoMarginBottom
		/>}

		{('link' === type || 'cta' === type) && <TextControl className='mt10' type='url' label={__('Link URL', 'b-blocks')} value={url} placeholder='https://' onChange={(val) => update('url', val)} __next40pxDefaultSize __nextHasNoMarginBottom />}

		{/* A link is an invisible hot spot, so it only has an outline colour; the others get a full background. */}
		{'link' === type ?
			<ColorControl className='mt10' label={__('Hover Outline Color:', 'b-blocks')} value={color} onChange={(val) => update('color', val)} /> :
			<Background className='mt10' label={__('Background:', 'b-blocks')} value={bg} isImage={false} onChange={(val) => update('bg', val)} />}
	</>;
};

const Overlays = ({ attributes, setAttributes, premiumProps }) => {
	const { isPremium, setIsProModalOpen } = premiumProps;
	const [activeIndex, setActiveIndex] = useState(0);

	return <PanelBody className='bPlPanelBody' title={<>{__('Interactive Overlays', 'b-blocks')} {!isPremium && <PremiumBadge />}</>} initialOpen={false}>
		<p>{__('Notes, highlights, links and buttons placed on pages of the PDF. Positions are a percentage of the page, so they stay put at any zoom.', 'b-blocks')}</p>

		<p className='b-blocks-document-embed-warning'>{__('Overlays show on the published page. The editor preview cannot draw on the PDF viewer, so check them with Preview.', 'b-blocks')}</p>

		{isPremium ? <ItemsPanel
			attributes={attributes}
			setAttributes={setAttributes}
			arrKey='overlays'
			newItem={{ page: 1, type: 'note', x: 10, y: 10, w: 30, h: 10, url: '', content: '', color: '', bg: {} }}
			itemLabel={__('Overlay', 'b-blocks')}
			design='sortable'
			minItem={0}
			activeIndex={activeIndex}
			setActiveIndex={setActiveIndex}
			ItemSettings={OverlaySettings}
		/> : <Button variant='secondary' onClick={() => setIsProModalOpen(true)}>{__('Add Overlay', 'b-blocks')}</Button>}
	</PanelBody>;
};
export default Overlays;
