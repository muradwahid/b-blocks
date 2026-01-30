import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useBlockProps, InnerBlocks, RichText} from "@wordpress/block-editor";
import { withSelect } from '@wordpress/data';
import Settings from './Settings/Settings';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import style from '../Common/Style';

const TEMPLATE = [
	["b-blocks/container", { className: "b-blocks-toggle-content__panel b-blocks-toggle-content__panel--a", lock: { remove: true, move: true } }, []],
	["b-blocks/container", { className: "b-blocks-toggle-content__panel b-blocks-toggle-content__panel--b", lock: { remove: true, move: true } }, []],
];

const Edit = ({ attributes, setAttributes, className, device, clientId }) => {
	const { label, toggle } = attributes;

	const [isA, setIsA] = useState(true);

	const blockProps = useBlockProps({
		className,
	});

	const updateObj = updateAttributes(attributes, setAttributes);

	return (
		<>
			<Settings attributes={attributes} updateObj={updateObj} device={device} />

			<div {...blockProps}>
				<style>
					{style(attributes,`block-${clientId}`)}
				</style>

				<div className={`b-blocks-toggle-content__wrapper ${isA ? "is-a" : "is-b"}`}>
					<div className="b-blocks-toggle-content__head">
						<div className="b-blocks-toggle-content-switch__wrapper">
							<RichText
								tagName="span"
								className={`b-blocks-toggle-content__label b-blocks-toggle-content__label--left ${!isA ? "is-active" : ""}`}
								value={label.left}
								onChange={(val) => updateObj('label', val, 'left')}
								onClick={() => setIsA(true)}
								placeholder={__("First", "b-blocks")}
								allowedFormats={[]}
							/>

							<div
								className={`b-blocks-toggle-content__switch  b-blocks-toggle-content-switch-${toggle.switchType} ${isA ? "" : "is-b"}`}
								role="button"
								tabIndex={0}
								aria-label={__("Toggle content", "b-blocks")}
								onClick={() => setIsA((s) => !s)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") setIsA((s) => !s);
								}}
							>
								<div className="b-blocks-toggle-content__knob" />
							</div>

							<RichText
								tagName="span"
								className={`b-blocks-toggle-content__label b-blocks-toggle-content__label--right ${!isA ? "is-active" : ""}`}
								value={label.right}
								onChange={(val) => updateObj('label', val, 'right')}
								onClick={() => setIsA(false)}
								placeholder={__("Second", "b-blocks")}
								allowedFormats={[]}
							/>
						</div>
					</div>

					<div className="b-blocks-toggle-content__content">
						<InnerBlocks template={TEMPLATE}
							// templateLock={true}
							renderAppender={false} />
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
	}
)(Edit);