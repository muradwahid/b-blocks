import Layout from '../Layout/Layout';
import devBlocks from '../utils/devBlocks';

const InDev = ({ info }) => {
	return <Layout info={info}>
		<div className='blocksPage'>
			<div className='blocks'>
				{devBlocks?.map((block) => <div key={block.name} className='block'>
					<div className='icon'>{block.icon}</div>
					<div className='name'>{block.title}</div>
				</div>)}
			</div>
		</div>
	</Layout>
}
export default InDev;