import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { Label, Background, BDevice, BorderControl, ShadowControl, SpaceControl } from '../../../../../../Components';

import { overflows } from '../../../../row/utils/options';

const Settings = props => {
	const { attributes, setAttributes, nextClientId, columns, updateColumns, updateColumnWidth, MINWIDTH } = props;
	const { width, overflow, background, padding, border, shadow } = attributes;

	const [device, setDevice] = useState('desktop');

	const maxColWidth = 100 - (columns - 1) * MINWIDTH;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
				<PanelRow>
					<Label className='mb5'>{__('Width (%):', 'b-blocks')}</Label>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={width[device]} onChange={val => updateColumnWidth(device, val)} min={MINWIDTH} max={'desktop' === device ? maxColWidth : 100} step={0.01} disabled={'desktop' === device && !nextClientId ? true : false} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Column Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Overflow:', 'b-blocks')}</Label>
					<SelectControl value={overflow} onChange={val => setAttributes({ overflow: val })} options={overflows} />
				</PanelRow>

				<Background className='mt20' label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#fff' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '10px', horizontal: '10px' }} />

				<BorderControl className='mt20' label={__('Border', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />

				<ShadowControl label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup label={__('Column Options', 'b-blocks')}>
				{columns < 6 && <ToolbarButton icon='plus' label={__('Add Column', 'b-blocks')} onClick={() => updateColumns('add')} />}

				{columns > 1 && <ToolbarButton icon='trash' label={__('Delete Column', 'b-blocks')} onClick={() => updateColumns('delete')} />}
			</ToolbarGroup>
		</BlockControls>
	</>;
};
export default Settings;