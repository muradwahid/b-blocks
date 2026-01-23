import { PanelBody, SelectControl, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BButtonGroup, Device, IconLibrary, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { useWPAjax, useWPOptionQuery } from "../../../../../../../bpl-tools/hooks"

import { pathTypeOptions } from '../../../../utils/options';
import { Flex } from '@wordpress/components';
import { CenterIcon, LeftIcon, RightIcon } from '../../../../utils/icons';
import { SVGSanitizer } from '../../../../../../../bpl-tools/utils/common';

const General = (props) => {
	const { attributes, updateObj, device } = props;
	const { icon, styles } = attributes;
	const { container } = styles;

			const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	
			const { refetch, } = useWPAjax('b-blocks-enable-svg-mime-type', { _wpnonce: bBlocksUtils?.nonce }, false)
	
	
			const enableSVGUpload = async () => {
					await refetch();
			}
	
			const svgSanitizer = new SVGSanitizer();

	return <>

		<PanelBody className='bPlPanelBody' title={__('Text Path', 'b-blocks')} initialOpen={true}>

			<TextControl label={__('Title', 'b-blocks')} value={icon.title} onChange={val => updateObj('icon', val, 'title')} />

			<SelectControl label={__('Path Type', 'b-blocks')} labelPosition='edge' options={pathTypeOptions} value={icon.type} onChange={val => updateObj('icon', val, 'type')} />

			{
				icon.type === 'custom' && <>
					<BButtonGroup label={__('Icon Type', 'b-blocks')} value={icon.iconType} onChange={val => updateObj('icon', val, 'iconType')} options={[
						{ label: __('Library', 'b-blocks'), value: 'library' },
						{ label: __('Upload', 'b-blocks'), value: 'upload' }
					]} />

					{icon.iconType === 'library' && <IconLibrary value={icon.library} onChange={(val) => updateObj('icon', val, 'library')} />}

					{/* {icon.iconType === 'upload' && <MediaArea value={icon.upload} onChange={val => updateObj('icon', val, 'upload')} />} */}
					
					{ 
					icon.iconType ==='upload' && <MediaArea types={['image/svg+xml']} onClick={enableSVGUpload} label={__('Upload SVG', 'b-blocks')} value={{ url: icon.upload }} onChange={async (value) => {
																	const svgStr = value?.url ? await svgSanitizer.sanitizeFile(value?.url) : '';
							updateObj('icon', svgStr, 'upload')
															}} isSvgEnabled={true} />

					}
				</>
			}

			<Flex className="mt10">
				<Label className='flex1 mb0'>{__('Alignment', 'b-blocks')}<Device/></Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={container[device]?.alignment} onChange={(val) => updateObj('styles', val, 'container', device,'alignment')} isDeselectable >
					<ToggleGroupControlOptionIcon label="Left" value="flex-start" icon={LeftIcon} />
					<ToggleGroupControlOptionIcon label="Center" value="center" icon={CenterIcon} />
					<ToggleGroupControlOptionIcon label="Right" value="flex-end" icon={RightIcon} />
				</ToggleGroupControl>
			</Flex>
			
		</PanelBody>

	</>
}
export default General;