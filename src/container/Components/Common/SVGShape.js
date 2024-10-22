import SVG from 'react-inlinesvg';
import { Abstract, AsymmetricCurve, AsymmetricTriangle, OceanWave } from '../../utils/icons';

const SVGShape = ({ data }) => {
	const { isUpload, uploadSvg, type } = data || {};

	return isUpload ? <SVG src={uploadSvg?.url} height='' width='' /> : <>{(() => {
		switch (type) {
			case 'ocean-wave':
				return <OceanWave />;
			case 'asymmetric-triangle':
				return <AsymmetricTriangle />;
			case 'abstract-paintbrush':
				return <Abstract />;
			case 'asymmetric-curve':
				return <AsymmetricCurve />;
			case 'none':
			default:
				return null;
		}
	})()}</>
}
export default SVGShape;