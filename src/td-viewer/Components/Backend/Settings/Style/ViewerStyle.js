import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl, Background } from '../../../../../../../bpl-tools/Components';

const ViewerStyle = ({ attributes, setAttributes }) => {
	const { background = {}, progressBarColor = '', posterColor = '' } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Viewer', 'b-blocks')}>
		<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />

		<ColorControl className='mt20' label={__('Progress Bar Color:', 'b-blocks')} value={progressBarColor} onChange={val => setAttributes({ progressBarColor: val })} />

		<ColorControl className='mt20' label={__('Poster Background:', 'b-blocks')} value={posterColor} onChange={val => setAttributes({ posterColor: val })} />
	</PanelBody>;
};
export default ViewerStyle;
