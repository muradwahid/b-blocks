import { __ } from '@wordpress/i18n';
import { Button, Dashicon, Flex, PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { produce } from 'immer';

import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';

import { travelModes } from '../../../../utils/options';

const Directions = ({ directions = {}, updateObj }) => {
	const waypoints = directions.waypoints || [];

	const updateWaypoint = (index, value) => updateObj('directions', produce(waypoints, (draft) => { draft[index].address = value; }), 'waypoints');

	return <PanelBody className='bPlPanelBody' title={__('Directions', 'b-blocks')} initialOpen={false}>
		<ToggleControl
			label={__('Show a route', 'b-blocks')}
			checked={!!directions.enabled}
			onChange={(val) => updateObj('directions', !!val, 'enabled')}
			__nextHasNoMarginBottom
		/>

		{directions.enabled && <>
			<SelectControl className='mt10' label={__('Travel Mode', 'b-blocks')} value={directions.mode || 'DRIVING'} options={travelModes} onChange={(val) => updateObj('directions', val, 'mode')} __nextHasNoMarginBottom />

			<TextControl className='mt10' label={__('Origin', 'b-blocks')} value={directions.origin?.address || ''} onChange={(val) => updateObj('directions', val, 'origin', 'address')} placeholder={__('Address or place name', 'b-blocks')} __nextHasNoMarginBottom />

			<TextControl className='mt10' label={__('Destination', 'b-blocks')} value={directions.destination?.address || ''} onChange={(val) => updateObj('directions', val, 'destination', 'address')} placeholder={__('Address or place name', 'b-blocks')} __nextHasNoMarginBottom />

			<Label className='mt15'>{__('Waypoints', 'b-blocks')}</Label>
			{waypoints.map((waypoint, index) => <Flex key={index} align='flex-end' gap={2} className='mt5'>
				<TextControl className='flex2' value={waypoint.address || ''} onChange={(val) => updateWaypoint(index, val)} __nextHasNoMarginBottom />

				<Button isDestructive label={__('Remove', 'b-blocks')} onClick={() => updateObj('directions', waypoints.filter((_item, i) => i !== index), 'waypoints')}>
					<Dashicon icon='no' />
				</Button>
			</Flex>)}

			<Flex justify='center' className='addItem mt10'>
				<Button variant='secondary' onClick={() => updateObj('directions', [...waypoints, { address: '' }], 'waypoints')}>
					<Dashicon icon='plus' />
					{__('Add Waypoint', 'b-blocks')}
				</Button>
			</Flex>

			<ToggleControl className='mt10' label={__('Show turn-by-turn panel', 'b-blocks')} checked={!!directions.showPanel} onChange={(val) => updateObj('directions', !!val, 'showPanel')} __nextHasNoMarginBottom />

			<ColorControl className='mt10' label={__('Route Color:', 'b-blocks')} value={directions.routeColor} onChange={(val) => updateObj('directions', val, 'routeColor')} />
		</>}
	</PanelBody>;
};
export default Directions;
