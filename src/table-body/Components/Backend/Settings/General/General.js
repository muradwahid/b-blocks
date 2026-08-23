import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { useState } from 'react';
import { Background } from '../../../../../../bpl-tools/Components';

import { HelpPanel } from '../../../../../../bpl-tools/Components';

const General = (props) => {
	const [normal, setNormal] = useState('normal');

	const { attributes, updateObj } = props;
	const { styles } = attributes;

	return <>
		<HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/content-slider-block/guides/general' />


		<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')}>
			<ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
				setNormal(val)
			}}>
				<ToggleGroupControlOption label='Default' value='normal' />
				<ToggleGroupControlOption label='Hover' value='hover' />
			</ToggleGroupControl>

			<Background label={__('Background', 'b-blocks')} value={styles[normal].bg} onChange={val => updateObj('styles', val, normal, 'bg')} />

			{
				normal === 'hover' && <RangeControl
					className='mt10'
					label={__('Transition', 'b-blocks')}
					value={styles.hover.transition}
					step={0.05}
					min={0}
					max={5}
					onChange={val => updateObj('styles', val, 'hover', 'transition')}
				/>
			}
		</PanelBody>
	</>
}
export default General;