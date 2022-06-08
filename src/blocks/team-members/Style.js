const Style = ({ attributes, clientId }) => {
	const { members = [], columnGap, rowGap, layout, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, titleTypo, titleMargin, sepMargin, bioTypo, bioMargin, socialSize, socialIconMargin } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${nameTypo?.googleFontLink ? `@import url(${nameTypo?.googleFontLink});` : ''}
			${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink});` : ''}
			${bioTypo?.googleFontLink ? `@import url(${bioTypo?.googleFontLink});` : ''}

			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers{
				grid-gap: ${rowGap} ${columnGap};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember{
				text-align: ${textAlign};
				padding: ${padding?.styles || '50px 20px'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberPhoto{
				width: ${photoWidth};
				margin: ${'horizontal' === layout ? '0 20px 0 0' : `${photoMargin?.styles || '0 0 20px 0'}`};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberName{
				${nameTypo?.styles || 'font-size: 20px; font-weight: 600;'}
				margin: ${nameMargin?.styles || '0 0 10px 0'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberTitle{
				${titleTypo?.styles || 'font-size: 16px;'}
				margin: ${titleMargin?.styles || '0 0 10px 0'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSeparator{
				margin: ${sepMargin?.styles || '0 0 15px 0'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberBio{
				${bioTypo?.styles || 'font-size: 15px;'}
				margin: ${bioMargin?.styles || '0 0 15px 0'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .icon, #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .memberSocialAdd{
				margin: ${socialIconMargin?.styles || '10px 10px'};
			}
			#bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .icon i, #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .memberSocialAdd i{
				font-size: ${socialSize};
				width: ${socialSize};
			}
			`.replace(/\s+/g, ' ')
		}} />

		{members.map((item, index) => {
			const { background, border, shadow, photoBorder, nameColor, titleColor, separator, bioColor, socialIconColors } = item;

			return <style key={index} dangerouslySetInnerHTML={{
				__html: `
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index}{
					${background?.styles || 'background-color: #0000;'}
					${border?.styles || 'border-radius: 3px;'}
					box-shadow: ${shadow?.styles || 'none'};
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberPhoto{
					${photoBorder?.styles || 'border-radius: 50%;'}
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberName{
					color: ${nameColor};
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberTitle{
					color: ${titleColor};
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberSeparator{
					${separator?.styles || 'width: 20%; border-top: 3px solid #777;'}
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberBio{
					color: ${bioColor};
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial{
					justify-content: ${'center' === textAlign ? 'center' : 'right' === textAlign ? 'flex-end' : 'flex-start'}
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li a{
					${socialIconColors?.styles || 'color: #fff; background: #4527a4;'}
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li.isSelected{
					border: 2px solid ${socialIconColors?.bg};
				}
				#bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li.memberSocialAdd button i{
					color: ${socialIconColors?.bg};
				}
				`.replace(/\s+/g, ' ')
			}} />;
		})}
	</>;
}
export default Style;