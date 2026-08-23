import { normalizeAttributes } from '../../../../utils/data';
import CaptionStyle from './CaptionStyle';
import FilterBarStyle from './FilterBarStyle';
import InfoWindowStyle from './InfoWindowStyle';
import MapStyle from './MapStyle';
import MarkerStyle from './MarkerStyle';

const Style = (props) => {
	const { attributes, updateObj, device = 'desktop' } = props;
	const { map = {}, marker = {}, infoWindow = {}, filterBar = {}, caption = {} } = attributes;

	const isInteractive = 'embed' !== normalizeAttributes(attributes).source.type;

	return <>
		<MapStyle map={map} updateObj={updateObj} device={device} />

		{isInteractive && <>
			<MarkerStyle marker={marker} updateObj={updateObj} device={device} />

			<InfoWindowStyle infoWindow={infoWindow} updateObj={updateObj} device={device} />

			<FilterBarStyle filterBar={filterBar} updateObj={updateObj} device={device} />
		</>}

		<CaptionStyle caption={caption} updateObj={updateObj} />
	</>;
};
export default Style;
