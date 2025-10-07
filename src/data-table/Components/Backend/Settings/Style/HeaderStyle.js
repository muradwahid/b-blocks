import { Flex, PanelBody, RangeControl, SelectControl, TabPanel } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BoxControl, BtnGroup, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignmentOptions, borderOptions } from '../../../../utils/options';

const HeaderStyle = ({ attributes, updateObj, device }) => {
	const { headerStyle } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Header Style', 'b-blocks')} initialOpen={false}>
		<RangeControl label={__('Border Radius', 'data-block')} min={0} max={200} value={headerStyle.bRadius} onChange={(value) => updateObj('headerStyle', value, 'bRadius')} />

		<BoxControl label={<Flex>{__('Padding', 'data-block')}<Device /></Flex>} values={headerStyle.padding[device]} onChange={(value) => updateObj('headerStyle', value, 'padding', device)} />

		<TabPanel className='bPlTabPanel mini mt10' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
			{
				tab => <>
					<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={headerStyle.color[tab.name]} onChange={(value) => updateObj('headerStyle', value, 'color', tab.name)} />

					<ColorControl className='mt10' label={__('Background', 'b-blocks')} value={headerStyle.bg[tab.name]} onChange={(value) => updateObj('headerStyle', value, 'bg', tab.name)} style={{ margin: '10px 0' }} />

					<SelectControl className='mt10' label={__('Border Type', 'b-blocks')} labelPosition='left' value={headerStyle.borderType[tab.name]} options={borderOptions} onChange={(value) => updateObj('headerStyle', value, 'borderType', tab.name)} />

					{headerStyle.borderType[tab.name] !== 'default' && headerStyle.borderType[tab.name] !== 'none' && <>
						<RangeControl className='mt10' label={__('Border Width', 'b-blocks')} value={headerStyle.border[tab.name].width} min={0} max={30} step={1} onChange={(value) => updateObj('headerStyle', value, 'border', tab.name, 'width')} />

						<ColorControl className='mt10' label={__('Border Color', 'b-blocks')} value={headerStyle.border[tab.name].color} onChange={(value) => updateObj('headerStyle', value, 'border', tab.name, 'color')} style={{ margin: '10px 0' }} />
					</>}

					{tab.name === 'normal' && (<>
						<RangeControl className='mt10' label={<Flex>{__('Icon/Image Size')}<Device /></Flex>} min={0} max={200} value={headerStyle.iconSize[device]} onChange={(value) => updateObj('headerStyle', value, 'iconSize', device)} />

						<RangeControl className='mt10' label={<Flex>{__('Icon/Image Space')} <Device /></Flex>} min={0} max={200} value={headerStyle.iconSpace[device]} onChange={(value) => updateObj('headerStyle', value, 'iconSpace', device)} />

						<ColorControl className='mt10' label={__('Icon Color', 'b-blocks')} value={headerStyle.iconColor} onChange={(value) => updateObj('headerStyle', value, 'iconColor')} style={{ margin: '10px 0' }} />

						<BtnGroup className='mt10' label={__('Title Alignment', 'b-blocks')} options={alignmentOptions} value={headerStyle.titleAlign} onChange={(val) => updateObj('headerStyle', val, 'titleAlign')} isIcon={true} />
					</>
					)}
				</>
			}
		</TabPanel>

	</PanelBody>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(HeaderStyle);
