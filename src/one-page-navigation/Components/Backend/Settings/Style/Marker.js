import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { resolveDevice } from '../../../../utils/options';

const Marker = ({ attributes, updateObj, device = 'desktop' }) => {
	const { marker = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Marker', 'b-blocks')} initialOpen={false}>
		<Flex>
			<Label className='mb0 flex2'>{__('Size', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				value={resolveDevice(marker, device, 'size', '')}
				onChange={(val) => updateObj('marker', undefined === val ? '' : val, device, 'size')}
				__next40pxDefaultSize
			/>
		</Flex>
	</PanelBody>;
};

export default Marker;
