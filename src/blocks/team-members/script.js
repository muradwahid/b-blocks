import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';

document.addEventListener('DOMContentLoaded', () => {
	const teamEls = document.querySelectorAll('.wp-block-b-blocks-team-members');
	teamEls.forEach(teamEl => {
		const attributes = JSON.parse(teamEl.dataset.attributes);
		const { cId, members = [], columns, layout, isLinkNewTab, isTitle, isSep, isBio, isSocial } = attributes;
		const { desktop, tablet, mobile } = columns || {};

		createRoot(teamEl).render(<>
			<Style attributes={attributes} clientId={cId} />

			<div className={`bBlocksTeamMembers ${layout || 'vertical'} columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
				{members.map((item, index) => {
					const { photo, name, title, bio, social = [] } = item;

					return <div key={index} className='bBlocksMember' id={`bBlocksMember-${index}`}>
						{photo?.url && <img className='memberPhoto' src={photo.url} alt={photo?.alt} />}

						<div className='memberDetails'>
							{name && <h4 className='memberName' dangerouslySetInnerHTML={{ __html: name }} />}
							{isTitle && title && <p className='memberTitle' dangerouslySetInnerHTML={{ __html: title }} />}
							{isSep && <span className='memberSeparator' />}
							{isBio && bio && <p className='memberBio' dangerouslySetInnerHTML={{ __html: bio }} />}

							{isSocial && <ul className='memberSocial'>
								{social?.map((socialItem, socialIndex) => {
									const { link, icon } = socialItem;

									return <li key={socialIndex} className={`icon icon-${index}-${socialIndex}`}>
										<a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel="noreferrer">
											<i className={icon?.class} />
										</a>
									</li>;
								})}
							</ul>}
						</div>
					</div>;
				})}
			</div>
		</>);

		teamEl?.removeAttribute('data-attributes');
	});
});