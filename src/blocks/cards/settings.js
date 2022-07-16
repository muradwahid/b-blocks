import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, ButtonGroup, Tooltip } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import Background from '../../../../Components/Background';
import BorderControl from '../../../../Components/BorderControl';
import { ImageHolderControl, ChangeImageData } from '../../../../Components/ImageControl';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';

import icons from '../../Const/icons';
import options from '../../Const/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, updateCard }) => {
	const { cards = [], columns, columnGap, rowGap, layout, textAlign, padding, imgPos, imgHeight, isCat, catTypo, catMargin, isTitle, titlePos, titleTypo, titleMargin, isDesc, descTypo } = attributes;

	const [device, setDevice] = useState('desktop');

	const addCard = () => {
		setAttributes({
			cards: [...cards, {
				background: { color: '#0000' },

				img: { id: null, url: '', alt: '', title: '' },
				imgBorder: { radius: '5px' },

				cat: `Category ${cards.length + 1}`,
				catColor: '#0dcaf0',

				title: `Card Title ${cards.length + 1}`,
				titleColor: '#ff7500',

				desc: `This content area describes card ${cards.length + 1} descriptions/details.`,
				descColor: '#333'
			}]
		});
		setActiveIndex(cards.length);
	}

	const { background = {}, img = {}, imgBorder = {}, catColor = '', titleColor = '', descColor = '' } = cards[activeIndex] || {};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/cards-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Cards', 'b-blocks')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Card No ${activeIndex + 1}:`, 'b-blocks')}</h3>

							<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateCard('background', val)} />

							<ImageHolderControl className='mt20' label={__('Image:', 'b-blocks')} img={img} onChange={val => updateCard('img', val)} />
							<ChangeImageData className='mt20' img={img} onChange={val => updateCard('img', val)} />

							<BorderControl label={__('Image Border:', 'b-blocks')} border={imgBorder} onChange={val => updateCard('imgBorder', val)} defaults={{ radius: '5px' }} />

							<BColor label={__('Category Color:', 'b-blocks')} value={catColor} onChange={val => updateCard('catColor', val)} defaultColor='#0dcaf0' />

							<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateCard('titleColor', val)} defaultColor='#ff7500' />

							<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateCard('descColor', val)} defaultColor='#333' />

							<PanelRow className='itemAction mt20 mb15'>
								<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(1 === cards.length ? null : 0 === activeIndex ? 0 : activeIndex - 1);
									setAttributes({ cards: [...cards.slice(0, activeIndex), ...cards.slice(activeIndex + 1)] });
								}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
									e.preventDefault();
									setActiveIndex(cards.length);
									setAttributes({ cards: [...cards, { ...cards[activeIndex] }] });
								}}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' />{__('Add New Card', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title mt='0'>{__('Layout:', 'b-blocks')}</Title>
							<ButtonGroup className='bPlBtnGroup'>
								<Tooltip text={__('Vertical', 'b-blocks')} position='top'>
									<Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => setAttributes({
										layout: 'vertical',
										columns: { ...columns, ['desktop']: 3 },
										textAlign: 'center',
										imgHeight: '250px'
									})}></Button>
								</Tooltip>

								<Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
									<Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => setAttributes({
										layout: 'horizontal',
										columns: { ...columns, ['desktop']: 2 },
										textAlign: 'left',
										imgHeight: '200px'
									})}></Button>
								</Tooltip>
							</ButtonGroup>
						</PanelRow>

						<PanelRow className='mt20'>
							<Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title mt='0'>{__('Image Position:', 'b-blocks')}</Title>
							<BtnGroup value={imgPos} onChange={val => setAttributes({ imgPos: val })} options={[
								{ label: 'vertical' == layout ? 'Top' : 'Left', value: 'top', icon: 'vertical' == layout ? 'TOP' : 'LEFT' },
								{ label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom', icon: 'vertical' == layout ? 'BOTTOM' : 'RIGHT' }
							]} />
						</PanelRow>

						<ToggleControl className='mt20' label={__('Show Category', 'b-blocks')} checked={isCat} onChange={val => setAttributes({ isCat: val })} />

						<ToggleControl className='mt20' label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						{isTitle && <PanelRow>
							<Title mt='0' mb='0'>{__('Title Position:', 'b-blocks')}</Title>
							<BtnGroup value={titlePos} onChange={val => setAttributes({ titlePos: val })} options={[
								{ label: 'Image', value: 'image', icon: 'IMAGE' },
								{ label: 'Content', value: 'content', icon: 'CONTENT' }
							]} />
						</PanelRow>}

						<ToggleControl className='mt20' label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Content Area', 'b-blocks')}>
						<SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '10px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={imgHeight} onChange={val => setAttributes({ imgHeight: val })} units={[pxUnit, perUnit, emUnit]} />
					</PanelBody>


					{isCat && <PanelBody className='bPlPanelBody' title={__('Category', 'b-blocks')} initialOpen={false}>
						<Typography typography={catTypo} onChange={val => setAttributes({ catTypo: val })} defaults={{ fontSize: 15 }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={catMargin} onChange={val => setAttributes({ catMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isTitle && <PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
						<Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 22 }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isDesc && <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
						<Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;