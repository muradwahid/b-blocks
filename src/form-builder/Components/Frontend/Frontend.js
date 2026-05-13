import { useEffect, useRef } from 'react';
import BForm from './BForm';

const Frontend = ({ attributes, templateContent }) => {
  const wrapperRef = useRef(null);

  // useEffect(() => {
  //   const el = ref.current;
  //   if (!el || !templateContent) return;

  //   el.replaceChildren(templateContent.cloneNode(true));

  //   el.dispatchEvent(new CustomEvent('bblocks:inputField:loaded', {
  //     bubbles: true
  //   }));
  // }, [templateContent]);


  useEffect(() => {
      if (!wrapperRef.current || !templateContent) return;
      if (templateContent.dataset.moved === '1') {

        return;
      }
  
      const slideNodes = Array.from(templateContent.children);
      wrapperRef.current.append(...slideNodes);
      templateContent.dataset.moved = '1';
  
    }, [wrapperRef.current, templateContent]);

  return (
    <BForm attributes={attributes} isFrontend={true}>
      <div className="b-blocks-b-form-child-field-wrapper" ref={wrapperRef} />
    </BForm>
  );
};

export default Frontend;