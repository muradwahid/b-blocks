import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

const Button = ({ attributes, updateObj }) => {
	const { button = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
		<ToggleControl className='mt10' label={__('Show Icon', 'b-blocks')} checked={button.showIcon} onChange={(val) => updateObj('button', val, 'showIcon')} __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Show Text', 'b-blocks')} checked={button.showText} onChange={(val) => updateObj('button', val, 'showText')} __nextHasNoMarginBottom />
	</PanelBody>;
};

export default Button;
