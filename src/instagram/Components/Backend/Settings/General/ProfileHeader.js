import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import { InlineMediaUpload, Label } from '../../../../../../../bpl-tools/Components';

// What the header above the grid says about the account.
const ProfileHeader = ({ attributes, updateObj }) => {
	const { elements = {}, profile = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Profile', 'b-blocks')} initialOpen={false}>
		<ToggleControl className='mt10' label={__('Show Profile', 'b-blocks')} checked={elements.profile} onChange={(val) => updateObj('elements', val, 'profile')} />

		{elements.profile && <>
			<ToggleControl className='mt10' label={__('Show Photo', 'b-blocks')} checked={elements.profilePhoto} onChange={(val) => updateObj('elements', val, 'profilePhoto')} />

			{elements.profilePhoto && <>
				<Label className='mt10'>{__('Fallback Photo', 'b-blocks')}</Label>

				<InlineMediaUpload value={profile.photo} types={['image']} onChange={(val) => updateObj('profile', val, 'photo')} placeholder={__('Upload Profile Picture', 'b-blocks')} />

				<small>{__('Used only when Instagram returns no picture for the account.', 'b-blocks')}</small>
			</>}

			<ToggleControl className='mt10' label={__('Show Name', 'b-blocks')} checked={elements.profileName} onChange={(val) => updateObj('elements', val, 'profileName')} />

			{elements.profileName && <TextControl className='mt10' value={profile.nameText || ''} onChange={(val) => updateObj('profile', val, 'nameText')} placeholder={__('Display name', 'b-blocks')} help={__('Shown only when the account itself returns no name.', 'b-blocks')} />}

			<ToggleControl className='mt10' label={__('Show Biography', 'b-blocks')} checked={elements.profileBio} onChange={(val) => updateObj('elements', val, 'profileBio')} />

			{elements.profileBio && <TextControl className='mt10' value={profile.bioText || ''} onChange={(val) => updateObj('profile', val, 'bioText')} placeholder={__('Short bio', 'b-blocks')} help={__('Shown only when the account itself returns no biography.', 'b-blocks')} />}
		</>}
	</PanelBody>;
};

export default ProfileHeader;
