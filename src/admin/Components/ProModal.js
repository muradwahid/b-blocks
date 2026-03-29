import { Button } from '../../../../bpl-tools/Components';
import { CrownIcon } from '../Dashboard/utils/icons';
import { pricingPage } from '../../utils/data';

import './proModal.scss';

const ProModal = () => {
  return <>
    <input type='checkbox' id='b-blocks-admin-pro-modal-toggle' />
    <div className='b-blocks-admin-proModal-wrapper'>
      <div className='b-blocks-promodal-content-wrapper'>
        <div className='b-blocks-promodal-content'>
          <CrownIcon className='b-blocks-promodal-crounIcon' />
        <h2 className='b-blocks-promodal-title'>Unlock Premium Blocks!</h2>
        <p className='b-blocks-promodal-description'>Get access to exclusive blocks to enhance your website&apos;s design.</p>
          <Button href={pricingPage}>Upgrade Now</Button>
      </div>
        <label htmlFor='b-blocks-admin-pro-modal-toggle' className='b-blocks-promodal-close'>&times;</label>
      </div>
    </div>
  </>
};

export default ProModal;