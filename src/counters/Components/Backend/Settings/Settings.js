import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, RangeControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Dashicon, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Background, Device, HelpPanel, Typography, ItemsPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl, ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';
import { primaryColor } from '../../../../../../bpl-tools/utils/data';

import { pluginSlug, countersDocs, pricingPage } from '../../../../utils/data';
import { generalStyleTabs } from '../../../../utils/options';
import { themes, iconPositions, sepChars } from '../../../utils/options';

import ItemSettings from './ItemSettings';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, isPremium, device }) => {
	const { counters = [], theme, columns, columnGap, rowGap, duration, separator, background, padding, counterWidth, counterHeight, textAlign, isIcon, iconSize, iconPosition, numberTypo, isLabel, labelTypo, counterPadding, counterBorder, counterShadow } = attributes;

	const addCounter = {
		background: { color: primaryColor },
		icon: { class: 'fa fa-award', fontSize: 50, color: '#fff' },
		number: { start: 0, end: 300, prefix: '', suffix: '', color: '#fff' },
		label: { text: 'Awards', color: '#fff' }
	}



	const updateAllCounters = (params) => {
		const newCounters = produce(counters, draft => {
			draft.map((_, index) => {
				for (const param of params) {
					const type = param[0];
					const value = param[1];

					draft[index][type] = value;
				}
			});
		});
		setAttributes({ counters: newCounters });
	}


	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink={countersDocs} />


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove counters', 'b-blocks')}>
						<ItemsPanel
							attributes={attributes}
							setAttributes={setAttributes}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							arrKey='counters'
							ItemSettings={ItemSettings}
							itemLabel='Counter'
							newItem={addCounter}
							design={isPremium ? 'sortable' : 'single'}
						/>
						{!isPremium && <small> <b><a href={pricingPage} target='__blank'>Upgrade to Premium</a></b> to unlock sorting and more features.</small>}
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Theme:', 'b-blocks')}</Label>
							<SelectControl value={theme} onChange={val => {
								setAttributes({ theme: val });
								'default' === val && setAttributes({
									background: { ...background, type: 'solid', color: '#0000' },
									padding: { ...padding, vertical: '20px', horizontal: '0px' },
									counterHeight: '250px',
									counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%' },
									iconPosition: 'top',
									iconSize: 50
								});
								'theme1' === val && setAttributes({
									background: { ...background, type: 'solid', color: '#0000' },
									padding: { ...padding, vertical: '20px', horizontal: '0px' },
									counterHeight: '175px',
									counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '5px' },
									iconPosition: 'label',
									iconSize: labelTypo?.fontSize
								});
								'theme2' === val && setAttributes({
									background: { ...background, type: 'solid', color: '#0000' },
									padding: { ...padding, vertical: '20px', horizontal: '0px' },
									counterHeight: '175px',
									counterBorder: { ...counterBorder, width: '2px', color: primaryColor, radius: '5px' },
									iconPosition: 'label',
									iconSize: labelTypo?.fontSize
								});
								'theme3' === val && setAttributes({
									background: { ...background, type: 'image', image: { url: 'https://i.imgur.com/n8bbzIE.jpeg' }, overlayColor: '#000000b3' },
									padding: { ...padding, vertical: '140px', horizontal: '0px' },
									counterHeight: '250px',
									counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%' },
									iconPosition: 'top',
									iconSize: 50
								});

								counters?.map(member => {
									const { background, icon, number, label } = member;

									const defaultParams = [
										['background', { ...background, type: 'solid', color: primaryColor }],
										['icon', { ...icon, color: '#fff' }],
										['number', { ...number, color: '#fff' }],
										['label', { ...label, color: '#fff' }]
									];
									const theme1Params = [
										['background', { ...background, type: 'solid', color: primaryColor }],
										['icon', { ...icon, color: '#fff' }],
										['number', { ...number, color: '#fff' }],
										['label', { ...label, color: '#fff' }]
									];
									const theme2Params = [
										['background', { ...background, type: 'solid', color: '#0000' }],
										['icon', { ...icon, color: primaryColor }],
										['number', { ...number, color: primaryColor }],
										['label', { ...label, color: primaryColor }]
									];
									const theme3Params = [
										['background', { ...background, type: 'solid', color: '#0000' }],
										['icon', { ...icon, color: '#fff' }],
										['number', { ...number, color: '#fff' }],
										['label', { ...label, color: '#fff' }]
									];

									'default' === val && updateAllCounters(defaultParams);
									'theme1' === val && updateAllCounters(theme1Params);
									'theme2' === val && updateAllCounters(theme2Params);
									'theme3' === val && updateAllCounters(theme3Params);
								});
							}} options={themes} />
						</PanelRow>

						<PanelRow className='mt20'>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<Device />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counters Settings', 'b-blocks')} initialOpen={false}>
						<NumberControl label={__('Duration:', 'b-blocks')} labelPosition='left' value={duration} onChange={val => setAttributes({ duration: parseFloat(val) })} />
						<small>{__('Duration in milliseconds:', 'b-blocks')}</small>

						<SelectControl className='mt20' label={__('Separator', 'b-blocks')} labelPosition='left' value={separator.char} onChange={val => setAttributes({ separator: { ...separator, char: val } })} options={sepChars} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counter Elements', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

						<Label>{__('Icon Size:', 'b-blocks')}</Label>
						<RangeControl value={iconSize} onChange={val => setAttributes({ iconSize: val })} min={0} max={400} step={1} allowReset={true} resetFallbackValue={50} initialPosition={50} />

						<PanelRow className='mt10'>
							<Label className=''>{__('Icon Position:', 'b-blocks')}</Label>
							<SelectControl value={iconPosition} onChange={val => {
								setAttributes({ iconPosition: val });
								'top' === val && setAttributes({ iconSize: 50 });
								'label' === val && setAttributes({ iconSize: labelTypo?.fontSize });
							}} options={iconPositions} />
						</PanelRow>

						<Typography className='mt20' label={__('Number Typography:', 'b-blocks')} value={numberTypo} onChange={val => setAttributes({ numberTypo: val })} defaults={{ fontSize: { desktop: 48, tablet: 40, mobile: 32 } }} />

						<ToggleControl className='mt20' label={__('Show Label', 'b-blocks')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

						{isLabel && <Typography label={__('Label Typography:', 'b-blocks')} value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} />}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Counters', 'b-blocks')}>
						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '0px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Single Counter', 'b-blocks')} initialOpen={false}>
						<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={counterWidth} onChange={val => setAttributes({ counterWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={counterHeight} onChange={val => setAttributes({ counterHeight: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={counterPadding} onChange={val => setAttributes({ counterPadding: val })} defaults={{ vertical: '20px', horizontal: '20px' }} />

						<BorderControl label={__('Border:', 'b-blocks')} value={counterBorder} onChange={val => setAttributes({ counterBorder: val })} defaults={{ radius: '50%' }} />

						<ShadowControl label={__('Shadow:', 'b-blocks')} value={counterShadow} onChange={val => setAttributes({ counterShadow: val })} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Counter', 'b-blocks')} onClick={() => setAttributes({counters:[...counters,addCounter]})}><Dashicon icon='plus' /></ToolbarButton>
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