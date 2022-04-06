export const calcPercentage = (child, parent) => 100 * parseFloat(child / parent);
export const elWidth = el => parseInt(el?.clientWidth);
export const elHeight = el => parseInt(el?.clientHeight);
export const childPositionSet = (position, sliderContent, childPositionsForOld, isBackend = false, resetPosition) => {
    const contentChild = sliderContent?.children || [];

    const revI = [...Array(contentChild?.length).keys()].reverse();
    const middleI = Math.ceil(contentChild?.length / 2 - 1);
    const beforeMiddleRevI = [...Array(middleI).keys()].reverse();
    for (let i = 0; i < contentChild?.length; i++) {
        const contentChildWidthPer = calcPercentage(elWidth(contentChild[i]), elWidth(sliderContent));
        const contentChildHeightPer = calcPercentage(elHeight(contentChild[i]), elHeight(sliderContent));

        if (0 < contentChildWidthPer && 0 < contentChildHeightPer && isFinite(contentChildWidthPer) && isFinite(contentChildHeightPer)) {
            const verticalLeft = 5.8;
            const verticalCenter = (50 - (contentChildWidthPer / 2));
            const verticalRight = (100 - contentChildWidthPer - verticalLeft);

            const horizontalTop = ((i + 1) * 11);
            const horizontalCenterQuery = i === middleI ? 50 : i < middleI ? 50 - (11 * (beforeMiddleRevI[i] + 1)) : 50 + (11 * (i - middleI));
            const horizontalCenter = (horizontalCenterQuery - (contentChildHeightPer / 2));
            const horizontalBottom = (100 - (11 * (i + 1)) - contentChildHeightPer);

            switch (position) {
                case 'top left':
                    childPositionsForOld(i, horizontalTop, verticalLeft);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'top center':
                    childPositionsForOld(i, horizontalTop, verticalCenter);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'top right':
                    childPositionsForOld(i, horizontalTop, verticalRight);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'center left':
                    childPositionsForOld(i, horizontalCenter, verticalLeft);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'center center':
                    childPositionsForOld(i, horizontalCenter, verticalCenter);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'center right':
                    childPositionsForOld(i, horizontalCenter, verticalRight);
                    isBackend && i + 1 === contentChild?.length && resetPosition();
                    break;
                case 'bottom left':
                    childPositionsForOld(revI[i], horizontalBottom, verticalLeft);
                    isBackend && 0 === revI[i] && resetPosition();
                    break;
                case 'bottom center':
                    childPositionsForOld(revI[i], horizontalBottom, verticalCenter);
                    isBackend && 0 === revI[i] && resetPosition();
                    break;
                case 'bottom right':
                    childPositionsForOld(revI[i], horizontalBottom, verticalRight);
                    isBackend && 0 === revI[i] && resetPosition();
                    break;
            }
        }
    }
}