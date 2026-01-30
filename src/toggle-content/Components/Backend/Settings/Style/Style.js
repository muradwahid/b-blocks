import HeadingStyles from './HeadingStyles';
import LabelStyles from './LabelStyles';
import SwitcherStyles from './SwitcherStyles';


const Style = props => {
	return <>
		<HeadingStyles {...props} />
		<SwitcherStyles {...props} />
		<LabelStyles {...props} />
	</>
}
export default Style;