import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { ColorControl, HelpPanel, SeparatorControl, Typography } from '../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { primaryColor, secondaryColor } from '../../../../../../bpl-tools/utils/data';

import { pluginSlug } from '../../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const { textAlign, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, descTypo, descColor, descMargin } = attributes;

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />


			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')}>
				<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 }, fontWeight: 600 }} />

				<ColorControl label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor={primaryColor} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				<SeparatorControl value={separator} onChange={val => setAttributes({ separator: val })} defaults={{ width: '150px', height: '3px', color: secondaryColor }} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '5px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				<Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

				<ColorControl label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;