import { HelpPanel } from "../../../../../../../bpl-tools/Components";
import ButtonContent from './ButtonContent';
import EmailOptionSettings from './EmailOptionSettings';
import FormFieldSettings from './FormFieldSettings';
import FormHeader from './FormHeader';
import FormOptionSettings from './FormOptionSettings';
import SocialSignUp from './SocialSignUp';
import TermsConditionSettings from './TermsConditionSettings';
import ValidationSettings from './ValidationSettings';
const General = (props) => {

    return (
        <>
            <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

            <FormHeader {...props} />

            <FormFieldSettings {...props} />

            <ButtonContent {...props} />

            <SocialSignUp {...props} />

            <FormOptionSettings {...props} />

            <EmailOptionSettings {...props} />

            <TermsConditionSettings {...props} />

            <ValidationSettings {...props} />
        </>
    );
}
export default General;

// className = 'bPlPanelBody' 