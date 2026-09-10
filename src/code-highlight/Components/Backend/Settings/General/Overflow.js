import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { codeLines } from '../../../../utils/options';

/** What happens when the snippet is taller than you want to show. */
const Overflow = ({ attributes, updateObj }) => {
	const { options = {}, content = {} } = attributes;

	const max = parseInt(options.maxLines, 10) || 0;
	const total = codeLines(content.code).length;

	return <PanelBody className='bPlPanelBody' title={__('Overflow', 'b-blocks')} initialOpen={false}>
		<Flex>
			<Label className='mb0 flex2'>{__('Max Lines', 'b-blocks')}</Label>

			<NumberControl className='flex1' labelPosition='edge' min={0} value={max} onChange={(val) => updateObj('options', parseInt(val, 10) || 0, 'maxLines')} />
		</Flex>

		<small>{__('Zero shows the whole snippet. Any other number caps the height.', 'b-blocks')}</small>

		{0 < max && max >= total && <p className='bPlInspectorInfo'>{__('This snippet is shorter than the cap, so nothing is hidden yet.', 'b-blocks')}</p>}

		{0 < max && <>
			<ToggleControl className='mt10' label={__('Expandable', 'b-blocks')} checked={options.collapsible} onChange={(val) => updateObj('options', val, 'collapsible')} help={__('Adds a button that opens the snippet to its full height. Off, the rest simply scrolls.', 'b-blocks')} __nextHasNoMarginBottom />

			{options.collapsible && <>
				<TextControl className='mt10' label={__('Expand Label', 'b-blocks')} value={options.expandLabel || ''} onChange={(val) => updateObj('options', val, 'expandLabel')} placeholder='Show all' __nextHasNoMarginBottom />

				<TextControl className='mt10' label={__('Collapse Label', 'b-blocks')} value={options.collapseLabel || ''} onChange={(val) => updateObj('options', val, 'collapseLabel')} placeholder='Show less' __nextHasNoMarginBottom />
			</>}
		</>}
	</PanelBody>;
};

export default Overflow;
