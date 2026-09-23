import { premiumBlocks } from './data';

// export const isBlockEnabled = (name) => {
// 	const isPremium = bBlocksPremiumChecker;
// 	const disabledBlocks = bBlocksDisabledBlocks || [];
// 	const checkProBlock = premiumBlocks.includes(name);
// 	if (!isPremium && checkProBlock) {
// 		return false;
// 	}
// 	return !disabledBlocks.includes(name);
// }

export const isBlockEnabled = (name) => {
	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const disabledBlocks = typeof bBlocksDisabledBlocks !== 'undefined' ? (bBlocksDisabledBlocks || []) : [];
	const checkProBlock = premiumBlocks.includes(name);
	if (!isPremium && checkProBlock) {
		return false;
	}
	return !disabledBlocks.includes(name);
}