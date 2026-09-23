import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { pulseStyles } from '../../../../utils/options';

const Animation = ({ attributes, updateObj }) => {

	const { animation = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>

		<ToggleControl
			label={__('Active Pulse', 'b-blocks')}
			checked={animation.pulse}
			onChange={(val) => updateObj('animation', val, 'pulse')}
		/>

		{animation.pulse && <SelectControl
			label={__('Pulse Style', 'b-blocks')}
			value={animation.style || 'pulseRing'}
			options={pulseStyles}
			onChange={(val) => updateObj('animation', val, 'style')}
			__nextHasNoMarginBottom
		/>}

		{animation.pulse && <>
			
			<Label className='mb0 mt10'>{__('Speed', 'b-blocks')}</Label>

			<UnitControl
				value={animation.speed}
				onChange={(val) => updateObj('animation', undefined === val ? '' : val, 'speed')}
				units={[{ label: 's', value: 's' }, { label: 'ms', value: 'ms' }]}
				__next40pxDefaultSize
			/>

		</>}
	</PanelBody>;
};

export default Animation;
