import { useBlockProps } from '@wordpress/block-editor';
import EmojiStackSeparator from '../Common/EmojiStackSeparator';
import Settings from './Settings/Settings';
import Style from '../Common/Style';

const Edit = (props) => {
    const { attributes, clientId } = props;
const { align } = attributes;

    const blockProps = useBlockProps( {
        className: `align${ align }`,
    } );

    return <>
            {/* <BlockControls>
                <AlignmentToolbar
                    value={ align }
                    onChange={ ( newAlign ) => setAttributes( { align: newAlign } ) }
                    alignmentControls={ [
                        { icon: 'align-wide', title: __( 'Wide width', 'b-blocks' ), align: 'wide' },
                        { icon: 'align-full-width', title: __( 'Full width', 'b-blocks' ), align: 'full' },
                    ] }
                />
            </BlockControls> */}
            <Settings {...props} />
            <Style attributes={attributes} id={`block-${clientId}`} />
            <div {...blockProps}>
                <EmojiStackSeparator attributes={attributes} />
            </div>
        </>
}
export default Edit