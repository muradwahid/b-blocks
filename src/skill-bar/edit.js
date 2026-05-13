import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl, ColorPicker, Button, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus } from '@wordpress/icons';

import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
	const {
		skills,
		theme,
		template,
		columns,
		customBackgroundColor,
		customTitleColor,
		customPercentageColor,
		// customBarBackgroundColor,
		customBarProgressColor,
		customBarRemainingColor
	} = attributes;
	const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

	const isCustomizable = theme === 'customizable';

	const customStyles = {};
	if (isCustomizable && customBackgroundColor) {
		customStyles.background = customBackgroundColor;
	}

	const titleStyles = {};
	if (isCustomizable && customTitleColor) {
		titleStyles.color = customTitleColor;
	}

	const percentageStyles = {};
	if (isCustomizable && customPercentageColor) {
		percentageStyles.color = customPercentageColor;
	}

	const blockProps = useBlockProps({
		className: `skill-bar-block theme-${theme} template-${template} columns-${columns}`,
	});

	const addSkill = () => {
		const newSkills = [
			...skills,
			{
				title: 'New Skill',
				percentage: 50,
				color: '#0073aa',
			},
		];
		setAttributes({ skills: newSkills });
		setSelectedSkillIndex(newSkills.length - 1);
	};

	const removeSkill = (index) => {
		const newSkills = skills.filter((_, i) => i !== index);
		setAttributes({ skills: newSkills });
		if (selectedSkillIndex >= newSkills.length) {
			setSelectedSkillIndex(Math.max(0, newSkills.length - 1));
		}
	};

	const updateSkill = (index, field, value) => {
		const newSkills = [...skills];
		newSkills[index] = {
			...newSkills[index],
			[field]: value,
		};
		setAttributes({ skills: newSkills });
	};

	const renderSkillBar = (skill, index) => {
		const isSelected = selectedSkillIndex === index;
		const baseClass = 'b-blocks-skill-bar-skill-item';
		const itemClass = isSelected ? `${baseClass} is-selected` : baseClass;

		const barBgStyle = {};
		if (isCustomizable && customBarRemainingColor) {
			barBgStyle.backgroundColor = customBarRemainingColor;
		}

		const barFillStyle = {
			width: `${skill.percentage}%`,
		};
		if (isCustomizable && customBarProgressColor) {
			barFillStyle.background = customBarProgressColor;
		} else {
			barFillStyle.background = skill.color;
		}

		const circularStroke = isCustomizable && customBarProgressColor ? customBarProgressColor : skill.color;
		const circularBgStroke = isCustomizable && customBarRemainingColor ? customBarRemainingColor : '#e0e0e0';

		return (
			<div
				key={index}
				className={itemClass}
				style={customStyles}
				onClick={() => setSelectedSkillIndex(index)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						setSelectedSkillIndex(index);
					}
				}}
			>
				<div className="skill-header">
					<span className="skill-title" style={titleStyles}>{skill.title}</span>
					<span className="skill-percentage" style={percentageStyles}>{skill.percentage}%</span>
				</div>
				{template === 'circular' ? (
					<div className="skill-circular">
						<svg viewBox="0 0 100 100">
							<circle
								className="skill-circular-bg"
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke={circularBgStroke}
								strokeWidth="10"
							/>
							<circle
								className="b-blocks-skill-bar-skill-circular-progress"
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke={circularStroke}
								strokeWidth="10"
								strokeDasharray={`${2 * Math.PI * 45}`}
								strokeDashoffset={`${2 * Math.PI * 45 * (1 - skill.percentage / 100)}`}
								transform="rotate(-90 50 50)"
							/>
						</svg>
						<div className="b-blocks-skill-bar-skill-circular-text" style={percentageStyles}>{skill.percentage}%</div>
					</div>
				) : (
					<div className="skill-bar-wrapper">
						<div className="skill-bar-bg" style={barBgStyle}>
							<div
								className="b-blocks-skill-bar-skill-bar-fill"
								style={barFillStyle}
							/>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={plus}
						label={__('Add Skill', 'b-blocks')}
						onClick={addSkill}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Theme & Layout', 'b-blocks')}>
					<SelectControl
						label={__('Theme', 'b-blocks')}
						value={theme}
						options={[
							{ label: __('Modern', 'b-blocks'), value: 'modern' },
							{ label: __('Classic', 'b-blocks'), value: 'classic' },
							{ label: __('Gradient', 'b-blocks'), value: 'gradient' },
							{ label: __('Customizable', 'b-blocks'), value: 'customizable' },
						]}
						onChange={(value) => setAttributes({ theme: value })}
					/>
					<SelectControl
						label={__('Template', 'b-blocks')}
						value={template}
						options={[
							{ label: __('Standard', 'b-blocks'), value: 'standard' },
							{ label: __('Circular', 'b-blocks'), value: 'circular' },
							{ label: __('Striped', 'b-blocks'), value: 'striped' },
						]}
						onChange={(value) => setAttributes({ template: value })}
					/>
					<RangeControl
						label={__('Columns', 'b-blocks')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={4}
					/>
				</PanelBody>

				{isCustomizable && (
					<PanelBody title={__('Customizable Theme Colors', 'b-blocks')} initialOpen={true}>
						<p style={{ marginBottom: '20px', color: '#757575', fontSize: '13px', lineHeight: '1.5' }}>
							{__('Customize all color aspects of your skill bars. These settings only apply when "Customizable" theme is selected.', 'b-blocks')}
						</p>

						<h3 style={{ margin: '20px 0 12px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' }}>{__('Card Styling', 'b-blocks')}</h3>
						<div style={{ marginBottom: '20px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
								{__('Background Color', 'b-blocks')}
							</label>
							<ColorPicker
								color={customBackgroundColor || '#ffffff'}
								onChange={(value) => setAttributes({ customBackgroundColor: value })}
								enableAlpha
							/>
							{customBackgroundColor && (
								<Button
									isSmall
									variant="secondary"
									style={{ marginTop: '8px' }}
									onClick={() => setAttributes({ customBackgroundColor: '' })}
								>
									{__('Reset', 'b-blocks')}
								</Button>
							)}
						</div>

						<h3 style={{ margin: '24px 0 12px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' }}>{__('Text Colors', 'b-blocks')}</h3>

						<div style={{ marginBottom: '20px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
								{__('Skill Title Color', 'b-blocks')}
							</label>
							<ColorPicker
								color={customTitleColor || '#333333'}
								onChange={(value) => setAttributes({ customTitleColor: value })}
								enableAlpha
							/>
							{customTitleColor && (
								<Button
									isSmall
									variant="secondary"
									style={{ marginTop: '8px' }}
									onClick={() => setAttributes({ customTitleColor: '' })}
								>
									{__('Reset', 'b-blocks')}
								</Button>
							)}
						</div>

						<div style={{ marginBottom: '20px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
								{__('Percentage Number Color', 'b-blocks')}
							</label>
							<ColorPicker
								color={customPercentageColor || '#666666'}
								onChange={(value) => setAttributes({ customPercentageColor: value })}
								enableAlpha
							/>
							{customPercentageColor && (
								<Button
									isSmall
									variant="secondary"
									style={{ marginTop: '8px' }}
									onClick={() => setAttributes({ customPercentageColor: '' })}
								>
									{__('Reset', 'b-blocks')}
								</Button>
							)}
						</div>

						<h3 style={{ margin: '24px 0 12px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' }}>{__('Progress Bar Colors', 'b-blocks')}</h3>

						<div style={{ marginBottom: '20px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
								{__('Bar Progress Color', 'b-blocks')}
							</label>
							<ColorPicker
								color={customBarProgressColor || '#0073aa'}
								onChange={(value) => setAttributes({ customBarProgressColor: value })}
								enableAlpha
							/>
							{customBarProgressColor && (
								<Button
									isSmall
									variant="secondary"
									style={{ marginTop: '8px' }}
									onClick={() => setAttributes({ customBarProgressColor: '' })}
								>
									{__('Reset', 'b-blocks')}
								</Button>
							)}
						</div>

						<div style={{ marginBottom: '20px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
								{__('Bar Remaining/Background Color', 'b-blocks')}
							</label>
							<ColorPicker
								color={customBarRemainingColor || '#f0f0f0'}
								onChange={(value) => setAttributes({ customBarRemainingColor: value })}
								enableAlpha
							/>
							{customBarRemainingColor && (
								<Button
									isSmall
									variant="secondary"
									style={{ marginTop: '8px' }}
									onClick={() => setAttributes({ customBarRemainingColor: '' })}
								>
									{__('Reset', 'b-blocks')}
								</Button>
							)}
						</div>
					</PanelBody>
				)}

				{skills.length > 0 && (
					<PanelBody
						title={__('Individual Skill Settings', 'b-blocks')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Select Skill', 'b-blocks')}
							value={selectedSkillIndex}
							options={skills.map((skill, index) => ({
								label: skill.title || `Skill ${index + 1}`,
								value: index,
							}))}
							onChange={(value) => setSelectedSkillIndex(parseInt(value, 10))}
						/>
						<TextControl
							label={__('Skill Title', 'b-blocks')}
							value={skills[selectedSkillIndex].title}
							onChange={(value) =>
								updateSkill(selectedSkillIndex, 'title', value)
							}
						/>
						<RangeControl
							label={__('Percentage', 'b-blocks')}
							value={skills[selectedSkillIndex].percentage}
							onChange={(value) =>
								updateSkill(selectedSkillIndex, 'percentage', value)
							}
							min={0}
							max={100}
						/>
						{!isCustomizable && (
							<div style={{ marginBottom: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '12px' }}>
									{__('Progress Bar Color', 'b-blocks')}
								</label>
								<ColorPicker
									color={skills[selectedSkillIndex].color}
									onChange={(value) =>
										updateSkill(selectedSkillIndex, 'color', value)
									}
									enableAlpha
								/>
							</div>
						)}
						{isCustomizable && (
							<p style={{ fontSize: '12px', color: '#757575', fontStyle: 'italic' }}>
								{__('Individual skill colors are overridden by the Customizable theme settings above.', 'b-blocks')}
							</p>
						)}
						{skills.length > 1 && (
							<Button
								isDestructive
								variant="secondary"
								onClick={() => removeSkill(selectedSkillIndex)}
							>
								{__('Remove This Skill', 'b-blocks')}
							</Button>
						)}
					</PanelBody>
				)}
			</InspectorControls>

			<div {...blockProps}>
				<div className="b-blocks-skill-bar-skills-grid">
					{skills.map((skill, index) => renderSkillBar(skill, index))}
				</div>
				<div className="b-blocks-skill-bar-skill-bar-actions">
					<Button variant="secondary" onClick={addSkill} icon={plus}>
						{__('Add Skill', 'b-blocks')}
					</Button>
				</div>
			</div>
		</>
	);
}