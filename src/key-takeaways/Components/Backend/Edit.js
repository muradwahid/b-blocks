import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const TAG_VALUES = ['h2', 'h3', 'h4'];
const STYLE_VALUES = ['check', 'numbered', 'bullet'];

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device } = props;
  const { heading = {}, list = {}, items = [] } = attributes;

  const isPremium = bBlocksPremiumChecker;
  const updateObj = updateAttributes(attributes, setAttributes);

  const listStyle = STYLE_VALUES.includes(list.style) ? list.style : 'check';
  const HeadingTag = TAG_VALUES.includes(heading.tag) ? heading.tag : 'h3';
  const ListTag = 'numbered' === listStyle ? 'ol' : 'ul';
  const showPrefix = list.showIcon !== false;

  const wrapperClasses = [
    'bBlocks-key-takeaways-wrapper',
    `bBlocks-key-takeaways-style-${listStyle}`,
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
      <div>
        <Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

        <div className={wrapperClasses} role='region'>
          <RichText tagName={HeadingTag} className='bBlocks-key-takeaways-heading' value={heading.text || ''} onChange={(val) => updateObj('heading', val, 'text')} placeholder={__('Key Takeaways', 'b-blocks')} allowedFormats={['core/bold', 'core/italic']} />

          <div className='bBlocks-key-takeaways-body'>
            {0 === items.length ? (
              <p className='bBlocks-key-takeaways-empty'>
                {__('No takeaways yet. Add the first one from the sidebar.', 'b-blocks')}
              </p>
            ) : (
              <ListTag className='bBlocks-key-takeaways-list' role='list'>
                {items.map((item, idx) => (
                  <li key={(item && item._key) || idx} className='bBlocks-key-takeaways-item'>
                    {showPrefix && 'check' === listStyle && (
                      <span
                        className='bBlocks-key-takeaways-icon'
                        aria-hidden='true'
                        dangerouslySetInnerHTML={{ __html: (item && item.icon) || '' }}
                      />
                    )}
                    {showPrefix && 'numbered' === listStyle && (
                      <span className='bBlocks-key-takeaways-num' aria-hidden='true' />
                    )}
                    {showPrefix && 'bullet' === listStyle && (
                      <span className='bBlocks-key-takeaways-bullet' aria-hidden='true' />
                    )}

                    <RichText
                      tagName='span'
                      className='bBlocks-key-takeaways-text'
                      value={(item && item.text) || ''}
                      onChange={(val) => updateItem(idx, 'text', val)}
                      placeholder={__('Takeaway text', 'b-blocks')}
                      allowedFormats={['core/bold', 'core/italic', 'core/link']}
                    />

                    <div className='bBlocks-key-takeaways-editor-item-actions'>
                      <Button variant='tertiary' size='small' icon='arrow-up-alt2' label={__('Move item up', 'b-blocks')} onClick={() => moveItem(idx, idx - 1)} disabled={0 === idx} />
                      <Button variant='tertiary' size='small' icon='arrow-down-alt2' label={__('Move item down', 'b-blocks')} onClick={() => moveItem(idx, idx + 1)} disabled={idx === items.length - 1} />
                      <Button variant='tertiary' isDestructive size='small' icon='trash' label={__('Remove item', 'b-blocks')} onClick={() => removeItem(idx)} />
                    </div>
                  </li>
                ))}
              </ListTag>
            )}
          </div>
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
