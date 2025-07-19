import { Flex, PanelBody, RangeControl, SelectControl, TabPanel } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BoxControl, BtnGroup, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignmentOptions, borderOptions } from '../../../../utils/options';

const ContentStyle = ({ attributes, updateObj, device }) => {
	const { bodyStyle } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Body Style', 'b-blocks')} initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
			{
				tab => <>
					<ColorControl label={__('Color (Odd Row)', 'b-blocks')} value={bodyStyle.oddCell[tab.name].color} onChange={(value) => updateObj('bodyStyle', value, 'oddCell', tab.name, 'color')} />

					<ColorControl className='mt10' label={__('Background (Odd Row)', 'b-blocks')} value={bodyStyle.oddCell[tab.name].bg} onChange={(value) => updateObj('bodyStyle', value, 'oddCell', tab.name, 'bg')} />

					<ColorControl label={__('Color (Even Row)', 'b-blocks')} value={bodyStyle.evenCell[tab.name].color} onChange={(value) => updateObj('bodyStyle', value, 'evenCell', tab.name, 'color')} />

					<ColorControl className='mt10' label={__('Background (Even Row)', 'b-blocks')} value={bodyStyle.evenCell[tab.name].bg} onChange={(value) => updateObj('bodyStyle', value, 'evenCell', tab.name, 'bg')} />

					<SelectControl label={__('Border Type', 'b-blocks')} labelPosition='left' value={bodyStyle.borderType[tab.name]} options={borderOptions} onChange={(value) => updateObj('bodyStyle', value, 'borderType', tab.name)} />

					{bodyStyle.borderType[tab.name] !== 'default' &&
						bodyStyle.borderType[tab.name] !== 'none' && <>
							<RangeControl label={__('Border Width', 'b-blocks')} value={bodyStyle.border[tab.name].width} min={0} max={30} step={1} onChange={(value) => updateObj('bodyStyle', value, 'border', tab.name, 'width')} />

							<ColorControl label={__('Border Color', 'b-blocks')} value={bodyStyle.border[tab.name].color} onChange={(value) => updateObj('bodyStyle', value, 'border', tab.name, 'color')} className='mt10' />
						</>
					}
					{tab.name === 'normal' && <BoxControl label={<Flex>{__('Padding', 'data-block')} <Device /></Flex>} values={bodyStyle.padding[device]} onChange={value => updateObj('bodyStyle', value, 'padding', device)} />}

					<ColorControl className='mt10' label={__('Link Color', 'b-blocks')} value={bodyStyle.linkColor[tab.name]} onChange={(value) => updateObj('bodyStyle', value, 'linkColor', tab.name)} />

					{tab.name === 'normal' && <>
						<BtnGroup label={<Flex>{__('Alignment', 'b-blocks')} <Device /></Flex>} options={alignmentOptions} value={bodyStyle.textAlign[device]} onChange={(val) => updateObj('bodyStyle', val, 'textAlign', device)} isIcon={true} />

						<RangeControl className='mt10' label={<Flex>{__('Icon Size', 'b-blocks')} <Device /></Flex>} value={bodyStyle.icon.size[device]} onChange={(value) => updateObj('bodyStyle', value, 'icon', 'size', device)} />
					</>
					}
					<ColorControl className='mt10' label={__('Icon Color', 'b-blocks')} value={bodyStyle.icon.color[tab.name]} onChange={(value) => updateObj('bodyStyle', value, 'icon', 'color', tab.name)} />
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
})(ContentStyle);
