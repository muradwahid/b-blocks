// import { HelpPanel } from '../../../../../../../bpl-tools/Components';

import Image from './Image';
import Presets from './Presets';
import Spots from './Spots';
import Tooltip from './Tooltip';

const General = (props) => {

	return <>
		{/* <HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/image-hotspot/guides/general' /> */}
		<Image {...props} />
		<Spots {...props} />
		<Tooltip {...props} />
		<Presets {...props} />
	</>
};
export default General;
