import ConnectorsStyle from './ConnectorsStyle';
import MarkerStyle from './MarkerStyle';
import CardStyle from './CardStyle';
import DateStyle from './DateStyle';

const Style = ( props ) => {
	return <>
		<ConnectorsStyle { ...props } />
		<MarkerStyle { ...props } />
		<CardStyle { ...props } />
		<DateStyle { ...props } />
	</>;
};
export default Style;
