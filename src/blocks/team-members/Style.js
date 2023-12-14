import { getBackgroundCSS, getBorderCSS, getColorsCSS, getMultiShadowCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { members = [], columnGap, rowGap, layout, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, titleTypo, titleMargin, sepMargin, bioTypo, bioMargin, socialSize, socialIconMargin } = attributes;

	const mainSl = `#bBlocksTeamMembers-${clientId}`;
	const membersSl = `${mainSl} .bBlocksTeamMembers`;
	const gMemberSl = `${membersSl} .bBlocksMember`;
	const gMemberDetailsSl = `${gMemberSl} .memberDetails`;
	const gMemberSocialSl = `${gMemberDetailsSl} .memberSocial`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', nameTypo)?.googleFontLink}
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', bioTypo)?.googleFontLink}
		${getTypoCSS(`${gMemberDetailsSl} .memberName`, nameTypo)?.styles}
		${getTypoCSS(`${gMemberDetailsSl} .memberTitle`, titleTypo)?.styles}
		${getTypoCSS(`${gMemberDetailsSl} .memberBio`, bioTypo)?.styles}

		${membersSl}{
			grid-gap: ${rowGap} ${columnGap};
		}
		${gMemberSl}{
			text-align: ${textAlign};
			padding: ${getSpaceCSS(padding)};
		}
		${gMemberSl} .memberPhoto{
			width: ${photoWidth};
			margin: ${'horizontal' === layout ? '0 20px 0 0' : `${getSpaceCSS(photoMargin)}`};
		}
		${gMemberDetailsSl} .memberName{
			margin: ${getSpaceCSS(nameMargin)};
		}
		${gMemberDetailsSl} .memberTitle{
			margin: ${getSpaceCSS(titleMargin)};
		}
		${gMemberDetailsSl} .memberSeparator{
			margin: ${getSpaceCSS(sepMargin)};
		}
		${gMemberDetailsSl} .memberBio{
			margin: ${getSpaceCSS(bioMargin)};
		}
		${gMemberSocialSl} .icon,
		${gMemberSocialSl} .memberSocialAdd{
			margin: ${getSpaceCSS(socialIconMargin)};
		}
		${gMemberSocialSl} .icon i,
		${gMemberSocialSl} .memberSocialAdd i{
			font-size: ${socialSize};
			width: ${socialSize};
		}

		${members.map((item, index) => {
			const { background, border, shadow, photoBorder, nameColor, titleColor, separator, bioColor, socialIconColors } = item;

			const memberSl = `${mainSl} #bBlocksMember-${index}`;
			const memberDetailsSl = `${memberSl} .memberDetails`;
			const memberSocialSl = `${memberDetailsSl} .memberSocial`;

			return `
				${memberSl}{
					${getBackgroundCSS(background)}
					${getBorderCSS(border)}
					box-shadow: ${getMultiShadowCSS(shadow?.shadow || (shadow?.color ? [shadow] : shadow))};
				}
				${memberSl} .memberPhoto{
					${getBorderCSS(photoBorder)}
				}
				${memberDetailsSl} .memberName{
					color: ${nameColor};
				}
				${memberDetailsSl} .memberTitle{
					color: ${titleColor};
				}
				${memberSl} .memberSeparator{
					${getSeparatorCSS(separator)}
				}
				${memberDetailsSl} .memberBio{
					color: ${bioColor};
				}
				${memberSocialSl}{
					justify-content: ${'center' === textAlign ? 'center' : 'right' === textAlign ? 'flex-end' : 'flex-start'}
				}
				${memberSocialSl} li a{
					${getColorsCSS(socialIconColors)}
				}
				${memberSocialSl} li.isSelected{
					border: 2px solid ${socialIconColors?.bg};
				}
				${memberSocialSl} li.memberSocialAdd button i{
					color: ${socialIconColors?.bg};
				}
			`;
		}).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;