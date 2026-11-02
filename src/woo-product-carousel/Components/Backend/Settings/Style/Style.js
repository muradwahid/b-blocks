import Card from './Card';
import Elements from './Elements';
import Buttons from './Buttons';
import Navigation from './Navigation';
import Featured from './Featured';

import { FEATURED_PRESETS, PRESET_HIDDEN } from '../../../../utils/data';

const Style = ( props ) => {
	// Panels for elements the preset leaves out would style nothing.
	const has = ( element ) => ! PRESET_HIDDEN[ props.attributes.preset ]?.includes( element );

	return <>
		<Card { ...props } />
		<Elements { ...props } has={ has } />
		<Buttons { ...props } />
		{ FEATURED_PRESETS.includes( props.attributes.preset ) && <Featured { ...props } /> }
		<Navigation { ...props } />
	</>;
};

export default Style;
