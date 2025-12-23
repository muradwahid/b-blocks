import { TextControl } from '@wordpress/components'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const SignOut = ({ attributes, setAttributes }) => {
    const { button } = attributes;
    return <PanelBody title={__('Sign Out', 'b-blocks')} className='bPlPanelBody'>
        <TextControl label={__('Sign Out Label Text', 'b-blocks')} value={button?.signout?.text?.first} onChange={(value) => setAttributes({ button: {...button, signout: {...button?.signout, text: {...button?.signout?.text, first: value } } } })} />
        
        <TextControl className='mt10' label={__('Sign Out Button Text', 'b-blocks')} value={button?.signout?.text?.second} onChange={(value) => setAttributes({ button: {...button, signout: {...button?.signout, text: {...button?.signout?.text, second: value } } } })} />
    </PanelBody>
}

export default SignOut