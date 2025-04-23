import { useSelect } from "@wordpress/data";
import { useEffect, useRef, useState } from "react";

export const useHeadingDetect = () => {
  const [headingContent, setHeadingContent] = useState(null);
  const [headingTags, setHeadingTags] = useState([]);
  const previousBlocks = useRef([]);
  const blocks = useSelect((select) => {
    return select('core/block-editor').getBlocks();
  }, []);

  useEffect(() => {
    const currentBlocks = blocks;
    const prevBlocks = previousBlocks.current;
    const currentHeadingBlocks = currentBlocks.filter(block => block.name === 'core/heading');
    const previousHeadingBlocks = prevBlocks.filter(block => block.name === 'core/heading');
    currentHeadingBlocks.forEach(currentBlock => {

      const previousBlock = previousHeadingBlocks.find(block => block.clientId === currentBlock.clientId);
      if (previousBlock && previousBlock.attributes.content !== currentBlock.attributes.content) {
        setHeadingContent(currentBlock.attributes.content);
      }
    });
    const newHeadingTags = currentHeadingBlocks.map(block => ({
      level: block.attributes.level,
      content: block.attributes.content,
    }));
    setHeadingTags(newHeadingTags);
    previousBlocks.current = currentBlocks;
  }, [blocks]);
  return { headingContent, headingTags };
};