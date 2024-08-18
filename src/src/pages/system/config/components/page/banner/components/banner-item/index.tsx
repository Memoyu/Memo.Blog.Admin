import { FC, useEffect, useState } from 'react';
import './index.scss';
import { Typography, List, Input } from '@douyinfe/semi-ui';

import UploadImage from '@src/components/upload-image';
import { BannerInfoModel } from '@src/common/model';

interface ComProps {
    banner: BannerInfoModel;
}

const { Text } = Typography;

const Index: FC<ComProps> = ({ banner }) => {
    const [bannerInfo, setBannerInfo] = useState<BannerInfoModel>();

    useEffect(() => {
        // console.log('头图加载', banner);
        setBannerInfo(banner);
    }, [banner]);

    return (
        <div style={{ width: 300, margin: 8 }}>
            <UploadImage
                type="banner"
                url={bannerInfo?.url}
                path="config/banner"
                onSuccess={(url) =>
                    setBannerInfo((old) => {
                        return { ...old, url };
                    })
                }
                onRemove={() =>
                    setBannerInfo((old) => {
                        return { ...old, url: '' };
                    })
                }
            />

            <div style={{ padding: '10px 5px' }}>
                <Input placeholder="来源" value={bannerInfo?.title} />
                <Input
                    style={{ marginTop: 5 }}
                    placeholder="来源链接"
                    value={bannerInfo?.originUrl}
                />
            </div>
        </div>
    );
};

export default Index;
