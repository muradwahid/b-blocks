import { HelpPanel } from '../../../../../../../bpl-tools/Components';

import Image from './Image';
import Presets from './Presets';
import Spots from './Spots';
import Tooltip from './Tooltip';

const General = (props) => {
	const { attributes, setAttributes, activeIdx, setActiveIdx, updateObj } = props;

	return <>
		<HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/image-hotspot/guides/general' />
		<Image {...{ attributes, setAttributes, updateObj }} />
		<Spots {...{ attributes, setAttributes, activeIdx, setActiveIdx, updateObj }} />
		<Tooltip {...{ attributes, setAttributes, updateObj }} />
		<Presets {...{ attributes, setAttributes, updateObj }} />
	</>
};
export default General;
