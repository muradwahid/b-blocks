import NavigationStyles from './NavigationStyles';
import PaginationStyles from './PaginationStyles';

const Style = props => {
	return <>
		<NavigationStyles {...props} />
		<PaginationStyles {...props} />
	</>
}
export default Style;