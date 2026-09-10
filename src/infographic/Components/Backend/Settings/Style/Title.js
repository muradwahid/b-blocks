import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

import { titleTagOptions } from '../../../../utils/options';

const Title = ({ attributes, updateObj }) => {
	const { title = {} } = attributes.content || {};

	return <PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>

		<SelectControl label={__('Heading Tag', 'b-blocks')} labelPosition='edge' value={title.tag} options={titleTagOptions} onChange={(val) => updateObj('content', val, 'title', 'tag')} __nextHasNoMarginBottom />

		<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={title.color} onChange={(val) => updateObj('content', val, 'title', 'color')} defaultColor='#1F2937' />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={title.typo} onChange={(val) => updateObj('content', val, 'title', 'typo')} defaults={{ fontSize: { desktop: 34, tablet: 28, mobile: 22 } }} />

	</PanelBody>;
};

export default Title;
