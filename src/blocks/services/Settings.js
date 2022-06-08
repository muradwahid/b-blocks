import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, PanelRow, RangeControl, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import Background from '../../../../Components/Background';
import Typography from '../../../../Components/Typography';
import BDevice from '../../../../Components/BDevice';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';

import options from '../../Const/options';
import servicePattern from '../../img/service-pattern.png';
const { pxUnit, perUnit, emUnit } = options;
const layouts = [
	{ label: __('Default', 'services-section'), value: 'default' },
	{ label: __('Layout 1', 'services-section'), value: 'layout1' }
];
const linkPosition = [
	{ label: __('Service Element', 'services-section'), value: 'service' },
	{ label: __('Title', 'services-section'), value: 'title' },
	{ label: __('Button', 'services-section'), value: 'button' },
];

const Settings = ({ attributes, setAttributes, clientId }) => {
	const { layout, columns, columnGap, rowGap, background, textAlign, itemHeight, itemPadding, itemShadow, itemBorder, iconPadding, iconMargin, titleTypo, titleMargin, descTypo } = attributes;

	const [device, setDevice] = useState('desktop');

	// Play with child data
	const innerBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks;
	const childAttributes = innerBlocks && innerBlocks[0]?.attributes;
	const [isIcon, setIsIcon] = useState(childAttributes?.isIcon);
	const [isTitle, setIsTitle] = useState(childAttributes?.isTitle);
	const [isDesc, setIsDesc] = useState(childAttributes?.isDesc);
	const [linkIn, setLinkIn] = useState(childAttributes?.linkIn);

	const setChildAttributes = args => innerBlocks.forEach(block => {
		dispatch('core/block-editor').updateBlockAttributes(block.clientId, args);
	});

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/services-section-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' size={23} />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' size={23} />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')}>
				<PanelRow>
					<Title mt='0' mb='0'>{__('Layout:', 'b-blocks')}</Title>
					<SelectControl value={layout} onChange={val => {
						setAttributes({ layout: val });
						'default' === val && setAttributes({
							background: { ...background, type: 'solid', color: '#0000', styles: 'background-color: #0000' },
							itemShadow: { ...itemShadow, blur: '20px', color: '#0000001a', styles: '0 0 20px 0 #0000001a' }
						});
						'layout1' === val && setAttributes({
							background: { ...background, type: 'solid', color: '#121212', styles: 'background-color: #121212' },
							itemShadow: { ...itemShadow, blur: '0', color: '#0000', styles: '0 0 0 0 #0000' }
						});

						innerBlocks.forEach(block => {
							const { hoverBG, icon, iconBorder } = block?.attributes;

							'default' === val && dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
								hoverBG: { ...hoverBG, type: 'image', image: { url: servicePattern }, overlayColor: '#0000', position: 'bottom left', size: 'auto', styles: `background-image: url(${servicePattern}); background-position: bottom left; background-size: auto; background-repeat: no-repeat; background-color: #0000;` },
								icon: { ...icon, colorType: 'solid', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)', styles: 'font-size: 70px; color: inherit;' },
								iconBorder: { ...iconBorder, width: '0px', color: '#0000', side: 'all', styles: '' },
								titleColor: '#222',
								descColor: '#333',
								linkIn: 'button'
							});
							'layout1' === val && dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
								hoverBG: { ...hoverBG, type: 'solid', color: '#0000', styles: `background-color: #0000;` },
								icon: { ...icon, colorType: 'gradient', gradient: 'linear-gradient(135deg, #7f246b, #c70d2b)', styles: 'font-size: 70px; color: transparent; background-image: linear-gradient(135deg, #7f246b, #c70d2b); -webkit-background-clip: text; background-clip: text;' },
								iconBorder: { ...iconBorder, width: '1px', color: '#777', side: 'bottom', styles: 'border-bottom: 1px solid #777' },
								titleColor: '#fff',
								descColor: '#777',
								linkIn: 'title'
							});
						});
					}} options={layouts} />
				</PanelRow>

				<PanelRow className='mt20'>
					<Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

				<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

				<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />

				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Item Settings', 'b-blocks')} initialOpen={false}>
				<UnitControl label={__('Min Height:', 'b-blocks')} labelPosition='left' value={itemHeight} onChange={val => setAttributes({ itemHeight: val })} units={[pxUnit, emUnit]} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={itemPadding} onChange={val => setAttributes({ itemPadding: val })} defaults={{ side: 4, top: '50px', right: '30px', bottom: '50px', left: '50px' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} shadow={itemShadow} onChange={val => setAttributes({ itemShadow: val })} defaults={{ blur: '20px', color: '#0000001a' }} />

				<BorderControl label={__('Border', 'b-blocks')} border={itemBorder} onChange={val => setAttributes({ itemBorder: val })} defaults={{ radius: '15px' }} />

				<PanelRow className='mt20'>
					<Title mt='0' mb='0'>{__('Link In:', 'b-blocks')}</Title>
					<SelectControl value={linkIn} onChange={val => { setChildAttributes({ linkIn: val }); setLinkIn(val); }} options={linkPosition} />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
				{/* Icon Settings */}
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon || childAttributes?.isIcon} onChange={val => { setChildAttributes({ isIcon: val }); setIsIcon(val); }} />

				{isIcon || childAttributes?.isIcon ? <>
					<SpaceControl className='mt20' label={__('Icon Padding:', 'b-blocks')} space={iconPadding} onChange={val => setAttributes({ iconPadding: val })} defaults={{ side: 4, bottom: '10px' }} />

					<SpaceControl className='mt20' label={__('Icon Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
				</> : ''}

				{/* Title Settings */}
				<ToggleControl className='mt35' label={__('Show Title', 'b-blocks')} checked={isTitle || childAttributes?.isTitle} onChange={val => { setChildAttributes({ isTitle: val }); setIsTitle(val); }} />

				{isTitle || childAttributes?.isTitle ? <>
					<Typography label={__('Title Typography:', 'b-blocks')} typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 23 }} />

					<SpaceControl className='mt20' label={__('Title Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '30px' }} />
				</> : ''}

				{/* Description Settings */}
				<ToggleControl className='mt35' label={__('Show Description', 'b-blocks')} checked={isDesc || childAttributes?.isDesc} onChange={val => { setChildAttributes({ isDesc: val }); setIsDesc(val); }} />

				{isDesc || childAttributes?.isDesc ? <Typography label={__('Description Typography:', 'b-blocks')} typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 16 }} /> : ''}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;