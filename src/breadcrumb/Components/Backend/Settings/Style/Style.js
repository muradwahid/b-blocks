import BreadCrumbStyles from './BreadCrumbStyles';
import Prefix from './Prefix';
import SeparatorStyles from './SeparatorStyles';

const Style = props => {
	return <>
		<BreadCrumbStyles {...props}/>
		<SeparatorStyles {...props}/>
		<Prefix {...props}/>
	</>
}
export default Style;