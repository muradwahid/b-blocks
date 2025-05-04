import React from "react";
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS} from "../../../../../bpl-tools/utils/getCSS";
import { btnAlign } from "../../utils/functions";

const StyleThree = ({ attributes, id }) => {
  const { termsConditions, button, password, validation } = attributes;
  const mainSl = `#${id}`;
  const blockSl = `${mainSl} .wp-block-b-blocks-register-form-wrapper`;
  const mainWrapper = `${blockSl} .rgfr-register-form-main-wrapper`;
  const formWrapper = `${mainWrapper} .rgfr-register-form`;
  const formContainer = `${formWrapper} .rgfr-registerForm-container`;
  const formEl = `${formContainer} .rgfr-register-form-wrapper`;
  const checkBoxEl = `${formEl} .rgfr-checkbox-wrapper`;
  const inputWrapper = `${formEl} .rgfr-inputField-wrapper`;
  const inputField = `${inputWrapper} .rgfr-register-input-field`;
  const buttonWrapper = `${formEl} .rgfr-registerFormBtn-wrapper`;
  const signUpButton = `${buttonWrapper} .rgfr-register-loader-wrapper`;
  const signinButton = `${buttonWrapper} .rgfr-signInBtn-wrapper`;
  const successMessageEl = `${formContainer} .rgfr-successMessage`;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
				${
          getTypoCSS(
            `${inputField} .rgfr-passStrengthTextWrapper span`,
            password.passStrengthTxt.typography
          ).styles
        }
    ${inputField} .rgfr-passStrengthTextWrapper span{
      margin:${getBoxCSS(password.passStrengthTxt.margin.desktop)};
      padding:${getBoxCSS(password.passStrengthTxt.padding.desktop)};
    }
  

    ${getTypoCSS(checkBoxEl, termsConditions.typography).styles}

    ${checkBoxEl}{
      margin:${getBoxCSS(termsConditions.margin.desktop)};
      padding:${getBoxCSS(termsConditions.padding.desktop)};
      color:${termsConditions.color.text};
      background:${termsConditions.color.bg};
    }
    ${checkBoxEl} :where(a){
      color:${termsConditions.color.link};
    }
    ${checkBoxEl} .container{
      margin:${getBoxCSS(termsConditions.checkboxMargin.desktop)};
    }
    ${checkBoxEl} .container input:checked ~ .checkmark {
      background:${termsConditions.color.checkbox};
    }
    ${buttonWrapper}{
      flex-direction:${button.signup.displayAs.desktop};
      align-items: ${
        button.signup.displayAs.desktop === "column"
          ? btnAlign(button.signup.alignment.desktop)
          : "center"
      };
      justify-content:${button.signup.justifyContent.desktop};
    }
    ${signUpButton}{
      margin:${getBoxCSS(button.signup.margin.desktop)};
    }
    
    ${
      getTypoCSS(`${signUpButton} .rgfr-signupBtn`, button.signup.typography)
        .styles
    }
    ${signUpButton} .rgfr-signupBtn{
      height:${button.signup.height.desktop};
      width:${button.signup.width.desktop};
      padding:${getBoxCSS(button.signup.padding.desktop)};
      color:${button.signup.color.normal.color};
      ${getBackgroundCSS(button.signup.color.normal.bg)}
      ${getBorderCSS(button.signup.border.normal)}
    }

    ${signUpButton} .rgfr-signupBtn:hover{
      color:${button.signup.color.hover.color};
      ${getBackgroundCSS(button.signup.color.hover.bg)};
      ${getBorderCSS(button.signup.border.hover)};
    }
    ${signUpButton} .rgfr-loader{
      right:${button.signup.spinner.position}%;
      color:${button.signup.spinner.color};
    }

    ${getTypoCSS(`${signinButton} a`, button.signin.typography).styles}
    ${signinButton}{
      flex-direction:${button.signin.displayAs.desktop};
      ${
        button.signin.displayAs.desktop === "row"
          ? `justify-content:${button.signin.justifyContent.desktop}`
          : `align-items:${button.signin.alignItems.desktop}`
      };
      width:${button.signin.width.container.desktop}
    }
    ${signinButton} :where(a){
      width:${button.signin.width.width.desktop};
      height:${button.signin.height.desktop};
      color:${button.signin.color.normal.color};
      ${getBackgroundCSS(button.signin.color.normal.bg)}
      margin:${getBoxCSS(button.signin.margin.desktop)};
      padding:${getBoxCSS(button.signin.padding.desktop)};
      ${getBorderCSS(button.signin.border.normal)}
    }
    ${signinButton} :where(a):hover{
      color:${button.signin.color.hover.color};
      ${getBackgroundCSS(button.signin.color.hover.bg)}
      ${getBorderCSS(button.signin.border.hover)}
    }
    ${successMessageEl} {
      margin:${getBoxCSS(validation.success.styles.margin)};
      padding:${getBoxCSS(validation.success.styles.padding)};
      ${getBorderCSS(validation.success.styles.border)}
      ${getBackgroundCSS(validation.success.styles.color.bg)}
    }
    ${
      getTypoCSS(`${successMessageEl} span`, validation.success.styles.typo)
        .styles
    }
    ${successMessageEl} span{
      color:${validation.success.styles.color.text};
    }
			`
          .replace(/\s+/g, " ")
          .trim(),
      }}
    ></style>
  );
};

export default StyleThree;
