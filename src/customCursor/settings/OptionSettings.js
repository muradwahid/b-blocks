import { SelectControl, TabPanel } from '@wordpress/components';
import { cursorSourceOptions, cursorStyleTabs } from '../utils/options';
import General from './options/General';
import CursorEffects from './options/CursorEffects';
import { __ } from '@wordpress/i18n';
import CursorImgShape from './options/CursorImageShape';
import { useState } from 'react';
import { InlineMediaUpload } from '../../../../bpl-tools/Components';
import { AboutProModal, BControlPro } from '../../../../bpl-tools/ProControls';
import { pricingPage } from '../../utils/data';

const OptionSettings = (props) => {
    const { csbAvScrData, setCsbAvScrData, isPremium } = props;
    const [isProModalOpen, setIsProModalOpen] = useState(false)

    return <>
        <AboutProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link={pricingPage}>
            <li>&emsp;<strong>{__('Select Cursor Source: ', 'b-blocks')}</strong>{__('Choose a predefined or custom cursor style from available options.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Cursor Shape: ', 'b-blocks')}</strong>{__('Select from various styles to customize the cursor\'s appearance and movement behavior.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Select Cursor Image: ', 'b-blocks')}</strong>{__('Select an image to customize the cursor appearance.', 'b-blocks')}</li>

            {/* <li>&emsp;<strong>{__('Show Cursor Options: ', 'b-blocks')}</strong>{__('Enable or disable different cursor styles to enhance user interaction.', 'b-blocks')}</li> */}

            <li>&emsp;<strong>{__('Custom URL: ', 'b-blocks')}</strong>{__('Specify a custom URL or upload an image to personalize the cursor.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Click Effect: ', 'b-blocks')}</strong>{__('Choose from various dynamic effects like sparkle, starburst, radial, explosion, ripple, and wave to enhance click interactions.', 'b-blocks')}</li>

        </AboutProModal>
        <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={cursorStyleTabs} >
            {
                (tab) => <>
                    {tab.name == "shape" &&
                        <>

                            <SelectControl className="mt10" label={__("Select Cursor Source", "b-blocks")} labelPosition="edge" options={cursorSourceOptions(isPremium)} value={csbAvScrData?.source} onChange={value => setCsbAvScrData({ ...csbAvScrData, source: value })} />

                            {csbAvScrData?.source === "shape" && <General {...{ csbAvScrData, setCsbAvScrData, isPremium, isProModalOpen, setIsProModalOpen }} />}

                            {csbAvScrData?.source === "predefined" && <CursorImgShape {...{ csbAvScrData, setCsbAvScrData, isPremium, setIsProModalOpen }} />}

                            {csbAvScrData?.source === "customUrl" && <BControlPro label={__("Choose Cursor", "b-blocks")} value={csbAvScrData?.image} onChange={value => setCsbAvScrData({ ...csbAvScrData, shape: { ...csbAvScrData?.shape?.customImg, url: value } })} Component={InlineMediaUpload} isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} />}
                        </>
                    }
                    {tab.name == "effect" && <CursorEffects value={csbAvScrData?.effect || {}} onChange={(val) => setCsbAvScrData({ ...csbAvScrData, effect: val })} {...{ isPremium, setIsProModalOpen }} />}
                </>
            }
        </TabPanel>
    </>
};

export default OptionSettings;