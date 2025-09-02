import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, SelectControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Device, BtnGroup, Typography, HelpPanel, ItemsPanel } from '../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';
import { primaryColor } from '../../../../../../bpl-tools/utils/data';

import { pluginSlug, teamMembersDocs } from '../../../../utils/data';
import { horizontalLineIcon, verticalLineIcon } from '../../../../utils/icons';
import { aligns, generalStyleTabs } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const themes = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Theme 1', 'b-blocks'), value: 'theme1' },
	{ label: __('Theme 2', 'b-blocks'), value: 'theme2' },
	{ label: __('Theme 3', 'b-blocks'), value: 'theme3' },
	{ label: __('Theme 4', 'b-blocks'), value: 'theme4' },
];
const layouts = [
	{ label: __('Vertical', 'b-blocks'), value: 'vertical', icon: verticalLineIcon },
	{ label: __('Horizontal', 'b-blocks'), value: 'horizontal', icon: horizontalLineIcon },
]

const Settings = ({ attributes, setAttributes, updateMember, activeIndex, setActiveIndex, isPremium, device }) => {
	const { members = [], columns, columnGap, rowGap, layout, theme, isLinkNewTab, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isBio, bioTypo, bioMargin, isSocial, socialSize, socialIconMargin } = attributes;

	const addMember = () => {
		return {
			background:{ color: '#0000' },
			border:{ radius: '3px' },
			shadow:[],
			photo: { id: null, url: '', alt: '', title: '' },
			photoBorder:{ radius: '50%' },
			name: 'John Smith',
			nameColor:'#333',
			title: 'Manager',
			titleColor:'#333',
			separator:{ width: '20%', height: '3px', style: 'solid', color: '#777' },
			bio: 'I am a self-motivated and self-taught professional who likes to solve problems.',
			bioColor:'#333',
			social: [
				{ link: '#', icon: { class: 'fab fa-facebook-f', fontSize: 22, color: '#fff' } },
				{ link: '#', icon: { class: 'fab fa-twitter', fontSize: 22, color: '#fff' } },
				{ link: '#', icon: { class: 'fab fa-linkedin-in', fontSize: 22, color: '#fff' } }
			],
			socialIconColors:{ color: '#fff', bg: primaryColor }
		}
	}

	const updateAllMembers = (params) => {
		const newMembers = produce(members, draft => {
			draft.map((_, index) => {
				for (const param of params) {
					const type = param[0];
					const value = param[1];

					draft[index][type] = value;
				}
			});
		});
		setAttributes({ members: newMembers });
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink={teamMembersDocs} />

					<PanelBody className='bPlPanelBody' title={__('Add or Remove Members', 'b-blocks')}>

						<ItemsPanel
							attributes={attributes}
							setAttributes={setAttributes}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							updateMember={updateMember}
							arrKey='members'
							ItemSettings={ItemSettings}
							itemLabel='Team Member'
							newItem={addMember()}
							design={isPremium ? 'sortable' : 'single'}
						/>
						{!isPremium && <small> <b><a href="https://bblockswp.com/#pricing" target='__blank'>Upgrade to Premium</a></b> to unlock sorting and more features.</small>}

					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<Device />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<PanelRow className='mt20'>
							<Label className=''>{__('Layout:', 'b-blocks')}</Label>
							<BtnGroup value={layout} onChange={val => {
								setAttributes({ layout: val });
								'vertical' === val && setAttributes({
									columns: { ...columns, desktop: 3, tablet: 2 },
									textAlign: 'center',
									padding: { ...padding, vertical: '50px' },
								})
								'horizontal' === val && setAttributes({
									columns: { ...columns, desktop: 2, tablet: 1 },
									textAlign: 'left',
									padding: { ...padding, vertical: '30px' },
								})
							}} options={layouts} isIcon={true} />
						</PanelRow>

						<PanelRow>
							<Label className=''>{__('Theme:', 'b-blocks')}</Label>
							<SelectControl value={theme} onChange={val => {
								setAttributes({ theme: val });
								'default' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px' },
									photoWidth: '170px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none' },
									titleTypo: { ...titleTypo, fontSize: 16, textTransform: 'none' },
									isSep: true,
									isBio: true,
									socialSize: '22px'
								});
								'theme1' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px' },
									photoWidth: '190px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none' },
									titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase' },
									isSep: true,
									isBio: true,
									socialSize: '22px'
								});
								'theme2' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px' },
									photoWidth: '190px',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'none' },
									titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase' },
									isSep: true,
									isBio: false,
									socialSize: '22px'
								});
								'theme3' === val && setAttributes({
									padding: { ...padding, vertical: '50px', horizontal: '20px' },
									photoWidth: '170px',
									nameTypo: { ...nameTypo, fontSize: 24, textTransform: 'none' },
									titleTypo: { ...titleTypo, fontSize: 18, textTransform: 'none' },
									isSep: false,
									isBio: false,
									socialSize: '28px'
								});
								'theme4' === val && setAttributes({
									padding: { ...padding, vertical: '15px', horizontal: '15px' },
									photoWidth: '100%',
									nameTypo: { ...nameTypo, fontSize: 20, textTransform: 'uppercase' },
									titleTypo: { ...titleTypo, fontSize: 15, textTransform: 'none' },
									isSep: false,
									isBio: false,
									socialSize: '22px'
								});

								members.map(member => {
									const { background, border, photoBorder, separator, socialIconColors } = member;

									const defaultParams = [
										['background', { ...background, color: '#0000' }],
										['border', { ...border, radius: '3px' }],
										['shadow', [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }]],
										['photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%' }],
										['nameColor', '#333'],
										['titleColor', '#333'],
										['separator', { ...separator, color: '#777' }],
										['bioColor', '#333'],
										['socialIconColors', { ...socialIconColors, color: '#fff', bg: primaryColor }]
									];
									const theme1Params = [
										['background', { ...background, color: '#0000' }],
										['border', { ...border, radius: '3px' }],
										['shadow', [{ hOffset: '', vOffset: '', blur: '20px', color: '#e8edfb' }]],
										['photoBorder', { ...photoBorder, width: '10px', color: '#e8edfb', radius: '50%' }],
										['nameColor', '#333'],
										['titleColor', '#7a7a7a'],
										['separator', { ...separator, color: primaryColor }],
										['bioColor', '#7a7a7a'],
										['socialIconColors', { ...socialIconColors, color: '#fff', bg: primaryColor }]
									];
									const theme2Params = [
										['background', { ...background, color: '#0000' }],
										['border', { ...border, radius: '3px' }],
										['shadow', [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }]],
										['photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%' }],
										['nameColor', '#333'],
										['titleColor', '#7a7a7a'],
										['separator', { ...separator, color: '#999' }],
										['bioColor', '#7a7a7a'],
										['socialIconColors', { ...socialIconColors, color: primaryColor, bg: '#0000' }]
									];
									const theme3Params = [
										['background', { ...background, color: '#f2f3f7' }],
										['border', { ...border, radius: '10px' }],
										['shadow', [{ hOffset: '-10px', vOffset: '-10px', blur: '20px', color: '#f7f7f7' }, { hOffset: '10px', vOffset: '10px', blur: '20px', color: '#d7e0e8' }]],
										['photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%' }],
										['nameColor', '#32285C'],
										['titleColor', '#677592'],
										['separator', { ...separator, color: '#777' }],
										['bioColor', '#333'],
										['socialIconColors', { ...socialIconColors, color: '#677592', bg: '#0000' }]
									];
									const theme4Params = [
										['background', { ...background, color: primaryColor }],
										['border', { ...border, radius: '0px' }],
										['shadow', [{ hOffset: '', vOffset: '', blur: '0px', color: '#7090b0' }]],
										['photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '0px' }],
										['nameColor', '#fff'],
										['titleColor', '#fff'],
										['separator', { ...separator, color: '#777' }],
										['bioColor', '#fff'],
										['socialIconColors', { ...socialIconColors, color: primaryColor, bg: '#fff' }]
									];

									'default' === val && updateAllMembers(defaultParams);
									'theme1' === val && updateAllMembers(theme1Params);
									'theme2' === val && updateAllMembers(theme2Params);
									'theme3' === val && updateAllMembers(theme3Params);
									'theme4' === val && updateAllMembers(theme4Params);
								});
							}} options={themes} />
						</PanelRow>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

						<ToggleControl className='mt10' label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

						<ToggleControl className='mt10' label={__('Show Bio', 'b-blocks')} checked={isBio} onChange={val => setAttributes({ isBio: val })} />

						<ToggleControl className='mt10' label={__('Show Social', 'b-blocks')} checked={isSocial} onChange={val => setAttributes({ isSocial: val })} />

						<ToggleControl className='mt10' label={__('Open Link in New Tab', 'b-blocks')} checked={isLinkNewTab} onChange={val => setAttributes({ isLinkNewTab: val })} />
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Member', 'b-blocks')}>
						<PanelRow>
							<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
							<BtnGroup value={textAlign} onChange={val => setAttributes({ textAlign: val })} options={aligns.filter(a => 'justify' !== a.value)} isIcon={true} />
						</PanelRow>

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Photo', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={photoWidth} onChange={val => setAttributes({ photoWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={photoMargin} onChange={val => setAttributes({ photoMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Member Name', 'b-blocks')} initialOpen={false}>
						<Typography value={nameTypo} onChange={val => setAttributes({ nameTypo: val })} defaults={{ fontSize: { desktop: 20, tablet: 18, mobile: 16 }, fontWeight: 600 }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={nameMargin} onChange={val => setAttributes({ nameMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>


					{isTitle && <PanelBody className='bPlPanelBody' title={__('Designation/Title', 'b-blocks')} initialOpen={false}>
						<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
					</PanelBody>}


					{isSep && <PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
					</PanelBody>}


					{isBio && <PanelBody className='bPlPanelBody' title={__('Member Bio', 'b-blocks')} initialOpen={false}>
						<Typography value={bioTypo} onChange={val => setAttributes({ bioTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

						<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={bioMargin} onChange={val => setAttributes({ bioMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
					</PanelBody>}


					{isSocial && <PanelBody className='bPlPanelBody' title={__('Member Social', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Icon Size:', 'b-blocks')} labelPosition='left' value={socialSize} onChange={val => setAttributes({ socialSize: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<SpaceControl className='mt20' label={__('Icon Margin:', 'b-blocks')} value={socialIconMargin} onChange={val => setAttributes({ socialIconMargin: val })} defaults={{ vertical: '10px', horizontal: '10px' }} />
					</PanelBody>}
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Member', 'b-blocks')} onClick={()=>{
					const addNewMember = [...members,addMember()];
					setAttributes({members:addNewMember});
					setActiveIndex(members.length);
				}}><Dashicon icon='plus' /></ToolbarButton>
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