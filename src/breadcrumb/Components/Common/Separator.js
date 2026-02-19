import { Fragment } from 'react';

const Separator = ({ separator }) => {
  const { type, text, library } = separator;
  return <Fragment>
    {type === 'text' && <span className='bBlocks-breadCrumb-item-separator' > {text}</span>}
    {type === 'library' && <span className='bBlocks-breadCrumb-item-separator bBlocks-breadCrumb-item-separator-library' dangerouslySetInnerHTML={{__html: library}} />}
  </Fragment>
};

export default Separator;