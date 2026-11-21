import { labels } from '../../../utils/common';

import { Actions, FileBadge } from './parts';
import { calendarIcon } from '../../../utils/icons';

const List = ({ docs, attributes, isBackend, onView }) => {
	const { layout = {}, itemOptions = {} } = attributes;
	const { showIcon = true, showSize = true, showDate = true, showAuthor = false, showDescription = true, showType = true } = itemOptions;
	const isCompact = 'compact' === layout.listDensity;
	// Card titles default to h3; a page without the library header may need another level.
	const TitleTag = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(layout.titleTag) ? layout.titleTag : 'h3';

	return <ul className={`b-blocks-document-library-list${isCompact ? ' is-compact' : ''}`}>
		{docs.map((doc) => <li key={doc.at} className='b-blocks-document-library-row'>
			{showIcon && <FileBadge doc={doc} small={isCompact} />}

			<div className='b-blocks-document-library-row-body'>
				<TitleTag className='b-blocks-document-library-name'>{doc.title} {doc.featured && <span className='b-blocks-document-library-featured'>{labels.featured}</span>} {doc.isNew && <span className='b-blocks-document-library-new'>{labels.newBadge}</span>}</TitleTag>

				{showDescription && !isCompact && doc.description && <p className='b-blocks-document-library-desc'>{doc.description}</p>}

				{((showType && doc.ext) || (showSize && doc.size) || (showDate && doc.date) || (showAuthor && doc.author)) && <div className='b-blocks-document-library-meta'>
					{showType && doc.ext && <span className='b-blocks-document-library-type'>{doc.ext.toUpperCase()}</span>}
					{showSize && doc.size && <span className='b-blocks-document-library-size'>{doc.size}</span>}
					{showDate && doc.date && <span className='b-blocks-document-library-date'>{calendarIcon} {doc.date}</span>}
					{showAuthor && doc.author && <span className='b-blocks-document-library-author'>{doc.author}</span>}
				</div>}
			</div>

			<Actions doc={doc} attributes={attributes} isBackend={isBackend} onView={onView} />
		</li>)}
	</ul>;
};
export default List;
