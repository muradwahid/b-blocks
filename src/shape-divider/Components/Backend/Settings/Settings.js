import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, SelectControl, __experimentalUnitControl as UnitControl, RangeControl, __experimentalBoxControl as BoxControl } from '@wordpress/components';

import { Label, ColorControl, Background } from '../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import { emUnit, pxUnit, vhUnit } from '../../../../../../bpl-tools/utils/options';

import { generalStyleTabs } from '../../../../utils/options';
import { shapes } from '../../../utils/options';
import { ToggleControl } from '@wordpress/components';

const Settings = ({ attributes, setAttributes }) => {
	const { height, shape, shapePosition, isShapeSplite, shapeWidth, shapeHeight, shapeColor, background, padding } = attributes;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
			{'general' === tab.name && <>
				<PanelBody className='bPlPanelBody' title={__('Section', 'b-blocks')}>
					<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={height.desktop} onChange={val => setAttributes({ height: { desktop: val, tablet: val, mobile: val } })} units={[pxUnit(1080), emUnit(67), vhUnit(100)]} isResetValueOnUnitChange={true} />
				</PanelBody>


				<PanelBody className='bPlPanelBody' title={__('Shape', 'b-blocks')} initialOpen={false}>
					<PanelRow>
						<Label className=''>{__('Type:', 'b-blocks')}</Label>
						<SelectControl value={shape} onChange={val => setAttributes({ shape: val })} options={shapes} />
					</PanelRow>

					<PanelRow className='mt20'>
						<Label className=''>{__('Position:', 'b-blocks')}</Label>

						<SelectControl value={shapePosition} options={[{ label: __('Top', 'b-blocks'), value: 'top' }, { label: __('Bottom', 'b-blocks'), value: 'bottom' },]} onChange={newPosition => setAttributes({ shapePosition: newPosition })} />
					</PanelRow>

					<ToggleControl className='mt10' label={__('Shape Splite','b-blocks')} checked={isShapeSplite} value={isShapeSplite} onChange={val=>setAttributes({isShapeSplite:val})} />

					<Label>{__('Width:', 'b-blocks')}</Label>
					<RangeControl value={shapeWidth} onChange={val => setAttributes({ shapeWidth: val })} min={100} max={300} />

					<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={shapeHeight.desktop} onChange={val => setAttributes({ shapeHeight: { desktop: val, tablet: val, mobile: val } })} units={[pxUnit(150), emUnit(10)]} isResetValueOnUnitChange={true} />
				</PanelBody>
			</>}


			{'style' === tab.name && <>
				<PanelBody className='bPlPanelBody' title={__('Section', 'b-blocks')}>
					<Background className='mb20' label={__('Background', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />

					<BoxControl label={__('Padding:', 'b-blocks')} values={padding} resetValues={{ top: '100px', right: '0px', bottom: '100px', left: '0px' }} onChange={val => setAttributes({ padding: val })} />
				</PanelBody>


				<PanelBody className='bPlPanelBody' title={__('Shape', 'b-blocks')} initialOpen={false}>
					<ColorControl label={__('Color:', 'b-blocks')} value={shapeColor} onChange={val => setAttributes({ shapeColor: val })} defaultColor='#fff' />
				</PanelBody>
			</>}
		</>}</TabPanel>
	</InspectorControls>
};
export default Settings;