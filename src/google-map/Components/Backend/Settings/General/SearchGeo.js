import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Notice } from '../../../../../../../bpl-tools/Components';

import { toNumber } from '../../../../utils/data';

const SearchGeo = ({ tools = {}, updateObj }) => <PanelBody className='bPlPanelBody' title={__('Search & Location', 'b-blocks')} initialOpen={false}>
	<ToggleControl
		label={__('Search Box', 'b-blocks')}
		checked={!!tools.searchBox}
		onChange={(val) => updateObj('tools', !!val, 'searchBox')}
		help={__('Adds a Places autocomplete field above the map. Requires the Places API (New) on your key.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	<ToggleControl
		className='mt10'
		label={__('Find my location button', 'b-blocks')}
		checked={!!tools.geolocation}
		onChange={(val) => updateObj('tools', !!val, 'geolocation')}
		__nextHasNoMarginBottom
	/>

	{tools.geolocation && <>
		<NumberControl
			className='mt10'
			label={__('Nearby Radius (metres)', 'b-blocks')}
			min={0}
			step={100}
			value={tools.nearbyRadius ?? 0}
			onChange={(val) => updateObj('tools', toNumber(val, 0), 'nearbyRadius')}
			__next40pxDefaultSize
		/>

		<Notice status='info' isIcon={true}>
			{__('Browsers only allow location access on HTTPS, and the visitor must approve the prompt.', 'b-blocks')}
		</Notice>
	</>}
</PanelBody>;
export default SearchGeo;
