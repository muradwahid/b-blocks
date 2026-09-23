import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { hasRing, resolveDevice } from '../../../../utils/options';

const Line = ({ attributes, updateObj, device = 'desktop' }) => {
	const { line = {}, layout = {} } = attributes;


	// The bullseye has no line of its own: its ring is Style ▸ Item, and only
	// the arc that fills in is set here.
	const ring = hasRing(layout.preset);

	return <PanelBody className='bPlPanelBody' title={__('Line / Track', 'b-blocks')} initialOpen={false}>
		{!ring && <ColorControl label={__('Color', 'b-blocks')} value={line.color} onChange={(val) => updateObj('line', val, 'color')} />}

		{ring && <ColorControl label={__('Progress Color', 'b-blocks')} value={line.progressColor} onChange={(val) => updateObj('line', val, 'progressColor')} />}

		{!ring && <Flex className='mt10'><Label className='mb0 flex2'>{__('Thickness', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				value={resolveDevice(line, device, 'thickness', '')}
				onChange={(val) => updateObj('line', undefined === val ? '' : val, device, 'thickness')}
				__next40pxDefaultSize
			/>
	
		</Flex>

		}
	</PanelBody>;
};

export default Line;
