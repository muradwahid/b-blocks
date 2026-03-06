import { ToggleControl, PanelBody, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Device, IconLibrary, Label } from '../../../../../../../bpl-tools/Components';

const NavigationOptions = ({ attributes, updateObj, device }) => {
  const { navigation, styles } = attributes;
  const { navigation: navigationStye } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Navigation', 'b-blocks')} initialOpen={false}>

    <ToggleControl label={__('Show Navigation', 'b-blocks')} value={navigation.navigation} checked={navigation.navigation} onChange={val => updateObj('navigation', val, 'navigation')} />
    {
      navigation.navigation && <>
      <IconLibrary className='mt10' label={__('Prev Icon', 'b-blocks')} value={navigation.prevIcon.library} onChange={val => updateObj('navigation', val, 'prevIcon', 'library')} />
        <IconLibrary className='mt10' label={__('Next Icon', 'b-blocks')} value={navigation.nextIcon.library} onChange={val => updateObj('navigation', val, 'nextIcon', 'library')} />
        <br />
        <b>Position X</b>
        <Flex>
          <Label className='mb0 flex2'>{__('Prev Position', 'b-blocks')} <Device /></Label>
          <UnitControl className='flex1' value={navigationStye[device].arrow.positionX.prev} onChange={val => updateObj('styles', val, 'navigation', device, 'arrow', 'positionX', 'prev')} />
        </Flex>
        <Flex className="mt10">
          <Label className='mb0 flex2'>{__('Next Position', 'b-blocks')} <Device /></Label>
          <UnitControl className='flex1' value={navigationStye[device].arrow.positionX.next} onChange={val => updateObj('styles', val, 'navigation', device, 'arrow', 'positionX', 'next')} />
        </Flex>

        <b>Position Y</b>

        <Flex>
          <Label className='mb0 flex2'>{__('Prev Position', 'b-blocks')} <Device /></Label>
          <UnitControl className='flex1' value={navigationStye[device].arrow.positionY.prev} onChange={val => updateObj('styles', val, 'navigation', device, 'arrow', 'positionY', 'prev')} />
        </Flex>
        <Flex className="mt10">
          <Label className='mb0 flex2'>{__('Next Position', 'b-blocks')} <Device /></Label>
          <UnitControl className='flex1' value={navigationStye[device].arrow.positionY.next} onChange={val => updateObj('styles', val, 'navigation', device, 'arrow', 'positionY', 'next')} />
        </Flex>

      </>
    }


  </PanelBody>
};

export default NavigationOptions;