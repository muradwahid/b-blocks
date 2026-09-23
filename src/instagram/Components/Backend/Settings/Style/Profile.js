import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

const Profile = ({ attributes, updateObj, device = 'desktop' }) => {
	const { elements = {}, profile = {} } = attributes;

	if (!elements.profile) return null;

	return <PanelBody className='bPlPanelBody' title={__('Profile', 'b-blocks')} initialOpen={false}>

		{elements.profilePhoto && <Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Photo Size', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				isUnitSelectTabbable
				value={profile?.[device]?.photoSize ?? ('desktop' === device ? (profile.photoSize || '') : '')}
				onChange={(val) => updateObj('profile', val, device, 'photoSize')}
				units={[pxUnit(), emUnit(), remUnit()]}
			/>
		</Flex>}

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Header Gap', 'b-blocks')} <Device /></Label>

			<UnitControl
				className='flex1'
				isUnitSelectTabbable
				value={profile?.[device]?.gap ?? ('desktop' === device ? (profile.gap || '') : '')}
				onChange={(val) => updateObj('profile', val, device, 'gap')}
				units={[pxUnit(), perUnit(), emUnit(), remUnit()]}
			/>
		</Flex>

		<ColorControl className='mt10' label={__('Username Color', 'b-blocks')} value={profile.usernameColor} onChange={(val) => updateObj('profile', val, 'usernameColor')} />

		{elements.profileName && <ColorControl label={__('Name Color', 'b-blocks')} value={profile.nameColor} onChange={(val) => updateObj('profile', val, 'nameColor')} />}

		{elements.profileBio && <ColorControl label={__('Biography Color', 'b-blocks')} value={profile.bioColor} onChange={(val) => updateObj('profile', val, 'bioColor')} />}

		<Typography className='mt10' label={__('Username Typography', 'b-blocks')} value={profile.usernameTypo} onChange={(val) => updateObj('profile', val, 'usernameTypo')} defaults={{ fontSize: { desktop: 18 } }} />

		{(elements.profileName || elements.profileBio) && <Typography className='mt10' label={__('Name & Bio Typography', 'b-blocks')} value={profile.metaTypo} onChange={(val) => updateObj('profile', val, 'metaTypo')} defaults={{ fontSize: { desktop: 14 } }} />}

	</PanelBody>;
};

export default Profile;
