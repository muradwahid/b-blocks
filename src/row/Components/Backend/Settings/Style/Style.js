import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

//bpl-tools
import { Background, Label } from '../../../../../../../bpl-tools/Components';
import { BorderControl, ShadowControl, SpaceControl } from '../../../../../../../bpl-tools/Components/Deprecated';

// b blocks utils
import { overflows } from '../../../../utils/options';


const Style = (props) => {
    const { attributes, setAttributes } = props;
    const { overflow, background, padding, border, shadow } = attributes;
    return <>
        <PanelBody className='bPlPanelBody' title={__('Row Style', 'b-blocks')} initialOpen={true}>
            <PanelRow>
                <Label className=''>{__('Overflow:', 'b-blocks')}</Label>
                <SelectControl value={overflow} onChange={val => setAttributes({ overflow: val })} options={overflows} />
            </PanelRow>

            <Background className='mt20' label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />

            <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} />

            <BorderControl label={__('Border', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />

            <ShadowControl label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
        </PanelBody>
    </>
};

export default Style;