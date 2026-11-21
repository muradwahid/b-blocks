import Model from './Model';
import PosterLoading from './PosterLoading';
import RotationCamera from './RotationCamera';
import AnimationVariants from './AnimationVariants';
import Lighting from './Lighting';
import AugmentedReality from './AugmentedReality';
import Buttons from './Buttons';

const General = props => {
	return <>
		<Model {...props} />
		<PosterLoading {...props} />
		<RotationCamera {...props} />
		<AnimationVariants {...props} />
		<Lighting {...props} />
		<AugmentedReality {...props} />
		<Buttons {...props} />
	</>;
};
export default General;
