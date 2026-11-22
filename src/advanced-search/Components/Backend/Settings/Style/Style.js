import { PRESET_HIDDEN, PRESET_STYLES } from '../../../../utils/presets';
import FieldStyle from './FieldStyle';
import ResultBoxStyle from './ResultBoxStyle';
import ContentStyle from './ContentStyle';
import TotalStyle from './TotalStyle';
import NotFoundStyle from './NotFoundStyle';
import ButtonStyle from './ButtonStyle';
import ViewAllStyle from './ViewAllStyle';

const Style = (props) => {
	const { attributes, device = 'desktop' } = props;
	const { preset = 'preset-1', search = {}, totalResults = {}, viewAll = {}, searchField = {}, button = {} } = attributes;

	// Style panels follow what the General tab shows.
	const { showImage = false, showExcerpt = true, showDate = false, showType = false, highlight = true, showAuthor = false, showCategory = false, showTerms = false, fallback = 'none', groupByType = false } = search;
	const { show: showTotal = true } = totalResults;
	const { show: showViewAll = true } = viewAll;
	const { showIcon: showSearchIcon = true } = searchField;
	const { show: showButton = true } = button;

	const toBg = (val) => (typeof val === 'string' ? { type: 'solid', color: val } : val);

	// A control the chosen preset turns off (PRESET_HIDDEN) is hidden while the block still has the preset's value; a
	// value changed before (or saved by an older version) keeps its control so it stays editable. One closure instead of
	// 15 copies of the same check.
	const presetData = PRESET_STYLES[preset] || {};
	const isOff = (key, value, presetValue) => (PRESET_HIDDEN[preset] || []).includes(key) && JSON.stringify(value) === JSON.stringify(presetValue);

	const panelProps = { ...props, device, isOff, presetData, toBg };

	return <>
		<FieldStyle {...panelProps} showSearchIcon={showSearchIcon} />

		<ResultBoxStyle {...panelProps} showTotal={showTotal} showViewAll={showViewAll} />

		<ContentStyle {...panelProps} showImage={showImage} showExcerpt={showExcerpt} showMeta={showDate || showType || showAuthor || showCategory || showTerms || groupByType} highlight={highlight} />

		{showTotal && <TotalStyle {...panelProps} />}

		<NotFoundStyle {...panelProps} fallback={fallback} />

		{showButton && <ButtonStyle {...panelProps} />}

		{showViewAll && <ViewAllStyle {...panelProps} />}
	</>;
};
export default Style;
