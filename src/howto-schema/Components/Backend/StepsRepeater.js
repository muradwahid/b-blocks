import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	TextareaControl,
	BaseControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Repeater UI for HowTo steps (sidebar variant).
 *
 * Each step row holds: name (TextControl), text (TextareaControl), and an
 * optional image (MediaUpload). Reorder up/down + delete controls per row.
 * Adding a row appends a default `{ _key, name, text, imageUrl, imageAlt }`.
 *
 * The `_key` is a stable string used as the React key so input focus
 * survives reorders (lesson learned from the FAQ block tester run).
 */
const StepsRepeater = ({ value = [], onChange }) => {
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
		const _key = `howto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{ _key, name: '', text: '', imageUrl: '', imageAlt: '' },
		]);
	};

	return (
		<div className='bb-howto-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No steps yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row?._key || idx}
					className='bb-howto-repeater__row'
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
						padding: 12,
						marginBottom: 12,
						background: '#f6f7f7',
						borderRadius: 4,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<strong style={{ fontSize: 12 }}>
							{__('Step', 'b-blocks')} #{idx + 1}
						</strong>
						<div style={{ display: 'flex', gap: 4 }}>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-up-alt2'
								label={__('Move step up', 'b-blocks')}
								onClick={() => moveItem(idx, idx - 1)}
								disabled={idx === 0}
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-down-alt2'
								label={__('Move step down', 'b-blocks')}
								onClick={() => moveItem(idx, idx + 1)}
								disabled={idx === items.length - 1}
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={__('Remove step', 'b-blocks')}
								onClick={() => removeAt(idx)}
							/>
						</div>
					</div>

					<TextControl
						label={__('Step name', 'b-blocks')}
						value={(row && row.name) || ''}
						onChange={(val) => updateAt(idx, 'name', val)}
						placeholder={__('Short title for this step', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Step description', 'b-blocks')}
						value={(row && row.text) || ''}
						onChange={(val) => updateAt(idx, 'text', val)}
						placeholder={__('Explain what the reader should do', 'b-blocks')}
						rows={3}
						__nextHasNoMarginBottom
					/>

					<BaseControl
						label={__('Step image (optional)', 'b-blocks')}
						__nextHasNoMarginBottom
					>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
							{(row && row.imageUrl) && (
								<img
									src={row.imageUrl}
									alt={(row && row.imageAlt) || ''}
									style={{
										maxWidth: '100%',
										height: 'auto',
										borderRadius: 4,
										border: '1px solid #ddd',
									}}
								/>
							)}
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={['image']}
									value={undefined}
									onSelect={(media) => {
										if (!media) return;
										const copy = items.map((r, i) => (
											i === idx
												? {
													...(r || {}),
													imageUrl: media.url || '',
													imageAlt: (r && r.imageAlt) || media.alt || '',
												}
												: r
										));
										onChange(copy);
									}}
									render={({ open }) => (
										<div style={{ display: 'flex', gap: 6 }}>
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
																? { ...(r || {}), imageUrl: '', imageAlt: '' }
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
							__nextHasNoMarginBottom
						/>
					)}
				</div>
			))}

			<Button variant='secondary' onClick={addRow} icon='plus'>
				{__('Add Step', 'b-blocks')}
			</Button>
		</div>
	);
};

export default StepsRepeater;
