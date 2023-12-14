import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

import { Label, Background, BColor, BDevice, IconControl, InlineDetailMediaUpload, SeparatorControl, SpaceControl, Typography } from '../../../../Components';
import { gearIcon } from '../../../../Components/utils/icons';
import { pxUnit, perUnit, emUnit } from '../../../../Components/utils/options';


const Settings = ({ attributes, setAttributes, updateFeature, activeIndex, setActiveIndex }) => {
	const { features = [], columns, columnGap, rowGap, textAlign, padding, isIcon, iconMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isDesc, descTypo } = attributes;

	const [device, setDevice] = useState('desktop');

	const addFeature = () => {
		setAttributes({
			features: [...features, {
				background: { color: '#0000' },
				isUpIcon: false,
				icon: { class: 'fa fa-wordpress', fontSize: 120 },
				upIcon: { id: null, url: '', alt: '', title: '' },
				iconWidth: '120px',
				title: `Feature ${features.length + 1}`,
				titleColor: '#333',
				separator: { width: '20%', height: '2px', style: 'solid', color: '#bbb' },
				desc: `This content area describes feature ${features.length + 1} description/details.`,
				descColor: '#333'
			}]
		});
		setActiveIndex(features.length);
	}

	const duplicateFeature = e => {
		e.preventDefault();

		setAttributes({ features: [...features.slice(0, activeIndex), { ...features[activeIndex] }, ...features.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removeFeature = e => {
		e.preventDefault();

		setAttributes({ features: [...features.slice(0, activeIndex), ...features.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const { background = {}, isUpIcon = false, icon = {}, upIcon = {}, iconWidth = '', titleColor = '', separator = {}, descColor = '' } = features[activeIndex] || {};

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/feature-boxes-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Features', 'b-blocks')}>
				{null !== activeIndex && <>
					<h3 className='bplItemTitle'>{__(`Feature No ${activeIndex + 1}:`, 'b-blocks')}</h3>

					<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateFeature('background', val)} />

					{isIcon && <>
						<ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => updateFeature('isUpIcon', val)} />

						{isUpIcon ? <>
							<Label>{__('Icon:', 'b-blocks')}</Label>
							<InlineDetailMediaUpload value={upIcon} onChange={val => updateFeature('upIcon', val)} placeholder={__('Enter Icon URL', 'b-blocks')} />

							<UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={iconWidth} onChange={val => updateFeature('iconWidth', val)} units={[pxUnit(), perUnit(), emUnit()]} />

						</> : <IconControl value={icon} onChange={val => updateFeature('icon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 120 }} />}
					</>}

					<BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateFeature('titleColor', val)} defaultColor='#333' />

					<SeparatorControl value={separator} onChange={val => updateFeature('separator', val)} defaults={{ width: '20%' }} />

					<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateFeature('descColor', val)} defaultColor='#333' />

					<PanelRow className='itemAction mt20 mb15'>
						{1 < features?.length && <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removeFeature}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>}

						<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicateFeature}>{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
					</PanelRow>
				</>}

				<div className='addItem'>
					<Button label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' />{__('Add New Feature', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

				<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

				{isIcon && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

				{isTitle && <>
					<Typography value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 20, tablet: 18, mobile: 16 }, fontWeight: 600 }} />

					<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				{isSep && <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '10px' }} />}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				{isDesc && <Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;