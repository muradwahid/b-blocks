import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

// Variables
import SeparatorControl from '../../../../Components/SeparatorControl';
import Typography from '../../../../Components/Typography';
import BColor from '../../../../Components/BColor';
import SpaceControl from '../../../../Components/SpaceControl';

const Settings = ({ settings }) => {
	const { attributes: { textAlign, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, descTypo, descColor, descMargin }, setAttributes } = settings;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')}>
				<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25, fontWeight: 600 }} />

				<BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				<SeparatorControl separator={separator} onChange={val => setAttributes({ separator: val })} defaults={{ width: '150px', height: '3px', color: '#8344c5' }} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '5px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				<Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />

				<BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;