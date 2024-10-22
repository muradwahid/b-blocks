import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TabPanel, TextControl, SelectControl, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, BtnGroup, ShadowControl, Typography } from '../../../../../../bpl-tools/Components'
import { emUnit, pxUnit } from '../../../../../../bpl-tools/utils/options';

import { generalStyleTabs } from '../../../../utils/options';
import { solidStar, outlineStar } from '../../../utils/icons';
import { ratingScales } from '../../../utils/options';

const iconOptions = [
	{ label: __('Solid', 'b-blocks'), value: 'solid', icon: solidStar },
	{ label: __('Outline', 'b-blocks'), value: 'outline', icon: outlineStar }
];
const iconAlignments = [
	{ label: __('left', 'b-blocks'), value: 'left', icon: 'editor-alignleft' },
	{ label: __('center', 'b-blocks'), value: 'center', icon: 'editor-aligncenter' },
	{ label: __('right', 'b-blocks'), value: 'right', icon: 'editor-alignright' }
];


const Settings = ({ attributes, setAttributes }) => {
	const { ratingScale, rating, iconStyle, prefix, gap, alignment, textTypo, textColor, textShadow } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>
				{(tab) => <>
					{tab.name === 'general' && <PanelBody className='bPlPanelBody' title={__('Star Rating', 'b-blocks')}>
						<SelectControl label={__('Rating Scale', 'b-blocks')} labelPosition='left' value={ratingScale} onChange={(val) => setAttributes({
							ratingScale: parseInt(val),
							rating: 5 === parseInt(val) ? parseFloat((rating / 2).toFixed(1)) : parseFloat((rating * 2).toFixed(1))
						})} options={ratingScales} />

						<TextControl className='mt20' label={__('Prefix', 'b-blocks')} value={prefix} onChange={(val) => setAttributes({ prefix: val })} />

						<RangeControl className='mt20' label={__('Rating', 'b-blocks')} labelPosition='left' value={rating} onChange={(val) => setAttributes({ rating: val })} min={1} max={ratingScale} step={0.1} />

						<BtnGroup className='mt20' label={__('Icon Style', 'b-blocks')} value={iconStyle} onChange={val => setAttributes({ iconStyle: val })} options={iconOptions} isIcon={true} />
					</PanelBody>}

					{tab.name === 'style' && <>
						<PanelBody className='bPlPanelBody' title={__('Star Rating', 'b-blocks')}>
							<BtnGroup label={__('Alignment', 'b-blocks')} value={alignment} onChange={val => setAttributes({ alignment: val })} options={iconAlignments} isIcon={true} />
						</PanelBody>


						<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
							<UnitControl label={__('Gap', 'b-blocks')} labelPosition='left' value={gap} onChange={(val) => setAttributes({ gap: val })} units={[pxUnit(10), emUnit(1)]} isResetValueOnUnitChange={true} />

							<ColorControl label={__('Text Color', 'b-blocks')} value={textColor} onChange={val => setAttributes({ textColor: val })} defaultColor='#7a7a7a' />

							<Typography label={__('Text Typography', 'b-blocks')} value={textTypo} onChange={val => setAttributes({ textTypo: val })} defaults={{ fontSize: 16 }} />

							<ShadowControl label={__('Text Shadow', 'b-blocks')} value={textShadow} onChange={val => setAttributes({ textShadow: val })} type='text' />
						</PanelBody>
					</>}
				</>}
			</TabPanel>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Rating Alignment')} alignmentControls={[
				{ title: __('Rating in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Rating in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Rating in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;