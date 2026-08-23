import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

import { TITLE_TAG_OPTIONS } from '../../../../utils/options';

const Content = ({ attributes, updateObj }) => {
	const { content = {} } = attributes;
	const { titleTag, titleColor, descColor } = content;

	return <PanelBody className='bPlPanelBody' title={__('Title & Description', 'b-blocks')} initialOpen={false}>

		<SelectControl label={__('Heading tag', 'b-blocks')} value={titleTag || 'h3'} options={TITLE_TAG_OPTIONS} onChange={(val) => updateObj('content', val, 'titleTag')} help={__('Use H3 for pages that already have an H2 section heading.', 'b-blocks')} __nextHasNoMarginBottom />

		<ColorControl label={__('Title color', 'b-blocks')} value={titleColor || ''} onChange={(val) => updateObj('content', val || '', 'titleColor')} defaultColor='' />

		<Typography label={__('Title Typography', 'b-blocks')} value={content.typo} onChange={val => updateObj('content', val, 'typo')} />

		<ColorControl label={__('Description Color', 'b-blocks')} value={descColor || ''} onChange={(val) => updateObj('content', val || '', 'descColor')} defaultColor='' />

		<Typography label={__('Description Typography', 'b-blocks')} value={content.descTypo} onChange={val => updateObj('content', val, 'descTypo')} />

	</PanelBody>;
};

export default Content;
