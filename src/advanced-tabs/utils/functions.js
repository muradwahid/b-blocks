import { createBlock } from "@wordpress/blocks";
import { select, dispatch } from "@wordpress/data";

const CHILD_TAB_BLOCK = "b-blocks/container";

export const addTab = ({
  clientId,
  tabLists,
  setAttributes,
  handleTabTitleClick, // optional
}) => {
  const innerBlocks = [...select("core/block-editor").getBlocks(clientId)];

  const maxId = (tabLists || []).reduce(
    (acc, curr) => Math.max(Number(acc), Number(curr?.id || 0)),
    0
  );
  const nextId = maxId + 1;

  const newItem = {
    title: `Tab ${nextId}`,
    subTitle: "",
    id: nextId,
    iconType: "none",
    image: "",
    svg: "",
    library: "",
    isExpanded: false,
    isDefault: false,
    customId: "",
  };

  const newChildBlock = createBlock(CHILD_TAB_BLOCK, {
    lock: { remove: true, move: true },
    className: 'b-blocks-advanced-tabs-panel b-blocks-advanced-tabs-panel-' + nextId
  });

  innerBlocks.push(newChildBlock);

  // Replace inner blocks first, then update attributes
  dispatch("core/block-editor")
    .replaceInnerBlocks(clientId, innerBlocks, false)
    .then(() => {
      setAttributes({ tabLists: [...(tabLists || []), newItem] });
      if (handleTabTitleClick) handleTabTitleClick(String(nextId));
    });
};