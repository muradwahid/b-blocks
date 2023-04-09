import { select } from '@wordpress/data';

export const truncate = (str, no_words) => str && str.split(' ').splice(0, no_words).join(' ');
export const renderHTML = raw => <span dangerouslySetInnerHTML={{ __html: raw }} />;
export const mediaUrl = id => select('core').getMedia(id)?.source_url;
export const filterSelected = (taxonomy, selected) => taxonomy?.map(tax => tax.id)?.filter(tax => selected.indexOf(tax) !== -1);