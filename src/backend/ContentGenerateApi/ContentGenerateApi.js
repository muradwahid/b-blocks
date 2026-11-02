/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { createHigherOrderComponent } from '@wordpress/compose';
import { TextareaControl, SelectControl, __experimentalNumberControl as NumberControl, Flex, FlexBlock, ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';

import Button from '../../../../bpl-tools/Components/Button/Button';
import { useWPAjax } from '../../../../bpl-tools/hooks';

import { useOutsideDetect } from '../../../../bpl-tools/hooks/useOutsideDetect';

import { AiIcon, pluginIcon } from '../../utils/icons';
import { apiSettingsPage } from '../../utils/data';
import './style.scss';

// Values must match the whitelists in includes/Ai.php
const lengthOptions = [
    { label: __('Short (3-8 words)'), value: 'short' },
    { label: __('Medium (10-15 words)'), value: 'medium' },
    { label: __('Large (20-30 words)'), value: 'large' },
    { label: __('Big (40-60 words)'), value: 'big' },
    { label: __('Custom'), value: 'custom' }
];
const toneOptions = [
    { label: __('Informative'), value: 'informative' },
    { label: __('Casual'), value: 'casual' },
    { label: __('Friendly'), value: 'friendly' },
    { label: __('Professional'), value: 'professional' },
    { label: __('Inspirational'), value: 'inspirational' },
    { label: __('Minimal'), value: 'minimal' }
];

// The editor canvas is an iframe in newer WP versions; fall back to the main document otherwise
const getEditorDocument = () => document.querySelector('iframe[name="editor-canvas"]')?.contentDocument || document;

const getSelectedRichText = (props) => {
    const { clientId, name, attributes } = props;
    if (!clientId) return {};
    const blockEl = getEditorDocument().querySelector(`[data-block="${clientId}"]`);
    if (!blockEl) return {};
    const isEditable = blockEl.getAttribute('contenteditable');
    if (isEditable === 'true') {
        return {
            blockName: name,
            clientId,
            editableEl: [blockEl],
            attributes
        }
    } else {
        const selectors = [
            '[contenteditable="true"]',
            '.block-editor-rich-text__editable',
            // '[data-rich-text]'
        ];

        const editableEl = blockEl.querySelectorAll(selectors.join(','));
        return {
            blockName: name,
            clientId,
            editableEl,
            attributes
        };
    }
}

const aiContentEditorControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { clientId, isSelected } = props;
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [prompt, setPrompt] = useState('');
        const [length, setLength] = useState('medium');
        const [customWords, setCustomWords] = useState(50);
        const [tone, setTone] = useState('informative');
        const [contents, setContents] = useState('')
        const [showError, setShowError] = useState(false);
        const [targetedEl, setTargetedEl] = useState(null);
        const { data, isLoading, error: ajaxError, refetch } = useWPAjax('generate_ai_content', { nonce: aiContentGenerator.nonce }, false);

        const { ref, btnRef } = useOutsideDetect(() => {
            setIsModalOpen(false)
        })

        const generateContent = () => {
            // Drop the previous result so it isn't shown next to a new error
            setContents('');
            setShowError(true);
            return refetch({ prompt, length, tone, ...('custom' === length && { customWords }) })
        };

        useEffect(() => {
            // useWPAjax keeps the last successful data after a failed request
            if (!isLoading && data && !ajaxError) {
                setContents(data.content);
            }
        }, [data, ajaxError, isLoading])

        const replaceCurrentContent = (type) => {
            if (contents && targetedEl) {
                targetedEl.focus();
                // The AI is asked for plain text, so escape it: tags in the output must stay
                // visible text (as in the preview), never become real markup in the post
                const escaper = document.createElement('div');
                escaper.textContent = contents;
                const safeContents = escaper.innerHTML;
                const checkTypeContent = () => {
                    const prevContent = targetedEl.textContent;
                    if (type === 'replace') {
                        return safeContents;
                    } else if (type === 'end') {
                        if (prevContent === '') {
                            return safeContents;
                        } else {
                            // innerHTML keeps the existing bold/italic/links
                            return targetedEl.innerHTML + ' ' + safeContents;
                        }
                    }
                }
                let fragment;
                const tmpRange = document.createRange();
                tmpRange.selectNodeContents(targetedEl);
                try {
                    fragment = tmpRange.createContextualFragment(checkTypeContent());
                } catch (e) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(checkTypeContent(), 'text/html');
                    fragment = document.createDocumentFragment();
                    Array.from(doc.body.childNodes).forEach(n => fragment.appendChild(n));
                }
                const sel = window.getSelection();
                const delRange = document.createRange();
                delRange.selectNodeContents(targetedEl);
                delRange.deleteContents();

                targetedEl.appendChild(fragment);

                const lastNode = targetedEl.lastChild;
                const range = document.createRange();
                if (!lastNode) {
                    range.selectNodeContents(targetedEl);
                    range.collapse(false);
                } else if (lastNode.nodeType === Node.TEXT_NODE) {
                    range.setStart(lastNode, lastNode.length);
                    range.collapse(true);
                } else {
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                }

                sel.removeAllRanges();
                sel.addRange(range);
                targetedEl.focus();
                targetedEl.normalize();

                setIsModalOpen(false)
                setPrompt('');
                setContents('')
            }
        };

        const closeModal = () => {
            setIsModalOpen(false);
            setPrompt('');
            // useWPAjax has no way to clear its error, so hide it until the next request
            setShowError(false);
            setContents('')
        };

        useEffect(() => {
            if (isModalOpen) return;
            const { editableEl = [] } = getSelectedRichText(props);

            if (isSelected && editableEl) {
                // if (Array.isArray(editableEl)>0) {
                Array.from(editableEl).forEach(el => {
                    el.onclick = () => setTargetedEl(el)
                })
                // }
            } else {
                setTargetedEl(null)
            }
            return () => {
                Array.from(editableEl)?.forEach(el => {
                    el.onclick = null;
                });
            };
        }, [clientId, isModalOpen, isSelected])
        const suggestion = ['Write a short description for', 'Create a product overview for', 'Generate a service intro for']
        return <>
            {targetedEl && isSelected && <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={AiIcon}
                        label={__('Generate AI Content')}
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        ref={btnRef}
                    >
                    </ToolbarButton>
                    {isModalOpen && (
                        <Popover
                            title={__('Generate AI Content')}
                            onClose={closeModal}
                            // Without this, focus leaving the popover calls onClose. Safari and macOS
                            // Firefox don't focus a clicked button, so clicking "Generate Content" moved
                            // focus to <body> and closed it. Outside clicks are handled by useOutsideDetect.
                            onFocusOutside={() => {}}
                            className="bBlocksContentGenerateAiContainer"
                            ref={ref}
                        >
                            <div className="bBlocksContentGenerateAiContent">
                                <div className='bBlocksContentGenerateAiHeader'>

                                    {pluginIcon}
                                    <h2>bBlocks Ai Content Generator</h2>
                                </div>
                                {aiContentGenerator.hasApiKey ? '' : <div className='bBlocksContentGenerateWarning'>
                                    <p>Please add your OpenAi Api Key. <a href={apiSettingsPage} target='_blank' rel='noreferrer'>Go to Settings</a></p>
                                </div>}
                                <TextareaControl
                                    // label={__('Enter your prompt:')}
                                    value={prompt}
                                    onChange={setPrompt}
                                    placeholder={__('Describe the content you want to generate...')}
                                    rows={4}
                                    disabled={isLoading}
                                />

                                {showError && ajaxError && (
                                    <div className="bBlocksContentGenerateAiError" >
                                        <strong>{__('Error:')}</strong> {ajaxError?.message}
                                    </div>
                                )}

                                <p>Suggested Prompts</p>
                                <div className='bBlocksContentGenerateAiSuggestions'>
                                    {suggestion.map((item, index) => <p key={index} onClick={() => setPrompt(item)}>{item}</p>)}
                                </div>

                                <Flex className='bBlocksContentGenerateAiOptions' align='flex-start'>
                                    <FlexBlock>
                                        <SelectControl
                                            label={__('Length')}
                                            value={length}
                                            options={lengthOptions}
                                            onChange={setLength}
                                            disabled={isLoading}
                                            __nextHasNoMarginBottom
                                        />
                                    </FlexBlock>
                                    <FlexBlock>
                                        <SelectControl
                                            label={__('Tone')}
                                            value={tone}
                                            options={toneOptions}
                                            onChange={setTone}
                                            disabled={isLoading}
                                            __nextHasNoMarginBottom
                                        />
                                    </FlexBlock>
                                </Flex>

                                {'custom' === length && (
                                    <NumberControl
                                        className='bBlocksContentGenerateAiOptions'
                                        label={__('Number of Words')}
                                        value={customWords}
                                        min={1}
                                        max={500}
                                        onChange={(val) => setCustomWords(val)}
                                        disabled={isLoading}
                                    />
                                )}

                                <Flex>
                                    <Button variant='secondary' onClick={generateContent} size='medium' disabled={isLoading || !prompt || ('custom' === length && !customWords)} >
                                        {isLoading && prompt ? __('Generating...', 'b-blocks') : __('Generate Content', 'b-blocks')}
                                    </Button>

                                    <Button variant='danger' size='medium' onClick={closeModal} disabled={isLoading} > {__('Cancel')} </Button>
                                </Flex>

                                {contents && !isLoading && (
                                    <div className="bBlocksContentGenerateAiPreview mt10">
                                        <h4>{__('Generated Content Preview:')}</h4>
                                        <div className="bBlocksAiContentPreview" > {contents}  </div>

                                        <Flex className='mt10'>
                                            <Button
                                                size='medium'
                                                onClick={() => replaceCurrentContent('replace')}
                                            >
                                                {__('Replace', 'b-blocks')}
                                            </Button>
                                            <Button
                                                size='medium'
                                                onClick={() => replaceCurrentContent('end')}
                                            >
                                                {__('Insert')}
                                            </Button>
                                        </Flex>
                                    </div>
                                )}
                            </div>
                        </Popover>
                    )}
                </ToolbarGroup>
            </BlockControls>}
            <BlockEdit {...props} />


        </>
    }
})

wp.hooks.addFilter('editor.BlockEdit', 'b-blocks', aiContentEditorControls);