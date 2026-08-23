import Badge from './Badge';
import Card from './Card';
import Content from './Content';

const Style = (props) => {
	return <>
		<Badge {...props} />
		<Content {...props} />
		<Card {...props} />
	</>;
};

export default Style;
