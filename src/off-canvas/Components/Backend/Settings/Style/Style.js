import Trigger from './Trigger';
import Icon from './Icon';
import Drawer from './Drawer';
import Overlay from './Overlay';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { trigger = {}, drawer = {}, overlay = {} } = attributes;

	return <>
		<Trigger trigger={trigger} updateObj={updateObj} device={device} />
		{trigger.showIcon !== false && <Icon trigger={trigger} updateObj={updateObj} device={device} />}
		<Drawer drawer={drawer} updateObj={updateObj} device={device} />
		<Overlay overlay={overlay} updateObj={updateObj} />
	</>;
};
export default Style;
