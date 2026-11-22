import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { IconLibrary } from '../../../../../../../bpl-tools/Components';
import { buttonTypeOptions } from '../../../../utils/options';

const Button = ({ attributes, updateObj }) => {
	const { button = {} } = attributes;
	const { position: buttonPosition = 'separate', type: buttonType = 'text', text: buttonText = '', icon: buttonIcon = '' } = button;

	return <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
		<ToggleGroupControl label={__('Position', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonPosition} onChange={(val) => updateObj('button', val || 'separate', 'position')}>
			<ToggleGroupControlOption label={__('Separate', 'b-blocks')} value='separate' />
			<ToggleGroupControlOption label={__('Inside', 'b-blocks')} value='inside' />
		</ToggleGroupControl>

		<ToggleGroupControl className='mt10' label={__('Type', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonType} onChange={(val) => updateObj('button', val || 'text', 'type')}>
			{buttonTypeOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>

		<TextControl
			className='mt10'
			label={'icon' !== buttonType ? __('Text', 'b-blocks') : __('Label (for screen readers)', 'b-blocks')}
			value={buttonText}
			onChange={(val) => updateObj('button', val, 'text')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		{'text' !== buttonType && <IconLibrary className='mt10' label={__('Icon', 'b-blocks')} value={buttonIcon} onChange={(val) => updateObj('button', val, 'icon')} />}
	</PanelBody>;
};
export default Button;
