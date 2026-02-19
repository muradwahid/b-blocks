import TabContainerStyles from './TabContainerStyles';
import TabsIconStyle from './TabsIconStyle';
import TabsStyle from './TabsStyle';
import TabsSubTitleStyle from './TabsSubTitleStyle';
import TabsTitleStyle from './TabsTitleStyle';


const Style = props => {
	const { attributes } = props;
	const { tabs } = attributes;
	return <>
		<TabContainerStyles {...props} />
		<TabsStyle {...props} />
		{tabs.isShowTitle && <TabsTitleStyle {...props} />}
		{tabs.isShowSubTitle && <TabsSubTitleStyle {...props} />}
		{tabs.isShowIcon && <TabsIconStyle {...props} />}
	</>
}
export default Style;