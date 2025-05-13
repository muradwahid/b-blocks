
import { useBlockProps } from '@wordpress/block-editor';

import Facebook from '../Common/Facebook';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = props => {
    const { attributes, setAttributes, clientId } = props;

    const { isPremium = false } = usePremiumInEditor();

    const updateObj = updateAttributes(attributes, setAttributes);

    return  <>
        <Settings {...{ attributes, setAttributes, updateObj, isPremium }} />

            <div {...useBlockProps()} >
                <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
                <Facebook key={JSON.stringify(attributes.facebook)} attributes={attributes} />
            </div>
        </> 
}
export default Edit;