import TabTitleStyle from './TabTitleStyle';
import ContentStyle from './ContentStyle';

const Style = ( props ) => <>
	<TabTitleStyle { ...props } />

	<ContentStyle { ...props } />
</>;

export default Style;
