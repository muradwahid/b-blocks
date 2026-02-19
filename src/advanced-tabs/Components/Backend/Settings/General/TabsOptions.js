import { ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TabsOptions = (props) => {
  const { attributes, updateObj, setAttributes } = props
  const { tabs, tabLists } = attributes;
  return <PanelBody className='bPlPanelBody' title={__('Options', 'b-blocks')} initialOpen={false}>
    <ToggleControl className='mt10' label={__('Show Title', 'b-blocks')} checked={tabs?.isShowTitle} value={tabs.isShowTitle} onChange={(val) => updateObj('tabs', val, 'isShowTitle')} />

    <ToggleControl className='mt10' label={__('Show Sub Title', 'b-blocks')} checked={tabs?.isShowSubTitle} value={tabs.isShowSubTitle} onChange={(val) => updateObj('tabs', val, 'isShowSubTitle')} />

    {tabs.isShowSubTitle && <ToggleControl className='mt10' label={__('Show Only Tab Active Sub Title', 'b-blocks')} checked={tabs?.isShowActiveSubTitle} value={tabs.isShowActiveSubTitle} onChange={(val) => updateObj('tabs', val, 'isShowActiveSubTitle')} />}

    <ToggleControl className='mt10' label={__('Show Icon', 'b-blocks')} checked={tabs?.isShowIcon} value={tabs.isShowIcon} onChange={(val) => updateObj('tabs', val, 'isShowIcon')} />

    <ToggleControl className='mt10' label={__('Close All Tabs Initially', 'b-blocks')} checked={tabs?.isCloseAllTab} value={tabs.isCloseAllTab} onChange={(val) => {
      const nextTabs = val
        ? tabLists?.map((tab) => ({ ...tab, isDefault: false }))
        : tabLists?.map((tab, i) => ({ ...tab, isDefault: i === 0 }));
      setAttributes({ tabLists: nextTabs, tabs: { ...tabs, isCloseAllTab: val } });
    }} />
    </PanelBody>
};

export default TabsOptions;