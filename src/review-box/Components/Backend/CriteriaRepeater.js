import { __ } from '@wordpress/i18n';
import {
	Button,
	RangeControl,
	TextControl,
} from '@wordpress/components';

/**
 * Repeater UI for scored review criteria.
 *
 * Each row holds a label (TextControl) and a score (RangeControl 1..max).
 * Adding a row appends `{ label: 'New Criterion', score: defaultScore }`.
 * Removing a row removes by index. All edits go through `onChange(newArray)`
 * so the calling component owns the source of truth (the block attribute).
 */
const CriteriaRepeater = ({
	value = [],
	onChange,
	maxRating = 5,
	defaultLabel = '',
}) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...row, [key]: next } : row
		));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = items.filter((_, i) => i !== index);
		onChange(copy);
	};

	const addRow = () => {
		onChange([
			...items,
			{ label: defaultLabel || __('New Criterion', 'b-blocks'), score: 3 },
		]);
	};

	return (
		<div className='bb-rb-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No criteria yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={idx}
					className='bb-rb-repeater__row'
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
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
						<strong style={{ fontSize: 12 }}>
							{__('Criterion', 'b-blocks')} #{idx + 1}
						</strong>
						<Button
							variant='tertiary'
							isDestructive
							size='small'
							icon='trash'
							label={__('Remove criterion', 'b-blocks')}
							onClick={() => removeAt(idx)}
						/>
					</div>

					<TextControl
						label={__('Label', 'b-blocks')}
						value={row?.label || ''}
						onChange={(val) => updateAt(idx, 'label', val)}
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Score', 'b-blocks')}
						value={parseInt(row?.score, 10) || 0}
						onChange={(val) => updateAt(idx, 'score', val)}
						min={1}
						max={maxRating}
						step={1}
						__nextHasNoMarginBottom
					/>
				</div>
			))}

			<Button variant='secondary' onClick={addRow} icon='plus'>
				{__('Add Criterion', 'b-blocks')}
			</Button>
		</div>
	);
};

export default CriteriaRepeater;
