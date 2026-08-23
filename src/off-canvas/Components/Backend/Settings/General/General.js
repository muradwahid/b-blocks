import Drawer from './Drawer';
import Trigger from './Trigger';
import Transition from './Transition';
import Behavior from './Behavior';

const General = ({ attributes, updateObj, device = 'desktop' }) => {
	const { trigger = {}, drawer = {}, overlay = {}, options = {}, transition = {} } = attributes;

	return <>
		<Drawer drawer={drawer} overlay={overlay} updateObj={updateObj} device={device} />
		<Trigger trigger={trigger} updateObj={updateObj} />
		<Transition transition={transition} updateObj={updateObj} />
		<Behavior options={options} updateObj={updateObj} />
	</>;
};
export default General;
