import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';

import { externalIcon } from '../utils/icons';

const Templates = ({ filteredItems, pageItems, isPremium, setShow, children }) => {
	return filteredItems.length ? <div className='modalBodyTemplates'>
		<div className='grid columns-3 columns-tablet-1 columns-mobile-1'>
			{pageItems.map((item, index) => {
				const { title, pro, url = '', content } = item;
				const hasAccess = isPremium || !pro;

				const linkProps = hasAccess ? {
					onClick: () => {
						const blocks = parse(content);
						wp.data.dispatch('core/block-editor').insertBlocks(blocks);
						setShow(false);
					}
				} : {
					href: url,
					target: '_blank',
					rel: 'noreferrer'
				};


				return <div className='modalBodyTemplateItem' key={index}>
					<div className='modalBodyTemplateItemPreviewWrap'>
						<div className='modalBodyTemplateItemPreview'>
							<BlockPreview blocks={parse(content)} viewportWidth={700} />
						</div>

						<div className='modalBodyTemplateItemButton'>
							<a {...linkProps}>
								{hasAccess ? 'Import' : <>
									Get Pro
									{externalIcon}
								</>}
							</a>
						</div>
					</div>

					<div className='modalBodyTemplateItemTitle'>
						<span>{title}</span>

						{hasAccess ? '' : <span className='modalBodyTemplateItemProBadge'>Pro</span>}
					</div>
				</div>
			})}
		</div>

		{children}
	</div> : <div className='modalBodyTemplateNotFound'>No Templates Found!!</div>
};
export default Templates;