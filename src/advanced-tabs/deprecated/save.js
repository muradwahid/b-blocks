import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import '../style.scss';
import style from '../Components/Common/Style';
const save = ({ attributes }) => {
  const { tabLists = [], tabs, clientId } = attributes;


  return <div {...useBlockProps.save()} id={`bBlocks-advancedTabs-${clientId}`} data-instance={clientId}>
    <style dangerouslySetInnerHTML={{ __html: style(attributes, `bBlocks-advancedTabs-${clientId}`) }} />
    <div className="b-blocks-advanced-tabs-main-wrapper">
      <div className={`b-blocks-advanced-tabs-wrapper`} data-close-all={tabs?.isCloseAllTab}>
        {/* <div className="b-blocks-advanced-tabs-button-wrapper"> */}
        <div className="b-blocks-advanced-tabs-button-lists">
          {(tabLists || []).map((item, index) => {
            return (
              <button
                key={`${index}-${item.id}`}
                data-title-tab-id={item.id}
                className={`b-blocks-advanced-tabs-button`}
                data-active-tab={item.isDefault}
              >
                {(tabs.isShowIcon && item.iconType !== 'none') && <p className="b-blocks-advanced-tabs-button-icon" dangerouslySetInnerHTML={{ __html: item?.[item.iconType] }}>
                </p>}
                <div className="b-blocks-advanced-tabs-button-title-container">
                  {tabs.isShowTitle && <span
                    className="b-blocks-advanced-tabs-button-title"
                    placeholder="Tab Title"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />}

                  {tabs.isShowSubTitle && <p className="b-blocks-advanced-tabs-button-subTitle">
                    {item.subTitle}
                  </p>}
                </div>
              </button>
            );
          })}
        </div>
        {/* </div> */}

        <div className="b-blocks-advanced-tabs-contents">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  </div>
};

export default save;