import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

const Edit = props => {
    const { className, attributes: { btnAlign, btnOne, btnOneColor, btnOneBGColor, btnTwo, btnTwoColor, btnTwoBGColor }, setAttributes } = props;

    return (
        <div className={`${className} text-${btnAlign}`}>
            <div className='btnHolder'>
                <RichText className='btn btnOne' tagName='a' value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} style={{ color: btnOneColor, backgroundColor: btnOneBGColor }} />

                <RichText className='btn btnTwo' tagName='a' value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} style={{ color: btnTwoColor, backgroundColor: btnTwoBGColor }} />
            </div>
        </div>
    );
};
export default Edit;