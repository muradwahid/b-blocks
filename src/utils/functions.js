import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

export const firstTitle = title => <p className='bBlocksLabel'>{__(title, 'b-blocks')}</p>;
export const otherTitle = title => <p className='bBlocksLabel' style={{ marginTop: '25px' }}>{__(title, 'b-blocks')}</p>;
export const truncate = (str, no_words) => str && str.split(' ').splice(0, no_words).join(' ');
export const renderHTML = raw => <span dangerouslySetInnerHTML={{ __html: raw }} />;
export const mediaUrl = id => select('core').getMedia(id)?.source_url;
export const tabController = () => {
	setTimeout(() => {
		const panelBodies = document.querySelectorAll('.components-panel__body-title button');
		panelBodies.forEach(item => {
			item.addEventListener('click', clickEveryItem);
		});

		function clickEveryItem() {
			this.removeEventListener('click', clickEveryItem);
			panelBodies.forEach(item => {
				if (item.getAttribute('aria-expanded') === 'true' && !item.isEqualNode(this)) {
					item.click();
				}
			});
			setTimeout(() => {
				this.addEventListener('click', clickEveryItem);
			}, 500);
		}
	}, 500);
}