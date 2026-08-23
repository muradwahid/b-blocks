import BodyStyle from './BodyStyle';
import CaptionStyle from './CaptionStyle';
import CellsStyle from './CellsStyle';
import FeaturedStyle from './FeaturedStyle';
import HeaderStyle from './HeaderStyle';
import IconsStyle from './IconsStyle';
import RowLabelStyle from './RowLabelStyle';
import TableStyle from './TableStyle';
import TooltipStyle from './TooltipStyle';

const Style = (props) => <>
	<TableStyle {...props} />

	<HeaderStyle {...props} />

	<BodyStyle {...props} />

	<CellsStyle {...props} />

	<RowLabelStyle {...props} />

	<FeaturedStyle {...props} />

	<IconsStyle {...props} />

	<TooltipStyle {...props} />

	<CaptionStyle {...props} />
</>;
export default Style;
