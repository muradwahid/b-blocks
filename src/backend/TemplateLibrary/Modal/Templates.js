import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Spinner } from '@wordpress/components';

import { externalIcon } from '../utils/icons';
import { pricingPage } from '../../../utils/data';

const isProItem = (item) => Array.isArray(item.category) && item.category.includes('pro');

const Templates = ({ isPremium, type, setShow, mainLoading, templates, templatesLoading, access = 'all', children }) => {
	const [isLoading, setIsLoading] = useState(false);

	const [isTempLoading, setIsTempLoading] = useState(false);

	const nonce = window.bBlocksCursorDataConfig?.nonce

	// Free/Pro is a client-side filter so it can combine with any category.
	const visible = (templates || []).filter((item) => {
		if ('pro' === access) return isProItem(item);
		if ('free' === access) return !isProItem(item);
		return true;
	});

	useEffect(() => {
		if (templatesLoading) {
			setTimeout(() => {
				setIsTempLoading(true);
			}, 1000);
		} else {
			setIsTempLoading(false);
		}
	}, [templatesLoading]);
	return <div className='modalBodyTemplates'>
		{templates?.length ? <>
			{visible.length ? <div className='grid columns-3 columns-tablet-1 columns-mobile-1'>
				{visible.map((item, index) => {
					// const { ID, original_content, category } = type === 'patterns' ? item : item.category[0] ==='landing-page' ? item : {};
					const { ID, original_content, category, thumbnail } = item;
					const isPro = category?.includes('pro');
					
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
										const content = res
											.replaceAll('\\"', '"')
											.replaceAll(`\\\\u003cbr\\\\u003e`, '<br/>')
											.replaceAll(`\\\\u003cstrong\\\\u003e`, '<strong>')
											.replaceAll(`\\\\u003c/strong\\\\u003e`, '</strong>')
											.replaceAll(`\\\\u003cem\\\\u003e`, '<em>')
											.replaceAll(`\\\\u003c/em\\\\u003e`, '</em>');

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
						href:pricingPage,
						target: '_blank',
						rel: 'noreferrer'
					};



					return <div className={`modalBodyTemplateItem ${type === 'pages'?'isPages':''}`} key={index}>
						<div className='modalBodyTemplateItemPreviewWrap'>
							{isPro && <span className='modalBodyTemplateItemProBadge'>{__('Pro', 'b-blocks')}</span>}

							<div className='modalBodyTemplateItemPreview'>
								{thumbnail && <img src={thumbnail} alt={item.title} className='modalBodyTemplateItemPreviewImg' />}
								{!thumbnail && <BlockPreview blocks={parse(original_content)} viewportWidth={1600} />}
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

						{item.title && <div className='modalBodyTemplateItemTitle' dangerouslySetInnerHTML={{ __html: item.title }} />}
					</div>
				})}
			</div> : <div className='modalBodyTemplateNotFound'>{'pro' === access ? __('No Pro templates on this page. Try “Load More”.', 'b-blocks') : __('No Free templates on this page. Try “Load More”.', 'b-blocks')}</div>}
			{children}
		</> : <>
			{mainLoading || isTempLoading ? <div className='bPlPlaceCenter'>
				<Spinner className='bPlSpinner' />
			</div> : <div className='modalBodyTemplateNotFound'>{__('No templates found.', 'b-blocks')}</div>}
		</>}
	</div>
};
export default Templates;