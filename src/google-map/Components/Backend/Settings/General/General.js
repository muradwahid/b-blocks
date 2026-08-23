import { normalizeAttributes } from '../../../../utils/data';
import { markerLatLng } from '../../../../utils/mapHelpers';
import Caption from './Caption';
import Categories from './Categories';
import Clustering from './Clustering';
import Controls from './Controls';
import Directions from './Directions';
import Layers from './Layers';
import MapOptions from './MapOptions';
import Markers from './Markers';
import Performance from './Performance';
import SearchGeo from './SearchGeo';
import Shapes from './Shapes';
import Source from './Source';
import Theme from './Theme';

const General = (props) => {
	const { attributes, updateObj, device = 'desktop' } = props;
	const { map = {}, controls = {}, clustering = {}, layers = {}, directions = {}, tools = {}, performance = {}, caption = {} } = attributes;

	const source = normalizeAttributes(attributes).source;
	const isInteractive = 'embed' !== source.type;
	// "lat": 23.8103,
	// "lng": 90.4125,
	return <>
		<Source source={source} updateObj={updateObj} apiKey={props.apiKey} />

		{isInteractive && <>
			<MapOptions map={map} updateObj={updateObj} device={device} />

			<Controls controls={controls} updateObj={updateObj} />

			<Theme attributes={attributes} updateObj={updateObj} />

			<Markers {...props} />

			<Clustering clustering={clustering} updateObj={updateObj} />

			<Categories {...props} />

			<Layers
				layers={layers}
				updateObj={updateObj}
				markerCount={attributes.markers?.length || 0}
				plottableCount={(attributes.markers || []).filter((item) => null !== markerLatLng(item)).length}
			/>

			<Shapes {...props} />

			<Directions directions={directions} updateObj={updateObj} />

			<SearchGeo tools={tools} updateObj={updateObj} />

			<Performance performance={performance} updateObj={updateObj} />
		</>}

		{!isInteractive && <MapOptions map={map} updateObj={updateObj} device={device} />}

		<Caption caption={caption} updateObj={updateObj} />
	</>;
};
export default General;
