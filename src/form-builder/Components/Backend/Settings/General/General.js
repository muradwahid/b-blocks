import ButtonContent from './ButtonContent';
import EmailOptionSettings from './EmailOptionSettings';
import FormOptions from "./FormOptions";
import FormOptionSettings from './FormOptionSettings';
import MessageOptions from "./MessageOptions";
import SignOut from './SignOut';
import TermsConditionSettings from './TermsConditionSettings';
const General = (props) => {
    const { attributes } = props;
    const { form } = attributes;
    const { formType } = form;
    return <>
        {/* <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" /> */}
        <FormOptions {...props} />

        <ButtonContent {...props} />

        {formType !== 'contact' && <FormOptionSettings {...props} />}

        {formType === 'register'  && <EmailOptionSettings {...props} />}

        {formType === 'register' && <TermsConditionSettings {...props} />}
        
        <MessageOptions {...props} />

        {formType !== 'contact' && <SignOut {...props} />}
   
    </>
}
export default General;

// className = 'bPlPanelBody' 