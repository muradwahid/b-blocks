import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { ColorControl } from '../../../../../../../bpl-tools/Components';

const Colors = ({ colors = {}, updateObj }) => (
	<PanelBody className='bPlPanelBody' title={__('Color Palette', 'b-blocks')} initialOpen={false}>

		<ColorControl label={__('Controls & Text', 'b-blocks')} value={colors.control} onChange={(val) => updateObj('colors', val, 'control')} />

		<ColorControl label={__('Accent Color', 'b-blocks')} value={colors.accent} onChange={(val) => updateObj('colors', val, 'accent')} />

		<ColorControl label={__('Playlist Row', 'b-blocks')} value={colors.track} onChange={(val) => updateObj('colors', val, 'track')} />

		<ColorControl label={__('Playlist Active Row', 'b-blocks')} value={colors.trackActive} onChange={(val) => updateObj('colors', val, 'trackActive')} />

	</PanelBody>
);

export default Colors;
