import { __ } from "@wordpress/i18n";
import { Flex, PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, ToggleControl } from "@wordpress/components";

import { BoxControl, ColorsControl, Label, Typography, Device, BtnGroup } from "../../../../../../../bpl-tools/Components";
import { hAlignOptions, hoverEffectOptions, imgAlignOptions, imgFitOptions, textAlignOptions, vAlignOptions } from '../../../../utils/options';


const Style = ({ attributes, updateObj, device }) => {
	const { image, layout, style, captionStyle, caption } = attributes;
	const { sourceType } = image;
	const { height, isAutoHeight, isAutoFit, fitOptionType } = layout;
	const { alignment, hoverEffect } = style
	const { typo, colors } = captionStyle;
	const { textAlign, hAlign, vAlign, margin, padding, width } = captionStyle[device];

	return (
		<>
			<PanelBody className='bPlPanelBody' title={__("Image", "b-blocks")} initialOpen={true}>
				<BoxControl></BoxControl>
				<PanelRow >
					<Label>{__('Width', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<UnitControl
					value={layout.width[device]}
					onChange={(v) => updateObj('layout', v, 'width', device)}
				/>

				<ToggleControl
					className='mt20'
					checked={isAutoHeight}
					label={__('Auto Height', 'b-blocks')}
					onChange={(v) => updateObj('layout', v, 'isAutoHeight')}
				/>

				{!isAutoHeight && <>
					<PanelRow className='mt10'>
						<Label>{__('Height', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<UnitControl
						value={height[device]}
						onChange={(v) => updateObj('layout', v, 'height', device)}
					/>
				</>}

				<PanelRow>
					<Label className=''>{__('Alignment', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<BtnGroup value={alignment[device]} onChange={val => updateObj('style', val, 'alignment', device)} options={imgAlignOptions} isIcon={true} size="default" />
				<ToggleControl
					className='mt20'
					checked={isAutoFit}
					label={__('Auto Fit', 'b-blocks')}
					onChange={(v) => updateObj('layout', v, 'isAutoFit')}
				/>
				{isAutoFit && <BtnGroup label={__('Image Fit', 'b-blocks')} value={fitOptionType} onChange={v => updateObj('layout', v, 'fitOptionType')} options={imgFitOptions} size="small" />}
				<SelectControl
					className='mt20'
					label={__('Hover Effect', 'b-blocks')}
					labelPosition='left'
					value={hoverEffect}
					options={hoverEffectOptions}
					onChange={(v) => updateObj('style', v, 'hoverEffect')}
				/>
			</PanelBody>
			{caption.enabled && sourceType === "custom" && (
				<PanelBody
					className='bPlPanelBody'
					title={__("Caption", "b-blocks")}
					initialOpen={false}
				>
					<ColorsControl
						label={__('Colors', 'b-blocks')}
						value={colors}
						onChange={(val) => updateObj('captionStyle', val, 'colors')}
						defaults={{ color: "black", bg: "#EEEEEE" }}
					/>

					<UnitControl
						label={<Flex justify='space-between'>
							<Label>{__('Width', 'b-blocks')}</Label>
							<Device />
						</Flex>}
						value={width}
						allowReset
						onChange={(v) => updateObj('captionStyle', v, device, 'width')}
					/>

					<Typography
						label={__('Typography', 'b-blocks')}
						value={typo}
						onChange={(v) => updateObj('captionStyle', v, 'typo')}
						defaults={{ fontSize: 13 }}
					/>

					<PanelRow className='mt20'>
						<Label className=''>{__('Text Align', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<BtnGroup value={textAlign} onChange={val => updateObj('captionStyle', val, device, 'textAlign')} options={textAlignOptions} isIcon={true} size='small' />

					<PanelRow className='mt20'>
						<Label className=''>{__('Horizontal Align', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<BtnGroup value={hAlign} onChange={val => updateObj('captionStyle', val, device, 'hAlign')} options={hAlignOptions} isIcon={true} size='small' />

					<PanelRow className='mt20'>
						<Label className=''>{__('Vertical Align', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<BtnGroup value={vAlign} onChange={val => updateObj('captionStyle', val, device, 'vAlign')} options={vAlignOptions} size='small' />

					<PanelRow>
						<Label>{__('Margin', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<BoxControl
						label=""
						values={margin}
						onChange={val => updateObj('captionStyle', val, device, "margin")}
					></BoxControl>

					<PanelRow>
						<Label>{__('Padding', 'b-blocks')}</Label>
						<Device />
					</PanelRow>
					<BoxControl
						label=""
						values={padding}
						onChange={val => updateObj('captionStyle', val, device, "padding")}
					></BoxControl>

				</PanelBody>
			)}
		</>
	);
};

export default Style;
