import { labels } from '../../../utils/common';

import { Actions, FileIcon } from './parts';
import { calendarIcon } from '../../../utils/icons';

const Grid = ({ docs, attributes, isBackend, onView }) => {
	const { layout = {}, itemOptions = {} } = attributes;
	const { showIcon = true, showSize = true, showDate = true, showAuthor = false, showDescription = true } = itemOptions;
	// Card titles default to h3; a page without the library header may need another level.
	const TitleTag = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(layout.titleTag) ? layout.titleTag : 'h3';

	return <ul className='b-blocks-document-library-grid'>
		{docs.map((doc) => <li key={doc.at} className='b-blocks-document-library-card'>
			{showIcon && <FileIcon doc={doc} />}

			{doc.featured && <span className='b-blocks-document-library-featured'>{labels.featured}</span>}

			{doc.isNew && <span className='b-blocks-document-library-new'>{labels.newBadge}</span>}

			{/* One line with an ellipsis; the full name shows on hover. */}
			<TitleTag className='b-blocks-document-library-name' title={doc.title}>{doc.title}</TitleTag>

			{showDescription && doc.description && <p className='b-blocks-document-library-desc'>{doc.description}</p>}

			{showSize && doc.size && <p className='b-blocks-document-library-size'>{(labels.sizeValue || '').replace('%s', doc.size)}</p>}

			{showDate && doc.date && <p className='b-blocks-document-library-date'>{calendarIcon} {doc.date}</p>}

			{showAuthor && doc.author && <p className='b-blocks-document-library-author'>{doc.author}</p>}

			<Actions doc={doc} attributes={attributes} isBackend={isBackend} onView={onView} />
		</li>)}
	</ul>;
};
export default Grid;
