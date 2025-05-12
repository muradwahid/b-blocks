import { useBlockProps } from '@wordpress/block-editor';

import BsCodeSlash from '../../utils/icons';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = props => {
    const { attributes, setAttributes, clientId } = props;
    const { htmlCode } = attributes;

    return  <>
            <Settings {...{ attributes, setAttributes }} />

            <div {...useBlockProps()} id={`html-block-${clientId}`}>
                <Style attributes={attributes} id={`html-block-${clientId}`} isBackend={true} />
                {htmlCode ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlCode }}></div>
                ) : (
                    <div>
                            <div><div className="html-placeholder">
                                <BsCodeSlash />
                            </div></div>
                    </div>
                )}
            </div>
        </> 
}
export default Edit;