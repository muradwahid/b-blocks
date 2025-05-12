import { HelpPanel } from '../../../../../../../bpl-tools/Components';
import Logo from './Logo';
import SliderSettings from './SliderSettings';

const General = (props) => {

    return <>
        <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />
        <Logo {...props} />
        <SliderSettings {...props} />
    </>
}
export default General;