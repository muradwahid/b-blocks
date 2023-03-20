import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Button, Dashicon, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import IconControl from '../../../../Components/IconControl';
import BDevice from '../../../../Components/BDevice';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import { gearIcon } from '../../../../Components/Helper/icons';
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

import options from '../../utils/options';
const { generalStyleTabs } = options;

import { iconPositions, themes } from './utils/options';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex, updateCounter }) => {
	const { counters = [], theme, columns, columnGap, rowGap, duration, background, padding, counterWidth, counterHeight, textAlign, isIcon, iconSize, iconPosition, numberTypo, isLabel, labelTypo, counterPadding, counterBorder, counterShadow } = attributes;

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

	const updateAllCounter = (type, val, otherType = false) => {
		const newCounters = [...counters];

		newCounters.map((counter, index) => {
			if (otherType) {
				newCounters[index][type][otherType] = val;
			} else {
				newCounters[index][type] = val;
			}
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
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/counters-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove counters', 'b-blocks')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Counter No ${activeIndex + 1}:`, 'b-blocks')}</h3>

							<Background label={__('Background:', 'b-blocks')} value={singleBG} onChange={val => updateCounter('background', val)} defaults={{ color: '#0000' }} />

							<IconControl label={__('Icon:', 'b-blocks')} value={icon} onChange={val => updateCounter('icon', val)} defaults={{ class: 'fa fa-award', fontSize: 50, color: '#fff' }} isSize={false} />

							<NumberControl label={__('Start Number:', 'b-blocks')} labelPosition='left' className='mt20' value={number.start} onChange={val => updateCounter('number', parseFloat(val), 'start')} />

							<NumberControl label={__('End Number:', 'b-blocks')} labelPosition='left' className='mt20' value={number.end} onChange={val => updateCounter('number', parseFloat(val), 'end')} />

							<PanelRow>
								<Title className=''>{__('Prefix:', 'b-blocks')}</Title>
								<TextControl value={number.prefix} onChange={val => updateCounter('number', val, 'prefix')} />
							</PanelRow>

							<PanelRow>
								<Title className=''>{__('Suffix:', 'b-blocks')}</Title>
								<TextControl value={number.suffix} onChange={val => updateCounter('number', val, 'suffix')} />
							</PanelRow>

							<BColor label={__('Number Color:', 'b-blocks')} value={number.color} onChange={val => updateCounter('number', val, 'color')} defaultColor='#fff' />

							<BColor label={__('Label Color:', 'b-blocks')} value={label.color} onChange={val => updateCounter('label', val, 'color')} defaultColor='#fff' />

							<PanelRow className='itemAction mt20 mb15'>
								<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removeCounter} ><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicateCounter} >{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Counter', 'b-blocks')} onClick={addCounter}><Dashicon icon='plus' />{__('Add New Counter', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow>
							<Title className=''>{__('Theme:', 'b-blocks')}</Title>
							<SelectControl value={theme} onChange={val => {
								setAttributes({ theme: val });
								'default' === val && (
									setAttributes({
										background: { ...background, type: 'solid', color: '#0000' },
										padding: { ...padding, vertical: '20px', horizontal: '0px' },
										counterHeight: '250px',
										counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%' },
										iconPosition: 'top',
										iconSize: 50
									}),
									updateAllCounter('background', '#4527a4', 'color'),
									updateAllCounter('icon', '#fff', 'color'),
									updateAllCounter('number', '#fff', 'color'),
									updateAllCounter('label', '#fff', 'color')
								);
								'theme1' === val && (
									setAttributes({
										background: { ...background, type: 'solid', color: '#0000' },
										padding: { ...padding, vertical: '20px', horizontal: '0px' },
										counterHeight: '175px',
										counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '5px' },
										iconPosition: 'label',
										iconSize: labelTypo?.fontSize
									}),
									updateAllCounter('background', '#4527a4', 'color'),
									updateAllCounter('icon', '#fff', 'color'),
									updateAllCounter('number', '#fff', 'color'),
									updateAllCounter('label', '#fff', 'color')
								);
								'theme2' === val && (
									setAttributes({
										background: { ...background, type: 'solid', color: '#0000' },
										padding: { ...padding, vertical: '20px', horizontal: '0px' },
										counterHeight: '175px',
										counterBorder: { ...counterBorder, width: '2px', color: '#4527a4', radius: '5px' },
										iconPosition: 'label',
										iconSize: labelTypo?.fontSize
									}),
									updateAllCounter('background', '#0000', 'color'),
									updateAllCounter('icon', '#4527a4', 'color'),
									updateAllCounter('number', '#4527a4', 'color'),
									updateAllCounter('label', '#4527a4', 'color')
								);
								'theme3' === val && (
									setAttributes({
										background: { ...background, type: 'image', image: { url: 'https://i.ibb.co/b18MWMw/open-space-office.jpg' }, overlayColor: '#000000b3' },
										padding: { ...padding, vertical: '140px', horizontal: '0px' },
										counterHeight: '250px',
										counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%' },
										iconPosition: 'top',
										iconSize: 50
									}),
									updateAllCounter('background', '#0000', 'color'),
									updateAllCounter('icon', '#fff', 'color'),
									updateAllCounter('number', '#fff', 'color'),
									updateAllCounter('label', '#fff', 'color')
								);
							}} options={themes} />
						</PanelRow>

						<PanelRow className='mt20'>
							<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counters Settings', 'b-blocks')} initialOpen={false}>
						<NumberControl label={__('Duration:', 'b-blocks')} labelPosition='left' value={duration} onChange={val => setAttributes({ duration: parseFloat(val) })} />
						<small>{__('Duration in milliseconds:', 'b-blocks')}</small>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Counter Elements', 'b-blocks')} initialOpen={false}>
						<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

						<Title>{__('Icon Size:', 'b-blocks')}</Title>
						<RangeControl value={iconSize} onChange={val => setAttributes({ iconSize: val })} min={0} max={400} step={1} allowReset={true} resetFallbackValue={50} initialPosition={50} />

						<PanelRow className='mt10'>
							<Title className=''>{__('Icon Position:', 'b-blocks')}</Title>
							<SelectControl value={iconPosition} onChange={val => {
								setAttributes({ iconPosition: val });
								'top' === val && setAttributes({ iconSize: 50 });
								'label' === val && setAttributes({ iconSize: labelTypo?.fontSize });
							}} options={iconPositions} />
						</PanelRow>

						<Typography className='mt20' label={__('Number Typography:', 'b-blocks')} value={numberTypo} onChange={val => setAttributes({ numberTypo: val })} defaults={{ fontSize: { desktop: 48, tablet: 40, mobile: 32 } }} produce={produce} />

						<ToggleControl className='mt20' label={__('Show Label', 'b-blocks')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

						{isLabel && <Typography label={__('Label Typography:', 'b-blocks')} value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} produce={produce} />}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Counters Style', 'b-blocks')}>
						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '0px' }} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Single Counter Style', 'b-blocks')} initialOpen={false}>
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
				<ToolbarButton label={__('Add New Counter', 'b-blocks')} onClick={addCounter}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;