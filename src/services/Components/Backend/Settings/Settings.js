import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect, select, dispatch } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, Device, Typography, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl, ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import { pluginSlug, servicesDocs } from '../../../../utils/data';
import { layouts, linkPosition } from '../../../utils/options';

const Settings = ({ attributes, setAttributes, clientId, device }) => {
	const { layout, columns, columnGap, rowGap, background, textAlign, itemHeight, itemPadding, itemBorder, itemShadow, iconPadding, iconMargin, titleTypo, titleMargin, descTypo } = attributes;

	// Play with child data
	const innerBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks;
	const childAttributes = innerBlocks && innerBlocks[0]?.attributes;
	const [isIcon, setIsIcon] = useState(childAttributes?.isIcon);
	const [isTitle, setIsTitle] = useState(childAttributes?.isTitle);
	const [isDesc, setIsDesc] = useState(childAttributes?.isDesc);
	const [linkIn, setLinkIn] = useState(childAttributes?.linkIn);

	const setChildAttributes = args => innerBlocks.forEach(block => {
		dispatch('core/block-editor').updateBlockAttributes(block.clientId, args);
	});

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} docsLink={servicesDocs} />


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')}>
				<PanelRow>
					<Label className=''>{__('Layout:', 'b-blocks')}</Label>
					<SelectControl value={layout} onChange={val => {
						setAttributes({ layout: val });
						'default' === val && setAttributes({
							background: { ...background, type: 'solid', color: '#0000' },
							itemShadow: { ...itemShadow, blur: '20px', color: '#0000001a' }
						});
						'layout1' === val && setAttributes({
							background: { ...background, type: 'solid', color: '#121212' },
							itemShadow: { ...itemShadow, blur: '0', color: '#0000' }
						});

						innerBlocks.forEach(block => {
							const { hoverBG, icon, iconBorder } = block?.attributes;

							'default' === val && dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
								hoverBG: { ...hoverBG, type: 'image', image: { url: 'https://i.imgur.com/i6qCSdM.png' }, overlayColor: '#0000', position: 'bottom left', size: 'auto' },
								icon: { ...icon, colorType: 'solid', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' },
								iconBorder: { ...iconBorder, width: '0px', color: '#0000', side: 'all' },
								titleColor: '#222',
								descColor: '#333',
								linkIn: 'button'
							});
							'layout1' === val && dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
								hoverBG: { ...hoverBG, type: 'solid', color: '#0000' },
								icon: { ...icon, colorType: 'gradient', gradient: 'linear-gradient(135deg, #7f246b, #c70d2b)' },
								iconBorder: { ...iconBorder, width: '1px', color: '#777', side: 'bottom' },
								titleColor: '#fff',
								descColor: '#777',
								linkIn: 'title'
							});
						});
					}} options={layouts} />
				</PanelRow>

				<PanelRow className='mt20'>
					<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

				<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Item Settings', 'b-blocks')} initialOpen={false}>
				<UnitControl label={__('Min Height:', 'b-blocks')} labelPosition='left' value={itemHeight} onChange={val => setAttributes({ itemHeight: val })} units={[pxUnit(), emUnit()]} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={itemPadding} onChange={val => setAttributes({ itemPadding: val })} defaults={{ side: 4, top: '50px', right: '30px', bottom: '50px', left: '50px' }} />

				<BorderControl label={__('Border', 'b-blocks')} value={itemBorder} onChange={val => setAttributes({ itemBorder: val })} defaults={{ radius: '15px' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={itemShadow} onChange={val => setAttributes({ itemShadow: val })} defaults={{ blur: '20px', color: '#0000001a' }} />

				<PanelRow className='mt20'>
					<Label className=''>{__('Link In:', 'b-blocks')}</Label>
					<SelectControl value={linkIn} onChange={val => { setChildAttributes({ linkIn: val }); setLinkIn(val); }} options={linkPosition} />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon || childAttributes?.isIcon} onChange={val => { setChildAttributes({ isIcon: val }); setIsIcon(val); }} />

				{isIcon || childAttributes?.isIcon ? <>
					<SpaceControl className='mt20' label={__('Icon Padding:', 'b-blocks')} value={iconPadding} onChange={val => setAttributes({ iconPadding: val })} defaults={{ side: 4, bottom: '10px' }} />

					<SpaceControl className='mt20' label={__('Icon Margin:', 'b-blocks')} value={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
				</> : ''}

				<ToggleControl className='mt35' label={__('Show Title', 'b-blocks')} checked={isTitle || childAttributes?.isTitle} onChange={val => {
					setChildAttributes({ isTitle: val });
					setIsTitle(val);
				}} />

				{isTitle || childAttributes?.isTitle ? <>
					<Typography label={__('Title Typography:', 'b-blocks')} value={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: { desktop: 23, tablet: 20, mobile: 18 } }} />

					<SpaceControl className='mt20' label={__('Title Margin:', 'b-blocks')} value={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '30px' }} />
				</> : ''}

				<ToggleControl className='mt35' label={__('Show Description', 'b-blocks')} checked={isDesc || childAttributes?.isDesc} onChange={val => { setChildAttributes({ isDesc: val }); setIsDesc(val); }} />

				{isDesc || childAttributes?.isDesc ? <Typography label={__('Description Typography:', 'b-blocks')} value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} /> : ''}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
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