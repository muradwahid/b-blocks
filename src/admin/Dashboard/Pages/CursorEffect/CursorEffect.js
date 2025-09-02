import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import { AboutProModal } from '../../../../../../bpl-tools/ProControls';

import Layout from '../../Layout/Layout';
import Playground from './Playground/Playground';
import Settings from './Settings/Settings';

import './style.scss';
import usePremiumInEditor from '../../../../hooks/usePremiumInEditor';
const CursorEffect = ({ info }) => {
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const { isPremium } = usePremiumInEditor();

    return <Layout info={info} >
        <div className='b-blocks-custom-cursor-container'>
            <AboutProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link={"https://bblockswp.com/#pricing"}>
                <li>&emsp;<strong>{__('Select Cursor Source: ', 'advanced-scrollbar')}</strong>{__('Choose a predefined or custom cursor style from available options.', 'advanced-scrollbar')}</li>

                <li>&emsp;<strong>{__('Cursor Shape: ', 'advanced-scrollbar')}</strong>{__('Select from various styles to customize the cursor\'s appearance and movement behavior.', 'advanced-scrollbar')}</li>

                <li>&emsp;<strong>{__('Select Cursor Image: ', 'advanced-scrollbar')}</strong>{__('Select an image to customize the cursor appearance.', 'advanced-scrollbar')}</li>

                {/* <li>&emsp;<strong>{__('Show Cursor Options: ', 'advanced-scrollbar')}</strong>{__('Enable or disable different cursor styles to enhance user interaction.', 'advanced-scrollbar')}</li> */}

                <li>&emsp;<strong>{__('Custom URL: ', 'advanced-scrollbar')}</strong>{__('Specify a custom URL or upload an image to personalize the cursor.', 'advanced-scrollbar')}</li>

                <li>&emsp;<strong>{__('Click Effect: ', 'advanced-scrollbar')}</strong>{__('Choose from various dynamic effects like sparkle, starburst, radial, explosion, ripple, and wave to enhance click interactions.', 'advanced-scrollbar')}</li>

            </AboutProModal>
            <div className='custom-cursor-content-wrapper'>
                <Settings {...{ info, isProModalOpen, setIsProModalOpen, isPremium }} />
                <Playground info={info} />
            </div>
        </div>
    </Layout>
};

export default CursorEffect;