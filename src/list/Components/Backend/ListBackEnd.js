import { RichText } from '@wordpress/block-editor';
import { Fragment } from 'react';

const ListBackEnd = ({ attributes, updateObj }) => {
  const { items = [], marker, styles } = attributes;
  const { divider } = styles;
  const { markerType } = marker;
  const getMarkerEl = (listIcon) => {
    switch (markerType) {
      case 'emoji':
        return <span className='bBlocksListMarkerEmoji'>{marker.emoji}</span>;
      case 'icon':
        return listIcon ? <span className='bBlocksListMarkerIcon' dangerouslySetInnerHTML={{ __html: listIcon }} />:null;
      case 'disc':
        return <span className='bBlocksListMarkerDisc bBlocksListMarker' />
      case 'square':
        return <span className='bBlocksListMarkerSquare bBlocksListMarker' />
      default:
        return null;
    }
  }

  return <div className='bBlocksListMainWrapper'>
    <div className='bBlocksListContainer'>
      {
        items.length > 0 && items.map((item, index) => <Fragment key={index}>
          <a className='bBlocksListItem' rel='noopener noreferrer'>
            {getMarkerEl(item.icon)}
            <RichText className='bBlocksListItemText' tagName='span' placeholder='Write your list text' value={item.text} onChange={(value) => updateObj('items', value, index, 'text')} /> </a>
          {(index < items.length - 1 && divider.isEnabled) && <div className="bBlocksListItemDivider"></div>}
        </Fragment>)
      }
    </div>
  </div>
}
export default ListBackEnd