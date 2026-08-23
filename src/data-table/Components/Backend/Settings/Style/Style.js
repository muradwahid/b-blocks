import BodyStyleOptions from './BodyStyleOptions';
import CellsStyles from './CellsStyles';
import DataTableStyles from './DataTableStyles';
import FooterStyles from './FooterStyles';
import HeaderStyleOptions from './HeaderStyleOptions';
import TableStyleOptions from './TableStyleOptions';

const Style = (props) => {
	const { attributes } = props;
	const { datatables } = attributes
	return <>

		<TableStyleOptions {...props} />
		<HeaderStyleOptions {...props} />
		<BodyStyleOptions {...props} />
		<CellsStyles {...props} />
		<FooterStyles {...props} />
		{datatables.enabled && <DataTableStyles {...props} />}

	</>
}
export default Style;