import { TabPanel, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InlineDetailMediaUpload } from '../../../../../../../../bpl-tools/Components';
import { BControlPro } from '../../../../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../../../../bpl-tools/utils/functions';
import { beforeAfterImgTab } from '../../../../../utils/options';

const ItemSettings = ({ attributes, updateObj, index, setIsProModalOpen, premiumProps }) => {
  const { slider } = attributes;
  const slide = slider[index];
  const { beforeImg, afterImg, caption } = slide;
  return (
    <div>
      <TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={beforeAfterImgTab} onSelect={tabController}>{tab => <>
        {'before-img' == tab.name && <>

          <BControlPro isPremium={premiumProps} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__('Label', 'image-compare')} value={beforeImg.beforeLabel} onChange={val => updateObj('slider', val, index, "beforeImg", "beforeLabel")} Component={TextControl} />

          <BControlPro isPremium={premiumProps} setIsProModalOpen={setIsProModalOpen} className='mt10' value={beforeImg.img} onChange={val => updateObj('slider', val, index, "beforeImg", "img")} placeholder={__('Enter Image URL', 'image-compare')} Component={InlineDetailMediaUpload} />

        </>}

        {'after-img' == tab.name && <>
          <BControlPro isPremium={premiumProps} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__('Label', 'image-compare')} value={afterImg.afterLabel} onChange={val => updateObj('slider', val, index, "afterImg", "afterLabel")} Component={TextControl} />

          <BControlPro isPremium={premiumProps} setIsProModalOpen={setIsProModalOpen} className='mt10' value={afterImg.img} onChange={val => updateObj('slider', val, index, "afterImg", "img")} placeholder={__('Enter Image URL', 'image-compare')} Component={InlineDetailMediaUpload} />

        </>}
        <BControlPro isPremium={premiumProps} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__('Caption', 'image-compare')} value={caption} onChange={val => updateObj('slider', val, index, "caption")} Component={TextControl} />

      </>}</TabPanel>
    </div>
  );
};

export default ItemSettings;