import { PanelBody, Flex, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';

const ProgressStyle = (props) => {
  const { attributes, updateObj } = props;
  const { styles } = attributes;
  const { progress } = styles;

  return <PanelBody title={__('Progress Style', 'b-blocks')} className='bPlPanelBody' initialOpen={false}>

    <Flex>
      <Label className='mb0 flex2'>{__('Progress Size', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={progress.size} onChange={(val) => updateObj('styles', val, 'progress', 'size')} />
    </Flex>
    <RangeControl label={__('Stroke Size', 'b-blocks')} value={progress.strokeSize} onChange={(val) => updateObj('styles', val, 'progress', 'strokeSize')} />

    <ColorControl label={__('Stroke Color', 'b-blocks')} value={progress.color} onChange={(val) => updateObj('styles', val, 'progress', 'color')} />

    <ColorControl label={__('Stroke Background', 'b-blocks')} value={progress.strokeBg} onChange={(val) => updateObj('styles', val, 'progress', 'strokeBg')} />

    <ColorControl label={__('Background', 'b-blocks')} value={progress.bg} onChange={(val) => updateObj('styles', val, 'progress', 'bg')} />

  </PanelBody>
};

export default ProgressStyle;