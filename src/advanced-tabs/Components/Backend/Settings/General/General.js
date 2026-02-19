import TabListSettings from './TabListSettings';
import TabsOptions from './TabsOptions';
import TabsSettings from './TabsSettings';

const General = (props) => {

	return <>
		<TabsSettings {...props} />
		<TabListSettings {...props} />
		<TabsOptions {...props} />
	</>
}
export default General;
