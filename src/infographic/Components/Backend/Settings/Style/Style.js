import Divider from './Divider';
import IconStyle from './IconStyle';
import Image from './Image';
import InnerDisc from './InnerDisc';
import OuterDisc from './OuterDisc';
import Segment from './Segment';
import Text from './Text';
import Title from './Title';

// One panel per element, outside in: the outer disc, the segments on its border,
// then the inner disc and its content.
const Style = (props) => <>
	<OuterDisc {...props} />

	<Segment {...props} />

	<IconStyle {...props} />

	<InnerDisc {...props} />

	<Title {...props} />

	<Divider {...props} />

	<Text {...props} />

	<Image {...props} />
</>;

export default Style;
