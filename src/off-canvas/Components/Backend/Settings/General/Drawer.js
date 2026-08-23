import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, Flex, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS } from '../../../../utils/options';
import { drawerSideOptions } from '../../../../utils/data';

const Drawer = ({ drawer = {}, overlay = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Drawer', 'b-blocks')} initialOpen={true}>
		
		<Flex>
			<Label className="flex2">{__('Drawer Side', 'b-blocks')}</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={drawer.side || 'left'} onChange={(val) => updateObj('drawer', val, 'side')}>
				{drawerSideOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
		</Flex>

		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Drawer Width', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={drawer.width?.[device]} units={UNITS} onChange={(val) => updateObj('drawer', val, 'width', device)} __next40pxDefaultSize />
		</Flex>

		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Drawer Height', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={drawer.height?.[device]} units={UNITS} onChange={(val) => updateObj('drawer', val, 'height', device)} placeholder={__('Full', 'b-blocks')} __next40pxDefaultSize />
		</Flex>

		<ToggleControl className='mt10' label={__('Show Overlay', 'b-blocks')} checked={overlay.show !== false} onChange={(val) => updateObj('overlay', !!val, 'show')} />
	</PanelBody>
);
export default Drawer;
