import { __ } from '@wordpress/i18n';

import BPLTemplateLibrary from '../../../../bpl-tools/TemplateLibrary';
import { pluginIcon } from '../../utils/icons';
import { pricingPage } from '../../utils/data';

// The shared bpl-tools library; the endpoints it calls are in includes/Templates/Templates.php.
const TemplateLibrary = () => <BPLTemplateLibrary
	prefix='bblocks'
	logo={pluginIcon}
	buttonLabel={__('Template Library', 'b-blocks')}
	modalTitle={__('Templates Library', 'b-blocks')}
	types={['pages', 'patterns']}
	pricingUrl={pricingPage}
	ajaxActionMain='bblocks_templates_main'
	ajaxActionTemplates='bblocks_templates'
	ajaxActionImport='bblocks_template_import'
	ajaxActionCounts='bblocks_template_counts'
	nonce={window.bBlocksCursorDataConfig?.nonce}
	isPremium={Boolean('undefined' !== typeof bBlocksPremiumChecker && bBlocksPremiumChecker)}
/>;

export default TemplateLibrary;