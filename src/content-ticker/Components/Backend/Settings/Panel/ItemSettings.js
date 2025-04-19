import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

const ItemSettings = ({ attributes, setAttributes, index }) => {
  const { content } = attributes;
  const item = content[index]
  return (
    <>
      <InputControl
        label={__("Content", "b-blocks")}
        className="mt5"
        value={item.text}
        onChange={(value) => setAttributes({ content: updateData(content, value, index, "text") })}
      />
      <InputControl
        label={__("Link", "b-blocks")}
        className="mt10"
        value={item.link}
        onChange={(value) => setAttributes({ content: updateData(content, value, index, "link") })}
      />
    </>
  );
};

export default ItemSettings;