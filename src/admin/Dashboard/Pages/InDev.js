import Layout from '../Layout/Layout';
import blocks from '../utils/blocks';

const InDev = ({ info }) => {
	return <Layout info={info}>
		<div className='blocksPage'>
			<div className='blocks'>
				{blocks.filter(b => 'inDev' === b.status).map((block) => <div key={block.name} className='block'>
					<div className='icon'>{block.icon}</div>
					<div className='name'>{block.title}</div>
				</div>)}
			</div>
		</div>
	</Layout>
}
export default InDev;