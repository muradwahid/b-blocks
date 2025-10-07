import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import { AboutProModal } from '../../../../../../bpl-tools/ProControls';

import Layout from '../../Layout/Layout';
import Playground from './Playground/Playground';
import Settings from './Settings/Settings';

import './style.scss';
import usePremiumInEditor from '../../../../hooks/usePremiumInEditor';
import { pricingPage } from '../../../../utils/data';
const CursorEffect = ({ info }) => {
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const { isPremium } = usePremiumInEditor();

    return <Layout info={info} >
        <div className='b-blocks-custom-cursor-container'>
            <AboutProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link={pricingPage}>
                <li>&emsp;<strong>{__('Select Cursor Source: ', 'b-blocks')}</strong>{__('Choose a predefined or custom cursor style from available options.', 'b-blocks')}</li>

                <li>&emsp;<strong>{__('Cursor Shape: ', 'b-blocks')}</strong>{__('Select from various styles to customize the cursor\'s appearance and movement behavior.', 'b-blocks')}</li>

                <li>&emsp;<strong>{__('Select Cursor Image: ', 'b-blocks')}</strong>{__('Select an image to customize the cursor appearance.', 'b-blocks')}</li>

                {/* <li>&emsp;<strong>{__('Show Cursor Options: ', 'b-blocks')}</strong>{__('Enable or disable different cursor styles to enhance user interaction.', 'b-blocks')}</li> */}

                <li>&emsp;<strong>{__('Custom URL: ', 'b-blocks')}</strong>{__('Specify a custom URL or upload an image to personalize the cursor.', 'b-blocks')}</li>

                <li>&emsp;<strong>{__('Click Effect: ', 'b-blocks')}</strong>{__('Choose from various dynamic effects like sparkle, starburst, radial, explosion, ripple, and wave to enhance click interactions.', 'b-blocks')}</li>

            </AboutProModal>
            <div className='custom-cursor-content-wrapper'>
                <Settings {...{ info, isProModalOpen, setIsProModalOpen, isPremium }} />
                <Playground info={info} />
            </div>
        </div>
    </Layout>
};

export default CursorEffect;