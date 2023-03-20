import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl, __experimentalUnitControl as UnitControl, TextControl, Dashicon } from '@wordpress/components';
import produce from 'immer';

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
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

const Settings = ({ settings }) => {
	const { attributes: { infoBoxAlign, textAlign, width, background, padding, border, shadow, isIcon, icon, iconMargin, titleTypo, titleColor, titleMargin, isDesc, descTypo, descColor, descMargin, isBtn, btnLink, isLinkNewTab, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes } = settings;

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/info-box-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Info Box Settings', 'b-blocks')}>
				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '50px' }} />

				<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ width: '10px', color: '#fff', radius: '5px' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} defaults={{ blur: '15px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

				{isIcon && <>
					<IconControl value={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-info-circle', fontSize: 70, color: '#4527a4' }} />

					<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
				<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 }, fontWeight: 600 }} produce={produce} />

				<BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#333' />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				{isDesc && <>
					<Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />

					<BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

					<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

				{isBtn && <>
					<PanelRow>
						<Title className=''>{__('Button Link:', 'b-blocks')}</Title>
						<TextControl value={btnLink} onChange={val => setAttributes({ btnLink: val })} placeholder={__('Button link', 'b-blocks')} />
					</PanelRow>

					<ToggleControl className='mt10' label={__('Open link in new tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />

					<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} produce={produce} />

					<ColorsControl value={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

					<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '8px', horizontal: '15px' }} />

					<BorderControl label={__('Border:', 'b-blocks')} value={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '5px' }} />
				</>}
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