import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";

import generateCSS from "../../../../../bpl-tools/Advanced/generateCSS";
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';

const Style = ({ attributes, id, isBackend = false }) => {
    const { formInput, button, form, labels, errorMessage, messages, advanced } = attributes;

    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .login-form-main-wrapper`;
    const formWrapper = `${blockSl} .login-form-wrapper`;
    const field = `${formWrapper} .form-field`;

    return  <style
            dangerouslySetInnerHTML={{
                __html: `
        ${generateCSS(id, advanced, isBackend)}
		${getTypoCSS("", labels.typography)?.googleFontLink}
        ${getTypoCSS("", formInput.typography)?.googleFontLink}
        ${getTypoCSS("", errorMessage.typography)?.googleFontLink}
        ${getTypoCSS("", messages.typography)?.googleFontLink}
        ${formWrapper}{
            ${isValidCSS('row-gap', form.fieldGap)}
        }
        ${field} input{
            ${isValidCSS('padding',getBoxCSS(formInput.padding))}
            ${isValidCSS('color',formInput.color)}
            ${isValidCSS('background-color', formInput.bgColor)}
            ${getBorderBoxCSS(formInput.border)}
            ${isValidCSS('border-radius', getBoxCSS(formInput.radius))}
        }
        ${getTypoCSS(`${field} input`, formInput.typography).styles}
        ${formWrapper} .login-submitBtn{
            ${isValidCSS('justify-content', button.alignment.desktop)}
        }
        ${field} .loginForm-errorMessage{
            color:${errorMessage.color} !important;
        }
        ${getTypoCSS(`${field} .loginForm-errorMessage`, errorMessage.typography).styles }
        ${field} .password-inputField .passwordEyeIcon{
            right:${formInput.icon.position}px;
            ${isValidCSS('color', formInput.icon.color)}
            font-size:${formInput.icon.size}px;
        }
        ${formWrapper} .login-submitBtn .submitBtn{
            ${isValidCSS('color',button.normal.colors.text)}
            ${getBackgroundCSS(button.normal.colors.bg)};
            ${button.alignment.desktop === "justify" && `width:100%`};
            ${isValidCSS('padding',getBoxCSS(button.padding))}
            ${getBorderBoxCSS(button.normal.border)};
            ${isValidCSS('box-shadow',getMultiShadowCSS(button.normal.shadow))}
        }
        ${formWrapper} .login-submitBtn .submitBtn:hover{
            ${isValidCSS('color', button.hover.colors.text)}
            ${getBackgroundCSS(button.hover.colors.bg)};
            ${getBorderBoxCSS(button.hover.border)};
            ${isValidCSS('box-shadow', getMultiShadowCSS(button.hover.shadow))}
        }
        ${getTypoCSS( `${formWrapper} .login-submitBtn .submitBtn`, button.typography).styles}
        ${formWrapper} .login-lostPassword a{
            ${isValidCSS('color',form.linkColor)}
        }
        ${formWrapper} .login-lostPassword a:hover{
            ${isValidCSS('color', form.linkHovColor)}
        }
        ${formWrapper} .form-label{
            ${isValidCSS('padding-bottom', labels.space)}
            ${isValidCSS('color',labels.color)}
        }
        ${getTypoCSS(`${formWrapper} .form-label`, labels.typography).styles}
        ${getTypoCSS(`${formWrapper} .bpl-success-message`, labels.typography).styles }
        ${formWrapper} .bpl-success-message{
            ${isValidCSS('color', messages.success.color.text)}
            ${isValidCSS('background', messages.success.color.bg)}
            ${isValidCSS('padding', getBoxCSS(messages.padding))}
        }
        ${getTypoCSS(`${formWrapper} .lgfr-login-failed-error`, labels.typography).styles}

        ${formWrapper} .lgfr-login-failed-error{
            ${isValidCSS('color',messages.error.color.text)}
            ${isValidCSS('background', messages.error.color.bg)}
            ${isValidCSS('padding', getBoxCSS(messages.padding))}

        }
        ${blockSl} .form-error-message{
            ${getBackgroundCSS(messages.normal.color.bg)};
            ${isValidCSS('padding', getBoxCSS(messages.normal.padding))}
            ${isValidCSS('border-radius', getBoxCSS(messages.normal.radius))}
            ${getBorderBoxCSS(messages.normal.border)}
        }
        ${blockSl} .form-error-message :where(svg,span){
        ${isValidCSS('color', messages.normal.color.text)}
        }


        ${tabBreakpoint} {
            ${formWrapper} .login-submitBtn{
                ${isValidCSS('justify-content', button.alignment.tablet)}
            }
            ${formWrapper} .login-submitBtn .submitBtn{
                ${button.alignment.tablet === "justify" ? `width:100%`:'width:auto'};
            }
        }

        ${mobileBreakpoint} {
            ${formWrapper} .login-submitBtn{
                ${isValidCSS('justify-content', button.alignment.mobile)}
            }
            ${formWrapper} .login-submitBtn .submitBtn{
                ${button.alignment.mobile === "justify" ? `width:100%`:'width:auto'};
            }
        }
	`,
            }}
        />
};
export default Style;
