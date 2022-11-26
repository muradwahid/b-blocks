import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, SelectControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BtnGroup from '../../../../Components/BtnGroup';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import ColorsControl from '../../../../Components/ColorsControl';
import { ImageHolderControl, ChangeImageData } from '../../../../Components/ImageControl';
import BDevice from '../../../../Components/BDevice';
import BorderControl from '../../../../Components/BorderControl';
import MultiShadowControl from '../../../../Components/MultiShadowControl';
import Typography from '../../../../Components/Typography';
import SeparatorControl from '../../../../Components/SeparatorControl';
import SpaceControl from '../../../../Components/SpaceControl';

import icons from '../../utils/icons';
import options from '../../utils/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;

const themes = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Theme 1', 'b-blocks'), value: 'theme1' },
	{ label: __('Theme 2', 'b-blocks'), value: 'theme2' },
	{ label: __('Theme 3', 'b-blocks'), value: 'theme3' },
	{ label: __('Theme 4', 'b-blocks'), value: 'theme4' },
];
const layouts = [
	{ label: __('Vertical', 'b-blocks'), value: 'vertical', icon: icons.verticalLine },
	{ label: __('Horizontal', 'b-blocks'), value: 'horizontal', icon: icons.horizontalLine },
]

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
	const { members = [], columns, columnGap, rowGap, layout, theme, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isBio, bioTypo, bioMargin, isSocial, socialSize, socialIconMargin } = attributes;

	const [device, setDevice] = useState('desktop');

	const addMember = () => {
		setAttributes({
			members: [...members, {
				background: { color: '#0000' },
				border: { radius: '3px' },
				shadow: {},
				photo: { id: null, url: '', alt: '', title: '' },
				photoBorder: { radius: '50%' },
				name: 'John Smith',
				nameColor: '#333',
				title: 'Manager',
				titleColor: '#333',
				separator: { width: '20%', height: '3px', style: 'solid', color: '#777' },
				bio: 'I am a self-motivated and self-taught professional who likes to solve problems.',
				bioColor: '#333',
				social: [
					{ link: '#', icon: { class: 'fab fa-facebook-f', fontSize: 22, color: '#fff' } },
					{ link: '#', icon: { class: 'fab fa-twitter', fontSize: 22, color: '#fff' } },
					{ link: '#', icon: { class: 'fab fa-linkedin-in', fontSize: 22, color: '#fff' } }
				],
				socialIconColors: { color: '#fff', bg: '#4527a4' }
			}]
		});
		setActiveIndex(members.length);
	}

	const updateMember = (type, val, index = null) => {
		const newMember = [...members];
		newMember[Number.isInteger(index) ? index : activeIndex][type] = val;
		setAttributes({ members: newMember });
	}

	const { background = {}, border = {}, shadow = {}, photo, photoBorder = {}, nameColor = '', titleColor = '', separator = {}, bioColor = '', socialIconColors = {} } = members[activeIndex] || {};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/team-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Members', 'b-blocks')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Member ${activeIndex + 1}:`, 'b-blocks')}</h3>

							<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateMember('background', val)} />

							<BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => updateMember('border', val)} defaults={{ radius: '3px' }} />

							<MultiShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => updateMember('shadow', val)} type='box' />

							<ImageHolderControl className='mt20' label={__('Photo:', 'b-blocks')} img={photo} onChange={val => updateMember('photo', val)} />
							<ChangeImageData className='mt20' img={photo} onChange={val => updateMember('photo', val)} />

							<BorderControl label={__('Photo Border:', 'b-blocks')} border={photoBorder} onChange={val => updateMember('photoBorder', val)} defaults={{ radius: '50%' }} />

							<BColor label={__('Name Color:', 'b-blocks')} value={nameColor} onChange={val => updateMember('nameColor', val)} defaultColor='#333' />

							<BColor label={__('Designation/Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateMember('titleColor', val)} defaultColor='#333' />

							<SeparatorControl separator={separator} onChange={val => updateMember('separator', val)} defaults={{ width: '20%', height: '3px', color: '#777' }} />

							<BColor label={__('Bio Color:', 'b-blocks')} value={bioColor} onChange={val => updateMember('bioColor', val)} defaultColor='#333' />

							<ColorsControl label={__('Social Icon Colors:', 'b-blocks')} colors={socialIconColors} onChange={val => updateMember('socialIconColors', val)} defaults={{ color: '#fff', bg: '#4527a4' }} />

							<PanelRow className='itemAction mt20 mb15'>
								<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(1 === members.length ? null : 0 === activeIndex ? 0 : activeIndex - 1);
									setAttributes({ members: [...members.slice(0, activeIndex), ...members.slice(activeIndex + 1)] });
								}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(members.length);
									setAttributes({ members: [...members, { ...members[activeIndex] }] });
								}}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Member', 'b-blocks')} onClick={addMember}><Dashicon icon='plus' />{__('Add New Member', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />

						<PanelRow className='mt20'>
							<Title className=''>{__('Layout:', 'b-blocks')}</Title>
							<BtnGroup value={layout} onChange={val => {
								setAttributes({ layout: val });
								'vertical' === val && setAttributes({
									columns: { ...columns, desktop: 3, tablet: 2 },
									textAlign: 'center',
									padding: { ...padding, vertical: '50px', styles: `50px ${padding?.horizontal}` },
								})
								'horizontal' === val && setAttributes({
									columns: { ...columns, desktop: 2, tablet: 1 },
									textAlign: 'left',
									padding: { ...padding, vertical: '30px', styles: `50px ${padding?.horizontal}` },
								})
							}} options={layouts} isIcon={true} />
						</PanelRow>

						<PanelRow>
							<Title className=''>{__('Theme:', 'b-blocks')}</Title>
							<SelectControl value={theme} onChange={val => {
								setAttributes({ theme: val });
								'default' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
									photoWidth: '170px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none', styles: `${nameTypo?.styles}; font-size: 20px; text-transform: none;` },
									titleTypo: { ...titleTypo, fontSize: 16, textTransform: 'none', styles: `${titleTypo?.styles}; font-size: 16px; text-transform: none;` },
									isSep: true,
									isBio: true,
									socialSize: '22px'
								});
								'theme1' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
									photoWidth: '190px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none', styles: `${nameTypo?.styles}; font-size: 20px; text-transform: none;` },
									titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase', styles: `${titleTypo?.styles}; font-size: 14px; text-transform: uppercase;` },
									isSep: true,
									isBio: true,
									socialSize: '22px'
								});
								'theme2' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
									photoWidth: '190px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none', styles: `${nameTypo?.styles}; font-size: 20px; text-transform: none;` },
									titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase', styles: `${titleTypo?.styles}; font-size: 14px; text-transform: uppercase;` },
									isSep: true,
									isBio: false,
									socialSize: '22px'
								});
								'theme3' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
									photoWidth: '170px',
									nameTypo: { ...nameTypo, fontSize: 24, textTransform: 'none', styles: `${nameTypo?.styles}; font-size: 24px; text-transform: none;` },
									titleTypo: { ...titleTypo, fontSize: 18, textTransform: 'none', styles: `${titleTypo?.styles}; font-size: 18px; text-transform: none;` },
									isSep: false,
									isBio: false,
									socialSize: '28px'
								});
								'theme4' === val && setAttributes({
									padding: { ...padding, vertical: '15px', horizontal: '15px', styles: `15px 15px` },
									photoWidth: '100%',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'uppercase', styles: `${nameTypo?.styles}; font-size: 20px; text-transform: uppercase;` },
									titleTypo: { ...titleTypo, fontSize: 15, textTransform: 'none', styles: `${titleTypo?.styles}; font-size: 15px; text-transform: none;` },
									isSep: false,
									isBio: false,
									socialSize: '22px'
								});

								members.map((item, index) => {
									const { background, border, shadow, photoBorder, separator, socialIconColors } = item;
									'default' === val && (
										updateMember('background', { ...background, color: '#0000', styles: `${background?.styles}; background-color: #0000;` }, index),
										updateMember('border', { ...border, radius: '3px', styles: `${border?.styles}; border-radius: 3px;` }, index),
										updateMember('shadow', { ...shadow, shadow: [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }], styles: `0px 0px 0px 0px #7090b0` }, index),
										updateMember('photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%', styles: `${photoBorder?.styles}; border: 0px solid #0000; border-radius: 50%;` }, index),
										updateMember('nameColor', '#333', index),
										updateMember('titleColor', '#333', index),
										updateMember('separator', { ...separator, color: '#777', styles: `${separator?.styles}; border-top: 3px solid #777` }, index),
										updateMember('bioColor', '#333', index),
										updateMember('socialIconColors', { ...socialIconColors, color: '#fff', bg: '#4527a4', styles: `${socialIconColors?.styles}; color: #fff; background: #4527a4;` }, index)
									);
									'theme1' === val && (
										updateMember('background', { ...background, color: '#0000', styles: `${background?.styles}; background-color: #0000;` }, index),
										updateMember('border', { ...border, radius: '3px', styles: `${border?.styles}; border-radius: 3px;` }, index),
										updateMember('shadow', { ...shadow, shadow: [{ hOffset: '', vOffset: '', blur: '20px', color: '#e8edfb' }], styles: `0px 0px 20px 0px #e8edfb` }, index),
										updateMember('photoBorder', { ...photoBorder, width: '10px', color: '#e8edfb', radius: '50%', styles: `${photoBorder?.styles}; border: 10px solid #e8edfb; border-radius: 50%;` }, index),
										updateMember('nameColor', '#333', index),
										updateMember('titleColor', '#7a7a7a', index),
										updateMember('separator', { ...separator, color: '#4527a4', styles: `${separator?.styles}; border-top: 3px solid #4527a4` }, index),
										updateMember('bioColor', '#7a7a7a', index),
										updateMember('socialIconColors', { ...socialIconColors, color: '#fff', bg: '#4527a4', styles: `${socialIconColors?.styles}; color: #fff; background: #4527a4;` }, index)
									);
									'theme2' === val && (
										updateMember('background', { ...background, color: '#0000', styles: `${background?.styles}; background-color: #0000;` }, index),
										updateMember('border', { ...border, radius: '3px', styles: `${border?.styles}; border-radius: 3px;` }, index),
										updateMember('shadow', { ...shadow, shadow: [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }], styles: `0px 0px 0px 0px #7090b0` }, index),
										updateMember('photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%', styles: `${photoBorder?.styles}; border: 0px solid #0000; border-radius: 50%;` }, index),
										updateMember('nameColor', '#333', index),
										updateMember('titleColor', '#7a7a7a', index),
										updateMember('separator', { ...separator, color: '#999', styles: `${separator?.styles}; border-top: 3px solid #999` }, index),
										updateMember('bioColor', '#7a7a7a', index),
										updateMember('socialIconColors', { ...socialIconColors, color: '#4527a4', bg: '#0000', styles: `${socialIconColors?.styles}; color: #4527a4; background: #0000;` }, index)
									);
									'theme3' === val && (
										updateMember('background', { ...background, color: '#f2f3f7', styles: `${background?.styles}; background-color: #f2f3f7;` }, index),
										updateMember('border', { ...border, radius: '10px', styles: `${border?.styles}; border-radius: 10px;` }, index),
										updateMember('shadow', { ...shadow, shadow: [{ hOffset: '-10px', vOffset: '-10px', blur: '20px', color: '#f7f7f7' }, { hOffset: '10px', vOffset: '10px', blur: '20px', color: '#d7e0e8' }], styles: `-10px -10px 20px 0px #f7f7f7 , 10px 10px 20px 0px #d7e0e8` }, index),
										updateMember('photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%', styles: `${photoBorder?.styles}; border: 0px solid #0000; border-radius: 50%;` }, index),
										updateMember('nameColor', '#32285C', index),
										updateMember('titleColor', '#677592', index),
										updateMember('separator', { ...separator, color: '#777', styles: `${separator?.styles}; border-top: 3px solid #777` }, index),
										updateMember('bioColor', '#333', index),
										updateMember('socialIconColors', { ...socialIconColors, color: '#677592', bg: '#0000', styles: `${socialIconColors?.styles}; color: #677592; background: #0000;` }, index)
									);
									'theme4' === val && (
										updateMember('background', { ...background, color: '#4527a4', styles: `${background?.styles}; background-color: #4527a4;` }, index),
										updateMember('border', { ...border, radius: '0px', styles: `${border?.styles}; border-radius: 0px;` }, index),
										updateMember('shadow', { ...shadow, shadow: [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }], styles: `0px 0px 0px 0px #7090b0` }, index),
										updateMember('photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '0px', styles: `${photoBorder?.styles}; border: 0px solid #0000; border-radius: 0px;` }, index),
										updateMember('nameColor', '#fff', index),
										updateMember('titleColor', '#fff', index),
										updateMember('separator', { ...separator, color: '#777', styles: `${separator?.styles}; border-top: 3px solid #777` }, index),
										updateMember('bioColor', '#fff', index),
										updateMember('socialIconColors', { ...socialIconColors, color: '#4527a4', bg: '#fff', styles: `${socialIconColors?.styles}; color: #4527a4; background: #fff;` }, index)
									);
								});
							}} options={themes} />
						</PanelRow>
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Member', 'b-blocks')} initialOpen={false}>
						<SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Photo', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={photoWidth} onChange={val => setAttributes({ photoWidth: val })} units={[pxUnit, perUnit, emUnit]} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={photoMargin} onChange={val => setAttributes({ photoMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Name', 'b-blocks')} initialOpen={false}>
						<Typography typography={nameTypo} onChange={val => setAttributes({ nameTypo: val })} defaults={{ fontSize: 20, fontWeight: 600 }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={nameMargin} onChange={val => setAttributes({ nameMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Designation/Title', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						{isTitle && <>
							<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 16 }} />

							<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

						{isSep && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '15px' }} />}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Bio', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Bio', 'b-blocks')} checked={isBio} onChange={val => setAttributes({ isBio: val })} />

						{isBio && <>
							<Typography typography={bioTypo} onChange={val => setAttributes({ bioTypo: val })} defaults={{ fontSize: 15 }} />

							<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={bioMargin} onChange={val => setAttributes({ bioMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
						</>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Social', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Social', 'b-blocks')} checked={isSocial} onChange={val => setAttributes({ isSocial: val })} />

						{isSocial && <>
							<UnitControl label={__('Icon Size:', 'b-blocks')} labelPosition='left' value={socialSize} onChange={val => setAttributes({ socialSize: val })} units={[pxUnit, perUnit, emUnit]} />

							<SpaceControl className='mt20' label={__('Icon Margin:', 'b-blocks')} space={socialIconMargin} onChange={val => setAttributes({ socialIconMargin: val })} defaults={{ vertical: '10px', horizontal: '10px' }} />
						</>}
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Member', 'b-blocks')} onClick={addMember}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;