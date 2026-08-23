import { useCallback, useEffect, useState } from 'react';

const useHeadingElements = (tagName, titleTag, titleText, titleSl, titleHeadingSl, blockWrapper) => {
  const [content, setContent] = useState([]);
  const [savedElements, setSavedElements] = useState([]);

  const processHeadingElement = useCallback((headingElement) => {
    if (headingElement.className === titleHeadingSl) return null;

    // Remove all children except the first one
    Array.from(headingElement.children).slice(1).forEach(child => child.remove());

    return {
      contents: headingElement.textContent,
      tag: headingElement.tagName,
      id: headingElement.children[0]?.getAttribute("id"),
    };
  }, []);

  // const addAnchorsToHeadings = useCallback((headingElements) => {
  //   Array.from(headingElements).forEach((headingElement, index) => {
  //     const span = document.createElement("span");
  //     span.setAttribute("id", `bppb-heading-anchor-${index}`);
  //     headingElement.insertAdjacentElement("afterbegin", span);
  //   });
  // }, []);

  const addAnchorsToHeadings = useCallback((headingElements) => {
    Array.from(headingElements).forEach((headingElement, index) => {
      if (headingElement.className == titleHeadingSl) return;
      if (headingElement?.children) {
        const hasExistingId = Array.from(headingElement?.children).some(child => child.getAttribute("id")?.startsWith("bppb-heading-anchor-"))
        if (!hasExistingId) {
          const span = document.createElement("span");
          span.setAttribute("id", `bppb-heading-anchor-${index}`);
          headingElement.insertAdjacentElement("afterbegin", span);
        }
      }
    });
  }, []);

  const processTitleHeading = useCallback((removeAttrHeading, titleText) => {
    if (!removeAttrHeading) return;

    if (removeAttrHeading.tagName.toLowerCase() !== "div") {
      const removeSpan = removeAttrHeading.querySelector("span");
      removeSpan?.remove();
    }

    removeAttrHeading.innerHTML = titleText;
  }, []);

  useEffect(() => {
    const fetchAndProcessHeadings = () => {
      // Get heading blocks and find their DOM elements
      // const headingBlocks = blocks.filter(block => block.name === 'core/heading');
      // const headingElements = headingBlocks
      //   .map(block => {
      //     const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
      //     return blockElement?.matches(tagName.join(',')) ? blockElement : null;
      //   })
      //   .filter(Boolean);

      // if (!headingElements?.length) return;

      // // Process heading elements
      // const elements = headingElements
      //   .map(processHeadingElement)
      //   .filter(Boolean);
      // console.log(elements);
      // setSavedElements(elements);
      // addAnchorsToHeadings(headingElements);

      // const root = document.querySelector(".wp-block-post-content");
      const doc = blockWrapper?.ownerDocument || blockWrapper || document;
      const root = doc?.querySelector(".wp-block-post-content");
      if (!root && !blockWrapper) return;

      const selectorString = tagName.join(", ");
      const headingElements = root?.querySelectorAll(selectorString);
      if (!headingElements?.length) return;

      // Process heading elements
      const elements = Array.from(headingElements)
        .map(processHeadingElement)
        .filter(Boolean);

      setSavedElements(elements);
      addAnchorsToHeadings(headingElements);

      // Process title
      const title = document.querySelector(titleSl);
      const removeAttrHeading = title?.querySelector(titleTag);
      processTitleHeading(removeAttrHeading, titleText);

      setContent(headingElements);
    };

    fetchAndProcessHeadings();
  }, [tagName, titleTag, titleText, titleSl, processHeadingElement, addAnchorsToHeadings, processTitleHeading, blockWrapper]);

  return { savedElements, content };
};

export default useHeadingElements;