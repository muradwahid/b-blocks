import Divider from './Divider';
import ListsStyle from './ListsStyle';
import MarkerStyle from './MarkerStyle';

const Style = props => {
	return <>
		<ListsStyle {...props} />

		<Divider {...props} />

		<MarkerStyle {...props} />

	</>
}
export default Style;