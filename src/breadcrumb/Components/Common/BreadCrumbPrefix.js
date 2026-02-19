import { Fragment } from 'react';
import Separator from './Separator';

const BreadCrumbPrefix = ({ prefix, isBeforeSeparator, separator }) => {
  const { type, text, library, image } = prefix;

  return <Fragment>
    {type === "text" && <span className='bBlocks-breadCrumb-item bBlocks-breadCrumbItem-prefix bBlocks-breadCrumbItem-prefixText'>{text}</span>}
    {
      type === "library" && <span className='bBlocks-breadCrumb-item bBlocks-breadCrumbItem-prefix bBlocks-breadCrumbItem-prefixIcon' dangerouslySetInnerHTML={{ __html: library }} />
    }
    {type === "image" && <span className='bBlocks-breadCrumb-item bBlocks-breadCrumbItem-prefix bBlocks-breadCrumbItem-prefixImage' >
      {image && <img src={image} alt="" />}
    </span>}
    {isBeforeSeparator && <Separator separator={separator} />}
  </Fragment>
};

export default BreadCrumbPrefix;