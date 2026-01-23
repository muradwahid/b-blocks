import { PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Flex } from '@wordpress/components';

import { IconLibrary, Label } from '../../../../../../../bpl-tools/Components';

const IconSettings = (props) => {
  const { attributes, updateObj } = props;
  const { icon, styles } = attributes;

  return <PanelBody title={__('Icon', 'b-blocks')} className='bPlPanelBody' initialOpen={false}>

    <IconLibrary label={__('Icon', 'b-blocks')} value={icon.svg} onChange={(val) => updateObj('icon', val, 'svg')} />

    <Flex className="mt10">
      <Label className="mb0 flex2">
        {__('Icon Size', 'b-blocks')}
      </Label>
    <UnitControl className='flex1' value={styles.icon.size} onChange={(val) => updateObj('styles', val, 'icon', 'size')} />
    </Flex>

    </PanelBody>;
};

export default IconSettings;