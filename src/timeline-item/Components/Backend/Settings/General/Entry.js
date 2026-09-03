import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl } from '@wordpress/components';

import { IconLibrary } from '../../../../../../../bpl-tools/Components';

import { timelineBlockName } from '../../../../utils/options';

const Entry = ({ attributes, setAttributes, updateObj, clientId }) => {
	const { icon, item } = attributes;

	const direction = useSelect((select) => {
		const { getBlockParentsByBlockName, getBlock } = select('core/block-editor');
		const parents = getBlockParentsByBlockName(clientId, timelineBlockName);

		if (!parents?.length) {
			return 'vertical';
		}

		// The closest parent is the last entry.
		// Direction is per breakpoint on the parent; these labels only need a
		// sensible name, so the widest one speaks for all of them.
		return getBlock(parents[parents.length - 1])?.attributes?.layout?.desktop?.direction || 'vertical';
	}, [clientId]);

	const isHorizontal = 'horizontal' === direction;

	const sideOptions = [
		{ label: __('Auto (follow layout)', 'b-blocks'), value: '' },
		{ label: isHorizontal ? __('Above', 'b-blocks') : __('Left', 'b-blocks'), value: 'left' },
		{ label: isHorizontal ? __('Below', 'b-blocks') : __('Right', 'b-blocks'), value: 'right' }
	];

	const arrowAlignOptions = [
		{ label: __('Auto (follow Timeline)', 'b-blocks'), value: '' },
		{ label: isHorizontal ? __('Left', 'b-blocks') : __('Top', 'b-blocks'), value: 'start' },
		{ label: __('Center', 'b-blocks'), value: 'center' },
		{ label: isHorizontal ? __('Right', 'b-blocks') : __('Bottom', 'b-blocks'), value: 'end' }
	];

	return <PanelBody className='bPlPanelBody' initialOpen={true} title={__('Entry', 'b-blocks')}>
		<SelectControl
			label={__('Side', 'b-blocks')}
			labelPosition='edge'
			help={__('Overrides the side this entry would get from the Timeline layout.', 'b-blocks')}
			value={item.side || ''}
			options={sideOptions}
			onChange={(value) => updateObj('item', value, 'side')}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>

		<SelectControl
			label={__('Arrow Alignment', 'b-blocks')}
			labelPosition='edge'
			help={__('Overrides where this entry’s arrow sits along its card edge. Arrow size and offset stay with the Timeline.', 'b-blocks')}
			value={item.arrowAlign || ''}
			options={arrowAlignOptions}
			onChange={(value) => updateObj('item', value, 'arrowAlign')}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>

		<IconLibrary label={__('Marker Icon', 'b-blocks')} value={icon} onChange={(value) => setAttributes({ icon: value })} />
	</PanelBody>;
};
export default Entry;
