// import Sass
import './style.scss';

// Pricing Tables
document.addEventListener('DOMContentLoaded', () => {
    const allPricingTables = document.querySelectorAll('.wp-block-b-blocks-pricing-table');

    Object.values(allPricingTables).map(priceTable => {
        const isUltimate = priceTable.className?.includes('ultimate');

        const priceFeaturesAll = document.querySelectorAll(`#${priceTable.id} .bBlocksPricingTables .bBlocksPriceTable .priceFeatures`);

        const priceFeaturesHeight = [];
        priceFeaturesAll?.forEach(priceFeatures => {
            priceFeaturesHeight.push(priceFeatures?.clientHeight);
        });

        priceFeaturesAll?.forEach(priceFeatures => {
            priceFeatures.style.height = Math.max(...priceFeaturesHeight) + 'px';
        });

        if (isUltimate) {
            const priceTableAll = document.querySelectorAll(`#${priceTable.id} .bBlocksPricingTables .bBlocksPriceTable`);
            const priceAmountWrapAll = document.querySelectorAll(`#${priceTable.id} .bBlocksPricingTables .bBlocksPriceTable .priceAmountWrap`);

            priceTableAll?.forEach((priceTable, index) => {
                const widthOfPriceWrap = priceTable?.clientHeight / 100 * 82;

                priceAmountWrapAll[index].style.width = `${widthOfPriceWrap}px`;
                priceAmountWrapAll[index].style.top = `${widthOfPriceWrap / 2}px`;
                priceAmountWrapAll[index].style.left = `${-widthOfPriceWrap / 2 + 60}px`;
            });
        }
    });
});