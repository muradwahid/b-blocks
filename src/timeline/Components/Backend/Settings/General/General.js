import Layout from './Layout';
import Connectors from './Connectors';
import Marker from './Marker';
import Card from './Card';
import DateOptions from './DateOptions';

const General = ( props ) => {
	return <>
		<Layout { ...props } />
		<Marker { ...props } />
		<Card { ...props } />
		<Connectors { ...props } />
		<DateOptions { ...props } />
	</>;
};
export default General;
