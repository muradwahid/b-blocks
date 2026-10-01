import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ItemsPanel } from "../../../../../../../bpl-tools/Components";
import ItemSettings from './ItemSettings';
import { addTab } from '../../../../utils/functions';
import { select, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

const TabListSettings = (props) => {
  const { attributes, setAttributes, updateObj, clientId, activeIndex, setActiveIndex } = props;
  const { tabLists } = attributes;
  const newItem = {
    title: `Tab ${tabLists.length + 1}`,
    subTitle: "",
    id: tabLists.length + 1,
    iconType: "none",
    image: "",
    svg: "",
    library: "",
    isExpanded: false,
    isDefault: false,
    customId: ""
  }

  const handleAddTab = () => {
    addTab({
      clientId,
      blockId: "",
      tabLists,
      setAttributes
    });
  };

  const handleRemoveTab = (idx) => {
    const innerBlocks = [...select("core/block-editor").getBlocks(clientId)];
    const tab = tabLists[idx];
    if (tab?.id) {
      innerBlocks.forEach((block, index) => {
        if (block?.attributes?.className.split(" ").includes(`b-blocks-advanced-tabs-panel-${tab?.id}`)) {
          const restBlocks = [...innerBlocks.slice(0, index), ...innerBlocks.slice(index + 1)];
          dispatch("core/block-editor").replaceInnerBlocks(clientId, restBlocks, false);
          const newValue = [...tabLists.slice(0, idx), ...tabLists.slice(idx + 1)];
          setAttributes({ tabLists: newValue })
        }
      });
    }
  }


  const handleCopyTab = (idx) => {
    const maxId = (tabLists || []).reduce(
      (acc, curr) => Math.max(Number(acc), Number(curr?.id || 0)),
      0
    );

    const innerBlocks = [...select("core/block-editor").getBlocks(clientId)];

    const tab = tabLists[idx];
    if (tab?.id) {
      innerBlocks.forEach((block, index) => {
        if (block?.attributes?.className.split(" ").includes(`b-blocks-advanced-tabs-panel-${tab?.id}`)) {

          const newBlock = createBlock(block.name, { ...block.attributes, className: `b-blocks-advanced-tabs-panel  b-blocks-advanced-tabs-panel-${maxId + 1}`, lock: { remove: true, move: true } }, block?.innerBlocks?.length > 0 ? block?.innerBlocks : []);

          dispatch("core/block-editor").insertBlocks(newBlock, index + 1, clientId)
          const newValue = [...tabLists.slice(0, idx), { ...tab, id: maxId + 1 }, ...tabLists.slice(idx)];
          setAttributes({ tabLists: newValue })
          dispatch("core/block-editor").selectBlock(
            clientId
          );
        }
      })
    }
  }

  return <PanelBody className='bPlPanelBody' title={__('Tab Lists', 'b-blocks')} initialOpen={false}>
    <ItemsPanel {...{ attributes, setAttributes }} handleAdd={handleAddTab} handleDelete={handleRemoveTab} newItem={newItem} design='sortable' itemLabel='Tab' arrKey='tabLists' title='title' ItemSettings={ItemSettings} handleCopy={handleCopyTab} minItem={0} updateObj={updateObj} {...{ activeIndex, setActiveIndex }} />
  </PanelBody>
};

export default TabListSettings;