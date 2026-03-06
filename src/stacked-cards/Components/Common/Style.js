import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	
	const { styles, options, advanced } = attributes;
	const { responsive } = options;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-stackedCardsMainWrapper`;

	const singleCardSl = `${blockSl} .bBlocksStackedSingleCard`;
	const singleCardContentSl = `${singleCardSl} .bBlocksContainer .bBlocksContainerContent`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${singleCardSl}{
			${isBackend ? '' : isValidCSS('top', styles.stickyTop + 'px')}
			${isBackend ? '' : isValidCSS('position', responsive.desktop ? 'unset' : 'sticky', true)}
			${responsive.desktop ? 'transform: scale(1) !important;' :''  }

		}
		${singleCardSl}:last-child{
			${isValidCSS('margin-bottom', '0px',true)}
		}
		${singleCardContentSl}{
			${isBackend ? '' : isValidCSS('height',styles.desktop.height)}
		}
		${tabBreakpoint}{
			${singleCardSl}{
				${isBackend ? '' : isValidCSS('position', responsive.tablet ? 'unset' : 'sticky', true)}
				${responsive.tablet ? 'transform: scale(1) !important;' : ''  }
			}
			${singleCardContentSl}{
				${isBackend ? '' : isValidCSS('height', styles.tablet.height)}
			}
		}

		${mobileBreakpoint}{
			${singleCardSl}{
				${isBackend ? '' : isValidCSS('position', responsive.mobile ? 'unset' : 'sticky', true)}
				${responsive.desktop ? 'transform: scale(1) !important;' : ''  }
			}
			${singleCardContentSl}{
				${isBackend ? '' : isValidCSS('height', styles.mobile.height)}
			}
		}

		${generateCSS(id, advanced,isBackend)}
	`}} />;
}
export default Style;