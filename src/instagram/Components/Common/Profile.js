import { prefix, profileURL } from '../../utils/data';

/** The account header: photo, handle and whatever extra lines are turned on. */
const Profile = ({ attributes, user = {}, compact = false }) => {
	const { elements = {}, profile = {} } = attributes;
	const { username = '', profile_picture_url: photo = '', name = '', biography = '' } = user;

	const link = profileURL(username);
	const displayName = name || profile.nameText || '';
	const displayBio = biography || profile.bioText || '';
	const src = photo || profile.photo || '';

	return <div className={`${prefix}-profile${compact ? ` ${prefix}-profile-compact` : ''}`}>

		{elements.profilePhoto && src && <a className={`${prefix}-photo`} href={link} target='_blank' rel='noreferrer noopener'>
			<img src={src} alt={username} loading='lazy' />
		</a>}

		<div className={`${prefix}-identity`}>

			<a className={`${prefix}-username`} href={link} target='_blank' rel='noreferrer noopener'>@{username}</a>

			{!compact && elements.profileName && displayName && <p className={`${prefix}-name`}>{displayName}</p>}

			{!compact && elements.profileBio && displayBio && <p className={`${prefix}-bio`}>{displayBio}</p>}

		</div>
	</div>;
};

export default Profile;
