import { prefix } from '../../utils/data';

const IconBox = ({ attributes }) => {
	const { icon } = attributes;

	return <div className={prefix} dangerouslySetInnerHTML={{ __html: icon.svg }} />
}
export default IconBox;