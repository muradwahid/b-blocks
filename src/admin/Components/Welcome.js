import Overview from '../../../../bpl-tools/Admin/Overview';
import ChangeLog from '../../../../bpl-tools/Admin/ChangeLog';
import ProAds from '../../../../bpl-tools/Admin/ProAds';
import Card from '../../../../bpl-tools/Admin/Blocks/Card';
import { overviewBlocks } from '../Dashboard/utils/blocks';

const Welcome = (props) => {
    const { isPremium,allBlocks, disabledBlocks, status, onChange } = props;
    return <Overview {...props}>
        <Card allBlocks={overviewBlocks} disabledBlocks={disabledBlocks} status={status} onChange={onChange} />
        <div style={{
            display: 'grid',
            gridTemplateColumns: isPremium ? '1fr' : 'repeat(auto-fill, minmax(min(480px, 100%), 1fr))',
            gap: '32px'
        }}>
            <ChangeLog {...props} />
            <ProAds {...props} />
        </div>
    </Overview>
};

export default Welcome;