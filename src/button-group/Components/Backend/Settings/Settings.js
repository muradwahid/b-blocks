import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, ColorControl, BtnGroup, ColorsControl, IconControl, Typography, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';
import { primaryColor, secondaryColor } from '../../../../../../bpl-tools/utils/data';

import { pluginSlug } from '../../../../utils/data';
const sepTypes = [
	{ label: 'Icon', value: 'icon', icon: 'Icon' },
	{ label: 'Text', value: 'text', icon: 'Text' }
];
const btnGroupTabs = [
	{ name: 'btn-one', title: __('Button One', 'b-blocks') },
	{ name: 'btn-two', title: __('Button Two', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes }) => {
	const { width, btnAlign, btnType, btnTypo, btnPadding, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepBGColor } = attributes;

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />


			<PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')}>
				<UnitControl label={__('Container Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<PanelRow>
					<Label className=''>{__('Type:', 'b-blocks')}</Label>
					<BtnGroup value={btnType} onChange={val => {
						setAttributes({ btnType: val });
						'fill' === val && setAttributes({
							btnOneColors: { ...btnOneColors, color: '#fff', bg: primaryColor, styles: `color: #fff; background: ${primaryColor};` },
							btnOneBorder: { ...btnOneBorder, width: '0px', color: '#0000', styles: '' },
							btnTwoColors: { ...btnTwoColors, color: '#fff', bg: secondaryColor, styles: `color: #fff; background: ${secondaryColor};` },
							btnTwoBorder: { ...btnTwoBorder, width: '0px', color: '#0000', styles: '' }
						});
						'outline' === val && setAttributes({
							btnOneColors: { ...btnOneColors, color: primaryColor, bg: '#0000', styles: `color: ${primaryColor}; background: #0000;` },
							btnOneBorder: { ...btnOneBorder, width: '3px', color: primaryColor, styles: `border: 3px solid ${primaryColor};` },
							btnTwoColors: { ...btnTwoColors, color: secondaryColor, bg: '#0000', styles: `color: ${secondaryColor}; background: #0000;` },
							btnTwoBorder: { ...btnTwoBorder, width: '3px', color: secondaryColor, styles: `border: 3px solid ${secondaryColor};` }
						});
					}} options={[
						{ label: __('Fill', 'b-blocks'), value: 'fill', icon: 'FILL' },
						{ label: __('Outline', 'b-blocks'), value: 'outline', icon: 'OUTLINE' }
					]} />
				</PanelRow>
				<small>{__('Some settings may change when type will be changed.', 'b-blocks')}</small>

				<Typography value={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: { desktop: 16, tablet: 16, mobile: 16 } }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '30px' }} />

				<Label>{__('Buttons:', 'b-blocks')}</Label>
				<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={btnGroupTabs}>{tab => <>
					{'btn-one' == tab.name && <>
						<PanelRow>
							<Label className=''>{__('Link:', 'b-blocks')}</Label>
							<TextControl value={btnOneLink} onChange={val => setAttributes({ btnOneLink: val })} />
						</PanelRow>

						<BorderControl label={__('Border', 'b-blocks')} value={btnOneBorder} onChange={val => setAttributes({ btnOneBorder: val })} defaults={{ radius: '50px' }} />

						<ColorsControl value={btnOneColors} onChange={val => setAttributes({ btnOneColors: val })} defaults={{ color: '#fff', bg: primaryColor }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnOneHovColors} onChange={val => setAttributes({ btnOneHovColors: val })} defaults={{ color: '#fff', bg: secondaryColor }} />
					</>}

					{'btn-two' == tab.name && <>
						<PanelRow>
							<Label className=''>{__('Link:', 'b-blocks')}</Label>
							<TextControl value={btnTwoLink} onChange={val => setAttributes({ btnTwoLink: val })} />
						</PanelRow>

						<BorderControl label={__('Border', 'b-blocks')} value={btnTwoBorder} onChange={val => setAttributes({ btnTwoBorder: val })} defaults={{ radius: '50px' }} />

						<ColorsControl value={btnTwoColors} onChange={val => setAttributes({ btnTwoColors: val })} defaults={{ color: '#fff', bg: secondaryColor }} />

						<ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnTwoHovColors} onChange={val => setAttributes({ btnTwoHovColors: val })} defaults={{ color: '#fff', bg: primaryColor }} />
					</>}
				</>}
				</TabPanel>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

				{isSep && <>
					<PanelRow>
						<Label className=''>{__('Type:', 'b-blocks')}</Label>
						<BtnGroup value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
					</PanelRow>

					{'text' === sepType && <>
						<Label>{__('Separator Text:', 'b-blocks')}</Label>
						<TextControl value={sepText} onChange={val => setAttributes({ sepText: val })} />

						<Typography label={__('Text Typography', 'b-blocks')} value={sepTextTypo} onChange={val => setAttributes({ sepTextTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

						<ColorControl label={__('Text Color:', 'b-blocks')} value={sepTextColor} onChange={val => setAttributes({ sepTextColor: val })} defaultColor='#333' />
					</>}

					{'icon' === sepType && <IconControl value={sepIcon} onChange={val => setAttributes({ sepIcon: val })} defaults={{ class: 'fa fa fa-arrows-alt-h', fontSize: 20, color: '#333' }} />}

					<ColorControl label={__('Background Color:', 'b-blocks')} value={sepBGColor} onChange={val => setAttributes({ sepBGColor: val })} defaultColor='#fff' />
				</>}
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} describedBy={__('Button Group Align')} alignmentControls={[
				{ title: __('Button Group in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Button Group in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Button Group in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;