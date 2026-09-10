import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody } from '@wordpress/components';

import { Background, BoxControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';

// The frame the whole feed sits in.
const Box = ({ attributes, updateObj, device = 'desktop' }) => {
	const { box = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Box', 'b-blocks')} initialOpen={true}>
		<BoxControl label={<>{__('Padding', 'b-blocks')} <Device /></>} values={box?.[device]?.padding || {}} onChange={(val) => updateObj('box', val, device, 'padding')} />

		<BoxControl label={<>{__('Border Radius', 'b-blocks')} <Device /></>} values={box?.[device]?.radius || {}} onChange={(val) => updateObj('box', val, device, 'radius')} />

		<Background className='mt10' label={__('Background', 'b-blocks')} value={box.background} onChange={(val) => updateObj('box', val, 'background')} />

		<small>{__('Left empty, the theme paints the background.', 'b-blocks')}</small>

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={box.border} onChange={(val) => updateObj('box', val, 'border')} />

		<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={box.shadow} onChange={(val) => updateObj('box', val, 'shadow')} />
	</PanelBody>;
};

export default Box;
