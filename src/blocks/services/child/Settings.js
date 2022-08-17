import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../../Components/Title';
import BColor from '../../../../../Components/BColor';
import Background from '../../../../../Components/Background';
import IconControl from '../../../../../Components/IconControl';
import { ImageHolderControl } from '../../../../../Components/ImageControl';
import BorderControl from '../../../../../Components/BorderControl';

import options from '../../../utils/options';
import servicePattern from '../img/service-pattern.png';
const { pxUnit, perUnit, emUnit } = options;

const Settings = ({ attributes, setAttributes }) => {
	const { background, hoverBG, isIcon, isUpIcon, icon, upIcon, iconWidth, iconBorder, isTitle, titleColor, isDesc, descColor, isLink, link, linkIn, linkIconColor, linkBGColor, linkBGHovColor } = attributes;

	return <InspectorControls>
		<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
			<div className='helpItem'>
				<a href='https://bblockswp.com/docs/services-section-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
			</div>

			<div className='helpItem rateUs'>
				<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
					<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
					<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
				</a>
			</div>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Service Settings', 'b-blocks')}>
			<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

			<Background label={__('Hover Background:', 'b-blocks')} background={hoverBG} onChange={val => setAttributes({ hoverBG: val })} defaults={{ type: 'image', image: { url: servicePattern }, overlayColor: '#0000', position: 'bottom left', size: 'auto' }} />
		</PanelBody>

		{isIcon && <PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
			<ToggleControl label='Upload Icon?' checked={isUpIcon} onChange={val => setAttributes({ isUpIcon: val })} />

			{isUpIcon ? <>
				{/* After Image */}
				<ImageHolderControl className='mt20' label={__('Icon:', 'b-blocks')} img={upIcon} onChange={val => setAttributes({ upIcon: val })} />

				<UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={iconWidth} onChange={val => setAttributes({ iconWidth: val })} units={[pxUnit, perUnit, emUnit]} />

			</> : <IconControl icon={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fab fa-wordpress', fontSize: 70 }} />}

			{/* Border */}
			<BorderControl label={__('Border:', 'b-blocks')} border={iconBorder} onChange={val => setAttributes({ iconBorder: val })} />
		</PanelBody>}

		<PanelBody className='bPlPanelBody' title={__('Colors Settings', 'b-blocks')} initialOpen={false}>
			{isTitle && <BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor={'#222'} />}

			{isDesc && <BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor={'#333'} />}
		</PanelBody>

		{isLink && <PanelBody className='bPlPanelBody' title={__('Link Settings', 'b-blocks')} initialOpen={false}>
			<Title mt='0'>{__('Link:', 'b-blocks')}</Title>
			<TextControl value={link} onChange={val => setAttributes({ link: val })} />

			{'button' === linkIn && <>
				<BColor label={__('Icon Color:', 'b-blocks')} value={linkIconColor} onChange={val => setAttributes({ linkIconColor: val })} defaultColor={'#fff'} />

				<BColor label={__('Background Color:', 'b-blocks')} value={linkBGColor} onChange={val => setAttributes({ linkBGColor: val })} defaultColor={'#d2d2d2'} />

				<BColor label={__('Background Hover Color:', 'b-blocks')} value={linkBGHovColor} onChange={val => setAttributes({ linkBGHovColor: val })} defaultColor={'#4527a4'} />
			</>}
		</PanelBody>}
	</InspectorControls>;
};
export default Settings;