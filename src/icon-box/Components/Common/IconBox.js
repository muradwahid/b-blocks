import { prefix } from '../../utils/data';

const IconBox = ({ attributes }) => {
	const { icon, animation } = attributes;
	const { type, hover } = animation;

	return <div className={`${prefix} b-blocks-icon-box-animation ${type} ${hover.type}`} dangerouslySetInnerHTML={{ __html: icon.svg }} />

}
export default IconBox;