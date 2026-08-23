import Layout from './Layout';
import Content from './Content';
import Columns from './Columns';
import Rows from './Rows';
import Icons from './Icons';

const General = (props) => <>
	<Layout {...props} />

	<Content {...props} />

	<Columns {...props} />

	<Rows {...props} />

	<Icons {...props} />
</>;
export default General;
