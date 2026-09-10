import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { getHighlightMarks, parseLineRanges } from '../../../../utils/options';

const LineNumbers = ({ attributes, updateObj }) => {
	const { options = {} } = attributes;

	const asked = parseLineRanges(options.highlightLines).length;
	const drawn = getHighlightMarks(attributes).length;

	return <PanelBody className='bPlPanelBody' title={__('Line Numbers', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Line Numbers', 'b-blocks')} checked={options.lineNumbers} onChange={(val) => updateObj('options', val, 'lineNumbers')} __nextHasNoMarginBottom />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Start At', 'b-blocks')}</Label>

			<NumberControl className='flex1' labelPosition='edge' min={1} value={options.startLine || 1} onChange={(val) => updateObj('options', parseInt(val, 10) || 1, 'startLine')} />
		</Flex>

		<small>{__('Numbering starts here — useful when the snippet is an extract.', 'b-blocks')}</small>

		<TextControl className='mt10' label={__('Highlight Lines', 'b-blocks')} value={options.highlightLines || ''} onChange={(val) => updateObj('options', val, 'highlightLines')} placeholder='2, 5-7' help={__('Single lines and ranges, separated by commas. Counted from Start At.', 'b-blocks')} __nextHasNoMarginBottom />

		{/* Marks are one line tall and placed by line height, so a reflowed line
		    would put every mark below it out of step. */}
		{options.wordWrap && 0 < asked && <p className='bPlInspectorInfo'>{__('Word Wrap is on, so highlighting is switched off — a wrapped line changes the height of every row beneath it and the marks would drift.', 'b-blocks')}</p>}

		{!options.wordWrap && asked > drawn && <p className='bPlInspectorInfo'>{__('Some of those lines fall outside the snippet and are ignored.', 'b-blocks')}</p>}
	</PanelBody>;
};

export default LineNumbers;
