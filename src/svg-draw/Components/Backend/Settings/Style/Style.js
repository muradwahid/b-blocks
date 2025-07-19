import { PanelBody, RangeControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BtnGroup, ColorControl } from '../../../../../../../bpl-tools/Components';
import { ShadowControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { tabController, updateData } from '../../../../../../../bpl-tools/utils/functions';
import { AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight } from '../../../../utils/icons';
import { normalHoverTabs } from '../../../../utils/options';

const Style = (props) => {
	const { attributes, setAttributes } = props;
	const { style } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Icon Style', 'b-blocks')} initialOpen={true} >

			<UnitControl label={__('Height', 'b-blocks')} labelPosition='edge' value={attributes.style.height} onChange={(value) => setAttributes({ style: updateData(attributes.style, value, 'height'), })} />

			<UnitControl label={__('Width', 'b-blocks')} labelPosition='edge' className='mt10' value={attributes.style.width} onChange={(value) => setAttributes({ style: updateData(attributes.style, value, 'width'), })} />

			<BtnGroup label={__('Alignment', 'b-blocks')} className='mt10' options={[{ label: 'Left', value: 'left', icon: <AiOutlineAlignLeft /> }, { label: 'Center', value: 'center', icon: <AiOutlineAlignCenter />, }, { label: 'Right', value: 'right', icon: <AiOutlineAlignRight /> },]} value={style.align} onChange={(value) => setAttributes({ style: updateData(style, value, 'align') })} isIcon={true} />

			<RangeControl label={__('Path Thickness', 'b-blocks')} className='mt10' value={style.strokeWidth} onChange={(value) => setAttributes({ style: updateData(style, value, 'strokeWidth') })} />

			<TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController} >
				{(tab) => (
					<>
						<ColorControl label={__('Stroke Color', 'b-blocks')} value={style.colors[tab.name].strokeColor} onChange={(value) => setAttributes({ style: updateData(style, value, 'colors', tab.name, 'strokeColor'), })} />

						<ColorControl label={__('Fill Color', 'b-blocks')} value={style.colors[tab.name].fill} onChange={(value) => setAttributes({ style: updateData(style, value, 'colors', tab.name, 'fill'), })} />

						<ShadowControl label={__('Shadow', 'b-blocks')} value={style.colors[tab.name].shadow} onChange={(value) => setAttributes({ style: updateData(style, value, 'colors', tab.name, 'shadow'), })} type='text' />

						{tab.name === 'hover' && (
							<>
								<RangeControl label={__('Transition (ms)', 'b-blocks')} value={style.colors.hover.transition} step={50} max={10000} onChange={(value) => setAttributes({ style: updateData(style, value, 'colors', 'hover', 'transition'), })} />
							</>
						)}
					</>
				)}
			</TabPanel>
		</PanelBody>
	</>
};
export default Style;
