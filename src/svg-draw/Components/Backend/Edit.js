import { useBlockProps } from '@wordpress/block-editor';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import SVGDrawBackend from './SVGDrawBackend/SVGDrawBackend';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const id = `svg-draw-${clientId}`;

	const { isPremium = false } = usePremiumInEditor();

	return <>
		<Settings {...{ attributes, setAttributes, isPremium }} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} isBackend={true} />
			<div>
				<SVGDrawBackend attributes={attributes} />
			</div>
		</div>
	</>
};
export default Edit;
