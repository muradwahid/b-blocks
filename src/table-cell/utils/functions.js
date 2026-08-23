export const findAncestorByName = (clientId, targetName, getBlockRootClientId, getBlockName) => {
  let currentId = clientId;
  while (currentId) {
    const parentId = getBlockRootClientId(currentId);
    if (!parentId) return null;
    if (getBlockName(parentId) === targetName) return parentId;
    currentId = parentId;
  }
  return null;
};