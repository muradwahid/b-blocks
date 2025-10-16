import ImageStyle from './ImageStyle';
import SpotsStyle from './SpotsStyle';
import TooltipStyle from './TooltipStyle';

const Style = (props) => {
	return <>
		<ImageStyle {...props} />
		<SpotsStyle {...props} />
		<TooltipStyle {...props} />
	</>
};
export default Style;
