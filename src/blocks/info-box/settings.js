import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl, __experimentalUnitControl as UnitControl, TextControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import ColorsControl from '../../../../Components/ColorsControl';
import IconControl from '../../../../Components/IconControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';

import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;

const Settings = ({ settings }) => {
	const { attributes: { infoBoxAlign, textAlign, width, background, padding, border, shadow, isIcon, icon, iconMargin, titleTypo, titleColor, titleMargin, isDesc, descTypo, descColor, descMargin, isBtn, btnLink, isLinkNewTab, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes } = settings;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody' title={__('Info Box Settings', 'b-blocks')}>
				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />

				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '50px' }} />

				<BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} defaults={{ width: '10px', color: '#fff', radius: '5px' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} defaults={{ blur: '15px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

				<IconControl icon={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-info-circle', fontSize: 70, color: '#4527a4' }} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
				<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25, fontWeight: 600 }} />

				<BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#333' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				<Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />

				<BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

				<PanelRow>
					<Title mt='0' mb='0'>{__('Button Link:', 'b-blocks')}</Title>
					<TextControl value={btnLink} onChange={val => setAttributes({ btnLink: val })} placeholder={__('Button link', 'b-blocks')} />
				</PanelRow>

				<ToggleControl className='mt10' label={__('Open link in new tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />

				<Typography typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 15 }} />

				<ColorsControl colors={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

				<ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '8px', horizontal: '15px' }} />

				<BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '5px' }} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={infoBoxAlign} onChange={val => setAttributes({ infoBoxAlign: val })} describedBy={__('Info Box Alignment')} alignmentControls={[
				{ title: __('Info Box in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Info Box in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Info Box in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;