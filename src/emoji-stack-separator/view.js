import { createRoot } from 'react-dom/client';
import EmojiStackSeparator from './Components/Common/EmojiStackSeparator';

import './style.scss';
import Style from './Components/Common/Style';
document.addEventListener('DOMContentLoaded', () => {
	const emojiStackSeparatorEls = document.querySelectorAll('.wp-block-b-blocks-emoji-stack-separator');
	emojiStackSeparatorEls.forEach(emojiStackSeparatorEl => {
		let attributes = {};

		try {
			const raw = emojiStackSeparatorEl.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('Emoji Stack Separator: Invalid attributes JSON', e);
		}

		createRoot(emojiStackSeparatorEl).render(<>
			<Style attributes={attributes} id={emojiStackSeparatorEl.id}/>
			<EmojiStackSeparator attributes={attributes} />
		</>);

		emojiStackSeparatorEl?.removeAttribute('data-attributes');
	});
});