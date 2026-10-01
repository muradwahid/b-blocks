import { Flex, __experimentalInputControl as InputControl, PanelBody, PanelRow, SelectControl, ToggleControl,  __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { BButtonGroup, IconLibrary, Label, MediaArea, SortableControl, TinyEditor } from "../../../../../../../bpl-tools/Components";

import { updateData } from '../../../../../../../bpl-tools/utils/functions';
import svgIcon from "../../../../../../assets/icons/christmas-star-icon.svg";
import oktaIconSvg from "../../../../../../assets/icons/okta-icon.svg";
import { htmlTags } from "../../../../utils/options";
import { CenterIcon, JustifyIcon, LeftIcon, RightIcon } from '../../../../utils/icon';

const General = (props) => {
	const { attributes, setAttributes, updateObj } = props;
	const { sortElements, heading, icon, separator, subHeading } = attributes;

	return <>
		<PanelBody className="bPlPanelBody" initialOpen={true} title={__("Elements", "b-blocks")} >
			<SortableControl label={__("Sort Elements:")} value={sortElements} onChange={(val) => updateObj('sortElements', val)} />
		</PanelBody>

		<PanelBody className="bPlPanelBody" initialOpen={false} title={__("Heading", "b-blocks")} >
			<PanelRow>
				<Label className="">{__("HTML Tag", "b-blocks")}</Label>
				<SelectControl value={heading.tag} onChange={(value) => updateObj('heading', value, 'tag')} options={htmlTags} />
			</PanelRow>

			{["first", "last"].map((part) => (
				<InputControl key={part} className="mt20" label={__(`${part==='first'?'First':'Last'} Part`, "b-blocks")} value={heading[part].text} onChange={(value) => setAttributes({ heading: { ...heading, [part]: { ...heading[part], text: value }, }, })} />
			))}

		<Flex className="mt10">
			<Label className='flex1 mb0'>{__('Alignment', 'b-blocks')}</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={heading?.align} onChange={(val) => updateObj('heading', val, 'align')} isDeselectable >
					<ToggleGroupControlOptionIcon label="Left" value="left" icon={LeftIcon} />
					<ToggleGroupControlOptionIcon label="Center" value="center" icon={CenterIcon} />
					<ToggleGroupControlOptionIcon label="Right" value="right" icon={RightIcon} />
					<ToggleGroupControlOptionIcon label="Justify" value="justify" icon={JustifyIcon} />
			</ToggleGroupControl>
		</Flex>

		</PanelBody>

		<PanelBody className="bPlPanelBody" initialOpen={false} title={__("Separator", "b-blocks")} >
			<ToggleControl label={__("Show Separator", "b-blocks")} checked={separator.show} onChange={(value) => updateObj('separator', value, 'show')} />

			{separator.show && <>
				<PanelRow>
					<Label className="">Type</Label>
					<SelectControl value={separator.type} options={[{ label: "Line", value: "line" }, { label: "Icon", value: "icon" },]} onChange={(value) => updateObj('separator', value, 'type')} />
				</PanelRow>

				{separator.type === "icon" && <>
					<BButtonGroup className='mt10' options={[{ label: "Library", value: "library" }, { label: "Upload", value: "upload" },]} value={separator.iconType} label={__("Icon Type", "b-blocks")} onChange={(value) => updateObj('separator', value, 'iconType')} />

					{separator.iconType === "library" && <IconLibrary label={__("Icon Library", "b-blocks")} value={separator.icon.library} onChange={(value) => updateObj('separator', value, 'icon', 'library')} />}

					{separator.iconType === "upload" && <>
						<Label>Icon</Label>
						<MediaArea
						types={['image/*']}
						value={{url:separator.icon.upload}} default={svgIcon} label={__("Choose Icon", "b-blocks")} className="dual-color-heading-icon" onChange={(value) => updateObj('separator', value?.url, 'icon', 'upload')} />
					</>}
				</>}
			</>}
		</PanelBody>

		<PanelBody className="bPlPanelBody" initialOpen={false} title={__("Sub Heading", "b-blocks")} >
			<TinyEditor height={220} value={subHeading.text} onChange={(value) => setAttributes({ subHeading: { ...subHeading, text: value } })} />
		</PanelBody>

		<PanelBody className="bPlPanelBody" initialOpen={false} title={__("Icon", "b-blocks")} >
			<ToggleControl label={__("Show Icon", "b-blocks")} checked={icon.show} onChange={(value) => setAttributes({ icon: { ...icon, show: value } })}
			/>

			{icon.show && (
				<>
					<BButtonGroup options={[{ label: "Library", value: "library" }, { label: "Upload", value: "upload" },]} value={icon.iconType} label={__("Icon Type", "b-blocks")} onChange={(value) => setAttributes({ icon: updateData(icon, value, "iconType"), })} />
					{icon.iconType === "library" && (
						<IconLibrary label={__("Icon Library", "b-blocks")} value={icon.icon.library} onChange={(value) => setAttributes({ icon: updateData(icon, value, "icon", "library"), })} />
					)}
					{icon.iconType === "upload" && (
						<>
							<Label>{__("Icon", "b-blocks")}</Label>
							<MediaArea
							// types="image/svg+xml"
							default={oktaIconSvg} value={icon.icon.upload} label={__("Choose Icon", "b-blocks")} onChange={(value) => setAttributes({ icon: updateData(icon, value, "icon", "upload"), })} />
						</>
					)}
				</>
			)}
		</PanelBody>
	</>
};
export default General;