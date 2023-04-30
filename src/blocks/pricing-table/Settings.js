import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Button, Dashicon, __experimentalNumberControl as NumberControl, Tooltip, CheckboxControl } from '@wordpress/components';

// Settings Components
import { Label, BColor, BDevice, ShadowControl, SpaceControl } from '../../../../Components';
import { gearIcon } from '../../../../Components/utils/icons';
import { pxUnit, perUnit, emUnit } from '../../../../Components/utils/options';

import { generalStyleTabs } from '../../utils/options';

const Settings = ({ attributes, setAttributes, updatePriceTable, activeIndex, setActiveIndex }) => {
	const { pricingTables, columns, columnGap, rowGap, textAlign, padding, shadow } = attributes;

	const [device, setDevice] = useState('desktop');

	const addPricingTable = () => {
		setAttributes({
			pricingTables: [...pricingTables, {
				name: 'Ultimate',
				price: 14.99,
				priceCurrency: '$',
				period: 'Month',
				link: '#',
				linkLabel: 'Enroll Now',
				color: '#4527a4',
				features: [
					{
						isEnable: true,
						label: 'Unlimited Disk Space'
					},
					{
						isEnable: true,
						label: 'Unlimited Website'
					},
					{
						isEnable: true,
						label: 'Unlimited Email Accounts'
					},
					{
						isEnable: true,
						label: 'Unlimited Bandwidth'
					},
					{
						isEnable: true,
						label: 'Unlimited Subdomains'
					},
					{
						isEnable: true,
						label: 'Maintenance'
					}
				]
			}]
		});
		setActiveIndex(updatePriceTable.length);
	}

	const duplicatePricingTable = e => {
		e.preventDefault();

		setAttributes({ pricingTables: [...pricingTables.slice(0, activeIndex), { ...pricingTables[activeIndex] }, ...pricingTables.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removePricingTable = e => {
		e.preventDefault();

		setAttributes({ pricingTables: [...pricingTables.slice(0, activeIndex), ...pricingTables.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const { price = 0, priceCurrency = '', features = [], link = '', color = '' } = pricingTables[activeIndex] || {};

	const addFeature = e => {
		e.preventDefault();
		updatePriceTable('features', [...features, {
			isEnable: '#', label: 'New Feature of Price'
		}]);
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
						<div className='helpItem'>
							<a href='https://bblockswp.com/docs/pricing-table-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
						</div>

						<div className='helpItem rateUs'>
							<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
								<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
								<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
							</a>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Prices', 'b-blocks')}>
						{null !== activeIndex && <>
							<h3 className='bplItemTitle'>{__(`Price No ${activeIndex + 1}:`, 'b-blocks')}</h3>

							<NumberControl label={__('Price:', 'b-blocks')} labelPosition='left' value={price} onChange={val => updatePriceTable('price', parseFloat(val))} />

							<PanelRow>
								<Label className=''>{__('Currency:', 'b-blocks')}</Label>
								<TextControl value={priceCurrency} onChange={val => updatePriceTable('priceCurrency', val)} />
							</PanelRow>

							<Label>{__('Features:', 'b-blocks')}</Label>
							{features?.map((feature, featureIndex) => {
								const { isEnable, label } = feature;

								const removeFeature = e => {
									e.preventDefault();
									updatePriceTable('features', [...features.slice(0, featureIndex), ...features.slice(featureIndex + 1)]);
								}

								return <PanelRow key={featureIndex} className='editPriceFeature'>
									<CheckboxControl className='priceFeatureIsEnable' checked={isEnable} onChange={val => updatePriceTable('features', val, featureIndex, 'isEnable')} />

									<TextControl value={label} onChange={val => updatePriceTable('features', val, featureIndex, 'label')} />

									<Tooltip text={__('Remove the feature', 'b-blocks')} position='top'>
										<a className='removeItem' onClick={removeFeature}><Dashicon icon='no' /></a>
									</Tooltip>
								</PanelRow>;
							})}

							<div className='addItem addFeature mt5'>
								<Button className='addItem' label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' />{__('Add New Feature', 'b-blocks')}</Button>
							</div>

							<Label>{__('Link:', 'b-blocks')}</Label>
							<TextControl value={link} onChange={val => updatePriceTable('link', val)} />

							<BColor label={__('Color:', 'b-blocks')} value={color} onChange={val => updatePriceTable('color', val)} defaultColor='#4527a4' />

							<PanelRow className='itemAction mt20 mb15'>
								{1 < pricingTables?.length && <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removePricingTable} ><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>}

								<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicatePricingTable} >{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
							</PanelRow>
						</>}

						<div className='addItem'>
							<Button label={__('Add New Price', 'b-blocks')} onClick={addPricingTable}><Dashicon icon='plus' />{__('Add New Price', 'b-blocks')}</Button>
						</div>
					</PanelBody>


					<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
						<PanelRow className='mt20'>
							<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
							<BDevice device={device} onChange={val => setDevice(val)} />
						</PanelRow>
						<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

						<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

						<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Pricing Table', 'b-blocks')}>
						<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '35px', horizontal: '25px' }} />

						<ShadowControl className='mt20' label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} defaults={{ blur: '30px', color: '#6e8faf4d' }} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Price', 'b-blocks')} onClick={addPricingTable}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;