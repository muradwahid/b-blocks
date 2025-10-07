import { createRoot } from 'react-dom/client';

import { sanitizeHTML, sanitizeURL } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const teamEls = document.querySelectorAll('.wp-block-b-blocks-team-members');
	teamEls.forEach(teamEl => {
		const attributes = JSON.parse(teamEl.dataset.attributes);
		const { members = [], columns, layout, isLinkNewTab, isTitle, isSep, isBio, isSocial } = attributes;
		const { desktop, tablet, mobile } = columns || {};

		createRoot(teamEl).render(<>
			<Style attributes={attributes} id={teamEl.id} />

			<div className={`${prefix} ${layout || 'vertical'} columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
				{members.map((item, index) => {
					const { photo, name, title, bio, social = [] } = item;

					return <div key={index} className='teamMember' id={`teamMember-${index}`}>
						{photo?.url && <img className='memberPhoto' src={photo.url} alt={photo?.alt} />}

						<div className='memberDetails'>
							{name && <h4 className='memberName' dangerouslySetInnerHTML={{ __html: sanitizeHTML(name) }} />}
							{isTitle && title && <p className='memberTitle' dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
							{isSep && <span className='memberSeparator' />}
							{isBio && bio && <p className='memberBio' dangerouslySetInnerHTML={{ __html: sanitizeHTML(bio) }} />}

							{isSocial && <ul className='memberSocial'>
								{social?.map((socialItem, socialIndex) => {
									const { link, icon } = socialItem;

									return <li key={socialIndex} className={`icon icon-${index}-${socialIndex}`}>
										<a href={sanitizeURL(link)} target={isLinkNewTab ? '_blank' : '_self'} rel="noreferrer">
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