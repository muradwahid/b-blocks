import { __, _n, sprintf } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { degUnit, directions, getVisibleItems } from '../../../../utils/options';

const Wheel = ({ attributes, updateObj }) => {
	const { wheel = {}, items = [] } = attributes;

	// An item with its own Position ignores Start Angle, Direction and Sweep, so
	// those three can look broken with no clue why. Say so where they are.
	const pinned = getVisibleItems(items).filter(({ item }) => !isNaN(parseFloat(item?.position)));

	const field = (label, key, units, help) => <>
		<Flex className='mt10'>
			<Label className='mb0 flex2'>{label}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={wheel[key] || ''} onChange={(val) => updateObj('wheel', val, key)} units={units} />
		</Flex>

		{help && <small>{help}</small>}
	</>;

	return <PanelBody className='bPlPanelBody' title={__('Arrangement', 'b-blocks')} initialOpen={false}>
		{field(__('Start Angle', 'b-blocks'), 'startAngle', [degUnit()])}

		<SelectControl className='mt10' label={__('Direction', 'b-blocks')} labelPosition='edge' value={wheel.direction || 'clockwise'} options={directions} onChange={(val) => updateObj('wheel', val, 'direction')} __nextHasNoMarginBottom />

		{field(__('Sweep', 'b-blocks'), 'sweep', [degUnit()], __('360° spreads all the way round. Less than that lays the items along an arc — 180° gives a half circle, with the first and last on the two ends.', 'b-blocks'))}

		{!wheel.enableSegmentsType && field(__('Radius Offset', 'b-blocks'), 'radiusOffset', [pxUnit()], __('Moves the segments in or out from the ring they sit on. Negative pulls them inward.', 'b-blocks'))}

		<ToggleControl className='mt10' label={__('Rotate Labels', 'b-blocks')} checked={!!wheel.rotateLabels} onChange={(val) => updateObj('wheel', val, 'rotateLabels')} help={__('Off, every label stays upright. On, each one turns to face outward from the centre.', 'b-blocks')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Enable Segments Type', 'b-blocks')} checked={wheel.enableSegmentsType} onChange={(val) => updateObj('wheel', val, 'enableSegmentsType')} help={__('Draws the segments as pie wedges filling the ring instead of circles on it.', 'b-blocks')} __nextHasNoMarginBottom />

		{wheel.enableSegmentsType && field(__('Wedge Gap', 'b-blocks'), 'wedgeGap', [degUnit()], __('White space between neighbouring wedges.', 'b-blocks'))}

		{0 < pinned.length && <p className='bPlInspectorInfo'>
			{sprintf(
				/* translators: %d: how many segments have their own Position set. */
				_n(
					'%d segment has its own Position, so Start Angle, Direction and Sweep will not move it. Clear that field to put it back on auto spacing.',
					'%d segments have their own Position, so Start Angle, Direction and Sweep will not move them. Clear those fields to put them back on auto spacing.',
					pinned.length,
					'b-blocks'
				),
				pinned.length
			)}
		</p>}

		<small>{__('Start Angle, Direction and Sweep only move items left on auto spacing — an item with its own Position stays put.', 'b-blocks')}</small>
	</PanelBody>;
};

export default Wheel;
