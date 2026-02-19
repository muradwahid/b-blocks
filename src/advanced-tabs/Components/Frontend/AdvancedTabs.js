import { useEffect, useMemo, useRef, useState } from 'react';

const AdvancedTabs = ({ attributes, templateContent }) => {
	const { tabLists = [], tabs } = attributes;

	const tabWrapRef = useRef(null);
	const contentRef = useRef(null);

	const [activeTabId, setActiveTabId] = useState(null);

	const activeDefaultTabId = useMemo(() => {
		const defaultItem = (tabLists || []).find((t) => t.isDefault);
		return tabs?.isCloseAllTab ? "" : String((defaultItem || { id: 1 })?.id);
	}, [tabLists, tabs?.isCloseAllTab]);

	useEffect(() => {
		if (activeTabId === null) setActiveTabId(activeDefaultTabId || null);
	}, [activeDefaultTabId]);

	const getMyPanels = []


	const showTab = (id) => {
		setActiveTabId(String(id));

		const panels = Array.from(contentRef?.current?.children).filter((el) =>
			el.classList.contains('b-blocks-advanced-tabs-panel')
		);

		panels.forEach((panel) => {
			const isActive = panel.classList.contains(`b-blocks-advanced-tabs-panel-${id}`);

			// simplest: display toggling (same as backend)
			panel.style.display = isActive ? "block" : "none";

			// If you want transitions instead, replace with:
			// panel.classList.toggle("is-active", isActive);
		});
	};

	// Inject template content into contentRef
	useEffect(() => {
		const el = contentRef.current;
		if (!el || !templateContent) return;

		el.replaceChildren(templateContent.cloneNode(true));

		// Initial show/hide after injecting panels
		if (tabs?.isCloseAllTab) {
			// hide all
			Array.from(contentRef?.current?.children).filter((el) =>
				el.classList.contains('b-blocks-advanced-tabs-panel')
			).forEach((p) => (p.style.display = "none"));
			// if using transitions: p.classList.remove("is-active")
		} else {
			// show default or first
			const firstId = tabLists?.[0]?.id;
			const startId = activeDefaultTabId || (firstId ? String(firstId) : null);
			if (startId) showTab(startId);
		}
	}, [templateContent]);

	// If closeAll toggles via attributes, re-apply
	useEffect(() => {
		if (!contentRef.current) return;

		if (tabs?.isCloseAllTab) {
			setActiveTabId(null);
			Array.from(contentRef?.current?.children).filter((el) =>
				el.classList.contains('b-blocks-advanced-tabs-panel')
			).forEach((p) => (p.style.display = "none"));
		} else {
			const firstId = tabLists?.[0]?.id;
			const startId = activeDefaultTabId || (firstId ? String(firstId) : null);
			if (startId) showTab(startId);
		}
	}, [tabs?.isCloseAllTab,contentRef]);

	return <div className="b-blocks-advanced-tabs-main-wrapper">
		<div className={`b-blocks-advanced-tabs-wrapper`} ref={tabWrapRef}>
			<div className="b-blocks-advanced-tabs-button-lists">
				{(tabLists || []).map((item, index) => {
					return (
						<button
							key={`${index}-${item.id}`}
							data-title-tab-id={item.id}
							onClick={() => {
								showTab(item.id)
							}}
							className={`b-blocks-advanced-tabs-button ${activeTabId == item.id ? 'b-blocks-advanced-tabs-button-active' : 'b-blocks-advanced-tabs-button-normal'}`}
						>
							{(tabs.isShowIcon && item.iconType !== 'none') && <p className="b-blocks-advanced-tabs-button-icon" dangerouslySetInnerHTML={{ __html: item?.[item.iconType] }}>
							</p>}
							<div className="b-blocks-advanced-tabs-button-title-container">
								<span className="b-blocks-advanced-tabs-button-title" dangerouslySetInnerHTML={{ __html: item.title }}></span>

								{tabs.isShowSubTitle && <span className="b-blocks-advanced-tabs-button-subTitle" dangerouslySetInnerHTML={{ __html: item.subTitle }}></span>}
							</div>
						</button>
					);
				})}
			</div>
			{/* </div> */}

			<div className="b-blocks-advanced-tabs-contents" ref={contentRef}>
			</div>
		</div>
	</div>
}
export default AdvancedTabs;