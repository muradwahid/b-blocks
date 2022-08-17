import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, Toolbar, Button } from '@wordpress/components';

// Settings Components
import Title from '../../../../../Components/Title';
import BDevice from '../../../../../Components/BDevice';
import Background from '../../../../../Components/Background';
import SpaceControl from '../../../../../Components/SpaceControl';
import BorderControl from '../../../../../Components/BorderControl';
import ShadowControl from '../../../../../Components/ShadowControl';

const Settings = props => {
	const { attributes, setAttributes, nextClientId, columns, updateColumns, updateColumnWidth } = props;
	const { width, background, padding, border, shadow } = attributes;

	const [device, setDevice] = useState('desktop');

	const maxColWidth = 100 - (columns - 1) * 10;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
				<PanelRow>
					<Title mt='0'>{__('Width (%):', 'b-blocks')}</Title>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={width[device]} onChange={val => updateColumnWidth(device, val)} min={10} max={'desktop' === device ? maxColWidth : 100} step={0.01} disabled={'desktop' === device && !nextClientId ? true : false} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Column', 'b-blocks')} initialOpen={false}>
				<Title mt='0' mb='0' />

				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#fff' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '10px', horizontal: '10px' }} />

				<BorderControl className='mt20' label={__('Border', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} />

				<ShadowControl label={__('Shadow', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>

		<BlockControls>
			<Toolbar label={__('Column Options', 'b-blocks')}>
				{columns < 6 && <Button icon='plus' label={__('Add Column', 'b-blocks')} onClick={() => updateColumns('add')} />}

				{columns > 1 && <Button icon='trash' label={__('Delete Column', 'b-blocks')} onClick={() => updateColumns('delete')} />}
			</Toolbar>
		</BlockControls>
	</>;
};
export default Settings;