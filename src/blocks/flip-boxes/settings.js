
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, TabPanel, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import ShadowControl from '../../../../Components/ShadowControl';
import BorderControl from '../../../../Components/BorderControl';
import ColorsControl from '../../../../Components/ColorsControl';
import IconControl from '../../../../Components/IconControl';
import Background from '../../../../Components/Background';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';

import icons from '../../utils/icons';
import options from '../../utils/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;
const frontBackTab = [
	{ name: 'front', title: __('Front', 'b-blocks') },
	{ name: 'back', title: __('Back', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
	const { boxes = [], columns, columnGap, rowGap, boxHeight, textAlign, boxPadding, isIcon, iconMargin, titleTypo, titleMargin, isDesc, descTypo, isBtn, isLinkNewTab, btnTypo, btnPadding } = attributes;

	const [device, setDevice] = useState('desktop');

	const addFlipBox = () => {
		setAttributes({
			boxes: [...boxes, {
				frontBG: {},
				backBG: {},
				border: {},
				shadow: {},
				frontIcon: {
					class: 'fa fa-sync-alt',
					fontSize: 70,
					color: '#fff'
				},
				backIcon: {
					class: 'fab fa-wordpress',
					fontSize: 70,
					color: '#fff'
				},
				frontTitle: `Front Title ${boxes.length + 1}`,
				frontTitleColor: '#fff',
				backTitle: `Back Title ${boxes.length + 1}`,
				backTitleColor: '#fff',
				desc: `This content area describes flip box ${boxes.length + 1} descriptions/details.`,
				descColor: '#fff',
				btn: `Button ${boxes.length + 1}`,
				btnLink: '#',
				btnBorder: {
					radius: '3px'
				},
				btnColors: {
					color: '#fff',
					bg: '#ff4500'
				},
				btnHovColors: {
					color: '#fff',
					bg: '#ff7500'
				}
			}]
		});
		setActiveIndex(boxes.length);
	}

	const updateFlipBox = (type, val) => {
		const newBoxes = [...boxes];
		newBoxes[activeIndex][type] = val;
		setAttributes({ boxes: newBoxes });
		setActiveIndex(activeIndex);
	}

	const { frontBG = {}, backBG = {}, border = {}, shadow = {}, frontIcon = {}, backIcon = {}, frontTitle = '', frontTitleColor = '', backTitle = '', backTitleColor = '', desc = '', descColor = '', btn = '', btnLink = '', btnBorder = {}, btnColors = {}, btnHovColors = {} } = boxes[activeIndex] || {};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' == tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
						{/* <div className='helpItem'>
							<a href='https://bblockswp.com/docs/flip-box-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div> */}

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Boxes', 'b-blocks')}>
						{null !== activeIndex && <PanelBody className='bPlPanelBody editItem' title={__(`Flip Box No ${activeIndex + 1}:`, 'b-blocks')}>
							<PanelBody className='bPlPanelBody' title={__('Box Settings', 'b-blocks')}>
								<BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => updateFlipBox('border', val)} />

								<ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => updateFlipBox('shadow', val)} />
							</PanelBody>

							<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={frontBackTab}>{tab => <>
								{'front' == tab.name && <>
									<PanelBody className='bPlPanelBody' title={__('Front Box', 'b-blocks')}>
										<Background label={__('Background:', 'b-blocks')} background={frontBG} onChange={val => updateFlipBox('frontBG', val)} />
									</PanelBody>

									{isIcon && <PanelBody className='bPlPanelBody' title={__('Front Icon', 'b-blocks')} initialOpen={false}>
										<IconControl icon={frontIcon} onChange={val => updateFlipBox('frontIcon', val)} defaults={{ class: 'fa fa-sync-alt', fontSize: 70, color: '#fff' }} />
									</PanelBody>}

									<PanelBody className='bPlPanelBody' title={__('Front Title', 'b-blocks')} initialOpen={false}>
										<Title className='mb5'>{__('Text:', 'b-blocks')}</Title>
										<TextControl value={frontTitle} onChange={val => updateFlipBox('frontTitle', val)} />

										<BColor label={__('Color:', 'b-blocks')} value={frontTitleColor} onChange={val => updateFlipBox('frontTitleColor', val)} defaultColor='#fff' />
									</PanelBody>

									<PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
										<Title className='mb5'>{__('Text:', 'b-blocks')}</Title>
										<TextareaControl value={desc} onChange={val => updateFlipBox('desc', val)} />

										<BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => updateFlipBox('descColor', val)} defaultColor='#fff' />
									</PanelBody>
								</>}

								{'back' == tab.name && <>
									<PanelBody className='bPlPanelBody' title={__('Back Box', 'b-blocks')}>
										<Background label={__('Background:', 'b-blocks')} background={backBG} onChange={val => updateFlipBox('backBG', val)} />
									</PanelBody>

									{isIcon && <PanelBody className='bPlPanelBody' title={__('Back Icon', 'b-blocks')} initialOpen={false}>
										<IconControl icon={backIcon} onChange={val => updateFlipBox('backIcon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 70, color: '#fff' }} />
									</PanelBody>}

									<PanelBody className='bPlPanelBody' title={__('Back Title', 'b-blocks')} initialOpen={false}>
										<Title className='mb5'>{__('Text:', 'b-blocks')}</Title>
										<TextControl value={backTitle} onChange={val => updateFlipBox('backTitle', val)} />

										<BColor label={__('Color:', 'b-blocks')} value={backTitleColor} onChange={val => updateFlipBox('backTitleColor', val)} defaultColor='#fff' />
									</PanelBody>

									<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
										<Title className='mb5'>{__('Text:', 'b-blocks')}</Title>
										<TextControl value={btn} onChange={val => updateFlipBox('btn', val)} />

										<Title>{__('Link:', 'b-blocks')}</Title>
										<TextControl value={btnLink} onChange={val => updateFlipBox('btnLink', val)} />

										<BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => updateFlipBox('btnBorder', val)} defaults={{ radius: '3px' }} />

										<ColorsControl colors={btnColors} onChange={val => updateFlipBox('btnColors', val)} defaults={{ color: '#fff', bg: '#ff4500' }} />

										<ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnHovColors} onChange={val => updateFlipBox('btnHovColors', val)} defaults={{ color: '#fff', bg: '#ff7500' }} />
									</PanelBody>
								</>}
							</>}</TabPanel>

							<PanelRow className='itemAction mt20'>
								<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(1 === boxes.length ? null : 0 === activeIndex ? 0 : activeIndex - 1);
									setAttributes({ boxes: [...boxes.slice(0, activeIndex), ...boxes.slice(activeIndex + 1)] });
								}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(boxes.length);
									setAttributes({ boxes: [...boxes, { ...boxes[activeIndex] }] });
								}}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</PanelBody>}

						<div className='addItem'>
							<Button label={__('Add New Flip Box', 'b-blocks')} onClick={addFlipBox}><Dashicon icon='plus' />{__('Add New Flip Box', 'b-blocks')}</Button>
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
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

						<ToggleControl className='mt20' label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

						<ToggleControl className='mt20' label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

						{isBtn && <ToggleControl label={__('Link in New Tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />}
					</PanelBody>
				</>}


				{'style' == tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Box', 'b-blocks')}>
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit, emUnit]} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={boxPadding} onChange={val => setAttributes({ boxPadding: val })} defaults={{ vertical: '30px', horizontal: '25px' }} />
					</PanelBody>


					{isIcon && <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
						<SpaceControl label={__('Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
					</PanelBody>}


					<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
						<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25 }} />

						{titleTypo && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '20px' }} />}
					</PanelBody>


					{isDesc && <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
						<Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 16 }} />
					</PanelBody>}


					{isBtn && <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
						<Typography typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 20 }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '15px', horizontal: '25px' }} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Box', 'b-blocks')} onClick={addFlipBox}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;