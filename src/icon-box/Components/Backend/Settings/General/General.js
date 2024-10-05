import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { BtnGroup, IconLibrary } from '../../../../../../../Components';
import { aligns } from '../../../../../posts/utils/options';

const General = (props) => {
	const { attributes, setAttributes } = props;
	const { alignment, icon } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={true}>
			<IconLibrary value={icon.svg} onChange={val => setAttributes({ icon: { ...icon, svg: val } })} />

			<BtnGroup label={__('Alignment', 'b-blocks')} value={alignment} onChange={val => setAttributes({ alignment: val })} options={aligns.filter(item => item.value !== 'justify')} isIcon={true} />
		</PanelBody>
	</>
}
export default General;