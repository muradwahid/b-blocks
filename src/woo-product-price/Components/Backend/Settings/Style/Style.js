import AffixStyle from './AffixStyle';
import SavingsStyle from './SavingsStyle';
import Styles from './Styles/Styles';

const Style = ( props ) => <>
	<Styles { ...props } />
	<AffixStyle { ...props } which='prefix' />
	<AffixStyle { ...props } which='suffix' />
	{ props.attributes.savings?.show && <SavingsStyle { ...props } /> }
</>;

export default Style;
