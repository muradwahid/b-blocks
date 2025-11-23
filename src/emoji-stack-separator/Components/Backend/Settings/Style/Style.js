import { BorderBoxControl, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

import { Background, BoxControl } from '../../../../../../../bpl-tools/Components';

const Style = ({ attributes, setAttributes }) => {
    const { padding, margin, background, height, border, borderRadius } = attributes;
    return <PanelBody title={__('Emoji Container', 'b-blocks')} className='bPlPanelBody' initialOpen={true} >

        <UnitControl label={__('Height', 'b-blocks')} value={height} onChange={(value) => setAttributes({ height: value }) } step={8}/>

        <BoxControl label={__('Padding', 'b-blocks')} values={padding} onChange={val => setAttributes({ padding: val })} />

        <BoxControl className='mt10' label={__('Margin', 'b-blocks')} values={margin} onChange={val => setAttributes({ margin: val })} />
        
        <Background label={__('Background', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />
        
        <BorderBoxControl label={__('Border', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />
        
        <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={borderRadius} onChange={val => setAttributes({ borderRadius: val })} />

    </PanelBody>
}
export default Style