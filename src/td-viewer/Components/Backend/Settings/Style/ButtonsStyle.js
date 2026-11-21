import { __ } from '@wordpress/i18n';
import { PanelBody, BorderBoxControl } from '@wordpress/components';

import { ColorControl, Background, BoxControl, ShadowControl } from '../../../../../../../bpl-tools/Components';

const ButtonsStyle = ({ attributes, setAttributes }) => {
	const { btnColor = '', btnBg = {}, btnBorder = {}, btnRadius = {}, btnShadow = [] } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Buttons & Selectors', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color:', 'b-blocks')} value={btnColor} onChange={val => setAttributes({ btnColor: val })} />

		<Background className='mt20' label={__('Background:', 'b-blocks')} value={btnBg} onChange={val => setAttributes({ btnBg: val })} />

		<div className='mt20'>
			<BorderBoxControl label={__('Border', 'b-blocks')} value={btnBorder} onChange={val => setAttributes({ btnBorder: val })} />
		</div>

		<BoxControl className='mt20' label={__('Border Radius', 'b-blocks')} values={btnRadius} onChange={val => setAttributes({ btnRadius: val })} />

		<ShadowControl className='mt20' label={__('Shadow', 'b-blocks')} value={btnShadow} onChange={val => setAttributes({ btnShadow: val })} />
	</PanelBody>;
};
export default ButtonsStyle;