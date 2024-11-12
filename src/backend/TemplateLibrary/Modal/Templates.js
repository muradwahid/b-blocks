import { useEffect } from 'react';
import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';

import { externalIcon } from '../utils/icons';
import { siteURL } from '../../../utils/data';
import useTemplateImport from '../hooks/useTemplateImport';

const Templates = ({ isPremium, show, setShow, main, mainLoading, templates, refetchTemplates, templatesLoading, type, setType, category, setCategory, pageNumber, setPageNumber, search, setSearch, filteredItems, pageItems, children }) => {
	const { data, getContent, isLoading } = useTemplateImport();

	useEffect(() => {
		if (!isLoading && data) {
			const content = data.replaceAll('\\"', '"');

			try {
				const blocks = parse(content);
				wp.data.dispatch('core/block-editor').insertBlocks(blocks);
				setShow(false);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		}
	}, [isLoading]);

	return <div className='modalBodyTemplates'>
		{templatesLoading ? <div className='placeCenter'>Templates Loading</div> : (
			templates?.length ? <>
				<div className='grid columns-3 columns-tablet-1 columns-mobile-1'>
					{templates.map((item, index) => {
						const { ID, title, original_content, category } = item;
						const isPro = category.includes('pro');

						const hasAccess = isPremium || !isPro;

						const linkProps = hasAccess ? {
							onClick: () => {
								getContent({ id: ID, original_content });
							}
						} : {
							href: `${siteURL}#pricing`,
							target: '_blank',
							rel: 'noreferrer'
						};


						return <div className='modalBodyTemplateItem' key={index}>
							<div className='modalBodyTemplateItemPreviewWrap'>
								<div className='modalBodyTemplateItemPreview'>
									<BlockPreview blocks={parse(original_content)} viewportWidth={1600} />
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
			</> :
				<div className='placeCenter modalBodyTemplateNotFound'>No Templates Found!!</div>)}
	</div>
};
export default Templates;