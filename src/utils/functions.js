export const isBlockEnabled = (name) => {
	const disabledBlocks = bBlocksDisabledBlocks || [];

	return !disabledBlocks.includes(name);
}