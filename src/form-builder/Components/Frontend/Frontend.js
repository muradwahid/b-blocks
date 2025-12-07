import { useEffect, useRef } from 'react';
import BForm from './BForm';

const Frontend = ({ attributes, templateContent }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !templateContent) return;

    el.replaceChildren(templateContent.cloneNode(true));

    el.dispatchEvent(new CustomEvent('bblocks:inputField:loaded', {
      bubbles: true
    }));
  }, [templateContent]);

  return (
    <BForm attributes={attributes} isFrontend={true}>
      <div className="b-blocks-b-form-child-field-wrapper" ref={ref} />
    </BForm>
  );
};

export default Frontend;