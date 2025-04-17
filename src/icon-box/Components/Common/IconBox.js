import { prefix } from '../../utils/data';

const IconBox = ({ attributes }) => {
	const { icon, animation } = attributes;
	const { type } = animation;

	return <div className={`${prefix} b-blocks-icon-box-animation ${type} infinite`} dangerouslySetInnerHTML={{ __html: icon.svg }} />

}
export default IconBox;