import { Fragment } from 'react';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const Separator = ({ separator }) => {
  const { type, text, library } = separator;
  return <Fragment>
    {type === 'text' && <span className='bBlocks-breadCrumb-item-separator' > {text}</span>}
    {type === 'library' && <span className='bBlocks-breadCrumb-item-separator bBlocks-breadCrumb-item-separator-library' dangerouslySetInnerHTML={{__html: sanitizeHtml( library )}} />}
  </Fragment>
};

export default Separator;