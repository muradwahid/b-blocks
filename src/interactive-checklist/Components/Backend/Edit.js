import { useEffect, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const CN = 'bBlocks-interactive-checklist';
const TAGS = ['h2', 'h3', 'h4'];

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device } = props;
  const { heading = {}, items = [], checkbox = {}, item = {}, progress = {}, reset = {}, persistKey } = attributes;

  const isPremium = bBlocksPremiumChecker;
  const updateObj = updateAttributes(attributes, setAttributes);

  // Local, non-persisted checked state so the canvas can preview the checked look.
  const [preview, setPreview] = useState({});
  const togglePreview = (itemId) => setPreview((p) => ({ ...p, [itemId]: !p[itemId] }));

  useEffect(() => {
    if (!persistKey) {
      setAttributes({ persistKey: `cl-${clientId.slice(0, 8)}` });
    }
  }, [persistKey, clientId, setAttributes]);

  const cbStyle = 'round' === checkbox.style ? 'round' : 'square';
  const strike = item.strike === true;
  const HeadingTag = TAGS.includes(heading.tag) ? heading.tag : 'h3';
  const total = items.length;
  const doneCount = items.filter((it) => it && preview[it.id]).length;
  
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const wrapperClasses = [
    `${CN}-wrapper`,
    `${CN}-checkbox-${cbStyle}`,
    strike ? `${CN}-has-strike` : '',
  ].filter(Boolean).join(' ');

  const updateItem = (index, key, next) => {
    setAttributes({ items: items.map((row, i) => (i === index ? { ...(row || {}), [key]: next } : row)) });
  };
  const removeItem = (index) => setAttributes({ items: items.filter((_, i) => i !== index) });
  const moveItem = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const copy = items.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setAttributes({ items: copy });
  };

  return <>
    <Settings {...{ attributes, setAttributes, updateObj, isPremium, device }} />

    <div {...useBlockProps()}>
      <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
      <div>

        <div className={wrapperClasses}>
          <RichText
            tagName={HeadingTag}
            className={`${CN}-heading`}
            value={heading.text || ''}
            onChange={(val) => updateObj('heading', val, 'text')}
            placeholder={__('Your Checklist', 'b-blocks')}
            allowedFormats={['core/bold', 'core/italic']}
          />

          {progress.show !== false && total > 0 && (
            <div className={`${CN}-progress`}>
              <p className={`${CN}-progress-text`}>
                {sprintf( /* translators: 1: done, 2: total */ __('%1$s of %2$s complete', 'b-blocks'), doneCount, total)}
              </p>
              <div className={`${CN}-progress-track`} aria-hidden='true'>
                <span className={`${CN}-progress-fill`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {0 === total ? (
            <p className={`${CN}-empty`}>
              {__('No checklist items yet. Add the first one from the sidebar.', 'b-blocks')}
            </p>
          ) : (
            <ul className={`${CN}-list`}>
              {items.map((it, idx) => {
                const isChecked = !!(it && preview[it.id]);
                return (
                  <li key={(it && it.id) || idx} className={`${CN}-item ${isChecked ? 'is-checked' : ''}`}>
                    <div className={`${CN}-label`}>
                      <input
                        type='checkbox'
                        className={`${CN}-checkbox`}
                        checked={isChecked}
                        onChange={() => { }}
                        onClick={(e) => { e.stopPropagation(); togglePreview(it.id); }}
                      />
                      <span className={`${CN}-box`} aria-hidden='true' />
                      <RichText
                        tagName='span'
                        className={`${CN}-text`}
                        value={(it && it.label) || ''}
                        onChange={(val) => updateItem(idx, 'label', val)}
                        placeholder={__('Checklist item', 'b-blocks')}
                        allowedFormats={[]}
                      />
                      <div className={`${CN}-editor-item-actions`}>
                        <Button variant='tertiary' size='small' icon='arrow-up-alt2' label={__('Move item up', 'b-blocks')} onClick={() => moveItem(idx, idx - 1)} disabled={0 === idx} />
                        <Button variant='tertiary' size='small' icon='arrow-down-alt2' label={__('Move item down', 'b-blocks')} onClick={() => moveItem(idx, idx + 1)} disabled={idx === items.length - 1} />
                        <Button variant='tertiary' isDestructive size='small' icon='trash' label={__('Remove item', 'b-blocks')} onClick={() => removeItem(idx)} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {reset.show !== false && total > 0 && (
            <button type='button' className={`${CN}-reset`} disabled>
              {__('Reset progress', 'b-blocks')}
            </button>
          )}
        </div>
      </div>
    </div>
  </>;
};

export default withSelect((select) => {
  const { getDeviceType } = select('core/editor');

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(Edit);
