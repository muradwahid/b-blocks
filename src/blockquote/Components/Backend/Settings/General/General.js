import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { HelpPanel, MediaArea } from '../../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../../utils/data';
import { ALIGN_OPTIONS, LAYOUT_OPTIONS } from '../../../../utils/options';

const NO_SIDE = { style: 'none', width: '0px' };
const ACCENT_BORDER = {
	top: NO_SIDE,
	right: NO_SIDE,
	bottom: NO_SIDE,
	left: { color: '#6366f1', style: 'solid', width: '4px' },
};
const NO_BORDER = { top: NO_SIDE, right: NO_SIDE, bottom: NO_SIDE, left: NO_SIDE };
const ACCENT_RADIUS = { top: '10px', right: '10px', bottom: '10px', left: '10px' };

const General = ({ attributes, updateObj }) => {
	const { layout = {}, authorName = {}, authorRole = {}, avatar = {}, advanced = {} } = attributes;

	const { text: nameText } = authorName;
	const { text: roleText, show: showRole } = authorRole;
	const { show: showAvatar, url: avatarUrl, alt: avatarAlt } = avatar;

	const setAvatar = (patch) => updateObj('avatar', { ...avatar, ...patch });

	// Selecting a layout also writes the accent bar into the Advanced border, so
	// it's fully editable from the Advanced tab afterwards.
	const onLayoutChange = (type) => {
		updateObj('layout', type, 'type');

		const normal = advanced?.borderShadow?.normal || {};
		updateObj('advanced', {
			...normal,
			border: 'border' === type ? ACCENT_BORDER : NO_BORDER,
			radius: 'border' === type ? ACCENT_RADIUS : normal.radius,
		}, 'borderShadow', 'normal');
	};

	return <>
		<HelpPanel slug={pluginSlug} />

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
			<SelectControl label={__('Layout', 'b-blocks')} labelPosition='edge' value={layout.type || 'border'} options={LAYOUT_OPTIONS} onChange={onLayoutChange} help={__('Border = left accent bar (editable in the Advanced tab). Quotation = large decorative quote mark.', 'b-blocks')} __nextHasNoMarginBottom />

			<SelectControl label={__('Alignment', 'b-blocks')} labelPosition='edge' className='mt10' value={layout.alignment || 'left'} options={ALIGN_OPTIONS} onChange={(val) => updateObj('layout', val, 'alignment')} __nextHasNoMarginBottom />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Author Name', 'b-blocks')} initialOpen={false}>
			<TextControl label={__('Author Name', 'b-blocks')} value={nameText || ''} onChange={(val) => updateObj('authorName', val, 'text')} placeholder={__('Jane Doe', 'b-blocks')} __nextHasNoMarginBottom />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Role / Company', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Role / Company', 'b-blocks')} checked={!!showRole} onChange={(val) => updateObj('authorRole', val, 'show')} />

			{showRole && (
				<TextControl label={__('Role / Company', 'b-blocks')} value={roleText || ''} onChange={(val) => updateObj('authorRole', val, 'text')} placeholder={__('CEO, Acme', 'b-blocks')} __nextHasNoMarginBottom />
			)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Author Photo', 'b-blocks')} initialOpen={false}>
			<ToggleControl
				label={__('Show Author Photo', 'b-blocks')}
				checked={!!showAvatar}
				onChange={(val) => updateObj('avatar', val, 'show')}
			/>

			{showAvatar && (
				<>
					<MediaArea className='mt10' label={avatarUrl ? __('Replace Photo', 'b-blocks') : __('Select Photo', 'b-blocks')} value={avatar} types={['image']} width='90%' height='90%' onChange={(media) => setAvatar({ id: media?.id || 0, url: media?.url || '', alt: media?.alt || avatarAlt || '', })} />

					{avatarUrl && <TextControl className='mt10' label={__('Image Alt Text', 'b-blocks')} value={avatarAlt || ''} onChange={(val) => updateObj('avatar', val, 'alt')} placeholder={__('Photo of Jane Doe', 'b-blocks')} help={__('Defaults to "Photo of <author name>" when empty.', 'b-blocks')} __nextHasNoMarginBottom />
					}
				</>
			)}
		</PanelBody>
	</>;
};
export default General;
