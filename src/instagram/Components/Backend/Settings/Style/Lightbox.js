import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl } from '../../../../../../../bpl-tools/Components';

const Lightbox = ({ attributes, updateObj }) => {
	const { elements = {}, lightbox = {} } = attributes;

	if (!elements.lightbox) return null;

	return <PanelBody className='bPlPanelBody' title={__('Lightbox', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Backdrop', 'b-blocks')} value={lightbox.backdrop} onChange={(val) => updateObj('lightbox', val, 'backdrop')} />

		<small>{__('A translucent colour keeps the page visible behind the post.', 'b-blocks')}</small>
	</PanelBody>;
};

export default Lightbox;
