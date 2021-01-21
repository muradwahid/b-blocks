const { __ } = wp.i18n;

const func = {
    firstTitle: title => <p className="panel_single-title">{__(title, 'b-blocks')}</p>,
    otherTitle: title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{__(title, 'b-blocks')}</p>
}
export default func;