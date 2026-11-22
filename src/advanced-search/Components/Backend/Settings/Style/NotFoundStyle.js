import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';
import { alignOptions } from '../../../../utils/options';

const NotFoundStyle = ({ attributes, updateObj, fallback }) => {
	const { notFound = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Not Found Message', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={notFound.typo} onChange={(val) => updateObj('notFound', val, 'typo')} />
		<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={notFound.color} onChange={(val) => updateObj('notFound', val, 'color')} />
		<SelectControl className='mt10' label={__('Alignment', 'b-blocks')} labelPosition='edge' value={notFound.align} options={alignOptions} onChange={(val) => updateObj('notFound', val, 'align')} __next40pxDefaultSize __nextHasNoMarginBottom />
		{'none' !== fallback && <p className='components-base-control__help mt10'>{__('Also styles the heading above the posts shown when nothing matches.', 'b-blocks')}</p>}
	</PanelBody>;
};
export default NotFoundStyle;
