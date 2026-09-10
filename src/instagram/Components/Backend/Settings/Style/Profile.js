import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Label, Typography } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

const Profile = ({ attributes, updateObj }) => {
	const { elements = {}, profile = {} } = attributes;

	if (!elements.profile) return null;

	return <PanelBody className='bPlPanelBody' title={__('Profile', 'b-blocks')} initialOpen={false}>
		{elements.profilePhoto && <>
			<Label className='mb0'>{__('Photo Size', 'b-blocks')}</Label>

			<UnitControl labelPosition='edge' isUnitSelectTabbable value={profile.photoSize || ''} onChange={(val) => updateObj('profile', val, 'photoSize')} units={[pxUnit(), emUnit(), remUnit()]} />
		</>}

		<Label className='mb0 mt10'>{__('Header Gap', 'b-blocks')}</Label>

		<UnitControl labelPosition='edge' isUnitSelectTabbable value={profile.gap || ''} onChange={(val) => updateObj('profile', val, 'gap')} units={[pxUnit(), perUnit(), emUnit(), remUnit()]} />

		<ColorControl className='mt10' label={__('Username Color', 'b-blocks')} value={profile.usernameColor} onChange={(val) => updateObj('profile', val, 'usernameColor')} />

		{elements.profileName && <ColorControl label={__('Name Color', 'b-blocks')} value={profile.nameColor} onChange={(val) => updateObj('profile', val, 'nameColor')} />}

		{elements.profileBio && <ColorControl label={__('Biography Color', 'b-blocks')} value={profile.bioColor} onChange={(val) => updateObj('profile', val, 'bioColor')} />}

		<Typography className='mt10' label={__('Username Typography', 'b-blocks')} value={profile.usernameTypo} onChange={(val) => updateObj('profile', val, 'usernameTypo')} defaults={{ fontSize: { desktop: 18 } }} />

		{(elements.profileName || elements.profileBio) && <Typography className='mt10' label={__('Name & Bio Typography', 'b-blocks')} value={profile.metaTypo} onChange={(val) => updateObj('profile', val, 'metaTypo')} defaults={{ fontSize: { desktop: 14 } }} />}
	</PanelBody>;
};

export default Profile;
