import ArrowStyles from './StyleSettings/ArrowStyles';
import BadgeStyle from './StyleSettings/BadgeStyle';
import ContentStyle from './StyleSettings/ContentStyle';

const Style = (props) => {
	return <>
		<BadgeStyle {...props} />
		<ContentStyle {...props} />
		<ArrowStyles {...props} />
	</>
};
export default Style;
