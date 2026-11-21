import { useEffect, useRef, useState } from 'react';

import { useWPAjax } from "../../../../../../../bpl-tools/hooks";

import CursorEffects from '../../../../../customCursor/cursor/Effects/CursorEffects';
import Cursor from '../../../../../customCursor/cursor/Shape/Cursor';
import CursorRibbon from '../../../../../customCursor/cursor/Shape/CursorRibbon/CursorRibbon';
import useCursorVisibility from "../../../../../customCursor/hooks/useCursorVisibility";
import Card from './Card';
import { cardOptions } from './options';
import { isSet } from '../../../../../customCursor/utils/common';
import { pricingPage } from '../../../../../utils/data';
// import CursorEffects from '../../../../src/settings/options/CursorEffects';
const Playground = ({ info }) => {
  const { nonce } = info;

  const { data, isLoading } = useWPAjax('bBlocks_get_cursor_data_settings', { nonce }); //authorize
  const [cursorData, setCursorData] = useState(null);
  const isCursorVisible = useCursorVisibility();
  const dashboardRef = useRef(null);
  const { enableCursor = true } = cursorData || {};

  useEffect(() => {
    const dataFetched = (e) => {
      const { data } = e.detail || {};
      setCursorData(data);
    };


    window.addEventListener('bBlocksCursorPlayground', dataFetched);

    return () => {
      window.removeEventListener('bBlocksCursorPlayground', dataFetched);
    };

  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      setCursorData(data);
    }

  }, [data, isLoading]);

  const cursorCssVar = {
    ...((isSet(cursorData?.shape?.customImg?.img) && cursorData?.source == "predefined") && { cursor: `url(${cursorData?.shape?.customImg?.img}), pointer` }),
    ...(cursorData?.source == "shape" && { cursor: enableCursor ? "auto" : "none" }),
    ...((isSet(cursorData?.shape?.customImg?.url) && cursorData?.source == "customUrl") && { cursor: `url(${cursorData?.shape?.customImg?.url}), pointer` }),
  }
  // console.log(csbIsPremium)
  return <div className='custom-cursor-playground-container' >
    <h3 className='custom-cursor-title'>Preview Area - Please move the mouse pointer inside the box below and click to see the changes.</h3>
    <div className='custom-cursor-playground' ref={dashboardRef} style={cursorCssVar} >
      <div className='custom-cursor-playground-contents-wrapper'>
        <div>
          <h2 className='custom-cursor-playground-contents-title'>bBlocks – The ultimate block collection<br/> and Gutenberg page builder.</h2>
          <p className='custom-cursor-playground-contents-description'><a href='https://bblockswp.com' target='_blank' rel="noreferrer" className='cursorPlaygroundLink'>bBlocks</a> is a Gutenberg addon that powers up your Block editor. It can be used as a WordPress page-building tool, which contains a variety of beautiful blocks. It is optimized for performance and provides you with maximum options to achieve your design goals.</p>

          <div className='custom-cursor-playground-contents-button-wrapper'>
            <a href={`https://bblockswp.com/#demos`} target='_blank' rel="noreferrer" className='bPlDashboardPrimaryBtn'>See Demo</a>
            <a href={pricingPage} target='_blank' rel="noreferrer" className='bPlDashboardSecondBtn'>Buy Now</a>
          </div>
        </div>

        <div className='custom-cursor-playground-contents-features'>
          {cardOptions.map((value, i) => <Card key={i} {...value} />)}
        </div>

      </div>
      {/* <button style={{height:"50px",width:"100px",marginInline:"auto"}}>Hover me</button> */}
      {
        cursorData?.source == "shape" && <>
          {(cursorData?.shape?.type === 'ribbon' && isCursorVisible) && <CursorRibbon {...cursorData?.shape?.ribbon} domEl={dashboardRef.current} eventEl={dashboardRef.current} rect={dashboardRef.current.getBoundingClientRect()} key={cursorData?.shape?.type} />}

          {(cursorData?.shape?.type && cursorData?.shape?.type !== 'ribbon' && isCursorVisible) ? <Cursor shape={cursorData?.shape} domEl={dashboardRef.current} eventEl={dashboardRef.current} rect={dashboardRef.current.getBoundingClientRect()} key={cursorData?.shape?.type} isDashboard={true} /> : null}
        </>
      }

      {cursorData?.effect?.type && <CursorEffects domEl={dashboardRef.current} effect={cursorData?.effect} key={cursorData?.effect?.type} />}
      {/* {cursorData?.effect?.type !== 'none' && <CursorEffects effect={cursorData?.effect} key={cursorData?.effect?.type} isDashboard={true} />} */}
    </div>
  </div>
};

export default Playground;