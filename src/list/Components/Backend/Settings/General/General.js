import ListsSettings from './ListsSettings';
import Marker from './Marker';

const General = (props) => {
	return <>
		<ListsSettings {...props} />
		<Marker {...props} />
	</>
}
export default General;