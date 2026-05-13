import { createRoot } from 'react-dom/client';
import './style.scss';
import style from './Components/Common/Style';
import AdvancedTabs from './Components/Frontend/AdvancedTabs';
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.wp-block-b-blocks-advanced-tabs[data-attributes]');
    tabs.forEach((tab) => {
        let attributes = {};
        try {
            const raw = tab.dataset.attributes;
            if (raw && raw !== 'undefined' && raw !== '') {
                attributes = JSON.parse(raw);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('tab: Invalid attributes JSON', e);
        }
        const templateContent = tab.querySelector('.b-blocks-advanced-tabs-innerBlocks-contents');
        if (!templateContent) return;

        createRoot(tab).render(<>
            {/* <Style attributes={attributes} id={tab.id} /> */}
            <style dangerouslySetInnerHTML={{ __html: style(attributes, tab.id) }} />
            <AdvancedTabs attributes={attributes} templateContent={templateContent} />
        </>
        );

        tab.removeAttribute('data-attributes');
    });
});