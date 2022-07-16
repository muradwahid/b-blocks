import { RichText } from '@wordpress/block-editor';
import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';

// Separator
document.addEventListener('DOMContentLoaded', () => {
	const allTeams = document.querySelectorAll('.wp-block-b-blocks-team-members');
	allTeams.forEach(team => {
		const attributes = JSON.parse(team.dataset.attributes);
		const { members = [], columns, layout, isTitle, isSep, isBio, isSocial } = attributes;

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<div className={`bBlocksTeamMembers ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{members.map((item, index) => {
					const { photo, name, title, bio, social = [] } = item;

					return <div key={index} className={`bBlocksMember`} id={`bBlocksMember-${index}`}>
						{photo?.url && <img className={`memberPhoto ${photo?.id ? `wp-image-${photo?.id}` : null}`} src={photo?.url} alt={photo?.alt} />}

						<div className='memberDetails'>
							{name && <RichText.Content className='memberName' tagName='h4' value={name} />}
							{isTitle && title && <RichText.Content className='memberTitle' tagName='p' value={title} />}
							{isSep && <span className='memberSeparator'></span>}
							{isBio && bio && <RichText.Content className='memberBio' tagName='p' value={bio} />}

							{isSocial && <ul className='memberSocial'>
								{social?.map((socialItem, socialIndex) => {
									const { link, icon } = socialItem;

									return <li key={socialIndex} className={`icon icon-${index}-${socialIndex}`}>
										<a href={link}><i className={icon?.class}></i></a>
									</li>;
								})}
							</ul>}
						</div>
					</div>;
				})}
			</div>
		</>, team);

		team?.removeAttribute('data-attributes');
	});
});