import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';

import { Label, Background } from '../../../../../../../bpl-tools/Components';
import { BorderControl, ShadowControl, SpaceControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { overflows } from '../../../../../row/utils/options';

const Style = ({attributes,setAttributes}) => {
    const { overflow, background, padding, border, shadow } = attributes;

    return<>
			<PanelBody className='bPlPanelBody' title={__('Column Style', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Overflow:', 'b-blocks')}</Label>
					<SelectControl value={overflow} onChange={val => setAttributes({ overflow: val })} options={overflows} />
				</PanelRow>

				<Background className='mt20' label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} />

				<BorderControl className='mt20' label={__('Border', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} />

				<ShadowControl label={__('Shadow', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
        </>
};

export default Style;