import Box from './Box';
import ButtonIcon from './ButtonIcon';
import Caption from './Caption';
import CopyButton from './CopyButton';
import Header from './Header';
import Highlight from './Highlight';
import LineNumbers from './LineNumbers';
import Typography from './Typography';

// One panel per element, outside in: the box holding everything, the header bar
// on top of it, then the gutter, the code, the marks over it, and the controls.
// Each panel hides itself when its element is switched off in General.
const Style = (props) => <>
	<Box {...props} />

	<Header {...props} />

	<LineNumbers {...props} />

	<Typography {...props} />

	<Highlight {...props} />

	<CopyButton {...props} />

	<ButtonIcon {...props} />

	<Caption {...props} />
</>;

export default Style;
