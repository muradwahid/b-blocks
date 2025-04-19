import { useBlockProps } from '@wordpress/block-editor';
import { useState } from 'react';

import Style from '../Common/Style';
import DataTableBack from './DataTableBack/DataTableBack';
import Settings from './Settings/Settings';

const Edit = props => {
  const { attributes, setAttributes, clientId } = props;
  const [firstIdx, setFirstIdx] = useState(0);
  const [headingIdx, setHeadingIdx] = useState(0);

  return (
    <>
      <Settings
        {...{
          attributes,
          setAttributes,
          firstIdx,
          headingIdx,
          setHeadingIdx
        }}
      />

      <div {...useBlockProps()}>
        <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
        <DataTableBack {...{ attributes, setAttributes, setFirstIdx, setHeadingIdx }} />
      </div>
    </>
  );
}
export default Edit;