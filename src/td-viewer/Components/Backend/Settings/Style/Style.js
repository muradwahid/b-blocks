import ViewerStyle from './ViewerStyle';
import ButtonsStyle from './ButtonsStyle';

const Style = props => {
	return <>
		<ViewerStyle {...props} />
		<ButtonsStyle {...props} />
	</>;
};
export default Style;
