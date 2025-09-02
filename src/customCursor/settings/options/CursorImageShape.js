import { __ } from '@wordpress/i18n';
import { RadioControlPro } from '../../../../../bpl-tools/ProControls';

const CursorImgShape = ({ csbAvScrData, setCsbAvScrData, isPremium, setIsProModalOpen }) => {

    const { dirUrl } = window.bBlocksCursorDataConfig;
    return (
        <div className='mt20'>
            <RadioControlPro
                gap=''
                direction='column'
                label={__("Select Cursor Image", "b-blocks")}
                help="Select any option for showing cursor"
                selected={csbAvScrData?.shape?.customImg?.img}
                isPremium={isPremium}
                setIsProModalOpen={setIsProModalOpen}
                options={[
                    { label: <img src={dirUrl + "assets/cursorImg/cursor1.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor1.png` },
                    { label: <img src={dirUrl + "assets/cursorImg/cursor2.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor2.png` },
                    { label: <img src={dirUrl + "assets/cursorImg/cursor3.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor3.png` },
                    { label: <img src={dirUrl + "assets/cursorImg/cursor4.png"}></img>, value: `${dirUrl}assets/cursorImg/cursor4.png` },
                ]}
                onChange={(value) => setCsbAvScrData({ ...csbAvScrData, shape: { ...csbAvScrData?.shape, customImg: { ...csbAvScrData?.shape?.customImg, img: value } } })}
            />
        </div>
    );
};

export default CursorImgShape;