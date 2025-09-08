
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, TabPanel, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { Label, Device, Typography, HelpPanel, ItemsPanel } from '../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import { generalStyleTabs } from '../../../../utils/options';

import { pluginSlug, pricingPage } from '../../../../utils/data';
import ItemSettings from './ItemSettings';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, isPremium, device }) => {
	const { boxes = [], columns, columnGap, rowGap, boxHeight, textAlign, boxPadding, isIcon, iconMargin, titleTypo, titleMargin, isDesc, descTypo, isBtn, isLinkNewTab, btnTypo, btnPadding } = attributes;

	const addFlipBox = {
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
			class: 'fa-brands fa-wordpress',
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
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' == tab.name && <>
					<HelpPanel slug={pluginSlug} />


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Boxes', 'b-blocks')}>


						<ItemsPanel
							attributes={attributes}
							setAttributes={setAttributes}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							arrKey='boxes'
							ItemSettings={ItemSettings}
							itemLabel='Flip Box'
							newItem={addFlipBox}
							// design={isPremium ? 'sortable' : 'single'}
							design={isPremium ? 'sortable' : 'single'}
						/>
						{!isPremium && <small> <b><a href={pricingPage} target='__blank'>Upgrade to Premium</a></b> to unlock sorting and more features.</small>}

					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<Device />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
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
						<UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit(), emUnit()]} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={boxPadding} onChange={val => setAttributes({ boxPadding: val })} defaults={{ vertical: '30px', horizontal: '25px' }} />
					</PanelBody>


					{isIcon && <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
						<SpaceControl label={__('Margin:', 'b-blocks')} value={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
					</PanelBody>}


					<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
						<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 25, tablet: 22, mobile: 20 } }} />

						{titleTypo && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '20px' }} />}
					</PanelBody>


					{isDesc && <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
						<Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} />
					</PanelBody>}


					{isBtn && <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
						<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 20, tablet: 18, mobile: 16 } }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '15px', horizontal: '25px' }} />
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
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Settings);