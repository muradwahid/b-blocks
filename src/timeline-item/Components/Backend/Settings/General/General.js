import Entry from './Entry';
import Marker from './Marker';

const General = ( props ) => {
	return <>
		<Entry { ...props } />
		<Marker { ...props } />
	</>;
};
export default General;
