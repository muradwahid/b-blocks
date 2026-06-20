import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	TextareaControl,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Sidebar repeater UI for Image Box items.
 *
 * Each item row holds: image (MediaUpload), title (TextControl),
 * description (TextareaControl), CTA URL / label / new-tab toggle.
 * Reorder up/down + delete controls per row. Adding a row appends a
 * default `{ _key, imageId, imageUrl, imageAlt, title, description,
 * ctaLabel, ctaUrl, ctaNewTab }`. Capped at 24 items.
 *
 * The `_key` is a stable string used as the React key so input focus
 * survives reorders (lesson learned from the FAQ block tester run).
 */
const MAX_ITEMS = 24;

const ItemsRepeater = ({ value = [], onChange }) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = items.filter((_, i) => i !== index);
		onChange(copy);
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= items.length) return;
		const copy = items.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		onChange(copy);
	};

	const addRow = () => {
		if (items.length >= MAX_ITEMS) return;
		const _key = `ib-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{
				_key,
				imageId: 0,
				imageUrl: '',
				imageAlt: '',
				title: '',
				description: '',
				ctaLabel: '',
				ctaUrl: '',
				ctaNewTab: false,
			},
		]);
	};

	const atCap = items.length >= MAX_ITEMS;

	return (
		<div className='bb-ib-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No items yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row?._key || idx}
					className='bb-ib-repeater__row'
				>
					<div className='bb-ib-repeater__row-head'>
						<strong className='bb-ib-repeater__row-title'>
							{__('Item', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-ib-repeater__row-actions'>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-up-alt2'
								label={__('Move item up', 'b-blocks')}
								onClick={() => moveItem(idx, idx - 1)}
								disabled={idx === 0}
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-down-alt2'
								label={__('Move item down', 'b-blocks')}
								onClick={() => moveItem(idx, idx + 1)}
								disabled={idx === items.length - 1}
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={__('Remove item', 'b-blocks')}
								onClick={() => removeAt(idx)}
							/>
						</div>
					</div>

					<BaseControl
						label={__('Image', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
							{(row && row.imageUrl) && (
								<img
									className='bb-ib-repeater__thumb'
									src={row.imageUrl}
									alt={(row && row.imageAlt) || ''}
								/>
							)}
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={['image']}
									value={(row && row.imageId) || undefined}
									onSelect={(media) => {
										if (!media) return;
										const copy = items.map((r, i) => (
											i === idx
												? {
													...(r || {}),
													imageId: media.id || 0,
													imageUrl: media.url || '',
													imageAlt: (r && r.imageAlt) || media.alt || '',
												}
												: r
										));
										onChange(copy);
									}}
									render={({ open }) => (
										<div className='bb-ib-repeater__media-actions'>
											<Button
												variant='secondary'
												size='small'
												onClick={open}
												icon='format-image'
											>
												{(row && row.imageUrl)
													? __('Replace image', 'b-blocks')
													: __('Select image', 'b-blocks')}
											</Button>
											{(row && row.imageUrl) && (
												<Button
													variant='tertiary'
													size='small'
													isDestructive
													onClick={() => {
														const copy = items.map((r, i) => (
															i === idx
																? { ...(r || {}), imageId: 0, imageUrl: '', imageAlt: '' }
																: r
														));
														onChange(copy);
													}}
												>
													{__('Remove image', 'b-blocks')}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</BaseControl>

					{(row && row.imageUrl) && (
						<TextControl
							label={__('Image alt text', 'b-blocks')}
							value={(row && row.imageAlt) || ''}
							onChange={(val) => updateAt(idx, 'imageAlt', val)}
							placeholder={__('Describe the image for screen readers', 'b-blocks')}
							help={__('Leave blank to use the WordPress media library alt text.', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<TextControl
						label={__('Title', 'b-blocks')}
						value={(row && row.title) || ''}
						onChange={(val) => updateAt(idx, 'title', val)}
						placeholder={__('Short title for this item', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Description', 'b-blocks')}
						value={(row && row.description) || ''}
						onChange={(val) => updateAt(idx, 'description', val)}
						placeholder={__('Optional short description shown in the overlay.', 'b-blocks')}
						rows={3}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Link URL', 'b-blocks')}
						type='url'
						value={(row && row.ctaUrl) || ''}
						onChange={(val) => updateAt(idx, 'ctaUrl', val)}
						placeholder='https://example.com/page'
						help={__('When set, the entire card becomes a link to this URL.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{(row && row.ctaUrl) && (
						<>
							<TextControl
								label={__('CTA label (optional)', 'b-blocks')}
								value={(row && row.ctaLabel) || ''}
								onChange={(val) => updateAt(idx, 'ctaLabel', val)}
								placeholder={__('e.g. Learn More', 'b-blocks')}
								help={__('Shown as a pill button inside the overlay. Leave empty for a title-only card.', 'b-blocks')}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Open in new tab', 'b-blocks')}
								checked={!!(row && row.ctaNewTab)}
								onChange={(val) => updateAt(idx, 'ctaNewTab', !!val)}
							/>
						</>
					)}
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-ib-add-item'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 24 items', 'b-blocks')
					: __('Add Item', 'b-blocks')}
			</Button>
		</div>
	);
};

export default ItemsRepeater;
