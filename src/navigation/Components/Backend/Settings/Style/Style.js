import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { TabPanel, PanelBody, PanelRow, RangeControl, Flex } from '@wordpress/components';

import { ColorControl, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';

import DropdownMenu from './DropdownMenu';
import HamburgerMenu from './HamburgerMenu';

const Style = (props) => {
	const { attributes, device, updateObj } = props;
	const { styles, caret } = attributes;
	const { padding, margin, typo, colors } = styles;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Navigation Link/Item', 'b-blocks')} initialOpen={true}>
			<BoxControl label={<PanelRow>
				{__('Padding', 'b-blocks')}
				<Device />
			</PanelRow>} values={padding[device]} onChange={(val) => updateObj('styles', val, 'padding', device)} />

			<br />
			<br />

			<BoxControl label={<Flex justify='space-between'>
				{__('Margin', 'b-blocks')}
				<Device />
			</Flex>} values={margin[device]} onChange={(val) => updateObj('styles', val, 'margin', device)} />

			<Typography className='mt20' value={typo} onChange={(val) => updateObj('styles', val, 'typo')} />

			<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={[
				{ title: 'Normal', name: 'normal' },
				{ title: 'Active', name: 'active' },
			]}>
				{({ name: active }) => <TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={[
					{ title: 'Normal', name: 'normal' },
					{ title: 'Hover', name: 'hover' },
				]}>
					{({ name: hover }) => <ColorControl className='mt10' label={__('Text', 'b-blocks')} value={colors[active][hover]} onChange={(val) => updateObj('styles', val, 'colors', active, hover)} />}
				</TabPanel>}
			</TabPanel>
		</PanelBody>


		<DropdownMenu {...props} />


		<PanelBody className='bPlPanelBody' title={__('Caret', 'b-blocks')} initialOpen={false}>
			<RangeControl label={<PanelRow>
				{__('Size', 'b-blocks')}
				<Device />
			</PanelRow>} value={caret.size[device]} onChange={(val) => updateObj('caret', val, 'size', device)} min={0} max={100} />

			<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={[
				{ title: 'Normal', name: 'normal' },
				{ title: 'Hover', name: 'hover' },
			]}>
				{({ name }) => <ColorControl className='mt10' label={__('Color', 'b-blocks')} value={caret.color[name]} onChange={(val) => updateObj('caret', val, 'color', name)} />}
			</TabPanel>
		</PanelBody>


		<HamburgerMenu {...props} />
	</>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Style);
