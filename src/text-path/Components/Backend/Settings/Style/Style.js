import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useState } from 'react';
import { ColorControl, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { ToggleControl, RangeControl } from '@wordpress/components';


const Style = props => {
	const { attributes, updateObj } = props;
	const { styles } = attributes;
	const { title, path } = styles;

	const [normal, setNormal] = useState('normal');

	return <>
		<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={true}>

			<Typography value={title.typo} onChange={(val) => updateObj('styles', val, 'title', 'typo')} />

			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => setNormal(val)} >
				<ToggleGroupControlOption label='Normal' value="normal" />
				<ToggleGroupControlOption label='Hover' value="hover" />
			</ToggleGroupControl>

			<ColorControl value={title[normal]?.color} onChange={(val) => updateObj('styles', val, 'title', normal, 'color')} />
			<ShadowControl value={title[normal]?.textShadow} onChange={(val) => updateObj('styles', val, 'title', normal, 'textShadow')} type='text' />

			<ToggleControl label={__('Show Stroke', 'b-blocks')} checked={title[normal]?.textStroke?.isStroke} value={title[normal]?.textStroke?.isStroke} onChange={(val) => updateObj('styles', val, 'title', normal, 'textStroke', 'isStroke')} />
			{
				title[normal]?.textStroke?.isStroke && <>
					<RangeControl step={0.1} className='mt10' label={__('Stroke Size', 'b-blocks')} value={title[normal]?.textStroke?.size} min={0} max={10} onChange={(val) => updateObj('styles', val, 'title', normal, 'textStroke', 'size')} />

					<ColorControl label={__('Stroke Color', 'b-blocks')} value={title[normal]?.textStroke?.color} onChange={(val) => updateObj('styles', val, 'title', normal, 'textStroke', 'color')} />
				</>
			}
			{
				normal === 'hover' && <RangeControl  className='mt10' label={__('Transition', 'b-blocks')} min={0} max={5} step={0.01} value={title.transition} onChange={(val) => updateObj('styles', val, 'title', 'transition')} />
			}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Path', 'b-blocks')} initialOpen={false}>

			<ColorControl value={path.color} onChange={(val) => updateObj('styles', val, 'path', 'color')} />

			<UnitControl label={__('Size', 'b-blocks')} value={path.size} onChange={(val) => updateObj('styles', val, 'path', 'size')} />

			<RangeControl className='mt10' label={__('Thickness', 'b-blocks')} value={path.thickness} step={0.1} min={0} max={20} onChange={(val) => updateObj('styles', val, 'path', 'thickness')} />

			<RangeControl label={__('Starting Point', 'b-blocks')} value={path.staringPoint} step={0.1} min={0} max={2000} onChange={(val) => updateObj('styles', val, 'path', 'staringPoint')} />

			<RangeControl label={__('Rotate', 'b-blocks')} value={path.rotate} step={0.1} min={0} max={360} onChange={(val) => updateObj('styles', val, 'path', 'rotate')} />

		</PanelBody>
	</>
}
export default Style;