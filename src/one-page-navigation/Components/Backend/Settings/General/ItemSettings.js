import { __ } from '@wordpress/i18n';
import { TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { IconLibrary, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { useWPAjax, useWPOptionQuery } from '../../../../../../../bpl-tools/hooks';
import { SVGSanitizer } from '../../../../../../../bpl-tools/utils/common';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { IMAGE_MIME_TYPES, SVG_MIME_TYPES, cleanSectionId, iconTypes } from '../../../../utils/options';

const ItemSettings = ({ attributes, setAttributes, index }) => {
	const { items = [] } = attributes;
	const item = items[index] || {};
	const icon = item.icon || {};

	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { refetch } = useWPAjax('b-blocks-enable-svg-mime-type', { _wpnonce: bBlocksUtils?.nonce }, false);
	const enableSVGUpload = async () => refetch();

	const svgSanitizer = new SVGSanitizer();

	const setItem = (val, ...props) => setAttributes({ items: updateData(items, val, index, ...props) });

	return <>
		<Label className='mb0'>{__('Icon Type', 'b-blocks')}</Label>

		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={icon.type || 'icon'} onChange={(val) => setItem(val, 'icon', 'type')}>
			{iconTypes.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		{'icon' === (icon.type || 'icon') && <IconLibrary className='mt10' label={__('Icon Library', 'b-blocks')} value={icon.icon} onChange={(val) => setItem(val, 'icon', 'icon')} />}

		{'image' === icon.type && <MediaArea
			height='90%'
			width='90%'
			className='mt10'
			label={__('Upload Image', 'b-blocks')}
			types={IMAGE_MIME_TYPES}
			value={icon.img}
			onChange={(val) => setItem(val || {}, 'icon', 'img')}
		/>}

		{'image' === icon.type && <small>{__('Recommended: PNG, JPEG, WebP, GIF or AVIF.', 'b-blocks')}</small>}

		{'svg' === icon.type && <MediaArea
			className='mt10'
			label={__('Upload SVG', 'b-blocks')}
			types={SVG_MIME_TYPES}
			onClick={enableSVGUpload}
			value={{ url: icon.svg }}
			onChange={async (value) => setItem(value?.url ? await svgSanitizer.sanitizeFile(value.url) : '', 'icon', 'svg')}
			isSvgEnabled={true}
		/>}

		{'svg' === icon.type && <small>{__('Recommended: image/svg+xml. The file is sanitised on upload.', 'b-blocks')}</small>}

		<TextControl
			className='mt10'
			label={__('Label', 'b-blocks')}
			value={item.label || ''}
			onChange={(val) => setItem(val, 'label')}
			__nextHasNoMarginBottom
		/>

		<TextControl
			label={__('Section ID', 'b-blocks')}
			value={item.sectionId || ''}
			onChange={(val) => setItem(cleanSectionId(val), 'sectionId')}
			help={__("The section's ID, or the heading of the section to scroll to. Without the # symbol.", 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</>;
};

export default ItemSettings;
