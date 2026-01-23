import IconStyle from './IconStyle';
import ProgressStyle from './ProgressStyle';
import TextStyle from './TextStyle';

const Style = props => {
	const { attributes } = props;
	const { scroll } = attributes;
	return <>
		{scroll.scrollType !=='text' && <IconStyle {...props} />}
		{ scroll.scrollType ==='text' && <TextStyle {...props} />}
		{scroll.scrollType ==='progress' && <ProgressStyle {...props} />}
	</>
}
export default Style;