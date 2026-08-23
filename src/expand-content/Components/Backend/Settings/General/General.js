import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Content from './Content';
import Layout from './Layout';

const General = (props) => {
  const { attributes, setAttributes } = props;
  const { animationDuration } = attributes;
  return <>
    <Layout {...props} />
    <Content {...props} />
    <PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>

      <RangeControl label={__('Animation Duration (ms)', 'b-blocks')} value={animationDuration} onChange={(val) => setAttributes({ animationDuration: val })} min={0} max={1000} step={50} help={__('Set to 0 to snap instantly. The animation is also disabled automatically when the visitor has prefers-reduced-motion enabled.', 'b-blocks')} />

    </PanelBody>
  </>
};

export default General;