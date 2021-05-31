import { __ } from '@wordpress/i18n';

const func = {
    firstTitle: title => <p className="panel_single-title">{__(title, 'b-blocks')}</p>,
    otherTitle: title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{__(title, 'b-blocks')}</p>,
    truncate: (str, no_words) => str && str.split(' ').splice(0, no_words).join(' '),
    renderHTML: raw => <span dangerouslySetInnerHTML={{ __html: raw }} />
}
export default func;