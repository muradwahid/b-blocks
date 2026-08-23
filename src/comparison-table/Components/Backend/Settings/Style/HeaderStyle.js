import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

/** Mirrors data-table's "Header" panel: typography plus normal/hover colours. */
const HeaderStyle = ({ attributes, updateObj }) => {
	const { header = {} } = attributes;
	const [state, setState] = useState('normal');


	return <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={header.typo || {}} onChange={(val) => updateObj('header', val, 'typo')} />

		<ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={setState}>
			<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
			<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
		</ToggleGroupControl>

		<ColorControl
			className='mt10'
			label={__('Text Color:', 'b-blocks')}
			value={header[state]?.color}
			onChange={(val) => updateObj('header', val, state, 'color')}
		/>

		{/* Solid, gradient or image — the CSS custom property carries any of
		    them because style.scss uses the `background:` shorthand. */}
		<Background
			className='mt10'
			label={__('Background', 'b-blocks')}
			value={header[state]?.bg || {}}
			onChange={(val) => updateObj('header', val, state, 'bg')}
		/>
	</PanelBody>;
};
export default HeaderStyle;
