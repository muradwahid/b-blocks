/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { createHigherOrderComponent } from '@wordpress/compose';
import { TextareaControl, Flex, ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';

import { Button } from '../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../bpl-tools/hooks';

import {useOutsideDetect} from '../../../../bpl-tools/hooks/useOutsideDetect';

import { AiIcon, pluginIcon } from '../../utils/icons';
import { apiSettingsPage } from '../../utils/data';
import './style.scss';

const getSelectedRichText = (props) => {
    const { clientId, name, attributes } = props;
    if (!clientId) return;
    const blockEl = document.querySelector(`[data-block="${clientId}"]`);
    if (!blockEl) return [];
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
        const [contents, setContents] = useState('')
        const [targetedEl, setTargetedEl] = useState(null);
        const { data, isLoading, error: ajaxError, refetch } = useWPAjax('generate_ai_content', { nonce: aiContentGenerator.nonce }, false);
        const { data: apiKeys } = useWPAjax('bblocks_api_keys', { _wpnonce: aiContentGenerator.nonce }, true);

        const { ref, btnRef } = useOutsideDetect(() => { 
            setIsModalOpen(false)
        })

        const generateContent = () => {
            return refetch({ prompt })
        };

        useEffect(() => {
            if (!isLoading && data) {
                setContents(data.content);
            }
        }, [data, ajaxError, isLoading])

        const replaceCurrentContent = (type) => {
            if (contents && targetedEl) {
                targetedEl.focus();
                const checkTypeContent = () => {
                    const prevContent = targetedEl.textContent;
                    if (type === 'replace') {
                        return contents;
                    } else if (type === 'end') {
                        if (prevContent === '') {
                            return contents;
                        } else {
                            return prevContent + ' ' + contents;
                        }
                    }
                }
                const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(checkTypeContent());
                let fragment;
                if (looksLikeHtml) {
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
                } else {
                    fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createTextNode(checkTypeContent()));
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
            // setError('');
            setContents('')
        };

        useEffect(() => {
            if (isModalOpen) return;
            const { editableEl=[] } = getSelectedRichText(props);

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
                            onRequestClose={closeModal}
                            className="bBlocksContentGenerateAiContainer"
                            ref={ref}
                        >
                            <div className="bBlocksContentGenerateAiContent">
                                <div className='bBlocksContentGenerateAiHeader'>
                                    
                                    {pluginIcon}
                                    <h2>bBlocks Ai Content Generator</h2>
                                </div>
                                {apiKeys?.openAi?.key ? '' : <div className='bBlocksContentGenerateWarning'>
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

                                {ajaxError && (
                                    <div className="bBlocksContentGenerateAiError" >
                                        <strong>{__('Error:')}</strong> {ajaxError?.message}
                                    </div>
                                )}

                                <p>Suggested Prompts</p>
                                <div className='bBlocksContentGenerateAiSuggestions'>
                                    {suggestion.map((item, index) => <p key={index} onClick={() => setPrompt(item)}>{item}</p>)}
                                </div>

                                <Flex>
                                    <Button variant='secondary' onClick={generateContent} size='medium' disabled={isLoading || !prompt} >
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