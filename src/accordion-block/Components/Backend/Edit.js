import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button, RangeControl, ColorPalette } from '@wordpress/components';
import '../../editor.scss';
import { useState } from 'react';

const TEMPLATES = {
    none: { label: __('None', 'accordion-block'), items: [] },
    faq: {
        label: __('FAQ', 'accordion-block'),
        items: [
            {
                title: __('What is your return policy?', 'accordion-block'),
                content: __('We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, contact our support team for a full refund.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('How long does shipping take?', 'accordion-block'),
                content: __('Standard shipping takes 5-7 business days. Express shipping options are available at checkout for faster delivery.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Do you offer customer support?', 'accordion-block'),
                content: __('Yes! Our customer support team is available 24/7 via email, phone, and live chat to assist you with any questions.', 'accordion-block'),
                isOpen: false
            }
        ]
    },
    features: {
        label: __('Product Features', 'accordion-block'),
        items: [
            {
                title: __('Easy to Use', 'accordion-block'),
                content: __('Our intuitive interface makes it simple to get started. No technical knowledge required - just install and start creating.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Fully Customizable', 'accordion-block'),
                content: __('Customize every aspect of your accordion with our powerful theme editor. Colors, spacing, fonts - it\'s all under your control.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Mobile Responsive', 'accordion-block'),
                content: __('Works perfectly on all devices. Your accordions will look great whether viewed on desktop, tablet, or mobile.', 'accordion-block'),
                isOpen: false
            }
        ]
    },
    timeline: {
        label: __('Timeline', 'accordion-block'),
        items: [
            {
                title: __('2020 - Foundation', 'accordion-block'),
                content: __('Our company was founded with a vision to create innovative solutions that make a difference in people\'s lives.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('2021 - Growth', 'accordion-block'),
                content: __('Expanded our team and launched three major products that received excellent feedback from customers worldwide.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('2022 - Innovation', 'accordion-block'),
                content: __('Introduced cutting-edge features and won multiple industry awards for innovation and customer satisfaction.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('2023 - Global Expansion', 'accordion-block'),
                content: __('Opened offices in 5 new countries and reached 1 million satisfied customers across the globe.', 'accordion-block'),
                isOpen: false
            }
        ]
    },
    pricing: {
        label: __('Pricing Details', 'accordion-block'),
        items: [
            {
                title: __('Basic Plan - $9/month', 'accordion-block'),
                content: __('Perfect for individuals and small projects. Includes 10 GB storage, basic support, and access to core features.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Pro Plan - $29/month', 'accordion-block'),
                content: __('Ideal for professionals and growing businesses. Includes 100 GB storage, priority support, and all premium features.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Enterprise Plan - Custom', 'accordion-block'),
                content: __('For large organizations with specific needs. Unlimited storage, dedicated support team, custom integrations, and SLA guarantees.', 'accordion-block'),
                isOpen: false
            }
        ]
    },
    steps: {
        label: __('Steps Guide', 'accordion-block'),
        items: [
            {
                title: __('Step 1: Sign Up', 'accordion-block'),
                content: __('Create your free account in seconds. Just enter your email address and choose a secure password to get started.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Step 2: Configure Settings', 'accordion-block'),
                content: __('Customize your preferences and connect your existing tools. Our setup wizard will guide you through the process.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Step 3: Add Content', 'accordion-block'),
                content: __('Start adding your content using our intuitive editor. Import existing data or create new content from scratch.', 'accordion-block'),
                isOpen: false
            },
            {
                title: __('Step 4: Publish & Share', 'accordion-block'),
                content: __('When you\'re ready, publish your work and share it with your audience. Track performance with built-in analytics.', 'accordion-block'),
                isOpen: false
            }
        ]
    }
};

const THEME_COLORS = [
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Light Gray', color: '#f8f9fa' },
    { name: 'Gray', color: '#6c757d' },
    { name: 'Dark Gray', color: '#343a40' },
    { name: 'Blue', color: '#0d6efd' },
    { name: 'Indigo', color: '#6610f2' },
    { name: 'Purple', color: '#6f42c1' },
    { name: 'Pink', color: '#d63384' },
    { name: 'Red', color: '#dc3545' },
    { name: 'Orange', color: '#fd7e14' },
    { name: 'Yellow', color: '#ffc107' },
    { name: 'Green', color: '#198754' },
    { name: 'Teal', color: '#20c997' },
    { name: 'Cyan', color: '#0dcaf0' },
];

const Edit = ({ attributes, setAttributes }) => {

        const { items, theme, template, customStyles } = attributes;
        const [openItems, setOpenItems] = useState(items.map((item, index) => index === 0));
    
        const blockProps = useBlockProps({
            className: `accordion-block accordion-theme-${theme}`
        });
    
        const toggleItem = (index) => {
            const newOpenItems = [...openItems];
            newOpenItems[index] = !newOpenItems[index];
            setOpenItems(newOpenItems);
        };
    
        const addItem = () => {
            const newItems = [
                ...items,
                {
                    title: __('New Accordion Item', 'accordion-block'),
                    content: __('Add your content here.', 'accordion-block'),
                    isOpen: false
                }
            ];
            setAttributes({ items: newItems });
            setOpenItems([...openItems, false]);
        };
    
        const removeItem = (index) => {
            const newItems = items.filter((_, i) => i !== index);
            setAttributes({ items: newItems });
            const newOpenItems = openItems.filter((_, i) => i !== index);
            setOpenItems(newOpenItems);
        };
    
        const updateItem = (index, field, value) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            setAttributes({ items: newItems });
        };
    
        const applyTemplate = (templateKey) => {
            if (templateKey !== 'none' && TEMPLATES[templateKey]) {
                setAttributes({
                    template: templateKey,
                    items: TEMPLATES[templateKey].items
                });
                setOpenItems(TEMPLATES[templateKey].items.map(() => false));
            }
        };
    
        const updateCustomStyle = (key, value) => {
            setAttributes({
                customStyles: {
                    ...customStyles,
                    [key]: value
                }
            });
        };
    
        const getInlineStyles = () => {
            if (theme !== 'custom') return {};
    
            return {
                '--accordion-header-bg': customStyles.headerBgColor,
                '--accordion-header-text': customStyles.headerTextColor,
                '--accordion-content-bg': customStyles.contentBgColor,
                '--accordion-content-text': customStyles.contentTextColor,
                '--accordion-border-color': customStyles.borderColor,
                '--accordion-border-width': `${customStyles.borderWidth}px`,
                '--accordion-border-radius': `${customStyles.borderRadius}px`,
                '--accordion-header-padding': `${customStyles.headerPadding}px`,
                '--accordion-content-padding': `${customStyles.contentPadding}px`,
                '--accordion-header-font-size': `${customStyles.headerFontSize}px`,
                '--accordion-content-font-size': `${customStyles.contentFontSize}px`,
                '--accordion-icon-color': customStyles.iconColor,
                '--accordion-animation-speed': `${customStyles.animationSpeed}ms`
            };
        };
    
	return        <>
                <InspectorControls>
                    <PanelBody title={__('Accordion Items', 'accordion-block')} initialOpen={true}>
                        <Button
                            variant="primary"
                            onClick={addItem}
                            style={{ width: '100%' }}
                        >
                            {__('Add Item', 'accordion-block')}
                        </Button>
                    </PanelBody>
    
                    <PanelBody title={__('Theme Settings', 'accordion-block')} initialOpen={false}>
                        <SelectControl
                            label={__('Theme', 'accordion-block')}
                            value={theme}
                            options={[
                                { label: __('Modern', 'accordion-block'), value: 'modern' },
                                { label: __('Classic', 'accordion-block'), value: 'classic' },
                                { label: __('Minimal', 'accordion-block'), value: 'minimal' },
                                { label: __('Custom', 'accordion-block'), value: 'custom' }
                            ]}
                            onChange={(value) => setAttributes({ theme: value })}
                        />
                    </PanelBody>
    
                    <PanelBody title={__('Templates', 'accordion-block')} initialOpen={false}>
                        <SelectControl
                            label={__('Apply Template', 'accordion-block')}
                            value={template}
                            options={Object.keys(TEMPLATES).map(key => ({
                                label: TEMPLATES[key].label,
                                value: key
                            }))}
                            onChange={applyTemplate}
                            help={__('Select a pre-built template to get started quickly', 'accordion-block')}
                        />
                    </PanelBody>
    
                    {theme === 'custom' && (
                        <>
                            <PanelBody title={__('Header Styles', 'accordion-block')} initialOpen={false}>
                                <p><strong>{__('Background Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.headerBgColor}
                                    onChange={(value) => updateCustomStyle('headerBgColor', value || '#f8f9fa')}
                                />
                                <p><strong>{__('Text Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.headerTextColor}
                                    onChange={(value) => updateCustomStyle('headerTextColor', value || '#212529')}
                                />
                                <RangeControl
                                    label={__('Font Size', 'accordion-block')}
                                    value={customStyles.headerFontSize}
                                    onChange={(value) => updateCustomStyle('headerFontSize', value)}
                                    min={12}
                                    max={32}
                                />
                                <RangeControl
                                    label={__('Padding', 'accordion-block')}
                                    value={customStyles.headerPadding}
                                    onChange={(value) => updateCustomStyle('headerPadding', value)}
                                    min={8}
                                    max={40}
                                />
                            </PanelBody>
    
                            <PanelBody title={__('Content Styles', 'accordion-block')} initialOpen={false}>
                                <p><strong>{__('Background Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.contentBgColor}
                                    onChange={(value) => updateCustomStyle('contentBgColor', value || '#ffffff')}
                                />
                                <p><strong>{__('Text Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.contentTextColor}
                                    onChange={(value) => updateCustomStyle('contentTextColor', value || '#495057')}
                                />
                                <RangeControl
                                    label={__('Font Size', 'accordion-block')}
                                    value={customStyles.contentFontSize}
                                    onChange={(value) => updateCustomStyle('contentFontSize', value)}
                                    min={12}
                                    max={24}
                                />
                                <RangeControl
                                    label={__('Padding', 'accordion-block')}
                                    value={customStyles.contentPadding}
                                    onChange={(value) => updateCustomStyle('contentPadding', value)}
                                    min={8}
                                    max={40}
                                />
                            </PanelBody>
    
                            <PanelBody title={__('Border & Spacing', 'accordion-block')} initialOpen={false}>
                                <p><strong>{__('Border Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.borderColor}
                                    onChange={(value) => updateCustomStyle('borderColor', value || '#dee2e6')}
                                />
                                <RangeControl
                                    label={__('Border Width', 'accordion-block')}
                                    value={customStyles.borderWidth}
                                    onChange={(value) => updateCustomStyle('borderWidth', value)}
                                    min={0}
                                    max={5}
                                />
                                <RangeControl
                                    label={__('Border Radius', 'accordion-block')}
                                    value={customStyles.borderRadius}
                                    onChange={(value) => updateCustomStyle('borderRadius', value)}
                                    min={0}
                                    max={30}
                                />
                            </PanelBody>
    
                            <PanelBody title={__('Icon & Animation', 'accordion-block')} initialOpen={false}>
                                <p><strong>{__('Icon Color', 'accordion-block')}</strong></p>
                                <ColorPalette
                                    colors={THEME_COLORS}
                                    value={customStyles.iconColor}
                                    onChange={(value) => updateCustomStyle('iconColor', value || '#212529')}
                                />
                                <RangeControl
                                    label={__('Animation Speed (ms)', 'accordion-block')}
                                    value={customStyles.animationSpeed}
                                    onChange={(value) => updateCustomStyle('animationSpeed', value)}
                                    min={100}
                                    max={1000}
                                    step={50}
                                />
                            </PanelBody>
                        </>
                    )}
                </InspectorControls>
    
                <div {...blockProps} style={getInlineStyles()}>
                    <div className="accordion-items">
                        {items.map((item, index) => (
                            <div key={index} className={`accordion-item ${openItems[index] ? 'is-open' : ''}`}>
                                <div className="accordion-header">
                                    <button
                                        className="accordion-toggle"
                                        onClick={() => toggleItem(index)}
                                        type="button"
                                    >
                                        <RichText
                                            tagName="span"
                                            value={item.title}
                                            onChange={(value) => updateItem(index, 'title', value)}
                                            placeholder={__('Accordion title...', 'accordion-block')}
                                            className="accordion-title"
                                        />
                                        <span className="accordion-icon">
                                            {openItems[index] ? '−' : '+'}
                                        </span>
                                    </button>
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => removeItem(index)}
                                        className="accordion-remove"
                                    >
                                        {__('Remove Item', 'accordion-block')}
                                    </Button>
                                </div>
                                {openItems[index] && (
                                    <div className="accordion-content" style={{maxHeight:'unset'}}>
                                        <RichText   
                                            tagName="div"
                                            value={item.content}
                                            onChange={(value) => updateItem(index, 'content', value)}
                                            placeholder={__('Accordion content...', 'accordion-block')}
                                            className="accordion-text"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {items.length === 0 && (
                        <div className="accordion-empty">
                            <p>{__('No accordion items yet. Click "Add Item" to get started.', 'accordion-block')}</p>
                            <Button variant="primary" onClick={addItem}>
                                {__('Add Item', 'accordion-block')}
                            </Button>
                        </div>
                    )}
                </div>
            </>
}

export default Edit;