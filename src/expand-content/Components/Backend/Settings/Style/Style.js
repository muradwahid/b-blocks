import { BorderBoxControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const Style = (props) => {
    const { attributes, updateObj } = props;
    const { styles } = attributes;
    const { buttons } = styles;

    return <PanelBody title={__('Button Style', 'b-blocks')} initialOpen={true} className='bPlPanelBody'>
        <p className='mb10'><b>Show More Button</b></p>
        <BoxControl label={__('Padding', 'b-blocks')} values={buttons.showMore.padding} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'padding')} />

        <Background value={buttons.showMore.bg} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'bg')} />

        <ColorControl label={__('Text Color', 'b-blocks')} value={buttons.showMore.color} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'color')} />

        <Typography value={buttons.showMore.typo} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'typo')} />

        <BorderBoxControl label={__('Border', 'b-blocks')} value={buttons.showMore.border} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'border')} />

        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={buttons.showMore.radius} onChange={val => updateObj('styles', val, 'buttons', 'showMore', 'radius')} />

        <p className='mb10 mt10'><b>Show Less Button</b></p>
        <BoxControl label={__('Padding', 'b-blocks')} values={buttons.showLess.padding} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'padding')} />

        <Background value={buttons.showLess.bg} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'bg')} />

        <ColorControl label={__('Text Color', 'b-blocks')} value={buttons.showLess.color} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'color')} />

        <Typography value={buttons.showLess.typo} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'typo')} />

        <BorderBoxControl label={__('Border', 'b-blocks')} value={buttons.showLess.border} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'border')} />

        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={buttons.showLess.radius} onChange={val => updateObj('styles', val, 'buttons', 'showLess', 'radius')} />

    </PanelBody>
};

export default Style;