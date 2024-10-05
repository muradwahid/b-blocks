import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

import { Label, Background, BColor, BDevice, BorderControl, BtnGroup, HelpPanel, InlineDetailMediaUpload, SpaceControl, Typography } from '../../../../../../Components';
import { BControlPro, SelectControlPro } from '../../../../../../Components/Pro';
import { tabController } from '../../../../../../Components/utils/functions';
import { gearIcon } from '../../../../../../Components/utils/icons';
import { pxUnit, perUnit, emUnit } from '../../../../../../Components/utils/options';

import ProModal from '../../../../backend/ProModal/ProModal';
import { pluginSlug } from '../../../../utils/data';
import { horizontalLineIcon, verticalLineIcon } from '../../../../utils/icons';
import { generalStyleTabs } from '../../../../utils/options';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, updateCard, isPremium }) => {
	const { cards = [], columns, columnGap, rowGap, layout, link = {}, textAlign, padding, imgPos, imgHeight, isCat, catTypo, catMargin, isTitle, titlePos, titleTypo, titleMargin, isDesc, descTypo } = attributes;
	const { target: linkTarget = '_self', element: linkElement = 'card' } = link;

	const [device, setDevice] = useState('desktop');
	const [isProModal, setIsProModal] = useState(false);

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

	const duplicateCard = e => {
		e.preventDefault();

		setAttributes({ cards: [...cards.slice(0, activeIndex), { ...cards[activeIndex] }, ...cards.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removeCard = e => {
		e.preventDefault();

		setAttributes({ cards: [...cards.slice(0, activeIndex), ...cards.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const premiumProps = {
		isPremium,
		setOpen: setIsProModal
	};

	const { background = {}, img = {}, imgBorder = {}, catColor = '', titleColor = '', descColor = '', link: cardLink = '' } = cards[activeIndex] || [{}];

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} />


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Cards', 'b-blocks')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Card No ${activeIndex + 1}:`, 'b-blocks')}</h3>

							<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateCard('background', val)} />

							<Label>{__('Image:', 'b-blocks')}</Label>
							<InlineDetailMediaUpload value={img} onChange={val => updateCard('img', val)} placeholder={__('Enter Image URL', 'b-blocks')} />

							<BorderControl label={__('Image Border:', 'b-blocks')} value={imgBorder} onChange={val => updateCard('imgBorder', val)} defaults={{ radius: '5px' }} />

							<BColor label={__('Category Color:', 'b-blocks')} value={catColor} onChange={val => updateCard('catColor', val)} defaultColor='#0dcaf0' />

							<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateCard('titleColor', val)} defaultColor='#ff7500' />

							<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateCard('descColor', val)} defaultColor='#333' />

							<TextControl className='mt10' label={__('Link:', 'b-blocks')} value={cardLink} onChange={val => updateCard('link', val)} />
							<span>{__('Insert the link if you want; otherwise, leave it blank.', 'b-blocks')}</span>

							<PanelRow className='itemAction mt20 mb15'>
								{1 < cards?.length && <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removeCard}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>}

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicateCard}>{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' />{__('Add New Card', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Layout:', 'b-blocks')}</Label>

							<BtnGroup value={layout} onChange={val => setAttributes({
								layout: val,
								columns: { ...columns, ['desktop']: 'vertical' === val ? 3 : 2 },
								textAlign: 'vertical' === val ? 'center' : 'left',
								imgHeight: 'vertical' === val ? '250px' : '200px'
							})} options={[
								{ label: 'Vertical', value: 'vertical', icon: verticalLineIcon },
								{ label: 'Horizontal', value: 'horizontal', icon: horizontalLineIcon }
							]} isIcon={true} />
						</PanelRow>

						<PanelRow className='mt20'>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className='mb5'>{__('Image Position:', 'b-blocks')}</Label>
							<BtnGroup value={imgPos} onChange={val => setAttributes({ imgPos: val })} options={[
								{ label: 'vertical' == layout ? 'Top' : 'Left', value: 'top', icon: 'vertical' == layout ? 'TOP' : 'LEFT' },
								{ label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom', icon: 'vertical' == layout ? 'BOTTOM' : 'RIGHT' }
							]} />
						</PanelRow>

						<ToggleControl className='mt20' label={__('Show Category', 'b-blocks')} checked={isCat} onChange={val => setAttributes({ isCat: val })} />

						<ToggleControl className='mt20' label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						{isTitle && <PanelRow>
							<Label className=''>{__('Title Position:', 'b-blocks')}</Label>
							<BtnGroup value={titlePos} onChange={val => setAttributes({ titlePos: val })} options={[
								{ label: 'Image', value: 'image', icon: 'IMAGE' },
								{ label: 'Content', value: 'content', icon: 'CONTENT' }
							]} />
						</PanelRow>}

						<ToggleControl className='mt20' label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Link', 'b-blocks')} initialOpen={false}>
						<BControlPro label={__('Open link in new tab?', 'b-blocks')} checked={'_blank' === linkTarget ? true : false} onChange={val => setAttributes({ link: { ...link, target: val ? '_blank' : '_self' } })} {...premiumProps} Component={ToggleControl} />

						<SelectControlPro className='mt20' label={__('Link to:', 'b-blocks')} labelPosition='left' value={linkElement} onChange={val => setAttributes({ link: { ...link, element: val } })}
							options={[
								{ label: 'Card', value: 'card' },
								{ label: 'Image', value: 'image' },
								{ label: 'Title', value: 'title' }
							]}
							proValues={['image', 'title']}
							{...premiumProps}
						/>
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Content Area', 'b-blocks')}>
						<SpaceControl label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '10px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={imgHeight} onChange={val => setAttributes({ imgHeight: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>


					{isCat && <PanelBody className='bPlPanelBody' title={__('Category', 'b-blocks')} initialOpen={false}>
						<Typography value={catTypo} onChange={val => setAttributes({ catTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={catMargin} onChange={val => setAttributes({ catMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isTitle && <PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
						<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isDesc && <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
						<Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModal={isProModal} setIsProModal={setIsProModal} block='Cards'>
			<li>&emsp;<strong>{__('Link Target: ', 'b-blocks')}</strong>{__('Set the card link target.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Link Element: ', 'b-blocks')}</strong>{__('Choose the link element you want to link to.', 'b-blocks')}</li>
		</ProModal>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Card', 'b-blocks')} onClick={addCard}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;