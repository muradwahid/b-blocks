import BreadCrumbOptions from './BreadCrumbOptions';
import PrefixOptions from './PrefixOptions';
import Separator from './Separator';

const General = (props) => {

	return <>
		<BreadCrumbOptions {...props}/>
		<Separator {...props}/>
		<PrefixOptions {...props}/>
	</>
}
export default General;

