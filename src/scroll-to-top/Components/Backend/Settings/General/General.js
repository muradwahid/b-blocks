import IconSettings from './IconSettings';
import PositionSettings from './PositionSettings';
import ScrollSettings from './ScrollSettings';

const General = (props) => {
	const { attributes } = props;
	const { scroll } = attributes;
	return <>
		<ScrollSettings {...props} />
		{scroll.scrollType !=='text' && <IconSettings {...props} />}
		<PositionSettings {...props} />
	</>
}
export default General;

