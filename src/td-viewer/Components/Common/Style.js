import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { alignment, width, height } = attributes;

	const mainSl = `#${id} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${mainSl} model-viewer{
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			height: ${['0px', '0%', '0em'].includes(height) ? '350px' : height};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;