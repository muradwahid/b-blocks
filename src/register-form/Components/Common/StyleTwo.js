import React from "react";
import { getBackgroundCSS, getBorderCSS, getBoxCSS, getTypoCSS} from "../../../../../bpl-tools/utils/getCSS";

const StyleTwo = ({ attributes, id }) => {
  const { formFields, formLabel, fieldIcons, password, validation } = attributes;
  const mainSl = `#${id}`;
  const blockSl = `${mainSl} .wp-block-b-blocks-register-form-wrapper`;
  const mainWrapper = `${blockSl} .rgfr-register-form-main-wrapper`;
  const formWrapper = `${mainWrapper} .rgfr-register-form`;
  const formContainer = `${formWrapper} .rgfr-registerForm-container`;
  const formEl = `${formContainer} .rgfr-register-form-wrapper`;
  const inputWrapper = `${formEl} .rgfr-inputField-wrapper`;
  const inputField = `${inputWrapper} .rgfr-register-input-field`;
  const labelEl = `${inputWrapper} .rgfr-register-input-label`;
  const fieldsIcon = `${inputField} .rgfr-inputField .rgfr-inputField-icon`;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `

    ${formFields.fields
      .map(
        (val, i) =>
          inputField +
          `.rgfr-width-${i + 1}{
      width:${val.width.desktop}
      }`
      )
      .join(" ")}
		${getTypoCSS(labelEl, formLabel.typography).styles}
    ${labelEl}{
      margin:${getBoxCSS(formLabel.margin.desktop)};
      padding:${getBoxCSS(formLabel.padding.desktop)};
      color:${formLabel.color.text};
      background:${formLabel.color.bg};
      ${getBorderCSS(formLabel.border)}
      }
    ${getTypoCSS(`${inputField} .rgfr-inputField input`, formFields.input.typography).styles}

    ${inputField} .rgfr-inputField input{
      color:${formFields.input.color.normal.text};
      background:${formFields.input.color.normal.bg};
      padding-top:${formFields.input.padding.desktop.top};
      padding-left:${formFields.fieldIcons ? `calc(24px + ${formFields.input.padding.desktop.left})` : formFields.input.padding.desktop.left};
      padding-bottom:${formFields.input.padding.desktop.bottom};
      padding-right:${formFields.input.padding.desktop.right};
      text-align:${formFields.input.txtAlign};
      ${getBorderCSS(formFields.input.border.normal)}
    }

    ${getTypoCSS(`${inputField} .rgfr-input-errorMessage`, validation.error.styles.typo).styles}

    ${inputField} .rgfr-input-errorMessage{
      margin:${getBoxCSS(validation.error.styles.margin)};
      color:${validation.error.styles.color};
    }

    ${inputField} .rgfr-inputField input::placeholder{
      color:${formFields.input.color.normal.placeholder};
    }

    ${inputField} .rgfr-inputField input:focus{
      background:${formFields.input.color.focus.bg};
      ${getBorderCSS(formFields.input.border.focus)};
    }
    ${inputField} .rgfr-inputField input:focus::placeholder{
      color:${formFields.input.color.focus.placeholder};
    }
    ${fieldsIcon}{
      width:${fieldIcons.icon.iconSize.desktop}px;
      fill:${fieldIcons.icon.color};
      top:${fieldIcons.icon.vertical.desktop}px;
      left:${fieldIcons.icon.horizontal.desktop}px;
    }

    ${inputField} .rgfr-inputField .register-eyeIcon.open{
      width:${fieldIcons.passVisibility.iconSize.desktop}px;
      color:${fieldIcons.passVisibility.openColor};
      top:${fieldIcons.passVisibility.vertical.desktop};
      right:${fieldIcons.passVisibility.horizontal.desktop};
    }
    ${inputField} .rgfr-inputField .register-eyeIcon.close{
      width:${fieldIcons.passVisibility.iconSize.desktop}px;
      color:${fieldIcons.passVisibility.closeColor};
      top:${fieldIcons.passVisibility.vertical.desktop};
      right:${fieldIcons.passVisibility.horizontal.desktop};
    }

    ${inputField} .passLength, .rgfr-passStrengthTextWrapper{
      width:${password.container.width.desktop};
      height:${password.container.height.desktop};
      margin:${getBoxCSS(password.container.margin.desktop)};
      padding:${getBoxCSS(password.container.padding.desktop)};
      ${getBorderCSS(password.container.border)}
      ${getBackgroundCSS(password.container.bg)}
    }

    ${inputField} .passLength .rgfr-strengthMeter{
      width:${password.meter.width.desktop};
      height:${password.meter.height.desktop};
      margin:${getBoxCSS(password.meter.margin.desktop)};
      padding:${getBoxCSS(password.meter.padding.desktop)};
      ${getBorderCSS(password.meter.border)}
    }
    ${Object.keys(password.colors)
      .map((value) => {
        return `  ${inputField} .passLength .${value}{
        background:${password.colors[value]};
    }`;
      })
      .join("")}
    ${Object.keys(password.colors)
      .map((value) => {
        return `  ${inputField} .${value}-text{
        color:${password.colors[value]};
    }`;
      })
      .join("")}
		`
          .replace(/\s+/g, " ")
          .trim(),
      }}
    ></style>
  );
};

export default StyleTwo;
