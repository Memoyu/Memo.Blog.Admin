import { FC, useEffect, useState } from 'react';
import './index.scss';
import { Input } from '@douyinfe/semi-ui';

import UploadImage from '@src/components/upload-image';
import { BannerInfoModel } from '@src/common/model';

interface ComProps {
    banner?: BannerInfoModel;
    onChange?: (banner: BannerInfoModel) => void;
}

const Index: FC<ComProps> = ({ banner, onChange }) => {
    const [bannerInfo, setBannerInfo] = useState<BannerInfoModel>();

    useEffect(() => {
        // console.log('头图加载', banner);
        setBannerInfo(banner);
    }, [banner]);

    // 上传图片变更（上传成功 | 移除图片）
    const handleUploadChange = (url: string) => {
        setBannerInfo((old) => {
            let b = { ...old, url };
            handleChange(b);
            return b;
        });
    };

    const handleTitleValueChange = (title: string) => {
        setBannerInfo((old) => {
            let b = { ...old, title };
            handleChange(b);
            return b;
        });
    };

    const handleOriginUrlValueChange = (originUrl: string) => {
        setBannerInfo((old) => {
            let b = { ...old, originUrl };
            handleChange(b);
            return b;
        });
    };

    const handleChange = (banner: BannerInfoModel) => {
        onChange && onChange(banner);
    };

    return (
        <div style={{ width: 300, margin: 8 }}>
            <UploadImage
                type="banner"
                url={bannerInfo?.url}
                path="config/banner"
                onSuccess={(url) => handleUploadChange(url)}
                onRemove={() => handleUploadChange('')}
            />

            <div style={{ padding: '10px 5px' }}>
                <Input
                    placeholder="来源"
                    value={bannerInfo?.title}
                    onChange={(val) => handleTitleValueChange(val)}
                />
                <Input
                    style={{ marginTop: 5 }}
                    placeholder="来源链接"
                    value={bannerInfo?.originUrl}
                    onChange={(val) => handleOriginUrlValueChange(val)}
                />
            </div>
        </div>
    );
};

export default Index;
