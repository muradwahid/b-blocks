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

			${pricingTables?.map((priceTable, index) => {
				const { color } = priceTable;

				const defPriceTableSelect = `#bBlocksPricingTables-${clientId} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;
				const priceTableSelect = hasClass => `#bBlocksPricingTables-${clientId}.is-style-${hasClass} .bBlocksPricingTables #bBlocksPriceTable-${index} .bBlocksPriceTable`;

				return `
				${defPriceTableSelect} .priceName,
				${priceTableSelect('basic')} .priceAmountWrap,
				${priceTableSelect('standard')} .priceAmountWrap{
					color: ${color};
				}
				${defPriceTableSelect} .priceLink,
				${priceTableSelect('basic')} .priceName,
				${priceTableSelect('standard')}::before,
				${priceTableSelect('ultimate')} .priceAmountWrap{
					color: #fff;
					background-color: ${color};
				}
				${priceTableSelect('basic')} .priceName::before{
					border-top-color: ${color};
				}
				`;
			}).join(' ')}
			`.replace(/\s+/g, ' ')
		}} />
	</>
}
export default Style;