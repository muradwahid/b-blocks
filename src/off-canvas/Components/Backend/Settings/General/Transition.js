import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, RangeControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { transitionTypeOptions, easingOptions } from '../../../../utils/data';

const Transition = ({ transition = {}, updateObj }) => (
	<PanelBody className='bPlPanelBody' title={__('Transition', 'b-blocks')} initialOpen={false}>
		<PanelRow>
			<Label className=''>{__('Transition Type:', 'b-blocks')}</Label>
			<SelectControl value={transition.type || 'default'} options={transitionTypeOptions} onChange={(val) => updateObj('transition', val, 'type')} __nextHasNoMarginBottom />
		</PanelRow>

		<RangeControl className='mt10' label={__('Duration (ms)', 'b-blocks')} value={transition.duration} onChange={(val) => updateObj('transition', val, 'duration')} min={0} max={2000} step={50} __nextHasNoMarginBottom />

		<PanelRow className='mt10'>
			<Label className=''>{__('Easing:', 'b-blocks')}</Label>
			<SelectControl value={transition.easing || 'ease'} options={easingOptions} onChange={(val) => updateObj('transition', val, 'easing')} __nextHasNoMarginBottom />
		</PanelRow>
	</PanelBody>
);
export default Transition;
