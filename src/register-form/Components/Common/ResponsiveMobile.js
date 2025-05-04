import React from "react";
import { getBoxCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
import { btnAlign } from "../../utils/functions";

const ResponsiveMobile = ({ attributes, id }) => {
  const { formHeader, formFields, general, termsConditions, formLabel, fieldIcons, button, password } = attributes;
  const mainSl = `#${id}`;
  const blockSl = `${mainSl} .wp-block-b-blocks-register-form-wrapper`;
  const mainWrapper = `${blockSl} .rgfr-register-form-main-wrapper`;
  const formWrapper = `${mainWrapper} .rgfr-register-form`;
  const formContainer = `${formWrapper} .rgfr-registerForm-container`;
  const formEl = `${formContainer} .rgfr-register-form-wrapper`;
  const checkBoxEl = `${formEl} .rgfr-checkbox-wrapper`;
  const logoWrapper = `${formEl} .rgfr-register-logo-wrapper`;
  const logoEl = `${logoWrapper} .rgrf-register-logo`;
  const headingWrapper = `${logoWrapper} .rgfr-register-heading`;
  const formImage = `${formWrapper} .rgfr-register-image-wrapper`;
  const inputWrapper = `${formEl} .rgfr-inputField-wrapper`;
  const inputField = `${inputWrapper} .rgfr-register-input-field`;
  const labelEl = `${inputWrapper} .rgfr-register-input-label`;
  const fieldsIcon = `${inputField} .rgfr-inputField .rgfr-inputField-icon`;
  const buttonWrapper = `${formEl} .rgfr-registerFormBtn-wrapper`;
  const signUpButton = `${buttonWrapper} .rgfr-register-loader-wrapper`;
  const signinButton = `${buttonWrapper} .rgfr-signInBtn-wrapper`;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
					@media (max-width:640px){
    ${mainWrapper}{
      justify-content:${general.containerBox.alignment.mobile};
    }
    ${formWrapper}{
      ${isValidCSS("width", general.containerBox.width.mobile)}
      ${isValidCSS("flex-direction", formHeader.image.img.url ? formHeader.image.position.mobile : "")}
      ${isValidCSS("justify-content", formHeader.image.img.url ? "normal" : "center")}
    }
    ${formContainer}{
      width:${general.formWrapper.width.mobile};
      margin:${getBoxCSS(general.formWrapper.margin.mobile)};
      padding:${getBoxCSS(general.formWrapper.padding.mobile)};;
    }
    ${formEl}{
      width:${general.form.width.mobile};
      margin:${getBoxCSS(general.form.margin.mobile)};
      padding:${getBoxCSS(general.form.padding.mobile)};
    }
    ${formImage}{
      margin:${getBoxCSS(formHeader.image.margin.mobile)};
      padding:${getBoxCSS(formHeader.image.padding.mobile)};
    }
    ${formImage} img {
      height:${formHeader.image.height.mobile};
      width:${formHeader.image.width.mobile};
    }
    ${logoWrapper}{
      width:${formHeader.header.width.mobile};
      height:${formHeader.header.height.mobile};
      margin:${getBoxCSS(formHeader.header.margin.mobile)};
      padding:${getBoxCSS(formHeader.header.padding.mobile)};
    }
    ${logoEl} img{
      height:${formHeader.header.logo.height.mobile};
      width:${formHeader.header.logo.width.mobile};
      margin:${getBoxCSS(formHeader.header.logo.margin.mobile)};
      padding:${getBoxCSS(formHeader.header.logo.padding.mobile)};
    }
    ${headingWrapper}{
      width:calc(100% - ${formHeader.header.logo.width.mobile} + ${formHeader.header.logo.url.url ? "0px" : formHeader.header.logo.width.mobile});
    }
    ${headingWrapper} img{
      object-fit:contain;
      height:${formHeader.header.logo.height.mobile};
      width:${formHeader.header.logo.width.mobile};
      margin:${getBoxCSS(formHeader.header.logo.margin.mobile)};
      padding:${getBoxCSS(formHeader.header.logo.padding.mobile)};
    }
    ${headingWrapper} h4{
      margin:${getBoxCSS(formHeader.header.title.margin.mobile)};
      padding:${getBoxCSS(formHeader.header.title.padding.mobile)};
    }
    ${headingWrapper} .rgfr-register-subHeading{
      margin:${getBoxCSS(formHeader.header.subTitle.margin.mobile)};
      padding:${getBoxCSS(formHeader.header.subTitle.padding.mobile)};
    }
    ${inputField}{
      margin:${getBoxCSS(formFields.input.margin.mobile)};
    }
      ${formFields.fields
        .map(
          (val, i) =>
            inputField +
            `.rgfr-width-${i + 1}{
      width:${val.width.mobile};
      }`
        )
        .join(" ")}
    ${labelEl}{
      margin:${getBoxCSS(formLabel.margin.mobile)};
      padding:${getBoxCSS(formLabel.padding.mobile)};
      }
    ${inputField} .rgfr-inputField input{
      padding-top:${formFields.input.padding.mobile.top};
      padding-left:${formFields.fieldIcons ? `calc(24px + ${formFields.input.padding.mobile.left})` : formFields.input.padding.mobile.left};
    }
    ${fieldsIcon}{
      width:${fieldIcons.icon.iconSize.mobile}px;
      top:${fieldIcons.icon.vertical.mobile}px;
      left:${fieldIcons.icon.horizontal.mobile}px;
    }
    ${inputField} .rgfr-inputField .register-eyeIcon.open{
      width:${fieldIcons.passVisibility.iconSize.mobile}px;
      top:${fieldIcons.passVisibility.vertical.mobile};
      right:${fieldIcons.passVisibility.horizontal.mobile};
    }
    ${inputField} .rgfr-inputField .register-eyeIcon.close{
      width:${fieldIcons.passVisibility.iconSize.mobile}px;
      top:${fieldIcons.passVisibility.vertical.mobile};
      right:${fieldIcons.passVisibility.horizontal.mobile};
    }
    ${inputField} .passLength, .rgfr-passStrengthTextWrapper{
      width:${password.container.width.mobile};
      height:${password.container.height.mobile};
      margin:${getBoxCSS(password.container.margin.mobile)};
      padding:${getBoxCSS(password.container.padding.mobile)};
    }
    ${inputField} .passLength .rgfr-strengthMeter{
      width:${password.meter.width.mobile};
      height:${password.meter.height.mobile};
      margin:${getBoxCSS(password.meter.margin.mobile)};
      padding:${getBoxCSS(password.meter.padding.mobile)};
    }
    ${inputField} .rgfr-passStrengthTextWrapper span{
      margin:${getBoxCSS(password.passStrengthTxt.margin.mobile)};
      padding:${getBoxCSS(password.passStrengthTxt.padding.mobile)};
    }
    ${checkBoxEl}{
      margin:${getBoxCSS(termsConditions.margin.mobile)};
      padding:${getBoxCSS(termsConditions.padding.mobile)};
    }
    ${checkBoxEl} .container{
      margin:${getBoxCSS(termsConditions.checkboxMargin.mobile)};
    }
    ${buttonWrapper}{
      flex-direction:${button.signup.displayAs.mobile};
      align-items: ${button.signup.displayAs.mobile === "column" ? btnAlign(button.signup.alignment.mobile) : "center"};
      justify-content:${button.signup.justifyContent.mobile};
    }
    ${signUpButton}{
      margin:${getBoxCSS(button.signup.margin.mobile)};
    }
    ${signUpButton} .rgfr-signupBtn{
      height:${button.signup.height.mobile};
      width:${button.signup.width.mobile};
      padding:${getBoxCSS(button.signup.padding.mobile)};
    }
    ${signinButton}{
      flex-direction:${button.signin.displayAs.mobile};
      ${button.signin.displayAs.mobile === "row" ? `justify-content:${button.signin.justifyContent.mobile}` : `align-items:${button.signin.alignItems.mobile}`};
      width:${button.signin.width.container.mobile}
    }
    ${signinButton} :where(a){
      width:${button.signin.width.width.mobile};
      height:${button.signin.height.mobile};
      margin:${getBoxCSS(button.signin.margin.mobile)};
      padding:${getBoxCSS(button.signin.padding.mobile)};
    }
    }
			`,
      }}
    ></style>
  );
};

export default ResponsiveMobile;
