import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, ColorControl, Label } from '../../../../../../../bpl-tools/Components';

import { UNITS } from '../../../../utils/options';
import { Flex } from '@wordpress/components';

const Clustering = ({ clustering = {}, updateObj }) => <PanelBody className='bPlPanelBody' title={__('Clustering', 'b-blocks')} initialOpen={false}>
	<ToggleControl
		label={__('Group nearby markers', 'b-blocks')}
		checked={!!clustering.enabled}
		onChange={(val) => updateObj('clustering', !!val, 'enabled')}
		help={__('Collapses dense marker groups into a single counted bubble as the visitor zooms out.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	{clustering.enabled && <>
		<Background className='mt10' label={__('Bubble Background', 'b-blocks')} value={clustering.background} onChange={(val) => updateObj('clustering', val, 'background')} />

		<ColorControl className='mt10' label={__('Count Color:', 'b-blocks')} value={clustering.textColor} onChange={(val) => updateObj('clustering', val, 'textColor')} />

		<Flex className='mt10'>
			<Label className='flex2'>{__('Bubble Size', 'b-blocks')}</Label>
			<UnitControl className='flex1' units={UNITS} value={clustering.size} onChange={(val) => updateObj('clustering', val, 'size')} __next40pxDefaultSize />
		</Flex>

		<ToggleControl
			className='mt10'
			label={__('Zoom in on cluster click', 'b-blocks')}
			checked={false !== clustering.clickToZoom}
			onChange={(val) => updateObj('clustering', !!val, 'clickToZoom')}
			__nextHasNoMarginBottom
		/>
	</>}
</PanelBody>;
export default Clustering;
