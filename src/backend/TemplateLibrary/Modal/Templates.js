import { useState } from 'react';
import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Spinner } from '@wordpress/components';

import { externalIcon } from '../utils/icons';
import { siteURL } from '../../../utils/data';

const Templates = ({ nonce, isPremium, setShow, mainLoading, templates, templatesLoading, children }) => {
	const [isLoading, setIsLoading] = useState(false);

	return <div className='modalBodyTemplates'>
		{templates?.length ? <>
			<div className='grid columns-3 columns-tablet-1 columns-mobile-1'>
				{templates.map((item, index) => {
					const { ID, original_content, category } = item;
					const isPro = category.includes('pro');

					const hasAccess = isPremium || !isPro;

					const linkProps = hasAccess ? {
						onClick: () => {
							setIsLoading(ID);

							// Request to import the template content with image upload
							wp.ajax
								.post('bblocks_template_import', { _wpnonce: nonce, original_content })
								.done((res) => {
									setIsLoading(false);

									if (res) {
										const content = res.replaceAll('\\"', '"');

										// Try insert block to the editor
										try {
											const blocks = parse(content);
											wp.data.dispatch('core/block-editor').insertBlocks(blocks);
											setShow(false);
										} catch (error) {
											// eslint-disable-next-line no-console
											console.error(error);
										}
									}
								})
								.fail((error) => {
									// eslint-disable-next-line no-console
									console.error(error);
									setIsLoading(false);
								});
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
								<a className={isLoading === ID ? 'disabled' : ''} {...linkProps}>
									{hasAccess ? <>
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
											<path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z' />
										</svg>
										Import
									</> : <>
										Get Pro
										{externalIcon}
									</>}
								</a>

								{isLoading === ID && <Spinner className='bPlSpinner' />}
							</div>
						</div>
					</div>
				})}
			</div>
			{children}
		</> : <>
			{mainLoading || templatesLoading ? <div className='bPlPlaceCenter'>
				<Spinner className='bPlSpinner' />
			</div> : <div className='bPlPlaceCenter modalBodyTemplateNotFound'>No Templates Found!!</div>}
		</>}
	</div>
};
export default Templates;