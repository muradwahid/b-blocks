import { getShadowCSS, getSpaceCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId, isStandard }) => {
	const { pricingTables, columnGap, rowGap, textAlign, padding, shadow } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			#bBlocksPricingTables-${clientId} .bBlocksPricingTables{
				grid-gap: ${rowGap} ${columnGap};
				text-align: ${textAlign};
				padding: ${isStandard ? '30px 0' : '0'}
			}
			#bBlocksPricingTables-${clientId} .bBlocksPricingTables .bBlocksPriceTable{
				padding: ${getSpaceCSS(padding)};
				box-shadow: ${getShadowCSS(shadow)};
			}
			`.replace(/\s+/g, ' ')
		}} />

		<style>
			{pricingTables?.map((priceTable, index) => {
				const defPriceTableSelect = `#bBlocksPricingTables-${clientId} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;
				const priceTableSelect = hasClass => `#bBlocksPricingTables-${clientId}.is-style-${hasClass} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;

				return `
				${defPriceTableSelect} .priceName,
				${priceTableSelect('basic')} .priceAmountWrap,
				${priceTableSelect('standard')} .priceAmountWrap{
					color: ${priceTable.color};
				}
				${defPriceTableSelect} .priceLink,
				${priceTableSelect('basic')} .priceName,
				${priceTableSelect('standard')}::before,
				${priceTableSelect('ultimate')} .priceAmountWrap{
					color: #fff;
					background-color: ${priceTable.color};
				}
				${priceTableSelect('basic')} .priceName::before{
					border-top-color: ${priceTable.color};
				}
				`.replace(/\s+/g, ' ')
			})}
		</style>
	</>
}
export default Style;