import AutoPlay from './AutoPlay';
import BasicOptions from './BasicOptions';
import LayoutOptions from './LayoutOptions';
import NavigationOptions from './NavigationOptions';
import PaginationOptions from './PaginationOptions';

const General = (props) => {
	return <>
		<LayoutOptions {...props} />
		<BasicOptions {...props} />
		<AutoPlay {...props} />
		<NavigationOptions {...props} />
		<PaginationOptions {...props} />
	</>
}
export default General;
