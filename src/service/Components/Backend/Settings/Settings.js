import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, ColorControl, IconControl, InlineDetailMediaUpload, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import { pluginSlug, servicesDocs } from '../../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const { background, hoverBG, isIcon, isUpIcon, icon, upIcon, iconWidth, iconBorder, isTitle, titleColor, isDesc, descColor, isLink, link, linkIn, linkIconColor, linkBGColor, linkBGHovColor } = attributes;

	return <InspectorControls>
		<HelpPanel slug={pluginSlug} docsLink={servicesDocs} />


		<PanelBody className='bPlPanelBody' title={__('Service Settings', 'b-blocks')}>
			<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

			<Background label={__('Hover Background:', 'b-blocks')} value={hoverBG} onChange={val => setAttributes({ hoverBG: val })} defaults={{ type: 'image', image: { url: 'https://i.imgur.com/i6qCSdM.png' }, overlayColor: '#0000', position: 'bottom left', size: 'auto' }} />
		</PanelBody>

		{isIcon && <PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
			<ToggleControl label='Upload Icon?' checked={isUpIcon} onChange={val => setAttributes({ isUpIcon: val })} />

			{isUpIcon ? <>
				<Label>{__('Icon:', 'b-blocks')}</Label>
				<InlineDetailMediaUpload value={upIcon} onChange={val => setAttributes({ upIcon: val })} placeholder={__('Enter Icon URL', 'b-blocks')} />

				<UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={iconWidth} onChange={val => setAttributes({ iconWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

			</> : <IconControl value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa-brands fa-wordpress', fontSize: 70 }} />}

			<BorderControl label={__('Border:', 'b-blocks')} value={iconBorder} onChange={val => setAttributes({ iconBorder: val })} />
		</PanelBody>}

		<PanelBody className='bPlPanelBody' title={__('Colors Settings', 'b-blocks')} initialOpen={false}>
			{isTitle && <ColorControl label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor={'#222'} />}

			{isDesc && <ColorControl label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor={'#333'} />}
		</PanelBody>

		{isLink && <PanelBody className='bPlPanelBody' title={__('Link Settings', 'b-blocks')} initialOpen={false}>
			<Label className='mb5'>{__('Link:', 'b-blocks')}</Label>
			<TextControl value={link} onChange={val => setAttributes({ link: val })} />

			{'button' === linkIn && <>
				<ColorControl label={__('Icon Color:', 'b-blocks')} value={linkIconColor} onChange={val => setAttributes({ linkIconColor: val })} defaultColor={'#fff'} />

				<ColorControl label={__('Background Color:', 'b-blocks')} value={linkBGColor} onChange={val => setAttributes({ linkBGColor: val })} defaultColor={'#d2d2d2'} />

				<ColorControl label={__('Background Hover Color:', 'b-blocks')} value={linkBGHovColor} onChange={val => setAttributes({ linkBGHovColor: val })} defaultColor={'#4527a4'} />
			</>}
		</PanelBody>}
	</InspectorControls>;
};
export default Settings;