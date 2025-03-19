import Layout from '../Layout/Layout';
import devBlocks from '../utils/devBlocks';

const InDev = () => {
	return <Layout>
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