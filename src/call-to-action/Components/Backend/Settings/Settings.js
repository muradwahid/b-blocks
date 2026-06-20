import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, ColorControl, ColorsControl, Typography, HelpPanel } from '../../../../../../bpl-tools/Components';
import { ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import { pluginSlug } from '../../../../utils/data';

const layoutOptions = [
	{ label: __('Centered', 'b-blocks'), value: 'centered' },
	{ label: __('Horizontal', 'b-blocks'), value: 'horizontal' }
];

const headingTagOptions = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' }
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		layout, headingTag, textAlign,
		primaryLabel, primaryUrl, primaryTarget,
		showSecondary, secondaryLabel, secondaryUrl, secondaryTarget,
		background, headingTypography, subTypography, headingColor, subColor,
		primaryBtnColors, secondaryBtnColors, btnBorderRadius,
		padding, borderRadius, shadow
	} = attributes;

	const updatePadding = (device, value) => {
		setAttributes({ padding: { ...(padding || {}), [device]: value } });
	};

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />


			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
				<PanelRow>
					<Label className=''>{__('Layout Style:', 'b-blocks')}</Label>
					<SelectControl value={layout} onChange={val => setAttributes({ layout: val })} options={layoutOptions} />
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Heading Tag:', 'b-blocks')}</Label>
					<SelectControl value={headingTag} onChange={val => setAttributes({ headingTag: val })} options={headingTagOptions} />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Primary Button', 'b-blocks')} initialOpen={false}>
				<TextControl label={__('Button Label', 'b-blocks')} value={primaryLabel} onChange={val => setAttributes({ primaryLabel: val })} placeholder={__('Get Started', 'b-blocks')} />

				<TextControl label={__('Button URL', 'b-blocks')} value={primaryUrl} onChange={val => setAttributes({ primaryUrl: val })} placeholder='https://…' type='url' />

				<ToggleControl label={__('Open in new tab', 'b-blocks')} checked={primaryTarget} onChange={val => setAttributes({ primaryTarget: val })} />

				<ColorsControl label={__('Button Colors:', 'b-blocks')} value={primaryBtnColors} onChange={val => setAttributes({ primaryBtnColors: val })} defaults={{ color: '#1a73e8', bg: '#ffffff' }} />

				<PanelRow>
					<Label className=''>{__('Hover Text:', 'b-blocks')}</Label>
					<ColorControl value={primaryBtnColors?.hoverColor} onChange={val => setAttributes({ primaryBtnColors: { ...(primaryBtnColors || {}), hoverColor: val } })} defaultColor='#ffffff' />
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Hover BG:', 'b-blocks')}</Label>
					<ColorControl value={primaryBtnColors?.hoverBg} onChange={val => setAttributes({ primaryBtnColors: { ...(primaryBtnColors || {}), hoverBg: val } })} defaultColor='#1557b0' />
				</PanelRow>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Secondary Button', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Secondary Button', 'b-blocks')} checked={showSecondary} onChange={val => setAttributes({ showSecondary: val })} />

				{showSecondary && <>
					<TextControl label={__('Button Label', 'b-blocks')} value={secondaryLabel} onChange={val => setAttributes({ secondaryLabel: val })} placeholder={__('Learn More', 'b-blocks')} />

					<TextControl label={__('Button URL', 'b-blocks')} value={secondaryUrl} onChange={val => setAttributes({ secondaryUrl: val })} placeholder='https://…' type='url' />

					<ToggleControl label={__('Open in new tab', 'b-blocks')} checked={secondaryTarget} onChange={val => setAttributes({ secondaryTarget: val })} />

					<ColorsControl label={__('Button Colors:', 'b-blocks')} value={secondaryBtnColors} onChange={val => setAttributes({ secondaryBtnColors: val })} defaults={{ color: '#ffffff', bg: 'transparent' }} />

					<PanelRow>
						<Label className=''>{__('Hover Text:', 'b-blocks')}</Label>
						<ColorControl value={secondaryBtnColors?.hoverColor} onChange={val => setAttributes({ secondaryBtnColors: { ...(secondaryBtnColors || {}), hoverColor: val } })} defaultColor='#ffffff' />
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Hover BG:', 'b-blocks')}</Label>
						<ColorControl value={secondaryBtnColors?.hoverBg} onChange={val => setAttributes({ secondaryBtnColors: { ...(secondaryBtnColors || {}), hoverBg: val } })} defaultColor='rgba(255,255,255,0.15)' />
					</PanelRow>
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Background', 'b-blocks')} initialOpen={false}>
				<Background label={__('Section Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} isImage={false} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Heading Style', 'b-blocks')} initialOpen={false}>
				<Typography value={headingTypography} onChange={val => setAttributes({ headingTypography: val })} defaults={{ fontSize: { desktop: 36, tablet: 28, mobile: 22 }, fontWeight: 700 }} />

				<ColorControl label={__('Heading Color:', 'b-blocks')} value={headingColor} onChange={val => setAttributes({ headingColor: val })} defaultColor='#ffffff' />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Subtext Style', 'b-blocks')} initialOpen={false}>
				<Typography value={subTypography} onChange={val => setAttributes({ subTypography: val })} defaults={{ fontSize: { desktop: 18, tablet: 16, mobile: 15 } }} />

				<ColorControl label={__('Subtext Color:', 'b-blocks')} value={subColor} onChange={val => setAttributes({ subColor: val })} defaultColor='#e8f0fe' />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Spacing & Border', 'b-blocks')} initialOpen={false}>
				<UnitControl label={__('Desktop Padding:', 'b-blocks')} labelPosition='left' value={padding?.desktop} onChange={val => updatePadding('desktop', val)} units={[pxUnit(), emUnit()]} />
				<small>{__('Use shorthand like "60px 40px".', 'b-blocks')}</small>

				<UnitControl className='mt10' label={__('Tablet Padding:', 'b-blocks')} labelPosition='left' value={padding?.tablet} onChange={val => updatePadding('tablet', val)} units={[pxUnit(), emUnit()]} />

				<UnitControl className='mt10' label={__('Mobile Padding:', 'b-blocks')} labelPosition='left' value={padding?.mobile} onChange={val => updatePadding('mobile', val)} units={[pxUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Section Radius:', 'b-blocks')} labelPosition='left' value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} units={[pxUnit(), emUnit()]} />

				<UnitControl className='mt10' label={__('Button Radius:', 'b-blocks')} labelPosition='left' value={btnBorderRadius} onChange={val => setAttributes({ btnBorderRadius: val })} units={[pxUnit(), emUnit()]} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val || 'center' })} />
		</BlockControls>
	</>;
};
export default Settings;
