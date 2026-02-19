import { Fragment } from 'react';
import Separator from './Separator';
import BreadCrumbPrefix from './BreadCrumbPrefix';

const BreadCrumb = ({ attributes, crumbs }) => {
  const { separator, options, prefix } = attributes;
  return <div className='bBlocks-breadCrumb-wrapper'>
    <div className='bBlocks-breadCrumb-items'>
    {options.isShowPrefix && <BreadCrumbPrefix prefix={prefix} separator={separator} isBeforeSeparator={options.isBeforeSeparator} />}

      {
        crumbs.map((crumb, index) => <Fragment key={index}>
        {index !== 0 && <Separator separator={separator} />}
          {crumb?.url ? <span className={`bBlocks-breadCrumb-item ${index === crumbs.length - 1 ? 'bBlocks-breadCrumb-item-active' : ''}`}><a href={crumb.url}>{crumb.label}</a></span> : <span className={`bBlocks-breadCrumb-item ${index === crumbs.length - 1 ? 'bBlocks-breadCrumb-item-active' : ''}`}>{crumb.label}</span>}
      </Fragment>)
      }

    </div>
  </div>
};

export default BreadCrumb;