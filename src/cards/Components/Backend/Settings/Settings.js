import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { Label, Device, BtnGroup, HelpPanel, Typography, ItemsPanel } from '../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro, SelectControlPro } from '../../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import ProModal from '../../../../backend/ProModal/ProModal';
import { pluginSlug, pricingPage } from '../../../../utils/data';
import { horizontalLineIcon, verticalLineIcon } from '../../../../utils/icons';
import { generalStyleTabs } from '../../../../utils/options';

import { verticalAlignments } from '../../../utils/options';

import ItemSettings from './ItemSettings';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, isPremium, device }) => {
	const { cards = [], columns, columnGap, rowGap, layout, link = {}, textAlign, padding, imgPos, imgHeight, isCat, catTypo, catMargin, isTitle, titlePos, titleTypo, titleMargin, isDesc, descTypo, imgWidth, imgAlign } = attributes;
	const { target: linkTarget = '_self', element: linkElement = 'card' } = link;
	const [isProModalOpen, setIsProModalOpen] = useState(false);

	// const addCard = () => {
	// 	setAttributes({
	// 		cards: [...cards, {
	// 			background: { color: '#0000' },

	// 			img: { id: null, url: '', alt: '', title: '' },
	// 			imgBorder: { radius: '5px' },

	// 			cat: `Category ${cards.length + 1}`,
	// 			catColor: '#0dcaf0',

	// 			title: `Card Title ${cards.length + 1}`,
	// 			titleColor: '#ff7500',

	// 			desc: `This content area describes card ${cards.length + 1} descriptions/details.`,
	// 			descColor: '#333'
	// 		}]
	// 	});
	// 	setActiveIndex(cards.length);
	// }


	const addCard = {
		background: { color: '#0000' },

		img: { id: null, url: '', alt: '', title: '' },
		imgBorder: { radius: '5px' },

		cat: `Category ${cards.length + 1}`,
		catColor: '#0dcaf0',

		title: `Card Title ${cards.length + 1}`,
		titleColor: '#ff7500',

		desc: `This content area describes card ${cards.length + 1} descriptions/details.`,
		descColor: '#333'
	}


	const premiumProps = {
		isPremium,
		setIsProModalOpen
	};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} />


					<PanelBody className='bPlPanelBody' title={__('Add or Remove Cards', 'b-blocks')}>
						<ItemsPanel
							attributes={attributes}
							setAttributes={setAttributes}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							arrKey='cards'
							title='title'
							ItemSettings={ItemSettings}
							itemLabel='Card'
							newItem={addCard}
							design={isPremium ? 'sortable':'single'}
						/>
						{!isPremium && <small> <b><a href={pricingPage} target='__blank'>Upgrade to Premium</a></b> to unlock sorting and more features.</small>}

					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Layout:', 'b-blocks')}</Label>

							<BtnGroup value={layout} onChange={val => setAttributes({
								layout: val,
								columns: { ...columns, ['desktop']: 'vertical' === val ? 3 : 2 },
								textAlign: 'vertical' === val ? 'center' : 'left',
								imgHeight: 'vertical' === val ? '250px' : '200px',
								imgWidth: 'vertical' === val ? '90%' : '50%'
							})} options={[
								{ label: 'Vertical', value: 'vertical', icon: verticalLineIcon },
								{ label: 'Horizontal', value: 'horizontal', icon: horizontalLineIcon }
							]} isIcon={true} />
						</PanelRow>
						<small>{__('Some options will be change when you change the layout.', 'b-blocks')}</small>

						<PanelRow className='mt20'>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<Device />
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

						<UnitControl className='mt10' label={__('Width:', 'b-blocks')} labelPosition='left' value={imgWidth} onChange={val => setAttributes({ imgWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						{layout === 'vertical' && <BtnGroup className='mt20' label={__('Alignment', 'b-blocks')} value={imgAlign} onChange={val => setAttributes({ imgAlign: val })} options={verticalAlignments} isIcon={true} />}
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


		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Cards'>
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
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Settings);