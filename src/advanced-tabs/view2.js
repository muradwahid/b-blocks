import "./style.scss";

document.addEventListener("DOMContentLoaded", () => {
	const advancedTabsEls = document.querySelectorAll(".wp-block-b-blocks-advanced-tabs");

	advancedTabsEls.forEach((advancedTabsEl) => {
		const tabsWrapper = advancedTabsEl.querySelector(".b-blocks-advanced-tabs-wrapper");
		if (!tabsWrapper) return;
		const isCloseAll = JSON.parse(tabsWrapper.dataset.closeAll || 'false');

		const buttonLists = tabsWrapper.querySelector(".b-blocks-advanced-tabs-button-lists");

		const buttons = Array.from(buttonLists?.children);

		const contents = tabsWrapper.querySelector(".b-blocks-advanced-tabs-contents");
		if (buttons.length === 0 || !contents) return;

		// const panels = Array.from(
		// 	contents.querySelectorAll('.b-blocks-advanced-tabs-panel')
		// );

		const hideAll = () => {
			Array.from(contents?.children)?.forEach((p) => (p.style.display = "none"));
			buttons.forEach(b => { 
				b.classList.remove('b-blocks-advanced-tabs-button-active')
				b.classList.add('b-blocks-advanced-tabs-button-normal')
				b.setAttribute('data-active-tab', 'false');
			})
		};

		const showPanel = (panelId) => { 
			if (!panelId) return;
			hideAll();

			// const panel = contents.querySelector(`.b-blocks-advanced-tabs-panel-${panelId}`);
			const panel = Array.from(contents?.children)?.find((p) => p.classList.contains(`b-blocks-advanced-tabs-panel-${panelId}`));
			// console.log(panels," : ",panelId)
			if (panel) panel.style.display = "block";
			const button = buttons.find(b => String(b.dataset.titleTabId) === String(panelId));
			if (button) { 
				button.classList.add('b-blocks-advanced-tabs-button-active');
				button.classList.remove('b-blocks-advanced-tabs-button-normal');
				button.setAttribute('data-active-tab', 'true');
			}

		}

		if (isCloseAll) {
			hideAll();
		} else { 
			const defaultBtn = buttons.find(b => b.dataset.activeTab === "true") || buttons[0];
			if (defaultBtn?.dataset?.titleTabId) {
				showPanel(defaultBtn.dataset.titleTabId);
			}
		}

		buttons.forEach(b => { 
			b.addEventListener('click', e => { 
				e.preventDefault();
				const btnId = b.dataset.titleTabId;
				if (btnId) showPanel(btnId);
			})
		})

		advancedTabsEl.removeAttribute("data-attributes");
	});
});
