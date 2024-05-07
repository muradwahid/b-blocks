import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Button, Dashicon, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Background, BColor, BDevice, BorderControl, HelpPanel, IconControl, ShadowControl, SpaceControl, Typography } from '../../../../../../../Components';
import { gearIcon } from '../../../../../../../Components/utils/icons';
import { tabController } from '../../../../../../../Components/utils/functions';
import { pxUnit, perUnit, emUnit } from '../../../../../../../Components/utils/options';

import { generalStyleTabs } from '../../../../../utils/options';
import { themes, iconPositions, sepChars } from '../../../utils/options';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, updateCounter }) => {
	const { counters = [], theme, columns, columnGap, rowGap, duration, separator, background, padding, counterWidth, counterHeight, textAlign, isIcon, iconSize, iconPosition, numberTypo, isLabel, labelTypo, counterPadding, counterBorder, counterShadow } = attributes;

	const [device, setDevice] = useState('desktop');

	const addCounter = () => {
		setAttributes({
			counters: [...counters, {
				background: { color: '#4527a4' },
				icon: { class: 'fa fa-award', fontSize: 50, color: '#fff' },
				number: { start: 0, end: 300, prefix: '', suffix: '', color: '#fff' },
				label: { text: 'Awards', color: '#fff' }
			}]
		});
		setActiveIndex(counters.length);
	}

	const updateAllCounters = (params) => {
		const newCounters = produce(counters, draft => {
			draft.map((__, index) => {
				for (const param of params) {
					const type = param[0];
					const value = param[1];

					draft[index][type] = value;
				}
			});
		});
		setAttributes({ counters: newCounters });
	}

	const duplicateCounter = e => {
		e.preventDefault();

		setAttributes({ counters: [...counters.slice(0, activeIndex), { ...counters[activeIndex] }, ...counters.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removeCounter = e => {
		e.preventDefault();

		setAttributes({ counters: [...counters.slice(0, activeIndex), ...counters.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const { background: singleBG = {}, icon = {}, number = {}, label = {} } = counters[activeIndex] || {};

	return <>
		<InspectorControls>
			<div className='ctrbInspectorInfo'>
				Need more block like this? Checkout the bundle ➡ <a href='https://wordpress.org/plugins/b-blocks' target='_blank' rel='noopener noreferrer'>B Blocks</a>
			</div>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug='counters-block' docsLink='https://bblockswp.com/docs/counters-block' />


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove counters', 'counters-block')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Counter No ${activeIndex + 1}:`, 'counters-block')}</h3>

							<Background label={__('Background:', 'counters-block')} value={singleBG} onChange={val => updateCounter('background', val)} defaults={{ color: '#0000' }} />

							<IconControl label={__('Icon:', 'counters-block')} value={icon} onChange={val => updateCounter('icon', val)} defaults={{ class: 'fa fa-award', fontSize: 50, color: '#fff' }} isSize={false} />

							<NumberControl label={__('Start Number:', 'counters-block')} labelPosition='left' className='mt20' value={number.start} onChange={val => updateCounter('number', parseFloat(val), 'start')} />

							<NumberControl label={__('End Number:', 'counters-block')} labelPosition='left' className='mt20' value={number.end} onChange={val => updateCounter('number', parseFloat(val), 'end')} />

							<PanelRow>
								<Label className=''>{__('Prefix:', 'counters-block')}</Label>
								<TextControl value={number.prefix} onChange={val => updateCounter('number', val, 'prefix')} />
							</PanelRow>

							<PanelRow>
								<Label className=''>{__('Suffix:', 'counters-block')}</Label>
								<TextControl value={number.suffix} onChange={val => updateCounter('number', val, 'suffix')} />
							</PanelRow>

							<BColor label={__('Number Color:', 'counters-block')} value={number.color} onChange={val => updateCounter('number', val, 'color')} defaultColor='#fff' />

							<BColor label={__('Label Color:', 'counters-block')} value={label.color} onChange={val => updateCounter('label', val, 'color')} defaultColor='#fff' />

							<PanelRow className='itemAction mt20 mb15'>
								{1 < counters?.length && <Button className='removeItem' label={__('Remove', 'counters-block')} onClick={removeCounter} ><Dashicon icon='no' />{__('Remove', 'counters-block')}</Button>}

								<Button className='duplicateItem' label={__('Duplicate', 'counters-block')} onClick={duplicateCounter} >{gearIcon}{__('Duplicate', 'counters-block')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Counter', 'counters-block')} onClick={addCounter}><Dashicon icon='plus' />{__('Add New Counter', 'counters-block')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'counters-block')} initialOpen={false}>
						<PanelRow>
							<Label className=''>{__('Theme:', 'counters-block')}</Label>
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
									counterBorder: { ...counterBorder, width: '2px', color: '#4527a4', radius: '5px' },
									iconPosition: 'label',
									iconSize: labelTypo?.fontSize
								});
								'theme3' === val && setAttributes({
									background: { ...background, type: 'image', image: { url: 'https://i.ibb.co/b18MWMw/open-space-office.jpg' }, overlayColor: '#000000b3' },
									padding: { ...padding, vertical: '140px', horizontal: '0px' },
									counterHeight: '250px',
									counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%' },
									iconPosition: 'top',
									iconSize: 50
								});

								counters?.map(member => {
									const { background, icon, number, label } = member;

									const defaultParams = [
										['background', { ...background, type: 'solid', color: '#4527a4' }],
										['icon', { ...icon, color: '#fff' }],
										['number', { ...number, color: '#fff' }],
										['label', { ...label, color: '#fff' }]
									];
									const theme1Params = [
										['background', { ...background, type: 'solid', color: '#4527a4' }],
										['icon', { ...icon, color: '#fff' }],
										['number', { ...number, color: '#fff' }],
										['label', { ...label, color: '#fff' }]
									];
									const theme2Params = [
										['background', { ...background, type: 'solid', color: '#0000' }],
										['icon', { ...icon, color: '#4527a4' }],
										['number', { ...number, color: '#4527a4' }],
										['label', { ...label, color: '#4527a4' }]
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
							<Label className='mb5'>{__('Columns:', 'counters-block')}</Label>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'counters-block')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'counters-block')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counters Settings', 'counters-block')} initialOpen={false}>
						<NumberControl label={__('Duration:', 'counters-block')} labelPosition='left' value={duration} onChange={val => setAttributes({ duration: parseFloat(val) })} />
						<small>{__('Duration in milliseconds:', 'counters-block')}</small>

						<SelectControl className='mt20' label={__('Separator', 'counters-block')} labelPosition='left' value={separator.char} onChange={val => setAttributes({ separator: { ...separator, char: val } })} options={sepChars} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counter Elements', 'counters-block')} initialOpen={false}>
						<ToggleControl label={__('Show Icon', 'counters-block')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

						<Label>{__('Icon Size:', 'counters-block')}</Label>
						<RangeControl value={iconSize} onChange={val => setAttributes({ iconSize: val })} min={0} max={400} step={1} allowReset={true} resetFallbackValue={50} initialPosition={50} />

						<PanelRow className='mt10'>
							<Label className=''>{__('Icon Position:', 'counters-block')}</Label>
							<SelectControl value={iconPosition} onChange={val => {
								setAttributes({ iconPosition: val });
								'top' === val && setAttributes({ iconSize: 50 });
								'label' === val && setAttributes({ iconSize: labelTypo?.fontSize });
							}} options={iconPositions} />
						</PanelRow>

						<Typography className='mt20' label={__('Number Typography:', 'counters-block')} value={numberTypo} onChange={val => setAttributes({ numberTypo: val })} defaults={{ fontSize: { desktop: 48, tablet: 40, mobile: 32 } }} />

						<ToggleControl className='mt20' label={__('Show Label', 'counters-block')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

						{isLabel && <Typography label={__('Label Typography:', 'counters-block')} value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} />}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Counters', 'counters-block')}>
						<Background label={__('Background:', 'counters-block')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'counters-block')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '0px' }} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Single Counter', 'counters-block')} initialOpen={false}>
						<UnitControl label={__('Width:', 'counters-block')} labelPosition='left' value={counterWidth} onChange={val => setAttributes({ counterWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Height:', 'counters-block')} labelPosition='left' value={counterHeight} onChange={val => setAttributes({ counterHeight: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<SpaceControl className='mt20' label={__('Padding:', 'counters-block')} value={counterPadding} onChange={val => setAttributes({ counterPadding: val })} defaults={{ vertical: '20px', horizontal: '20px' }} />

						<BorderControl label={__('Border:', 'counters-block')} value={counterBorder} onChange={val => setAttributes({ counterBorder: val })} defaults={{ radius: '50%' }} />

						<ShadowControl label={__('Shadow:', 'counters-block')} value={counterShadow} onChange={val => setAttributes({ counterShadow: val })} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Counter', 'counters-block')} onClick={addCounter}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;