
import { useBlockProps, RichText, InnerBlocks } from "@wordpress/block-editor";
import { useEffect, useMemo, useRef, useState } from "react";


import Settings from "./Settings/Settings";
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { withSelect } from '@wordpress/data';
import { Dashicon } from '@wordpress/components';
import { addTab } from '../../utils/functions';

import '../../editor.scss';
import style from '../Common/Style';


const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;

	const {
		tabLists = [],
		tabs
	} = attributes;

	const tabWrapRef = useRef(null);

	const [activeTabId, setActiveTabId] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);

	const tabContentRef = useRef(null);


	const activeDefaultTabId = useMemo(() => {
		const defaultItem = (tabLists || []).find((t) => t.isDefault);
		return tabs.isCloseAllTab ? '' : (defaultItem || { id: 1 })?.id;
	}, [tabLists]);

	useEffect(() => {
		if (!activeTabId) setActiveTabId(activeDefaultTabId);
	}, [activeDefaultTabId]);

	const handleTabTitleClick = (id) => {
		setActiveTabId(String(id));

		const tabContent = tabContentRef?.current;
		const contentTabs = tabContent.querySelectorAll(`.b-blocks-advanced-tabs-panel`);


		(Array.from(contentTabs) || []).forEach((tab) => {
			if (tab.classList.contains(`b-blocks-advanced-tabs-panel-${id}`)) {
				tab.style.display = "block";
			} else {
				tab.style.display = "none";
			}
		})
	};

	const CHILD_TAB_BLOCK = "b-blocks/container";

	const TEMPLATE = [
		[CHILD_TAB_BLOCK, { className: `b-blocks-advanced-tabs-panel b-blocks-advanced-tabs-panel-1 b-blocks-advanced-tabs-parent-${attributes.clientId}`, lock: { remove: true, move: true } }],
		[CHILD_TAB_BLOCK, { className: `b-blocks-advanced-tabs-panel b-blocks-advanced-tabs-panel-2 b-blocks-advanced-tabs-parent-${attributes.clientId}`, lock: { remove: true, move: true } }],
		[CHILD_TAB_BLOCK, { className: `b-blocks-advanced-tabs-panel b-blocks-advanced-tabs-panel-3 b-blocks-advanced-tabs-parent-${attributes.clientId}`, lock: { remove: true, move: true } }]
	]

	const updateObj = updateAttributes(attributes, setAttributes);


	const handleAddTab = () => {
		addTab({
			clientId,
			blockId: "",
			tabLists,
			setAttributes
		});
	};


	useEffect(() => {

		if (activeTabId) {
			const tabContent = tabContentRef?.current;
			const content = tabContent?.querySelector(`.b-blocks-advanced-tabs-panel-${activeTabId}`);
			const deactivateTab = tabContent?.querySelector(`.b-blocks-advanced-tabs-panel`);
			if (content) {
				content.style.display = "block";
			} else {
				if (deactivateTab) {
					deactivateTab.style.display = "none";
				}
			}
		}
	}, [tabContentRef, activeTabId]);


	useEffect(() => {
		setAttributes({
			clientId: clientId.slice(0, 12)
		})
	}, []);

	return (
		<>
			<Settings {...{ attributes, setAttributes, updateObj, clientId, device, activeIndex, setActiveIndex }} />

			<div {...useBlockProps()}>
				<style dangerouslySetInnerHTML={{ __html: style(attributes, `block-${clientId}`) }} />
				<div className="b-blocks-advanced-tabs-main-wrapper">
					<div className={`b-blocks-advanced-tabs-wrapper`} ref={tabWrapRef}>
						<div className="b-blocks-advanced-tabs-button-lists">
							{(tabLists || []).map((item, index) => {
								return (
									<button
										key={`${index}-${item.id}`}
										data-title-tab-id={item.id}
										onClick={() => {
											handleTabTitleClick(item.id)
											setActiveIndex(index)
										}}
										className={`b-blocks-advanced-tabs-button ${activeTabId == item.id ? 'b-blocks-advanced-tabs-button-active' : 'b-blocks-advanced-tabs-button-normal'}`}
									>
										{(tabs.isShowIcon && item.iconType !== 'none') && <p className="b-blocks-advanced-tabs-button-icon" dangerouslySetInnerHTML={{ __html: item?.[item.iconType] }}>
										</p>}
										<div className="b-blocks-advanced-tabs-button-title-container">
											{tabs.isShowTitle && <RichText
												tagName={'span'}
												className="b-blocks-advanced-tabs-button-title"
												placeholder="Tab Title"
												value={item.title}
												onChange={(value) => updateObj('tabLists', value, index, 'title')}
											/>}

											{tabs.isShowSubTitle && <RichText
												className="b-blocks-advanced-tabs-button-subTitle"
												placeholder="Tab SubTitle"
												value={item.subTitle}
												onChange={(value) => updateObj('tabLists', value, index, 'subTitle')}
											/>}
										</div>
									</button>
								);
							})}
							<div
								className="b-blocks-advanced-tabs-button-add"
								onClick={() => {
									handleAddTab();
								}}
							>
								<Dashicon icon="plus" />
							</div>
						</div>
						{/* </div> */}

						<div className="b-blocks-advanced-tabs-contents" ref={tabContentRef}>
							<InnerBlocks
								templateLock={false}
								template={tabLists.length > 0 ? TEMPLATE : []}
								// template={(tabs || []).map((item, index) => [
								// 	CHILD_TAB_BLOCK,
								// 	{
								// 		// tabId: String(index + 1),
								// 		// tabParentId: blockId,
								// 		lock: { remove: true, move: true }
								// 	}
								// ])}
								renderAppender={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
}
)(Edit);