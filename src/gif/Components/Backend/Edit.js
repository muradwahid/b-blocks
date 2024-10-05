import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { useBlockProps, InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, __experimentalUnitControl as UnitControl, Button, TextControl } from '@wordpress/components';

import { HelpPanel } from '../../../../../Components';
import { pxUnit, perUnit, emUnit } from '../../../../../Components/utils/options';

import { pluginSlug, gifDocs } from '../../../utils/data';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes: { gif, gifAlign, gifWidth }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [search, setSearch] = useState('');
	const [gifData, setGifData] = useState([]);

	// Gif scripts for modal
	const GIFAPI = 'dM3iQq13qK0Mls9ygR2zjxxPDQVlw1Ql';

	// First Trending
	search === '' && useEffect(() => {
		let url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIFAPI}&limit=25`;

		fetch(url).then(res => res.json()).then(data => {
			setGifData(data.data);
		}).catch(err => alert(err.message));
	}, [search]);

	// Search
	search && search !== '' && useEffect(() => {
		let url = `https://api.giphy.com/v1/gifs/search?api_key=${GIFAPI}&limit=25&q=${search}`;

		fetch(url).then(res => res.json()).then(data => {
			setGifData(data.data);
		}).catch(err => alert(err.message));
	}, [search]);

	const thisBlock = document.getElementById(`block-${clientId}`); // This Block
	const modal = document.getElementById(`gifModal-${clientId}`); // Get the modal

	const setPopup = () => {
		thisBlock.style.minHeight = '720px';
		modal.style.display = 'block';
	}

	const removePopup = () => {
		thisBlock.style.minHeight = 'auto';
		modal.style.display = 'none';
	}

	window.addEventListener('click', e => {
		if (e.target == modal) {
			thisBlock.style.minHeight = 'auto';
			modal.style.display = 'none';
		}
	});

	const id = `${prefix}-${clientId}`;

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} docsLink={gifDocs} />


			<PanelBody className='bPlPanelBody' title={__('Gif Settings', 'b-blocks')}>
				<UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={gifWidth} onChange={val => setAttributes({ gifWidth: val })} units={[pxUnit(), perUnit(), emUnit()]} />
				<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={gifAlign} onChange={val => setAttributes({ gifAlign: val })} describedBy={__('GIF Alignment')} alignmentControls={[
				{ title: __('GIF in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('GIF in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('GIF in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>


		<div {...useBlockProps()} id={id}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#${id} .${prefix}{
					text-align: ${gifAlign};
				}
				#${id} .${prefix} figure{
					width: ${'0px' === gifWidth || '0%' === gifWidth || '0em' === gifWidth ? 'auto' : gifWidth};
				}
			`}} />

			<div className={prefix}>
				<figure className='editImageHolder'>
					{gif && <img src={gif?.images?.original?.url} alt={gif?.title} />}

					<div className='mediaControl'>
						{!gif ?
							<div className='btnControl'>
								<Button icon='upload' onClick={setPopup}>{__('Insert GIF', 'b-blocks')}</Button>
							</div> :
							<div className='btnControl'>
								<Button icon='controls-repeat' onClick={setPopup}>{__('Replace', 'b-blocks')}</Button>
								<Button icon='exit' onClick={() => setAttributes({ gif: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
							</div>}
					</div>
				</figure>

				<div className='gifModal' id={`gifModal-${clientId}`}>
					<div className='gifModalContent'>
						<span className='close' onClick={removePopup}>&times;</span>

						<div className='gifModalHeader'>
							<label htmlFor={`gifSrcBox-${clientId}`}>Search Gif:</label>

							<TextControl className='gifSearchField' value={search} id={`gifSrcBox-${clientId}`} onChange={val => setSearch(val)} placeholder={__('Search gif here', 'b-blocks')} />
						</div>

						<div className='gifModalBody'>
							<div className='gifData'>
								{0 !== gifData.length && gifData.map(gif => <figure key={gif.id} onClick={() => setAttributes({
									gif,
									width: `${parseInt(gif.images.original.width)}px`,
									return: (modal.style.display = 'none', thisBlock.style.minHeight = 'auto')
								})}>
									<img src={gif.images.downsized.url} alt={gif.title} />
									<figcaption>{gif.title}</figcaption>
								</figure>)}
							</div>
						</div> {/* Modal Body */}
					</div> {/* Modal Content */}
				</div> {/* Modal */}
			</div>
		</div>
	</>;
};
export default Edit;