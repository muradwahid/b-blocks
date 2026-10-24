import PriceSettings from './PriceSettings';
import SavingsSettings from './SavingsSettings';

const General = ( props ) => <>
	<PriceSettings { ...props } />
	<SavingsSettings { ...props } />
</>;

export default General;
