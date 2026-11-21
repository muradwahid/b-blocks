import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextareaControl, ToggleControl } from '@wordpress/components';

import { Label, MultiSelectControl } from '../../../../../../../bpl-tools/Components';
import { BControlPro, PremiumBadge } from '../../../../../../../bpl-tools/ProControls';
import useUserRoles from '../../../../../hooks/useUserRoles';
import { accessOptions } from '../../../../utils/options';

const Access = ({ attributes, updateObj, premiumProps }) => {
	const { document = {}, viewer = {}, access = {}, security = {} } = attributes;
	const { view = 'everyone', roles = [], message = '' } = access;
	const { disablePopout = false, customLoader = false, secureDelivery = false } = security;

	const { roles: roleOptions } = useUserRoles();

	return <PanelBody className='bPlPanelBody' title={<>{__('Access & Security', 'b-blocks')} {!premiumProps?.isPremium && <PremiumBadge />}</>} initialOpen={false}>
		<BControlPro
			label={__('Who Can View', 'b-blocks')}
			help={__('Other visitors see the message below; the file URL is never written into their page.', 'b-blocks')}
			value={view}
			options={accessOptions}
			labelPosition='edge'
			onChange={(val) => updateObj('access', val, 'view')}
			{...premiumProps}
			Component={SelectControl}
		/>

		{'roles' === view && 0 < roleOptions.length && <>
			<Label>{__('Allowed Roles', 'b-blocks')}</Label>
			<MultiSelectControl value={roles.filter((role) => roleOptions.some((o) => o.value === role))} options={roleOptions} onChange={(val) => updateObj('access', val, 'roles')} />
		</>}

		{'everyone' !== view && <TextareaControl
			className='mt10'
			label={__('Restricted Message', 'b-blocks')}
			value={message}
			onChange={(val) => updateObj('access', val, 'message')}
			help={__('Basic HTML is allowed, e.g. a login link.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>}

		<BControlPro
			className='mt20'
			label={__('Secure Viewing', 'b-blocks')}
			help={__('Media Library PDFs with the Custom PDF, Flipbook or Slider engine: the viewer loads the file through a short-lived link tied to the visitor, and the file address is not written into the page. The file itself stays reachable at its uploads address for anyone who already has it.', 'b-blocks')}
			checked={secureDelivery}
			onChange={(val) => updateObj('security', val, 'secureDelivery')}
			{...premiumProps}
			Component={ToggleControl}
		/>

		{/* Same test as BBlocksDocumentEmbedHandler::isSecure(). */}
		{secureDelivery && !(0 < document.id && ('application/pdf' === document.mime || /\.pdf$/i.test((document.url || '').split(/[?#]/)[0])) && ['custom', 'flipbook', 'slider'].includes(viewer.engine)) && <p className='b-blocks-document-embed-warning'>{__('Secure viewing is not used for this document: it needs a PDF from the Media Library shown with the Custom PDF, Flipbook or Slider engine.', 'b-blocks')}</p>}

		<BControlPro
			className='mt10'
			label={__('Hide Google Viewer Pop-out', 'b-blocks')}
			help={__('Covers the pop-out button of the Google Docs and Drive viewers.', 'b-blocks')}
			checked={disablePopout}
			onChange={(val) => updateObj('security', val, 'disablePopout')}
			{...premiumProps}
			Component={ToggleControl}
		/>

		<BControlPro
			className='mt10'
			label={__('Loading Spinner', 'b-blocks')}
			help={__('Show a spinner until the document has loaded.', 'b-blocks')}
			checked={customLoader}
			onChange={(val) => updateObj('security', val, 'customLoader')}
			{...premiumProps}
			Component={ToggleControl}
		/>
	</PanelBody>;
};
export default Access;
