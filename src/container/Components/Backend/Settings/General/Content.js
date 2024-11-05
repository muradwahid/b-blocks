import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { heights, horizontalAlignOptions, verticalAlignOptions } from '../../../../utils/options';

const Content = (props) => {
	const { attributes, setAttributes, device } = props;
	const { content } = attributes;
	const { isFullWidth, width, height, verticalAlign, horizontalAlign } = content;

	return <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>
		<ToggleControl label='Enable Full Width' checked={isFullWidth} onChange={val => setAttributes({ content: updateData(content, val, 'isFullWidth') })} />

		{!isFullWidth && <>
			<PanelRow className='mt20'>
				<Label className=''>{__('Width:', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<UnitControl value={width[device]} onChange={val => setAttributes({ content: updateData(content, val, 'width', device) })} beforeIcon='grid-view'></UnitControl>
		</>}

		<SelectControl className='mt20' label={__('Height', 'b-blocks')} labelPosition='left' value={height} onChange={val => { setAttributes({ content: updateData(content, val, 'height') }) }} options={heights} />

		<SelectControl className='mt20' label={__('Vertical Align', 'b-blocks')} labelPosition='left' value={verticalAlign} options={verticalAlignOptions} onChange={(val) => { setAttributes({ content: updateData(content, val, 'verticalAlign') }) }} />

		<SelectControl className='mt20' label={__('Horizontal Align', 'b-blocks')} labelPosition='left' value={horizontalAlign} options={horizontalAlignOptions} onChange={(val) => { setAttributes({ content: updateData(content, val, 'horizontalAlign') }) }} />
	</PanelBody>
}
export default Content;