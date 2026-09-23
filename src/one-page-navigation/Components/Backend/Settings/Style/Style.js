import { hasPanel, showsNumber } from '../../../../utils/options';
import Bubble from './Bubble';
import Item from './Item';
import LabelStyle from './LabelStyle';
import Line from './Line';
import Marker from './Marker';
import Media from './Media';
import NumberStyle from './NumberStyle';

const Style = (props) => {
	const preset = props.attributes?.layout?.preset || 'glassBullseye';
	const shows = (panel) => hasPanel(preset, panel);

	return <>

		{shows('marker') && <Marker {...props} />}

		{shows('item') && <Item {...props} />}

		<Media {...props} />

		{shows('number') && showsNumber(props.attributes) && <NumberStyle {...props} />}

		{shows('label') && <LabelStyle {...props} />}

		{shows('line') && <Line {...props} />}

		{shows('bubble') && <Bubble {...props} />}

	</>;
};

export default Style;
