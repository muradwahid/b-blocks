import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { copyPositions } from '../../../../utils/options';

const CopyButton = ({ attributes, updateObj }) => {
	const { options = {} } = attributes;

	const set = (val, key) => updateObj('options', val, key);

	return <PanelBody className='bPlPanelBody' title={__('Copy Button', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Copy Button', 'b-blocks')} checked={options.copyButton} onChange={(val) => set(val, 'copyButton')} __nextHasNoMarginBottom />

		{options.copyButton && <>
			<SelectControl className='mt10' label={__('Position', 'b-blocks')} labelPosition='edge' value={options.copyPosition || 'header'} options={copyPositions} onChange={(val) => set(val, 'copyPosition')} __nextHasNoMarginBottom />

			{'header' === (options.copyPosition || 'header') && !options.header && <p className='bPlInspectorInfo'>{__('The header is switched off, so the button has no bar to sit in. Pick a floating position, or switch the header back on.', 'b-blocks')}</p>}

			<TextControl className='mt10' label={__('Copy Label', 'b-blocks')} value={options.copyLabel || ''} onChange={(val) => set(val, 'copyLabel')} placeholder='Copy' __nextHasNoMarginBottom />

			<TextControl className='mt10' label={__('Copied Label', 'b-blocks')} value={options.copiedLabel || ''} onChange={(val) => set(val, 'copiedLabel')} placeholder='Copied!' __nextHasNoMarginBottom />
		</>}
	</PanelBody>;
};

export default CopyButton;
