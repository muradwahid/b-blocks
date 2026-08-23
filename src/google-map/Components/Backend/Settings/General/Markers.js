import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel, Notice } from '../../../../../../../bpl-tools/Components';

import { pricingPage } from '../../../../../utils/data';
import { buildMapStyles } from '../../../../utils/data';
import { addNewMarker } from '../../../../utils/options';
import MarkerItemSettings from '../Panel/MarkerItemSettings/MarkerItemSettings';

const Markers = ({ attributes, setAttributes, activeIdx, setActiveIdx, device, isPremium, apiKey }) => {
	const { source = {} } = attributes;
	const nextId = (attributes.markers?.length || 0) + 1;

	// An active theme suppresses the Map ID, which in turn hides these markers.
	const themeActive = buildMapStyles(attributes.theme || {}).length > 0;

	const ItemSettings = useCallback(
		(itemProps) => <MarkerItemSettings {...itemProps} apiKey={apiKey} device={device} />,
		[apiKey, device]
	);

	return <PanelBody className='bPlPanelBody' title={__('Markers', 'b-blocks')} initialOpen={false}>
		{!source.mapId && <Notice status='warning' isIcon={true}>
			{__('Markers stay hidden until you add a Map ID. Google Advanced Markers cannot render without one — create a Map ID in the Google Cloud console and paste it into Map Source → Map ID.', 'b-blocks')}
		</Notice>}

		{source.mapId && themeActive && <Notice status='info' isIcon={true}>
			{__('Your Map ID is active, so markers work but the Style tab’s themes are ignored. Style this map in the Google Cloud console instead.', 'b-blocks')}
		</Notice>}

		<ItemsPanel
			attributes={attributes}
			setAttributes={setAttributes}
			arrKey='markers'
			itemLabel='Marker'
			design={isPremium ? 'sortable' : 'single'}
			ItemSettings={ItemSettings}
			newItem={addNewMarker(nextId, source.center)}
			activeIndex={activeIdx}
			setActiveIndex={setActiveIdx}
		/>

		{!isPremium && <small>
			<b><a href={pricingPage} target='_blank' rel='noopener noreferrer'>{__('Upgrade to Premium', 'b-blocks')}</a></b>
			{' '}{__('to unlock sorting and more features.', 'b-blocks')}
		</small>}
	</PanelBody>;
};
export default Markers;
