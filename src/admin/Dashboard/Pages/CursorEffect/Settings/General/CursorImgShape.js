import { Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { RadioControlPro } from '../../../../../../../../bpl-tools/ProControls';

const CursorImgShape = ({ bBlocksCursor, setBBlocksCursor, dirUrl, isPremium, isProModalOpen, setIsProModalOpen }) => {

  return (
    <div className='mt20'>

      {/* <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} labelPosition='edge' label={__('Theme', 'image-compare')} value={theme} options={[{ label: "Default", value: "default" }, { label: "Slider", value: "slider" }]} onChange={(val) => setAttributes({ theme: val })} Component={SelectControl} /> */}

      <Flex justify='center'>
        <RadioControlPro
          label={__("Select Cursor", 'b-blocks')}
          help=""
          className="bBlocks-radioPremium-control"
          selected={bBlocksCursor?.shape?.customImg?.img}
          options={[
            { label: <img src={dirUrl + "assets/cursorImg/cursor1.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor1.png` },
            { label: <img src={dirUrl + "assets/cursorImg/cursor2.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor2.png` },
            { label: <img src={dirUrl + "assets/cursorImg/cursor3.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor3.png` },
            { label: <img src={dirUrl + "assets/cursorImg/cursor4.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor4.png` },
          ]}
          onChange={(value) => setBBlocksCursor({ ...bBlocksCursor, shape: { ...bBlocksCursor?.shape, customImg: { ...bBlocksCursor?.shape?.customImg, img: value } } })}
          isProModalOpen={isProModalOpen}
          isPremium={isPremium}
          setIsProModalOpen={setIsProModalOpen}
          labelPosition="left"
        />
      </Flex>
    </div>
  );
};

export default CursorImgShape;