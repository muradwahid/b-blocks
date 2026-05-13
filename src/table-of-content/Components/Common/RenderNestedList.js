import { Fragment } from 'react';

const RenderNestedList = ({ items, markup, bullets, contentsAttr, setContentsAttr, className = '', prefix = "" }) => {
    if (!items || items.length === 0) return null;

    return (
        <ol className={`bblocks-tbcn-panel-table-container-order-list ${className}`}>
            {items.map((item, idx) => {
                const currentNumber = prefix ? `${prefix}.${idx + 1}` : `${idx + 1}`;
                return item.className !== "bblocks-tbcn-content-table-title" && <li key={item.id + item.contents + prefix} className="bblocks-tbcn-panel-table-list-items">
                    <div className="bblocks-tbcn-list-item-content">
                        {markup.view === "decimal" ? <span className="bblocks-tbcn-decimal-number">{currentNumber}.</span> : (
                            <span>
                                {bullets.map(({ value: val, icon }, bIdx) => val === markup.icon && <Fragment key={`bullet-${bIdx}`}>{icon}</ Fragment>)}
                            </span>
                        )}
                        <a
                            className={`bblocks-tbcn-table-content-anchor-list ${item.id === contentsAttr ? "item-active" : ""}`}
                            href={`#${item.id}`}
                            onClick={() => setContentsAttr(item.id)}
                        >
                            {item.contents}
                        </a>
                    </div>
                    {item.children && item.children.length > 0 && (
                        <RenderNestedList
                            items={item.children}
                            markup={markup}
                            bullets={bullets}
                            contentsAttr={contentsAttr}
                            setContentsAttr={setContentsAttr}
                            className='bblocks-tbcn-nested-list'
                            prefix={currentNumber}
                        />
                    )}
                </li>
            })}
        </ol>
    );
};

export default RenderNestedList;