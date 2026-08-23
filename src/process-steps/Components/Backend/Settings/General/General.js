import { HelpPanel } from '../../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../../utils/data';
import Connector from './Connector';
import Layout from './Layout';
import Steps from './Steps';

const General = (props) => {
	return <>
		<HelpPanel slug={pluginSlug} />

		<Layout {...props} />
		<Steps {...props} />
		<Connector {...props} />
	</>;
};

export default General;
