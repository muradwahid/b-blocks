import React, { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const AdvancedTabs = ({ attributes, templateContent }) => {
	const { tabLists = [], tabs } = attributes;
	const wrapperRef = useRef(null);

	const [ready, setReady] = useState(false);
	const [activeTabId, setActiveTabId] = useState(null);

	useEffect(() => {
		if (!wrapperRef.current || !templateContent) return;
		if (templateContent.dataset.moved === '1') {
			setReady(true);
			return;
		}

		const slideNodes = Array.from(templateContent.children);
		wrapperRef.current.append(...slideNodes);
		templateContent.dataset.moved = '1';

		setReady(true);
	}, [wrapperRef.current, templateContent]);


	const handleTabTitleClick = (id) => {
		setActiveTabId(String(id));

		const tabContent = wrapperRef?.current;
		const contentTabs = tabContent.querySelectorAll(`.b-blocks-advanced-tabs-panel`);


		(Array.from(contentTabs) || []).forEach((tab) => {
			if (tab.classList.contains(`b-blocks-advanced-tabs-panel-${id}`)) {
				tab.style.display = "block";
			} else {
				tab.style.display = "none";
			}
		})
	};

	useEffect(() => {
		const tabContent = wrapperRef?.current;
		const contentTabs = tabContent.querySelectorAll(`.b-blocks-advanced-tabs-panel`);
		if (!ready) return;
		if (!activeTabId) {
			const defaultItem = (tabLists || []).find((t) => t.isDefault);
			setActiveTabId(tabs.isCloseAllTab ? '' : (defaultItem || { id: 1 })?.id);
			if (tabs.isCloseAllTab) return;
			(Array.from(contentTabs) || []).forEach((tab) => {
				if (tab.classList.contains(`b-blocks-advanced-tabs-panel-${defaultItem.id}`)) {
					tab.style.display = "block";
				} else {
					tab.style.display = "none";
				}
			})
		} else {
			handleTabTitleClick(activeTabId);
		}
	}, [ready])




	return (
		<div>
			<div className="b-blocks-advanced-tabs-main-wrapper">
				<div className={`b-blocks-advanced-tabs-wrapper`} data-close-all={tabs?.isCloseAllTab}>
					{/* <div className="b-blocks-advanced-tabs-button-wrapper"> */}
					<div className="b-blocks-advanced-tabs-button-lists">
						{(tabLists || []).map((item, index) => {
							return (
								<button
									key={`${index}-${item.id}`}
									data-title-tab-id={item.id}
									className={`b-blocks-advanced-tabs-button ${activeTabId == item.id ? 'b-blocks-advanced-tabs-button-active' : 'b-blocks-advanced-tabs-button-normal'}`}
									data-active-tab={item.isDefault}
									onClick={() => handleTabTitleClick(item.id)}
								>
									{(tabs.isShowIcon && item.iconType !== 'none') && <p className="b-blocks-advanced-tabs-button-icon" dangerouslySetInnerHTML={{ __html: sanitizeHtml( item?.[item.iconType] ) }}>
									</p>}
									<div className="b-blocks-advanced-tabs-button-title-container">
										{tabs.isShowTitle && <span
											className="b-blocks-advanced-tabs-button-title"
											placeholder="Tab Title"
											dangerouslySetInnerHTML={{ __html: sanitizeHtml( item.title ) }}
										/>}

										{tabs.isShowSubTitle && <p className="b-blocks-advanced-tabs-button-subTitle">
											{item.subTitle}
										</p>}
									</div>
								</button>
							);
						})}
					</div>
					{/* </div> */}

					<div className="b-blocks-advanced-tabs-contents" ref={wrapperRef}>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdvancedTabs;